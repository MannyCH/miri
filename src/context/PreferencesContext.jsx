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
};

const UNIT_SYSTEM_KEY = 'miri-unit-system';

const SAVE_DEBOUNCE_MS = 1000;

function rowToState(row) {
  if (!row) return null;
  return {
    servings: row.servings ?? DEFAULT_PREFERENCES.servings,
    eatingStyle: row.eating_style ?? '',
    goal: row.goal ?? '',
    bmr: row.bmr_kcal != null ? String(row.bmr_kcal) : '',
    cookingFrequency: row.cooking_frequency ?? 'daily',
  };
}

function stateToPayload(state) {
  return {
    servings: state.servings,
    eatingStyle: state.eatingStyle || null,
    goal: state.goal || null,
    bmrKcal: state.bmr ? parseInt(state.bmr, 10) : null,
    cookingFrequency: state.cookingFrequency || 'daily',
  };
}

export function PreferencesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState(() => ({
    ...DEFAULT_PREFERENCES,
    unitSystem: localStorage.getItem(UNIT_SYSTEM_KEY) ?? 'metric',
  }));
  const [isLoading, setIsLoading] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Fetch as soon as the user is authenticated — not when Account page opens
  useEffect(() => {
    if (!isAuthenticated) {
      setPreferences(DEFAULT_PREFERENCES);
      return;
    }

    setIsLoading(true);
    fetchPreferences()
      .then((row) => {
        const state = rowToState(row);
        if (state) setPreferences(state);
      })
      .catch((err) => console.error('[preferences] load failed:', err))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const updatePreferences = useCallback((updates) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };

      // unitSystem is stored in localStorage only (no DB column yet)
      if (updates.unitSystem !== undefined) {
        localStorage.setItem(UNIT_SYSTEM_KEY, updates.unitSystem);
      }

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        savePreferences(stateToPayload(next)).catch((err) =>
          console.error('[preferences] save failed:', err)
        );
      }, SAVE_DEBOUNCE_MS);

      return next;
    });
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, isLoading }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within PreferencesProvider');
  return context;
}
