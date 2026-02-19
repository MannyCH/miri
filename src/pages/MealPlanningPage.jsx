import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { MealPlanningView } from '../patterns/MealPlanningView';
import { ConfirmDialog } from '../components/ConfirmDialog';
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
    shoppingList,
  } = useApp();
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
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
    // Check if shopping list has items
    if (shoppingList.length > 0) {
      // Show confirmation dialog
      setShowConfirmDialog(true);
    } else {
      // Just add without confirmation
      addAllToShoppingList(false);
    }
  };
  
  const handleConfirmReplace = () => {
    addAllToShoppingList(true);
    setShowConfirmDialog(false);
  };
  
  const handleConfirmAdd = () => {
    addAllToShoppingList(false);
    setShowConfirmDialog(false);
  };
  
  const handleCancel = () => {
    setShowConfirmDialog(false);
  };
  
  // Count unique recipes in shopping list
  const uniqueRecipes = new Set(shoppingList.map(item => item.recipeId)).size;
  
  return (
    <>
      <MealPlanningView
        selectedDay={selectedDay}
        onDayClick={setSelectedDay}
        meals={meals}
        onPlanMeals={handlePlanMeals}
        onAddMeals={handleAddMeals}
      />
      
      <AnimatePresence>
        {showConfirmDialog && (
          <ConfirmDialog
            isOpen={showConfirmDialog}
            title="Replace shopping list?"
            message={`You have ingredients from ${uniqueRecipes} ${uniqueRecipes === 1 ? 'recipe' : 'recipes'} in your shopping list. Do you want to replace them with the new meal plan or add to the existing list?`}
            confirmLabel="Replace"
            tertiaryLabel="Cancel"
            onConfirm={handleConfirmReplace}
            onTertiary={handleCancel}
            onCancel={handleConfirmAdd}
            variant="warning"
          />
        )}
      </AnimatePresence>
    </>
  );
}
