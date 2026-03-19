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
    shoppingListViewMode,
    setShoppingListViewMode,
    toggleIngredientCheck,
    deleteIngredient,
    deleteRecipeFromShoppingList,
    markRecipeAsPurchased,
    markRecipeAsUnpurchased,
    clearShoppingList,
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

  // Compute summary: unique recipes in the list with serving count
  const summaryEntries = React.useMemo(() => {
    const recipeMap = new Map();
    shoppingList.forEach(item => {
      if (!item.recipeName) return;
      if (!recipeMap.has(item.recipeName)) {
        recipeMap.set(item.recipeName, preferences.servings ?? 2);
      }
    });
    return Array.from(recipeMap.entries()).map(([recipeName, servings]) => ({ recipeName, servings }));
  }, [shoppingList, preferences.servings]);
  const [smartGroups, setSmartGroups] = React.useState([]);
  const [smartStatus, setSmartStatus] = React.useState('idle');
  const lastFetchedKeyRef = React.useRef(null);

  const fetchSmartGroups = React.useCallback((force = false) => {
    const uncheckedItems = shoppingList
      .filter(item => !item.checked)
      .map(item => item.name);

    const key = uncheckedItems.join('||');

    if (!force && key === lastFetchedKeyRef.current) return;

    if (uncheckedItems.length === 0) {
      lastFetchedKeyRef.current = key;
      setSmartGroups([]);
      setSmartStatus('idle');
      return;
    }

    lastFetchedKeyRef.current = key;
    setSmartStatus('loading');
    fetch('/api/normalize-shopping-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: uncheckedItems }),
    })
      .then(r => r.json())
      .then(data => {
        setSmartGroups(data.groups ?? []);
        setSmartStatus('idle');
      })
      .catch(() => setSmartStatus('error'));
  }, [shoppingList]);

  React.useEffect(() => {
    if (shoppingListViewMode === 'smart') {
      fetchSmartGroups();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shoppingListViewMode, shoppingList]);
  
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
        const match = shoppingList.find(
          item => item.name.toLowerCase() === itemName.toLowerCase()
        );
        if (match) deleteIngredient(match.entryId ?? match.id);
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
    />
  );
}
