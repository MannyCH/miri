import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { MealPlanningView } from '../patterns/MealPlanningView';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useApp } from '../context/AppContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatDayTitle } from '../data/recipes';

export function MealPlanningPage() {
  const navigate = useNavigate();
  const {
    mealPlan,
    isMealPlanGenerating,
    calendarDays,
    selectedFullDate,
    setSelectedFullDate,
    regenerateMealPlan,
    clearMealPlan,
    getDailyMeals,
    addAllToShoppingList,
    addRecipeToShoppingList,
    replaceMealInPlan,
    shoppingList,
    showToast,
  } = useApp();
  const { preferences } = usePreferences();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasAddedToList, setHasAddedToList] = useState(false);
  const [replacingMealType, setReplacingMealType] = useState(null);
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [pendingAddRecipeId, setPendingAddRecipeId] = useState(null);
  
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
    regenerateMealPlan(preferences);
    setHasAddedToList(false);
  };

  const handleReplan = () => {
    regenerateMealPlan(preferences);
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

  const handleRecipeClick = (recipeId) => {
    if (recipeId) navigate(`/recipes/${recipeId}`);
  };

  const handleAddRecipeToList = (recipeId) => {
    if (!recipeId) return;
    const alreadyInList = shoppingList.some(item => item.recipeId === recipeId);
    if (alreadyInList) {
      setPendingAddRecipeId(recipeId);
      setShowAddToListDialog(true);
    } else {
      addRecipeToShoppingList(recipeId, mealPlan);
      const recipe = mealPlan.flatMap(d => Object.values(d.meals)).find(m => m?.id === recipeId);
      showToast('success', `${recipe?.title ?? 'Recipe'} added to list`);
    }
  };

  const handleConfirmAddAgain = () => {
    if (pendingAddRecipeId) {
      addRecipeToShoppingList(pendingAddRecipeId, mealPlan);
      const recipe = mealPlan.flatMap(d => Object.values(d.meals)).find(m => m?.id === pendingAddRecipeId);
      showToast('success', `${recipe?.title ?? 'Recipe'} added to list`);
    }
    setPendingAddRecipeId(null);
    setShowAddToListDialog(false);
  };

  const handleCancelAddAgain = () => {
    setPendingAddRecipeId(null);
    setShowAddToListDialog(false);
  };

  const handleReplaceMeal = async (mealType) => {
    const currentMeal = meals[mealType];
    if (!currentMeal) return;
    setReplacingMealType(mealType);
    try {
      await replaceMealInPlan(selectedFullDate, mealType, currentMeal.id, preferences);
    } catch {
      // error toast handled inside replaceMealInPlan
    } finally {
      setReplacingMealType(null);
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
        isGenerating={isMealPlanGenerating}
        onPlanMeals={handlePlanMeals}
        onAddMeals={handleAddMeals}
        onReplan={handleReplan}
        onClearPlan={handleClearPlan}
        onAddRecipeToList={handleAddRecipeToList}
        onRecipeClick={handleRecipeClick}
        replacingMealType={replacingMealType}
        onReplaceMeal={handleReplaceMeal}
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
        {showAddToListDialog && (
          <ConfirmDialog
            isOpen={showAddToListDialog}
            title="Already in list"
            message="This meal is already in your shopping list. Add it again?"
            confirmLabel="Add again"
            tertiaryLabel="Cancel"
            onConfirm={handleConfirmAddAgain}
            onTertiary={handleCancelAddAgain}
            onCancel={handleCancelAddAgain}
          />
        )}
      </AnimatePresence>
    </>
  );
}
