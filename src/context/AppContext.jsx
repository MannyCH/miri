import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';
import { generateCalendarDays, formatDayTitle } from '../data/recipes';
import { fetchUserRecipes } from '../lib/recipesApi';
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
  
  // Shopping List State — persisted to localStorage
  const SHOPPING_LIST_KEY = 'miri-shopping-list';
  const [shoppingList, setShoppingList] = useState(() => {
    try {
      const stored = localStorage.getItem(SHOPPING_LIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [shoppingListViewMode, setShoppingListViewMode] = useState('list');
  const nextEntryIdRef = useRef(0);
  const createEntryId = React.useCallback(() => `sl-${nextEntryIdRef.current++}`, []);

  // Persist shopping list whenever it changes
  useEffect(() => {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(shoppingList));
  }, [shoppingList]);
  
  // Toast State
  const [toasts, setToasts] = useState([]);
  const pendingToastsRef = useRef(new Set());

  // Backfill unique row IDs for any existing shopping-list entries.
  // This keeps swipe/delete identity stable even when items move.
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
  const addAllToShoppingList = (replaceExisting = false) => {
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
    
    if (replaceExisting) {
      setShoppingList(allIngredients);
    } else {
      setShoppingList(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = allIngredients.filter(item => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }
  };
  
  // Add ingredients from a specific recipe to shopping list.
  // When mealPlan is provided, counts how many times the recipe appears
  // across the week and adds ingredients proportionally (one set per occurrence).
  const addRecipeToShoppingList = (recipeId, plan = []) => {
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
  };
  
  // Toggle ingredient checked state
  const toggleIngredientCheck = (ingredientId) => {
    setShoppingList(prev =>
      prev.map(item =>
        (item.entryId ?? item.id) === ingredientId
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };
  
  // Delete single ingredient from shopping list
  const deleteIngredient = (ingredientId) => {
    setShoppingList(prev =>
      prev.filter(item => (item.entryId ?? item.id) !== ingredientId)
    );
  };
  
  // Delete all ingredients from a specific recipe
  const deleteRecipeFromShoppingList = (recipeId) => {
    setShoppingList(prev => prev.filter(item => item.recipeId !== recipeId));
  };

  // Mark all ingredients from a specific recipe as purchased
  const markRecipeAsPurchased = (recipeId) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.recipeId === recipeId
          ? { ...item, checked: true }
          : item
      )
    );
  };

  // Mark all ingredients from a specific recipe as not purchased
  const markRecipeAsUnpurchased = (recipeId) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.recipeId === recipeId
          ? { ...item, checked: false }
          : item
      )
    );
  };
  
  // Clear entire shopping list
  const clearShoppingList = () => {
    setShoppingList([]);
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
