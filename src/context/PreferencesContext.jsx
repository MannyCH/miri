import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { fetchPreferences, savePreferences } from '../lib/profileApi';
import { useAuth } from './AuthContext';

const PreferencesContext = createContext(null);

const DEFAULT_PREFERENCES = {
  servings: 2,
  eatingStyle: '',
  goal: '',
  bmr: '',
  cookingFrequency: 'daily',
  unitSystem: 'metric',
  onboardedAt: null,
};

const SAVE_DEBOUNCE_MS = 1000;

function rowToState(row) {
  if (!row) return null;
  return {
    servings: row.servings ?? DEFAULT_PREFERENCES.servings,
    eatingStyle: row.eating_style ?? '',
    goal: row.goal ?? '',
    bmr: row.bmr_kcal != null ? String(row.bmr_kcal) : '',
    cookingFrequency: row.cooking_frequency ?? 'daily',
    unitSystem: row.unit_system ?? 'metric',
    onboardedAt: row.onboarded_at ?? null,
  };
}

function stateToPayload(state) {
  return {
    servings: state.servings,
    eatingStyle: state.eatingStyle || null,
    goal: state.goal || null,
    bmrKcal: state.bmr ? parseInt(state.bmr, 10) : null,
    cookingFrequency: state.cookingFrequency || 'daily',
    unitSystem: state.unitSystem || 'metric',
    onboardedAt: state.onboardedAt ?? null,
  };
}

export function PreferencesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  // isReady becomes true only after the first fetch completes for the current
  // session. useNeedsOnboarding waits on this so it never makes a routing
  // decision based on stale default preferences.
  const [isReady, setIsReady] = useState(false);
  const saveTimeoutRef = useRef(null);
  const pendingPayloadRef = useRef(null);
  const stateRef = useRef(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (!isAuthenticated) {
      stateRef.current = DEFAULT_PREFERENCES;
      setPreferences(DEFAULT_PREFERENCES);
      setIsReady(false);
      return;
    }

    setIsLoading(true);
    fetchPreferences()
      .then((row) => {
        const state = rowToState(row);
        if (state) {
          stateRef.current = state;
          setPreferences(state);
        }
      })
      .catch((err) => console.error('[preferences] load failed:', err))
      .finally(() => {
        setIsLoading(false);
        setIsReady(true);
      });
  }, [isAuthenticated]);

  const updatePreferences = useCallback((updates) => {
    const next = { ...stateRef.current, ...updates };
    stateRef.current = next;
    pendingPayloadRef.current = stateToPayload(next);
    setPreferences(next);

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      const payload = pendingPayloadRef.current;
      pendingPayloadRef.current = null;
      savePreferences(payload).catch((err) =>
        console.error('[preferences] save failed:', err)
      );
    }, SAVE_DEBOUNCE_MS);
  }, []);

  // Flush any pending debounced save immediately. Used by onboarding to
  // ensure onboarded_at is persisted before navigating away. Throws on
  // failure so callers can surface the error to the user.
  const flushPreferences = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    const payload = pendingPayloadRef.current;
    if (!payload) return;
    pendingPayloadRef.current = null;
    await savePreferences(payload);
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, flushPreferences, isLoading, isReady }}>
      {children}
    </PreferencesContext.Provider>
  );
}

/**
 * Returns { preferences, updatePreferences, isLoading }.
 *
 * Preferences are loaded on first authentication and auto-saved with a 1 s debounce.
 * `updatePreferences` accepts a partial object and merges it into current state.
 *
 * @consumers src/App.jsx (mounts PreferencesProvider), src/pages/AccountPage.jsx,
 *   src/pages/MealPlanningPage.jsx, src/pages/OnboardingPage.jsx,
 *   src/pages/RecipeDetailPage.jsx, src/pages/RecipeImportPage.jsx,
 *   src/pages/ShoppingListPage.jsx
 * @throws {Error} if called outside PreferencesProvider
 */
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
