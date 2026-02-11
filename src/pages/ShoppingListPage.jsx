import React from 'react';
import { ShoppingListView } from '../patterns/ShoppingListView';
import { useApp } from '../context/AppContext';

/**
 * Shopping List Page
 * - View shopping list as flat list
 * - View shopping list grouped by recipes
 * - Check off ingredients
 * - Delete ingredients or entire recipes
 * - Clear entire shopping list
 */
export function ShoppingListPage() {
  const {
    shoppingList,
    shoppingListViewMode,
    setShoppingListViewMode,
    toggleIngredientCheck,
    deleteIngredient,
    deleteRecipeFromShoppingList,
    clearShoppingList,
  } = useApp();
  
  // Group ingredients by recipe for recipe view mode
  const groupedByRecipe = shoppingList.reduce((acc, item) => {
    const existing = acc.find(group => group.recipeId === item.recipeId);
    if (existing) {
      existing.ingredients.push(item);
    } else {
      acc.push({
        recipeId: item.recipeId,
        recipeName: item.recipeName,
        ingredients: [item],
      });
    }
    return acc;
  }, []);
  
  // Convert shopping list items to format expected by ShoppingListView
  const ingredients = shoppingList.map(item => ({
    id: item.id,
    name: item.name,
    checked: item.checked,
  }));
  
  return (
    <ShoppingListView
      viewMode={shoppingListViewMode}
      onViewModeChange={setShoppingListViewMode}
      ingredients={ingredients}
      groupedByRecipe={groupedByRecipe}
      onIngredientCheck={(id, checked) => {
        toggleIngredientCheck(id);
      }}
      onIngredientDelete={(id) => {
        deleteIngredient(id);
      }}
      onRecipeDelete={(recipeId) => {
        deleteRecipeFromShoppingList(recipeId);
      }}
      onClearList={clearShoppingList}
    />
  );
}
