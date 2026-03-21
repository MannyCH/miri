import React from 'react';
import { ShoppingListView } from '../patterns/ShoppingListView';
import { useApp } from '../context/AppContext';
import { usePreferences } from '../context/PreferencesContext';

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
    mealPlan,
    shoppingListViewMode,
    setShoppingListViewMode,
    toggleIngredientCheck,
    deleteIngredient,
    deleteRecipeFromShoppingList,
    markRecipeAsPurchased,
    markRecipeAsUnpurchased,
    clearShoppingList,
    smartGroups,
    setSmartGroups,
    smartStatus,
    fetchSmartGroups,
    sharedListMeta,
    sharedListItems,
    toggleSharedItem,
    shareList,
    leaveSharedList,
  } = useApp();
  const { preferences } = usePreferences();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Pantry staples persisted to localStorage
  const [pantryStaples, setPantryStaples] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('miri-pantry-staples') ?? '[]'); } catch { return []; }
  });

  const togglePantryStaple = React.useCallback((itemName) => {
    setPantryStaples(prev => {
      const next = prev.includes(itemName)
        ? prev.filter(s => s !== itemName)
        : [...prev, itemName];
      localStorage.setItem('miri-pantry-staples', JSON.stringify(next));
      return next;
    });
  }, []);

  // Count how many times each recipe appears in the meal plan this week
  const mealPlanOccurrences = React.useMemo(() => {
    const map = new Map();
    mealPlan.forEach(day => {
      Object.values(day.meals ?? {}).forEach(meal => {
        if (meal?.id) map.set(meal.id, (map.get(meal.id) ?? 0) + 1);
      });
    });
    return map;
  }, [mealPlan]);

  // Summary: unique recipes in the list × occurrences in plan × servings per meal
  const summaryEntries = React.useMemo(() => {
    const seen = new Map(); // recipeId → recipeName
    shoppingList.forEach(item => {
      if (item.recipeName && item.recipeId && !seen.has(item.recipeId)) {
        seen.set(item.recipeId, item.recipeName);
      }
    });
    return Array.from(seen.entries()).map(([recipeId, recipeName]) => {
      const occurrences = mealPlanOccurrences.get(recipeId) ?? 1;
      return { recipeName, servings: occurrences * (preferences.servings ?? 2) };
    });
  }, [shoppingList, mealPlanOccurrences, preferences.servings]);

  // Only fetch when switching TO smart view — not on every list change.
  // Optimistic updates handle in-view changes (delete, pantry toggle).
  React.useEffect(() => {
    if (shoppingListViewMode === 'smart') {
      fetchSmartGroups();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoppingListViewMode]);
  
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
  const itemKeys = filteredList.map((item, index) => item.entryId ?? `${item.id}-${index}`);
  const itemIds = filteredList.map(item => item.entryId ?? item.id);

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
      ingredientKeys: filteredIngredients.map((item, index) => item.entryId ?? `${item.id}-${index}`),
      ingredientIds: filteredIngredients.map(item => item.entryId ?? item.id),
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
        markRecipeAsPurchased(group.recipeId);
      },
      onRestore: () => {
        markRecipeAsUnpurchased(group.recipeId);
      },
    };
  });
  
  return (
    <ShoppingListView
      viewMode={shoppingListViewMode}
      onViewModeChange={setShoppingListViewMode}
      summaryEntries={summaryEntries}
      pantryStaples={pantryStaples}
      onTogglePantryStaple={togglePantryStaple}
      smartGroups={smartGroups}
      smartStatus={smartStatus}
      onSmartRefresh={() => fetchSmartGroups(true)}
      onSmartItemDelete={(itemName) => {
        // Optimistically remove from smart groups so the item disappears immediately
        setSmartGroups(prev =>
          prev.map(group => ({
            ...group,
            items: group.items.filter(i => i.name.toLowerCase() !== itemName.toLowerCase()),
          })).filter(group => group.items.length > 0)
        );
        // Match shopping list items whose name contains the smart name.
        // One direction only — avoids short smart names (e.g. "salt") accidentally
        // matching unrelated items (e.g. "sea salt", "garlic salt").
        const needle = itemName.toLowerCase();
        const matches = shoppingList.filter(item =>
          item.name.toLowerCase().includes(needle)
        );
        matches.forEach(match => deleteIngredient(match.entryId ?? match.id));
      }}
      items={items}
      itemKeys={itemKeys}
      itemIds={itemIds}
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
      isSharedList={!!sharedListMeta}
      sharedListMeta={sharedListMeta}
      sharedListItems={sharedListItems}
      onToggleSharedItem={toggleSharedItem}
      onShare={shareList}
      onLeave={leaveSharedList}
    />
  );
}
