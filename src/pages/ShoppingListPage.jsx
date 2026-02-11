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
  const items = shoppingList.map(item => item.name);
  
  // Create checkedItems object
  const checkedItems = {};
  shoppingList.forEach((item, idx) => {
    checkedItems[idx] = item.checked;
  });
  
  // Convert grouped data to match ShoppingListView format
  const recipeGroups = groupedByRecipe.map(group => ({
    recipeName: group.recipeName,
    recipeId: group.recipeId,
    ingredients: group.ingredients.map(item => item.name),
    checkedItems: group.ingredients.reduce((acc, item, idx) => {
      acc[idx] = item.checked;
      return acc;
    }, {}),
    onIngredientCheck: (idx, checked) => {
      const item = group.ingredients[idx];
      if (item) {
        toggleIngredientCheck(item.id);
      }
    },
    onIngredientDelete: (idx) => {
      const item = group.ingredients[idx];
      if (item) {
        deleteIngredient(item.id);
      }
    },
    onDelete: () => {
      deleteRecipeFromShoppingList(group.recipeId);
    },
  }));
  
  return (
    <ShoppingListView
      viewMode={shoppingListViewMode}
      onViewModeChange={setShoppingListViewMode}
      items={items}
      recipeGroups={recipeGroups}
      checkedItems={checkedItems}
      onItemCheck={(idx, checked) => {
        // Find the actual item by index
        const item = shoppingList[idx];
        if (item) {
          toggleIngredientCheck(item.id);
        }
      }}
      onItemDelete={(idx) => {
        // Find the actual item by index
        const item = shoppingList[idx];
        if (item) {
          deleteIngredient(item.id);
        }
      }}
      onRecipeDelete={(recipeId) => {
        deleteRecipeFromShoppingList(recipeId);
      }}
      onClearList={clearShoppingList}
    />
  );
}
