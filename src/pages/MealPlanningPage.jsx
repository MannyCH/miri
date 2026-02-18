import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MealPlanningView } from '../patterns/MealPlanningView';
import { useApp } from '../context/AppContext';

/**
 * Meal Planning Page
 * - Displays 7-day meal plan with calendar
 * - Auto-generates meal plan from recipes
 * - Add all ingredients to shopping list
 */
export function MealPlanningPage() {
  const navigate = useNavigate();
  const {
    mealPlan,
    selectedDay,
    setSelectedDay,
    regenerateMealPlan,
    getDailyMeals,
    addAllToShoppingList,
  } = useApp();
  
  // Get meals for the selected day
  const dailyMeals = getDailyMeals();
  
  // Convert meal plan to format expected by MealPlanningView
  const meals = dailyMeals ? {
    breakfast: dailyMeals.meals.breakfast,
    lunch: dailyMeals.meals.lunch,
    dinner: dailyMeals.meals.dinner,
  } : {};
  
  const handlePlanMeals = () => {
    // Regenerate entire 7-day meal plan
    regenerateMealPlan();
  };
  
  const handleAddMeals = () => {
    // Add all ingredients from the entire 7-day plan to shopping list
    addAllToShoppingList();
  };
  
  return (
    <MealPlanningView
      selectedDay={selectedDay}
      onDayClick={setSelectedDay}
      meals={meals}
      onPlanMeals={handlePlanMeals}
      onAddMeals={handleAddMeals}
    />
  );
}
