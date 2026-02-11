import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateMealPlan, getRecipeById } from '../data/recipes';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Meal Plan State (7 days)
  const [mealPlan, setMealPlan] = useState([]);
  const [selectedDay, setSelectedDay] = useState(23); // Default to day 23
  
  // Shopping List State
  const [shoppingList, setShoppingList] = useState([]);
  const [shoppingListViewMode, setShoppingListViewMode] = useState('list'); // 'list' or 'recipe'
  
  // Generate initial meal plan on mount
  useEffect(() => {
    const plan = generateMealPlan();
    setMealPlan(plan);
  }, []);
  
  // Auto-generate new meal plan
  const regenerateMealPlan = () => {
    const newPlan = generateMealPlan();
    setMealPlan(newPlan);
  };
  
  // Add all ingredients from meal plan to shopping list
  const addAllToShoppingList = () => {
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
    
    // Merge with existing shopping list (avoid duplicates)
    setShoppingList(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const newItems = allIngredients.filter(item => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
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
    
    // Merge with existing shopping list (avoid duplicates)
    setShoppingList(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const filteredNew = newItems.filter(item => !existingIds.has(item.id));
      return [...prev, ...filteredNew];
    });
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
  
  // Get daily meals for selected date
  const getDailyMeals = () => {
    const day = mealPlan.find(d => d.date === selectedDay);
    return day || null;
  };
  
  const value = {
    // Meal Plan
    mealPlan,
    selectedDay,
    setSelectedDay,
    regenerateMealPlan,
    getDailyMeals,
    addAllToShoppingList,
    
    // Shopping List
    shoppingList,
    shoppingListViewMode,
    setShoppingListViewMode,
    addRecipeToShoppingList,
    toggleIngredientCheck,
    deleteIngredient,
    deleteRecipeFromShoppingList,
    clearShoppingList,
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
