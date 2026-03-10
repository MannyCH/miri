import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPreferences, savePreferences } from '../lib/profileApi';

const DEFAULT_PREFERENCES = {
  servings: 2,
  eatingStyle: '',
  goal: '',
  bmr: '',
};

const SAVE_DEBOUNCE_MS = 1000;

function rowToState(row) {
  if (!row) return null;
  return {
    servings: row.servings ?? DEFAULT_PREFERENCES.servings,
    eatingStyle: row.eating_style ?? '',
    goal: row.goal ?? '',
    bmr: row.bmr_kcal != null ? String(row.bmr_kcal) : '',
  };
}

function stateToPayload(state) {
  return {
    servings: state.servings,
    eatingStyle: state.eatingStyle || null,
    goal: state.goal || null,
    bmrKcal: state.bmr ? parseInt(state.bmr, 10) : null,
  };
}

export function useUserPreferences(isAuthenticated) {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(false);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

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

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        savePreferences(stateToPayload(next)).catch((err) =>
          console.error('[preferences] save failed:', err)
        );
      }, SAVE_DEBOUNCE_MS);

      return next;
    });
  }, []);

  return { preferences, updatePreferences, isLoading };
}
