import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { generateCalendarDays, formatDayTitle } from '../data/recipes';
import { fetchUserRecipes } from '../lib/recipesApi';
import {
  fetchShoppingList,
  fetchSharedListItems,
  addSharedListItem,
  removeSharedListItem,
  patchSharedListItem,
  addListItem,
  patchListItem,
  removeListItem,
  clearListItems,
  replaceListItems,
  getAuthToken,
} from '../lib/shoppingListApi';
import { dataClient } from '../lib/dataClient';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth();

  // User-imported recipes from Neon DB
  const [userRecipes, setUserRecipes] = useState([]);

  const loadUserRecipes = useCallback(async () => {
    try {
      const fetched = await fetchUserRecipes();
      setUserRecipes(fetched);
    } catch (err) {
      console.error('[recipes] load failed:', err);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setUserRecipes([]);
      return;
    }
    loadUserRecipes();
  }, [isAuthenticated, loadUserRecipes]);

  // Restore meal plan from localStorage once recipes are loaded
  useEffect(() => {
    if (!userRecipes.length) return;
    const stored = localStorage.getItem(MEAL_PLAN_KEY);
    if (!stored) return;
    try {
      const days = JSON.parse(stored);
      const findRecipe = (id) => (id ? userRecipes.find(r => r.id === id) ?? null : null);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const restored = days.map((day, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date.getDate(),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
          fullDate: day.fullDate,
          month: date.toLocaleDateString('en-US', { month: 'long' }),
          isToday: i === 0,
          meals: {
            breakfast: findRecipe(day.meals.breakfast),
            lunch: findRecipe(day.meals.lunch),
            dinner: findRecipe(day.meals.dinner),
          },
        };
      });
      setMealPlanState(restored);
    } catch {
      localStorage.removeItem(MEAL_PLAN_KEY);
    }
  // Only run once after recipes first load — not on every recipe change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRecipes.length > 0]);

  const addUserRecipe = useCallback((recipe) => {
    setUserRecipes((prev) => [recipe, ...prev]);
  }, []);

  const lookupRecipe = useCallback(
    (id) => userRecipes.find((r) => r.id === id) ?? null,
    [userRecipes]
  );

  // Meal Plan State (7 days from today)
  // Persisted to localStorage as { fullDate, meals: { breakfast: id, lunch: id, dinner: id } }[]
  const MEAL_PLAN_KEY = 'miri-meal-plan';
  const [mealPlan, setMealPlanState] = useState([]);
  const [isMealPlanGenerating, setIsMealPlanGenerating] = useState(false);

  const setMealPlan = useCallback((plan) => {
    setMealPlanState(plan);
    if (plan.length === 0) {
      localStorage.removeItem(MEAL_PLAN_KEY);
    } else {
      const stored = plan.map(day => ({
        fullDate: day.fullDate,
        meals: {
          breakfast: day.meals.breakfast?.id ?? null,
          lunch: day.meals.lunch?.id ?? null,
          dinner: day.meals.dinner?.id ?? null,
        },
      }));
      localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(stored));
    }
  }, []);
  const [calendarDays] = useState(() => generateCalendarDays(28));
  const todayStr = calendarDays[0]?.fullDate;
  const [selectedFullDate, setSelectedFullDate] = useState(todayStr);
  
  // Shopping List State
  const SHOPPING_LIST_KEY = 'miri-shopping-list';
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      const stored = localStorage.getItem(SHOPPING_LIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [shoppingListViewMode, setShoppingListViewMode] = useState('recipe');
  const nextEntryIdRef = useRef(0);
  const createEntryId = React.useCallback(() => `sl-${Date.now()}-${nextEntryIdRef.current++}`, []);

  // Shared list state: when non-null, User B is viewing User A's list as secondary
  const SHARED_LIST_KEY = 'miri-shared-list';
  const [sharedListMeta, setSharedListMetaState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SHARED_LIST_KEY)) ?? null; }
    catch { return null; }
  });
  const [sharedListItems, setSharedListItems] = useState([]);
  const sharedPollRef = useRef(null);

  // Persist shopping list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Sync polling ref
  const pollIntervalRef = useRef(null);
  const lastPollTimeRef = useRef(null);
  const isSyncInitializedRef = useRef(false);

  const resolvedOwnerId = useRef(null); // current owner user_id for DB ops

  // ── DB sync helpers ───────────────────────────────────────────────────────

  const loadListFromDb = useCallback(async (ownerUserId) => {
    try {
      const items = await fetchShoppingList(ownerUserId ?? null);
      setShoppingList(items.map(item => ({
        ...item,
        entryId: item.entryId ?? createEntryId(),
      })));
      lastPollTimeRef.current = new Date().toISOString();
    } catch (err) {
      console.error('[shopping-list] load failed:', err);
    }
  }, [createEntryId]);


  // On auth: initialize DB sync for own list (migrate localStorage if DB is empty)
  useEffect(() => {
    if (!isAuthenticated) {
      clearInterval(pollIntervalRef.current);
      isSyncInitializedRef.current = false;
      resolvedOwnerId.current = null;
      return;
    }

    const init = async () => {
      try {
        const { data: sessionData } = await dataClient.auth.getSession();
        const userId = sessionData?.user?.id;
        if (!userId) return;

        resolvedOwnerId.current = userId;
        const dbItems = await fetchShoppingList(null); // always own list

        if (dbItems.length === 0) {
          const stored = shoppingList;
          if (stored.length > 0) {
            await replaceListItems(stored.map(item => ({
              ...item,
              entryId: item.entryId ?? createEntryId(),
            })), userId);
            await loadListFromDb(null);
          }
        } else {
          setShoppingList(dbItems.map(item => ({
            ...item,
            entryId: item.entryId ?? createEntryId(),
          })));
          lastPollTimeRef.current = new Date().toISOString();
        }

        isSyncInitializedRef.current = true;

        // Poll own list every 5 seconds
        pollIntervalRef.current = setInterval(async () => {
          try {
            const fresh = await fetchShoppingList(null);
            const freshKey = fresh.map(i => `${i.entryId}:${i.checked}`).join('|');
            setShoppingList(prev => {
              const prevKey = prev.map(i => `${i.entryId}:${i.checked}`).join('|');
              if (prevKey === freshKey) return prev;
              return fresh.map(item => ({ ...item, entryId: item.entryId ?? item.id }));
            });
          } catch {
            // Ignore poll errors
          }
        }, 5000);

      } catch (err) {
        console.error('[shopping-list] init failed:', err);
      }
    };

    init();
    return () => clearInterval(pollIntervalRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Poll shared list separately when sharedListMeta is set
  useEffect(() => {
    clearInterval(sharedPollRef.current);
    if (!isAuthenticated || !sharedListMeta?.ownerId) {
      setSharedListItems([]);
      return;
    }
    const load = async () => {
      try {
        const items = await fetchSharedListItems(sharedListMeta.ownerId);
        setSharedListItems(items.map(item => ({ ...item, entryId: item.entryId ?? item.id })));
      } catch (err) {
        console.error('[shared-list] fetch failed:', err.message);
      }
    };
    load();
    sharedPollRef.current = setInterval(load, 5000);
    return () => clearInterval(sharedPollRef.current);
  }, [isAuthenticated, sharedListMeta?.ownerId]);

  const setSharedListMeta = useCallback((meta) => {
    if (meta) {
      localStorage.setItem(SHARED_LIST_KEY, JSON.stringify(meta));
    } else {
      localStorage.removeItem(SHARED_LIST_KEY);
    }
    setSharedListMetaState(meta);
  }, []);

  // Smart groups — kept in context so they survive navigation
  const [smartGroups, setSmartGroups] = useState([]);
  const [smartStatus, setSmartStatus] = useState('idle');
  const lastSmartKeyRef = useRef(null);

  const fetchSmartGroups = useCallback((force = false) => {
    const uncheckedItems = shoppingList
      .filter(item => !item.checked)
      .map(item => item.name);
    const key = uncheckedItems.join('||');

    if (!force && key === lastSmartKeyRef.current) return;

    if (uncheckedItems.length === 0) {
      lastSmartKeyRef.current = key;
      setSmartGroups([]);
      setSmartStatus('idle');
      return;
    }

    lastSmartKeyRef.current = key;
    setSmartStatus('loading');
    fetch('/api/normalize-shopping-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: uncheckedItems }),
    })
      .then(r => r.json())
      .then(data => {
        setSmartGroups(data.groups ?? []);
        setSmartStatus('idle');
      })
      .catch(() => setSmartStatus('error'));
  }, [shoppingList]);

  // Toast State
  const [toasts, setToasts] = useState([]);
  const pendingToastsRef = useRef(new Set());

  // Backfill unique row IDs for any existing shopping-list entries not yet synced.
  useEffect(() => {
    setShoppingList(prev => {
      let changed = false;
      const next = prev.map(item => {
        if (item.entryId) return item;
        changed = true;
        return { ...item, entryId: createEntryId() };
      });
      return changed ? next : prev;
    });
  }, [createEntryId]);

  // ── Share list helpers ────────────────────────────────────────────────────
  const shareList = useCallback(async (listName) => {
    const token = await getAuthToken();
    const res = await fetch('/api/shopping-list-share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ listName: listName || null }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? 'Share failed');
    return res.json(); // { token }
  }, []);

  const acceptSharedList = useCallback(async (token) => {
    const authToken = await getAuthToken();
    const res = await fetch('/api/shopping-list-accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? 'Accept failed');
    const { ownerId, listName } = await res.json();
    setSharedListMeta({ ownerId, name: listName ?? null });
    return ownerId;
  }, [setSharedListMeta]);

  const leaveSharedList = useCallback(() => {
    setSharedListMeta(null);
    setSharedListItems([]);
  }, [setSharedListMeta]);

  // Check/uncheck an item in the shared list (User B can UPDATE but not INSERT/DELETE)
  const addItemToSharedList = useCallback(async (name) => {
    if (!sharedListMeta?.ownerId || !name.trim()) return;
    const entryId = createEntryId();
    const newItem = { id: entryId, entryId, name: name.trim(), checked: false, recipeId: null, recipeName: null };
    setSharedListItems(prev => [...prev, newItem]);
    try {
      await addSharedListItem(sharedListMeta.ownerId, newItem);
    } catch (err) {
      console.error('[shared-list] add failed:', err.message);
      setSharedListItems(prev => prev.filter(i => (i.entryId ?? i.id) !== entryId));
    }
  }, [sharedListMeta, createEntryId]);

  const removeItemFromSharedList = useCallback(async (entryId) => {
    if (!sharedListMeta?.ownerId) return;
    setSharedListItems(prev => prev.filter(i => (i.entryId ?? i.id) !== entryId));
    try {
      await removeSharedListItem(sharedListMeta.ownerId, entryId);
    } catch (err) {
      console.error('[shared-list] remove failed:', err.message);
    }
  }, [sharedListMeta]);

  const toggleSharedItem = useCallback((entryId) => {
    let newChecked = null;
    setSharedListItems(prev => prev.map(item => {
      if ((item.entryId ?? item.id) === entryId) {
        newChecked = !item.checked;
        return { ...item, checked: newChecked };
      }
      return item;
    }));
    if (sharedListMeta?.ownerId && newChecked !== null) {
      Promise.resolve().then(() =>
        patchSharedListItem(sharedListMeta.ownerId, entryId, newChecked)
          .catch(err => console.error('[shared-list] patch failed:', err))
      );
    }
  }, [sharedListMeta]);
  
  // Start with no plan — user taps "Plan my week" to generate
  
  // Show toast notification
  const showToast = (variant, message) => {
    const toastKey = `${variant}-${message}`;
    
    // Prevent duplicate toasts (handles React StrictMode double renders)
    if (pendingToastsRef.current.has(toastKey)) {
      return;
    }
    
    // Check if toast with same message already visible
    const hasDuplicate = toasts.some(
      toast => toast.message === message && toast.variant === variant
    );
    
    if (hasDuplicate) return;
    
    // Mark as pending
    pendingToastsRef.current.add(toastKey);
    
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, variant, message }]);
    
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
      pendingToastsRef.current.delete(toastKey);
    }, 4000);
  };
  
  // Dismiss toast manually
  const dismissToast = (id) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast) {
        const toastKey = `${toast.variant}-${toast.message}`;
        pendingToastsRef.current.delete(toastKey);
      }
      return prev.filter(t => t.id !== id);
    });
  };
  
  // Generate meal plan — tries AI first, falls back to random
  const regenerateMealPlan = async (preferences = {}) => {
    setIsMealPlanGenerating(true);
    try {
      const recipeList = userRecipes.map(r => ({
        id: r.id,
        title: r.title,
        meal_type: r.meal_type ?? 'any',
      }));

      const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, recipes: recipeList }),
      });

      if (!response.ok) throw new Error('API error');

      const { days } = await response.json();

      const findRecipe = (id) => userRecipes.find(r => r.id === id) ?? null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const plan = days.map((day, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          date: date.getDate(),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
          fullDate: day.date,
          month: date.toLocaleDateString('en-US', { month: 'long' }),
          isToday: i === 0,
          meals: {
            breakfast: findRecipe(day.meals?.breakfast),
            lunch: findRecipe(day.meals?.lunch),
            dinner: findRecipe(day.meals?.dinner),
          },
        };
      });

      setMealPlan(plan);
    } catch {
      setMealPlan([]);
    } finally {
      setIsMealPlanGenerating(false);
    }
  };
  
  // Add all ingredients from meal plan to shopping list
  const addAllToShoppingList = async (replaceExisting = false) => {
    const allIngredients = [];

    mealPlan.forEach(day => {
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        const meal = day.meals[mealType];
        if (meal) {
          meal.ingredients.forEach((ingredient, idx) => {
            allIngredients.push({
              id: `${meal.id}-${idx}`,
              entryId: createEntryId(),
              name: ingredient,
              recipeId: meal.id,
              recipeName: meal.title,
              checked: false,
            });
          });
        }
      });
    });

    let finalList;
    if (replaceExisting) {
      setShoppingList(allIngredients);
      finalList = allIngredients;
    } else {
      setShoppingList(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = allIngredients.filter(item => !existingIds.has(item.id));
        finalList = [...prev, ...newItems];
        return finalList;
      });
    }

    if (isSyncInitializedRef.current && resolvedOwnerId.current) {
      replaceListItems(finalList ?? allIngredients, resolvedOwnerId.current)
        .catch(err => console.error('[shopping-list] bulk add failed:', err));
    }
  };
  
  // Add ingredients from a specific recipe to shopping list.
  // When mealPlan is provided, counts how many times the recipe appears
  // across the week and adds ingredients proportionally (one set per occurrence).
  const addRecipeToShoppingList = async (recipeId, plan = []) => {
    const recipe = lookupRecipe(recipeId);
    if (!recipe) return;

    const occurrences = plan.length > 0
      ? plan.reduce((count, day) =>
          count + Object.values(day.meals).filter(m => m?.id === recipeId).length, 0)
      : 1;
    const times = Math.max(1, occurrences);

    const newItems = [];
    for (let t = 0; t < times; t++) {
      recipe.ingredients.forEach((ingredient, idx) => {
        newItems.push({
          id: `${recipe.id}-${idx}-${t}`,
          entryId: createEntryId(),
          name: ingredient,
          recipeId: recipe.id,
          recipeName: recipe.title,
          checked: false,
        });
      });
    }

    setShoppingList(prev => [...prev, ...newItems]);

    if (isSyncInitializedRef.current && resolvedOwnerId.current) {
      for (const item of newItems) {
        addListItem(item, resolvedOwnerId.current).catch(err =>
          console.error('[shopping-list] add failed:', err)
        );
      }
    }
  };

  // Toggle ingredient checked state
  const toggleIngredientCheck = (ingredientId) => {
    let newChecked = null;
    let targetEntryId = null;
    setShoppingList(prev =>
      prev.map(item => {
        if ((item.entryId ?? item.id) === ingredientId) {
          newChecked = !item.checked;
          targetEntryId = item.entryId ?? item.id;
          return { ...item, checked: newChecked };
        }
        return item;
      })
    );

    if (isSyncInitializedRef.current && resolvedOwnerId.current && targetEntryId !== null) {
      Promise.resolve().then(() =>
        patchListItem(targetEntryId, resolvedOwnerId.current, { checked: newChecked })
          .catch(err => console.error('[shopping-list] patch failed:', err))
      );
    }
  };

  // Delete single ingredient from shopping list
  const deleteIngredient = (ingredientId) => {
    let targetEntryId = null;
    setShoppingList(prev => {
      const item = prev.find(i => (i.entryId ?? i.id) === ingredientId);
      if (item) targetEntryId = item.entryId ?? item.id;
      return prev.filter(i => (i.entryId ?? i.id) !== ingredientId);
    });

    if (isSyncInitializedRef.current && resolvedOwnerId.current && targetEntryId) {
      removeListItem(targetEntryId, resolvedOwnerId.current)
        .catch(err => console.error('[shopping-list] delete failed:', err));
    }
  };

  // Delete all ingredients from a specific recipe
  const deleteRecipeFromShoppingList = (recipeId) => {
    let removedEntryIds = [];
    setShoppingList(prev => {
      removedEntryIds = prev.filter(i => i.recipeId === recipeId).map(i => i.entryId ?? i.id);
      return prev.filter(item => item.recipeId !== recipeId);
    });

    if (isSyncInitializedRef.current && resolvedOwnerId.current) {
      removedEntryIds.forEach(entryId =>
        removeListItem(entryId, resolvedOwnerId.current)
          .catch(err => console.error('[shopping-list] delete failed:', err))
      );
    }
  };

  // Mark all ingredients from a specific recipe as purchased
  const markRecipeAsPurchased = (recipeId) => {
    let affectedItems = [];
    setShoppingList(prev => {
      affectedItems = prev.filter(i => i.recipeId === recipeId);
      return prev.map(item =>
        item.recipeId === recipeId ? { ...item, checked: true } : item
      );
    });

    if (isSyncInitializedRef.current && resolvedOwnerId.current) {
      affectedItems.forEach(item =>
        patchListItem(item.entryId ?? item.id, resolvedOwnerId.current, { checked: true })
          .catch(err => console.error('[shopping-list] patch failed:', err))
      );
    }
  };

  // Mark all ingredients from a specific recipe as not purchased
  const markRecipeAsUnpurchased = (recipeId) => {
    let affectedItems = [];
    setShoppingList(prev => {
      affectedItems = prev.filter(i => i.recipeId === recipeId);
      return prev.map(item =>
        item.recipeId === recipeId ? { ...item, checked: false } : item
      );
    });

    if (isSyncInitializedRef.current && resolvedOwnerId.current) {
      affectedItems.forEach(item =>
        patchListItem(item.entryId ?? item.id, resolvedOwnerId.current, { checked: false })
          .catch(err => console.error('[shopping-list] patch failed:', err))
      );
    }
  };

  // Clear entire shopping list
  const clearShoppingList = () => {
    setShoppingList([]);
    if (isSyncInitializedRef.current && resolvedOwnerId.current) {
      clearListItems(resolvedOwnerId.current)
        .catch(err => console.error('[shopping-list] clear failed:', err));
    }
  };
  
  // Replace a specific meal slot across the entire plan with an AI-suggested alternative
  const replaceMealInPlan = async (fullDate, mealType, currentRecipeId, preferences = {}) => {
    const recipeList = userRecipes.map(r => ({
      id: r.id,
      title: r.title,
      meal_type: r.meal_type ?? 'any',
      categories: r.categories ?? [],
    }));

    // Collect recipe IDs already used in the plan so the API can avoid repeats
    const usedRecipeIds = mealPlan.flatMap(day =>
      Object.values(day.meals ?? {}).map(m => m?.id).filter(Boolean)
    );

    try {
      const response = await fetch('/api/replace-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealType, currentRecipeId, recipes: recipeList, preferences, usedRecipeIds }),
      });

      if (!response.ok) throw new Error('API error');
      const { recipeId } = await response.json();
      const newRecipe = userRecipes.find(r => r.id === recipeId);
      if (!newRecipe) throw new Error('Recipe not found');

      const oldTitle = userRecipes.find(r => r.id === currentRecipeId)?.title ?? 'Recipe';

      const updatedPlan = mealPlan.map(day => {
        if (day.meals[mealType]?.id !== currentRecipeId) return day;
        return { ...day, meals: { ...day.meals, [mealType]: newRecipe } };
      });
      setMealPlan(updatedPlan);

      showToast('success', `${oldTitle} replaced with ${newRecipe.title}`);
    } catch {
      showToast('error', 'No other recipes available for this slot');
      throw new Error('replace failed');
    }
  };

  // Clear entire meal plan
  const clearMealPlan = () => {
    setMealPlan([]);
  };

  // Get daily meals for selected date (by fullDate string)
  const getDailyMeals = () => {
    const day = mealPlan.find(d => d.fullDate === selectedFullDate);
    return day || null;
  };
  
  const value = {
    // User Recipes
    userRecipes,
    addUserRecipe,
    loadUserRecipes,

    // Meal Plan
    mealPlan,
    isMealPlanGenerating,
    calendarDays,
    selectedFullDate,
    setSelectedFullDate,
    regenerateMealPlan,
    replaceMealInPlan,
    clearMealPlan,
    getDailyMeals,
    addAllToShoppingList,
    formatDayTitle,
    
    // Shopping List
    shoppingList,
    shoppingListViewMode,
    setShoppingListViewMode,
    addRecipeToShoppingList,
    toggleIngredientCheck,
    deleteIngredient,
    deleteRecipeFromShoppingList,
    markRecipeAsPurchased,
    markRecipeAsUnpurchased,
    clearShoppingList,
    smartGroups,
    setSmartGroups,
    smartStatus,
    fetchSmartGroups,

    // Shared list
    sharedListMeta,
    sharedListItems,
    toggleSharedItem,
    addItemToSharedList,
    removeItemFromSharedList,
    shareList,
    acceptSharedList,
    leaveSharedList,
    
    // Toast
    toasts,
    showToast,
    dismissToast,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
