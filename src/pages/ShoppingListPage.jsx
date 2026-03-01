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
  const [searchQuery, setSearchQuery] = React.useState('');
  
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
  
  const lowerQuery = searchQuery.toLowerCase();

  // Filter first, preserving original indices for callbacks
  const filteredList = shoppingList
    .map((item, originalIdx) => ({ ...item, originalIdx }))
    .filter(item => !lowerQuery || item.name.toLowerCase().includes(lowerQuery));

  const items = filteredList.map(item => item.name);
  const itemKeys = filteredList.map(item => item.id);

  const checkedItems = {};
  filteredList.forEach((item, idx) => {
    checkedItems[idx] = item.checked;
  });
  
  // Convert grouped data to match ShoppingListView format (filter by search)
  const recipeGroups = groupedByRecipe.map(group => {
    const filteredIngredients = group.ingredients
      .filter(item => !lowerQuery || item.name.toLowerCase().includes(lowerQuery));

    return {
      recipeName: group.recipeName,
      recipeId: group.recipeId,
      ingredients: filteredIngredients.map(item => item.name),
      ingredientKeys: filteredIngredients.map(item => item.id),
      checkedItems: filteredIngredients.reduce((acc, item, idx) => {
        acc[idx] = item.checked;
        return acc;
      }, {}),
      onIngredientCheck: (idx, checked, itemId) => {
        if (itemId) {
          toggleIngredientCheck(itemId);
          return;
        }
        const item = filteredIngredients[idx];
        if (item) toggleIngredientCheck(item.id);
      },
      onIngredientDelete: (idx, itemId) => {
        if (itemId) {
          deleteIngredient(itemId);
          return;
        }
        const item = filteredIngredients[idx];
        if (item) deleteIngredient(item.id);
      },
      onDelete: () => {
        deleteRecipeFromShoppingList(group.recipeId);
      },
    };
  });
  
  return (
    <ShoppingListView
      viewMode={shoppingListViewMode}
      onViewModeChange={setShoppingListViewMode}
      items={items}
      itemKeys={itemKeys}
      recipeGroups={recipeGroups}
      checkedItems={checkedItems}
      onItemCheck={(idx, checked, itemId) => {
        if (itemId) {
          toggleIngredientCheck(itemId);
          return;
        }
        const item = filteredList[idx];
        if (item) toggleIngredientCheck(item.id);
      }}
      onItemDelete={(idx, itemId) => {
        if (itemId) {
          deleteIngredient(itemId);
          return;
        }
        const item = filteredList[idx];
        if (item) deleteIngredient(item.id);
      }}
      onRecipeDelete={(recipeId) => {
        deleteRecipeFromShoppingList(recipeId);
      }}
      onClearList={clearShoppingList}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    />
  );
}
