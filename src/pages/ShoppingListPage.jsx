import React from 'react';
import { ShoppingListView } from '../patterns/ShoppingListView';
import { useApp } from '../context/AppContext';
import { usePreferences } from '../context/PreferencesContext';
import { AnimatePresence, motion } from 'motion/react';
import { ActionSheet } from '../components/ActionSheet';
import { ShareSheet } from '../components/ShareSheet';
import { Button } from '../components/Button';
import './ShoppingListPage.css';

/**
 * Shopping List Page
 * - Multi-list support with list switching
 * - Share badge + member count
 * - Context menu (rename, share, leave/delete)
 * - Check off ingredients
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
    // Multi-list
    lists,
    activeListId,
    members,
    inviteToken,
    isListLoading,
    switchList,
    createNewList,
    renameActiveList,
    deleteActiveList,
    leaveActiveList,
    removeListMember,
    showToast,
  } = useApp();
  const { preferences } = usePreferences();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isActionSheetOpen, setIsActionSheetOpen] = React.useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = React.useState(false);
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);
  const [createValue, setCreateValue] = React.useState('');

  const activeList = lists.find((l) => l.id === activeListId);
  const listName = activeList?.name || 'Home';
  const isShared = members.length > 1;

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
    const seen = new Map();
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

  // Only fetch when switching TO smart view
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
        if (itemId) { toggleIngredientCheck(itemId); return; }
        const item = filteredIngredients[idx];
        if (item) toggleIngredientCheck(item.id);
      },
      onIngredientDelete: (idx, itemId) => {
        if (itemId) { deleteIngredient(itemId); return; }
        const item = filteredIngredients[idx];
        if (item) deleteIngredient(item.id);
      },
      onDelete: () => markRecipeAsPurchased(group.recipeId),
      onRestore: () => markRecipeAsUnpurchased(group.recipeId),
    };
  });

  // ── Action sheet items for list management ──
  // ActionSheet API: { label, destructive?, onAction() } or '---' for separator
  const actionSheetItems = [];

  // Switch list options (if user has multiple lists)
  if (lists.length > 1) {
    lists.filter((l) => l.id !== activeListId).forEach((l) => {
      actionSheetItems.push({
        label: l.name,
        onAction: () => switchList(l.id),
      });
    });
    actionSheetItems.push('---');
  }

  actionSheetItems.push({
    label: 'Rename list',
    onAction: () => {
      setRenameValue(listName);
      setIsRenaming(true);
    },
  });

  actionSheetItems.push({
    label: 'Share list',
    onAction: () => setIsShareSheetOpen(true),
  });

  actionSheetItems.push({
    label: 'New list',
    onAction: () => {
      setCreateValue('');
      setIsCreating(true);
    },
  });

  if (isShared) {
    actionSheetItems.push({
      label: 'Leave list',
      destructive: true,
      onAction: async () => {
        await leaveActiveList();
        showToast('info', `Left "${listName}"`);
      },
    });
  } else if (lists.length > 1) {
    actionSheetItems.push({
      label: 'Delete list',
      destructive: true,
      onAction: async () => {
        await deleteActiveList();
      },
    });
  }

  // ── Rename handler ──
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (renameValue.trim() && renameValue.trim() !== listName) {
      await renameActiveList(renameValue.trim());
    }
    setIsRenaming(false);
  };

  // ── Create handler ──
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (createValue.trim()) {
      await createNewList(createValue.trim());
    }
    setIsCreating(false);
  };

  return (
    <>
      <ShoppingListView
        listName={listName}
        memberCount={members.length}
        isListLoading={isListLoading}
        onListNameTap={() => setIsActionSheetOpen(true)}
        lists={lists}
        activeListId={activeListId}
        onSwitchList={switchList}
        onMenuTap={() => setIsActionSheetOpen(true)}
        viewMode={shoppingListViewMode}
        onViewModeChange={setShoppingListViewMode}
        summaryEntries={summaryEntries}
        pantryStaples={pantryStaples}
        onTogglePantryStaple={togglePantryStaple}
        smartGroups={smartGroups}
        smartStatus={smartStatus}
        onSmartRefresh={() => fetchSmartGroups(true)}
        onSmartItemDelete={(itemName) => {
          setSmartGroups(prev =>
            prev.map(group => ({
              ...group,
              items: group.items.filter(i => i.name.toLowerCase() !== itemName.toLowerCase()),
            })).filter(group => group.items.length > 0)
          );
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
          if (itemId) { toggleIngredientCheck(itemId); return; }
          const item = filteredList[idx];
          if (item) toggleIngredientCheck(item.id);
        }}
        onItemDelete={(idx, itemId) => {
          if (itemId) { deleteIngredient(itemId); return; }
          const item = filteredList[idx];
          if (item) deleteIngredient(item.id);
        }}
        onRecipeDelete={(recipeId) => deleteRecipeFromShoppingList(recipeId)}
        onClearList={clearShoppingList}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      {/* List action sheet */}
      <ActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        title={listName}
        items={actionSheetItems}
      />

      {/* Share sheet */}
      <ShareSheet
        isOpen={isShareSheetOpen}
        onClose={() => setIsShareSheetOpen(false)}
        listName={listName}
        members={members}
        onCopyLink={async () => {
          if (!inviteToken) { showToast('error', 'No invite link available'); return; }
          try {
            const url = `${window.location.origin}/join/${inviteToken}`;
            await navigator.clipboard.writeText(url);
            showToast('success', 'Link copied');
          } catch {
            showToast('error', 'Could not copy link');
          }
        }}
        onNativeShare={async () => {
          if (!inviteToken) return;
          try {
            const url = `${window.location.origin}/join/${inviteToken}`;
            await navigator.share({ title: listName, url });
          } catch { /* user cancelled or unsupported */ }
        }}
        onRemoveMember={removeListMember}
      />

      {/* Rename sheet */}
      <AnimatePresence>
        {isRenaming && (
          <>
            <motion.div
              className="sheet-form-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRenaming(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Rename list"
              className="sheet-form"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="sheet-form-handle" aria-hidden="true" />
              <h2 className="text-h3-bold sheet-form-title">Rename list</h2>
              <form onSubmit={handleRenameSubmit} className="sheet-form-body">
                <input
                  autoFocus
                  className="sheet-form-input text-body-regular"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="List name"
                />
                <div className="sheet-form-actions">
                  <Button variant="secondary" onClick={() => setIsRenaming(false)} type="button">Cancel</Button>
                  <Button variant="primary" type="submit">Save</Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create list sheet */}
      <AnimatePresence>
        {isCreating && (
          <>
            <motion.div
              className="sheet-form-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="New list"
              className="sheet-form"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="sheet-form-handle" aria-hidden="true" />
              <h2 className="text-h3-bold sheet-form-title">New list</h2>
              <form onSubmit={handleCreateSubmit} className="sheet-form-body">
                <input
                  autoFocus
                  className="sheet-form-input text-body-regular"
                  value={createValue}
                  onChange={(e) => setCreateValue(e.target.value)}
                  placeholder="List name"
                />
                <div className="sheet-form-actions">
                  <Button variant="secondary" onClick={() => setIsCreating(false)} type="button">Cancel</Button>
                  <Button variant="primary" type="submit">Save</Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
