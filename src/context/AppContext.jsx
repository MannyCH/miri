import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { generateMealPlan, generateCalendarDays, getRecipeById, formatDayTitle } from '../data/recipes';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Meal Plan State (7 days from today)
  const [mealPlan, setMealPlan] = useState([]);
  const [calendarDays] = useState(() => generateCalendarDays(28));
  const todayStr = calendarDays[0]?.fullDate;
  const [selectedFullDate, setSelectedFullDate] = useState(todayStr);
  
  // Shopping List State
  const [shoppingList, setShoppingList] = useState([]);
  const [shoppingListViewMode, setShoppingListViewMode] = useState('list'); // 'list' or 'recipe'
  
  // Toast State
  const [toasts, setToasts] = useState([]);
  const pendingToastsRef = useRef(new Set());
  
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
  
  // Auto-generate new meal plan
  const regenerateMealPlan = () => {
    const newPlan = generateMealPlan();
    setMealPlan(newPlan);
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
  
  // Add ingredients from a specific recipe to shopping list
  const addRecipeToShoppingList = (recipeId) => {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return;
    
    const newItems = recipe.ingredients.map((ingredient, idx) => ({
      id: `${recipe.id}-${idx}`,
      name: ingredient,
      recipeId: recipe.id,
      recipeName: recipe.title,
      checked: false,
    }));
    
    setShoppingList(prev => [...prev, ...newItems]);
    showToast('Info', `${recipe.title} added to list`);
  };
  
  // Toggle ingredient checked state
  const toggleIngredientCheck = (ingredientId) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.id === ingredientId ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  // Delete single ingredient from shopping list
  const deleteIngredient = (ingredientId) => {
    setShoppingList(prev => prev.filter(item => item.id !== ingredientId));
  };
  
  // Delete all ingredients from a specific recipe
  const deleteRecipeFromShoppingList = (recipeId) => {
    setShoppingList(prev => prev.filter(item => item.recipeId !== recipeId));
  };
  
  // Clear entire shopping list
  const clearShoppingList = () => {
    setShoppingList([]);
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
    // Meal Plan
    mealPlan,
    calendarDays,
    selectedFullDate,
    setSelectedFullDate,
    regenerateMealPlan,
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
