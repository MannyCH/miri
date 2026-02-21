import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { MealPlanningView } from '../patterns/MealPlanningView';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { formatDayTitle } from '../data/recipes';

export function MealPlanningPage() {
  const {
    mealPlan,
    calendarDays,
    selectedFullDate,
    setSelectedFullDate,
    regenerateMealPlan,
    clearMealPlan,
    getDailyMeals,
    addAllToShoppingList,
    addRecipeToShoppingList,
    shoppingList,
  } = useApp();
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasAddedToList, setHasAddedToList] = useState(false);
  
  const hasPlan = mealPlan.length > 0;
  const dailyMeals = getDailyMeals();
  
  const meals = dailyMeals ? {
    breakfast: dailyMeals.meals.breakfast,
    lunch: dailyMeals.meals.lunch,
    dinner: dailyMeals.meals.dinner,
  } : {};

  const dynamicTitle = selectedFullDate ? formatDayTitle(selectedFullDate) : '';
  
  const handleDayClick = (date, fullDate) => {
    setSelectedFullDate(fullDate);
  };
  
  const handlePlanMeals = () => {
    regenerateMealPlan();
    setHasAddedToList(false);
  };

  const handleReplan = () => {
    regenerateMealPlan();
    setHasAddedToList(false);
  };

  const handleClearPlan = () => {
    clearMealPlan();
    setHasAddedToList(false);
  };
  
  const handleAddMeals = () => {
    if (shoppingList.length > 0) {
      setShowConfirmDialog(true);
    } else {
      addAllToShoppingList(false);
      setHasAddedToList(true);
    }
  };
  
  const handleConfirmReplace = () => {
    addAllToShoppingList(true);
    setHasAddedToList(true);
    setShowConfirmDialog(false);
  };
  
  const handleConfirmAdd = () => {
    addAllToShoppingList(false);
    setHasAddedToList(true);
    setShowConfirmDialog(false);
  };
  
  const handleCancel = () => {
    setShowConfirmDialog(false);
  };

  const handleAddRecipeToList = (recipeId) => {
    if (recipeId) {
      addRecipeToShoppingList(recipeId);
    }
  };
  
  const uniqueRecipes = new Set(shoppingList.map(item => item.recipeId)).size;
  
  return (
    <>
      <MealPlanningView
        calendarTitle={dynamicTitle}
        days={calendarDays}
        selectedFullDate={selectedFullDate}
        onDayClick={handleDayClick}
        meals={meals}
        hasPlan={hasPlan}
        hasMealsForDay={!!dailyMeals}
        hasAddedToList={hasAddedToList}
        onPlanMeals={handlePlanMeals}
        onAddMeals={handleAddMeals}
        onReplan={handleReplan}
        onClearPlan={handleClearPlan}
        onAddRecipeToList={handleAddRecipeToList}
      />
      
      <AnimatePresence>
        {showConfirmDialog && (
          <ConfirmDialog
            isOpen={showConfirmDialog}
            title="Update shopping list?"
            message={`You have ingredients from ${uniqueRecipes} ${uniqueRecipes === 1 ? 'recipe' : 'recipes'} in your shopping list.`}
            confirmLabel="Replace"
            secondaryLabel="Add"
            tertiaryLabel="Cancel"
            onConfirm={handleConfirmReplace}
            onSecondary={handleConfirmAdd}
            onTertiary={handleCancel}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>
    </>
  );
}
