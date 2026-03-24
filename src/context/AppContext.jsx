import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { generateCalendarDays, formatDayTitle } from '../data/recipes';
import { fetchUserRecipes } from '../lib/recipesApi';
import * as listApi from '../lib/shoppingListApi';
import { useAuth } from './AuthContext';
import { usePusher } from './PusherContext';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const { subscribe, unsubscribe, getSocketId, connectionState } = usePusher();

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
  
  // ── Shopping Lists (DB-backed with Pusher real-time sync) ──
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [members, setMembers] = useState([]);
  const [inviteToken, setInviteToken] = useState(null);
  const [shoppingListViewMode, setShoppingListViewMode] = useState('recipe');
  const [isListLoading, setIsListLoading] = useState(true);
  const nextEntryIdRef = useRef(0);
  const createEntryId = React.useCallback(() => `sl-${Date.now()}-${nextEntryIdRef.current++}`, []);
  const activeListIdRef = useRef(null);
  activeListIdRef.current = activeListId;

  // Toast State (declared early so Pusher handlers can use showToast)
  const [toasts, setToasts] = useState([]);
  const pendingToastsRef = useRef(new Set());

  const showToast = useCallback((variant, message) => {
    const toastKey = `${variant}-${message}`;
    if (pendingToastsRef.current.has(toastKey)) return;

    setToasts(prev => {
      if (prev.some(t => t.message === message && t.variant === variant)) return prev;
      pendingToastsRef.current.add(toastKey);
      const id = Date.now() + Math.random();
      setTimeout(() => {
        setToasts(p => p.filter(toast => toast.id !== id));
        pendingToastsRef.current.delete(toastKey);
      }, 4000);
      return [...prev, { id, variant, message }];
    });
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => {
      const toast = prev.find(t => t.id === id);
      if (toast) {
        pendingToastsRef.current.delete(`${toast.variant}-${toast.message}`);
      }
      return prev.filter(t => t.id !== id);
    });
  }, []);

  // Load user's lists on auth
  const loadLists = useCallback(async () => {
    try {
      const { lists: fetched } = await listApi.fetchLists();
      setLists(fetched);
      if (fetched.length > 0) {
        // Restore last-used list or pick first
        const lastUsed = localStorage.getItem('miri-active-list');
        const match = fetched.find((l) => l.id === lastUsed);
        setActiveListId(match ? match.id : fetched[0].id);
      } else {
        // New user — auto-create "Einkaufsliste"
        const { list } = await listApi.createList('Home');
        setLists([list]);
        setActiveListId(list.id);
      }
    } catch (err) {
      console.error('[lists] load failed:', err);
    } finally {
      setIsListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setLists([]);
      setActiveListId(null);
      setShoppingList([]);
      setMembers([]);
      setIsListLoading(false);
      return;
    }
    loadLists();
  }, [isAuthenticated, loadLists]);

  // Persist active list ID
  useEffect(() => {
    if (activeListId) localStorage.setItem('miri-active-list', activeListId);
  }, [activeListId]);

  // Load items + members when active list changes
  useEffect(() => {
    if (!activeListId) return;
    let cancelled = false;

    async function load() {
      try {
        const [{ items }, { members: m, inviteToken: token }] = await Promise.all([
          listApi.fetchItems(activeListId),
          listApi.fetchMembers(activeListId),
        ]);
        if (cancelled) return;
        setShoppingList(items.map((i) => ({
          entryId: i.entry_id,
          name: i.name,
          recipeId: i.recipe_id,
          recipeName: i.recipe_name,
          checked: i.checked,
          createdAt: i.created_at,
        })));
        setMembers(m);
        setInviteToken(token);
      } catch (err) {
        console.error('[items] load failed:', err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [activeListId]);

  // ── Pusher subscription for active list ──
  useEffect(() => {
    if (!activeListId || connectionState !== 'connected') return;

    const channel = subscribe(`private-list-${activeListId}`);
    if (!channel) return;

    channel.bind('item:added', (data) => {
      setShoppingList((prev) => {
        if (prev.some((i) => i.entryId === data.entryId)) return prev;
        const next = [...prev, {
          entryId: data.entryId,
          name: data.name,
          recipeId: data.recipeId,
          recipeName: data.recipeName,
          checked: data.checked,
          createdAt: data.createdAt,
        }];
        return next.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
      });
    });

    channel.bind('item:updated', (data) => {
      setShoppingList((prev) =>
        prev.map((i) => i.entryId === data.entryId ? { ...i, checked: data.checked } : i)
      );
    });

    channel.bind('item:removed', (data) => {
      setShoppingList((prev) => prev.filter((i) => i.entryId !== data.entryId));
    });

    channel.bind('list:cleared', () => {
      setShoppingList([]);
    });

    channel.bind('list:renamed', (data) => {
      setLists((prev) => prev.map((l) => l.id === activeListIdRef.current ? { ...l, name: data.name } : l));
    });

    channel.bind('member:joined', () => {
      // Refresh members list
      listApi.fetchMembers(activeListIdRef.current).then(({ members: m, inviteToken: token }) => { setMembers(m); setInviteToken(token); }).catch(() => {});
    });

    channel.bind('member:left', (data) => {
      setMembers((prev) => prev.filter((m) => m.id !== data.userId));
    });

    channel.bind('member:removed', (data) => {
      if (data.userId === user?.id) {
        // Current user was removed — reload lists
        loadLists();
        showToast('info', 'You were removed from the list');
      } else {
        setMembers((prev) => prev.filter((m) => m.id !== data.userId));
      }
    });

    return () => {
      unsubscribe(`private-list-${activeListId}`);
    };
  }, [activeListId, connectionState, subscribe, unsubscribe, user?.id, loadLists, showToast]);

  // Reconnection reconciliation — full fetch on reconnect
  const prevConnectionState = useRef(connectionState);
  useEffect(() => {
    if (
      prevConnectionState.current !== 'connected' &&
      connectionState === 'connected' &&
      activeListId
    ) {
      listApi.fetchItems(activeListId).then(({ items }) => {
        setShoppingList(items.map((i) => ({
          entryId: i.entry_id,
          name: i.name,
          recipeId: i.recipe_id,
          recipeName: i.recipe_name,
          checked: i.checked,
          createdAt: i.created_at,
        })));
      }).catch(() => {});
    }
    prevConnectionState.current = connectionState;
  }, [connectionState, activeListId]);

  // Smart groups — kept in context so they survive navigation
  const [smartGroups, setSmartGroups] = useState([]);
  const [smartStatus, setSmartStatus] = useState('idle');
  const lastSmartKeyRef = useRef(null);

  const fetchSmartGroups = useCallback((force = false) => {
    // Only send unchecked items — AI merges quantities, so checked items
    // would inflate totals. Checked items are shown separately in the UI.
    const uncheckedItems = shoppingList
      .filter(item => !item.checked)
      .map(item => ({ name: item.name, id: item.entryId ?? item.id }));
    const key = uncheckedItems.map(i => i.name).sort().join('||');

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
      body: JSON.stringify({ items: uncheckedItems.map(i => i.name) }),
    })
      .then(r => r.json())
      .then(data => {
        // Map 1-based source indices to entryIds of unchecked items
        const groups = (data.groups ?? []).map(group => ({
          ...group,
          items: group.items.map(item => ({
            ...item,
            sourceIds: (item.sources || [])
              .map(idx => uncheckedItems[idx - 1]?.id)
              .filter(Boolean),
          })),
        }));
        setSmartGroups(groups);
        setSmartStatus('idle');
      })
      .catch(() => setSmartStatus('error'));
  }, [shoppingList]);

  // ── List management actions ──
  const switchList = useCallback((listId) => {
    setActiveListId(listId);
  }, []);

  const createNewList = useCallback(async (name) => {
    const { list } = await listApi.createList(name);
    setLists((prev) => [...prev, list]);
    setActiveListId(list.id);
    return list;
  }, []);

  const renameActiveList = useCallback(async (name) => {
    if (!activeListId) return;
    const sid = getSocketId();
    await listApi.renameList(activeListId, name, sid);
    setLists((prev) => prev.map((l) => l.id === activeListId ? { ...l, name } : l));
  }, [activeListId, getSocketId]);

  const deleteActiveList = useCallback(async () => {
    if (!activeListId) return;
    await listApi.deleteList(activeListId);
    setLists((prev) => {
      const remaining = prev.filter((l) => l.id !== activeListId);
      if (remaining.length > 0) {
        setActiveListId(remaining[0].id);
      } else {
        // Auto-create fresh list
        listApi.createList('Home').then(({ list }) => {
          setLists([list]);
          setActiveListId(list.id);
        });
      }
      return remaining;
    });
  }, [activeListId]);

  const leaveActiveList = useCallback(async () => {
    if (!activeListId || !user?.id) return;
    const sid = getSocketId();
    await listApi.removeMember(activeListId, user.id, sid);
    // Reload lists (will auto-create if none left)
    await loadLists();
  }, [activeListId, user?.id, getSocketId, loadLists]);

  const removeListMember = useCallback(async (targetUserId) => {
    if (!activeListId) return;
    const sid = getSocketId();
    await listApi.removeMember(activeListId, targetUserId, sid);
    setMembers((prev) => prev.filter((m) => m.id !== targetUserId));
  }, [activeListId, getSocketId]);
  
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
  const addAllToShoppingList = useCallback(async (replaceExisting = false) => {
    if (!activeListId) return;
    const allIngredients = [];

    mealPlan.forEach(day => {
      ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
        const meal = day.meals[mealType];
        if (meal) {
          meal.ingredients.forEach((ingredient) => {
            allIngredients.push({
              entryId: createEntryId(),
              name: ingredient,
              recipeId: meal.id,
              recipeName: meal.title,
              checked: false,
              createdAt: new Date().toISOString(),
            });
          });
        }
      });
    });

    if (replaceExisting) {
      // Clear existing items first
      const sid = getSocketId();
      shoppingList.forEach((i) => {
        listApi.removeItem(activeListId, i.entryId, sid).catch(() => {});
      });
      setShoppingList(allIngredients);
    } else {
      setShoppingList(prev => [...prev, ...allIngredients]);
    }

    // Send all items to API, then re-fetch canonical order
    const sid = getSocketId();
    await Promise.all(allIngredients.map((item) =>
      listApi.addItem(activeListId, item, sid).catch(() => {})
    ));
    try {
      const { items } = await listApi.fetchItems(activeListId);
      setShoppingList(items.map((i) => ({
        entryId: i.entry_id, name: i.name, recipeId: i.recipe_id,
        recipeName: i.recipe_name, checked: i.checked, createdAt: i.created_at,
      })));
    } catch { /* optimistic state is good enough */ }
  }, [activeListId, mealPlan, shoppingList, getSocketId, createEntryId]);
  
  // Add ingredients from a specific recipe to shopping list.
  // When mealPlan is provided, counts how many times the recipe appears
  // across the week and adds ingredients proportionally (one set per occurrence).
  const addRecipeToShoppingList = useCallback(async (recipeId, plan = []) => {
    if (!activeListId) return;
    const recipe = lookupRecipe(recipeId);
    if (!recipe) return;

    const occurrences = plan.length > 0
      ? plan.reduce((count, day) =>
          count + Object.values(day.meals).filter(m => m?.id === recipeId).length, 0)
      : 1;
    const times = Math.max(1, occurrences);

    const newItems = [];
    for (let t = 0; t < times; t++) {
      recipe.ingredients.forEach((ingredient) => {
        newItems.push({
          entryId: createEntryId(),
          name: ingredient,
          recipeId: recipe.id,
          recipeName: recipe.title,
          checked: false,
          createdAt: new Date().toISOString(),
        });
      });
    }

    // Optimistic update
    setShoppingList(prev => [...prev, ...newItems]);

    // Send to API, then re-fetch canonical order
    const sid = getSocketId();
    await Promise.all(newItems.map((item) =>
      listApi.addItem(activeListId, item, sid).catch(() => {})
    ));
    try {
      const { items } = await listApi.fetchItems(activeListId);
      setShoppingList(items.map((i) => ({
        entryId: i.entry_id, name: i.name, recipeId: i.recipe_id,
        recipeName: i.recipe_name, checked: i.checked, createdAt: i.created_at,
      })));
    } catch { /* optimistic state is good enough */ }
  }, [activeListId, lookupRecipe, getSocketId, createEntryId]);
  
  // Toggle ingredient checked state (optimistic + API)
  const toggleIngredientCheck = useCallback((ingredientId) => {
    const item = shoppingList.find((i) => i.entryId === ingredientId);
    if (!item || !activeListId) return;
    const newChecked = !item.checked;
    // Optimistic update
    setShoppingList((prev) =>
      prev.map((i) => i.entryId === ingredientId ? { ...i, checked: newChecked } : i)
    );
    const sid = getSocketId();
    listApi.toggleItem(activeListId, ingredientId, newChecked, sid).catch(() => {
      // Revert on failure
      setShoppingList((prev) =>
        prev.map((i) => i.entryId === ingredientId ? { ...i, checked: !newChecked } : i)
      );
    });
  }, [shoppingList, activeListId, getSocketId]);

  // Delete single ingredient (optimistic + API)
  const deleteIngredient = useCallback((ingredientId) => {
    if (!activeListId) return;
    setShoppingList((prev) => prev.filter((i) => i.entryId !== ingredientId));
    const sid = getSocketId();
    listApi.removeItem(activeListId, ingredientId, sid).catch(() => {});
  }, [activeListId, getSocketId]);

  // Delete all ingredients from a specific recipe
  const deleteRecipeFromShoppingList = useCallback((recipeId) => {
    if (!activeListId) return;
    const toDelete = shoppingList.filter((i) => i.recipeId === recipeId);
    setShoppingList((prev) => prev.filter((i) => i.recipeId !== recipeId));
    const sid = getSocketId();
    toDelete.forEach((i) => {
      listApi.removeItem(activeListId, i.entryId, sid).catch(() => {});
    });
  }, [shoppingList, activeListId, getSocketId]);

  // Mark all ingredients from a specific recipe as purchased
  const markRecipeAsPurchased = useCallback((recipeId) => {
    if (!activeListId) return;
    const items = shoppingList.filter((i) => i.recipeId === recipeId && !i.checked);
    setShoppingList((prev) =>
      prev.map((i) => i.recipeId === recipeId ? { ...i, checked: true } : i)
    );
    const sid = getSocketId();
    items.forEach((i) => {
      listApi.toggleItem(activeListId, i.entryId, true, sid).catch(() => {});
    });
  }, [shoppingList, activeListId, getSocketId]);

  // Mark all ingredients from a specific recipe as not purchased
  const markRecipeAsUnpurchased = useCallback((recipeId) => {
    if (!activeListId) return;
    const items = shoppingList.filter((i) => i.recipeId === recipeId && i.checked);
    setShoppingList((prev) =>
      prev.map((i) => i.recipeId === recipeId ? { ...i, checked: false } : i)
    );
    const sid = getSocketId();
    items.forEach((i) => {
      listApi.toggleItem(activeListId, i.entryId, false, sid).catch(() => {});
    });
  }, [shoppingList, activeListId, getSocketId]);

  // Clear entire shopping list
  const clearShoppingList = useCallback(() => {
    if (!activeListId) return;
    const all = [...shoppingList];
    setShoppingList([]);
    const sid = getSocketId();
    all.forEach((i) => {
      listApi.removeItem(activeListId, i.entryId, sid).catch(() => {});
    });
  }, [shoppingList, activeListId, getSocketId]);
  
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
    
    // Shopping List — lists & membership
    lists,
    activeListId,
    members,
    inviteToken,
    isListLoading,
    switchList,
    createNewList,
    renameActiveList,
    deleteActiveList,
    leaveActiveList,
    removeListMember,
    loadLists,

    // Shopping List — items
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
