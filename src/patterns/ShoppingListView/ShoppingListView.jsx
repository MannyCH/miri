import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'react-feather';
import { Divider } from '../../components/Divider';
import { IngredientList } from '../../components/IngredientList';
import { SearchBar } from '../../components/SearchBar';
import { Button } from '../../components/Button';
import { ListSwitcher } from '../../components/ListSwitcher';
import { NavigationBarConnected } from '../../components/NavigationBar/NavigationBarConnected';
import './ShoppingListView.css';

/**
 * ShoppingListView Pattern - Shopping list screen with ingredients
 * Composition of: IngredientList, SearchBar, Button, NavigationBar
 * Supports two view modes: list view and recipe-grouped view
 */
export const ShoppingListView = ({
  viewMode = 'list',
  items = [],
  itemKeys = [],
  itemIds = [],
  recipeGroups = [],
  checkedItems = {},
  onItemCheck,
  onItemDelete,
  onClearList,
  onViewModeChange,
  onSmartRefresh,
  onSmartItemDelete,
  smartGroups = [],
  smartStatus = 'idle',
  summaryEntries = [],
  pantryStaples = [],
  onTogglePantryStaple,
  // Multi-list props
  listName = 'Shopping list',
  memberCount = 1,
  isListLoading = false,
  onListNameTap,
  lists = [],
  activeListId,
  onSwitchList,
  onMenuTap,
  onAddIngredient,
  pendingItems = [],
  onSetQuantity,
  ...props
}) => {
  const PURCHASED_SECTION_TITLE = 'Eingekauft';
  const RECIPE_REMOVE_ANIMATION_MS = 320;
  const MAX_SUGGESTIONS = 5;
  const [searchQuery, setSearchQuery] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [removingRecipeKeys, setRemovingRecipeKeys] = useState({});
  const searchInputRef = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      setKeyboardHeight(Math.max(0, window.innerHeight - vv.offsetTop - vv.height));
    };
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  const handleAddSuggestion = (name) => {
    onAddIngredient?.(name);
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const handleAddBarKeyDown = (e) => {
    if (e.key === 'Enter' && trimmedQuery.length > 0) {
      e.preventDefault();
      handleAddSuggestion(trimmedQuery);
    }
  };

  const trimmedQuery = searchQuery.trim();
  const suggestions = trimmedQuery.length > 0
    ? INGREDIENT_SUGGESTIONS
        .filter(s => s.toLowerCase().startsWith(trimmedQuery.toLowerCase()))
        .slice(0, MAX_SUGGESTIONS)
    : [];

  const getRecipeGroupKey = (group, index) =>
    group.recipeId ?? group.id ?? group.recipeName ?? `group-${index}`;

  const handleRecipeGroupDelete = (group, groupIndex) => {
    const groupKey = getRecipeGroupKey(group, groupIndex);
    if (removingRecipeKeys[groupKey]) return;

    setRemovingRecipeKeys(prev => ({ ...prev, [groupKey]: true }));
    window.setTimeout(() => {
      group.onDelete?.();
      setRemovingRecipeKeys(prev => {
        const next = { ...prev };
        delete next[groupKey];
        return next;
      });
    }, RECIPE_REMOVE_ANIMATION_MS);
  };

  const uncheckedItems = {
    ingredients: [],
    itemKeys: [],
    itemIds: [],
    originalIndices: [],
  };
  const checkedListItems = {
    ingredients: [],
    itemKeys: [],
    itemIds: [],
    originalIndices: [],
  };

  items.forEach((ingredient, index) => {
    const target = checkedItems[index] ? checkedListItems : uncheckedItems;
    target.ingredients.push(ingredient);
    target.itemKeys.push(itemKeys[index]);
    target.itemIds.push(itemIds[index]);
    target.originalIndices.push(index);
  });

  const splitRecipeGroupByChecked = (group) => {
    const uncheckedIndices = [];
    const checkedIndices = [];

    (group.ingredients || []).forEach((ingredient, index) => {
      const checkedValue = group.checkedItems?.[index];
      const isPantry = pantryStaples.some(s => ingredient?.toLowerCase().includes(s));
      if (checkedValue === true || isPantry) {
        checkedIndices.push(index);
      } else {
        uncheckedIndices.push(index);
      }
    });

    const createGroupFromIndices = (indices, isCheckedGroup) => {
      if (indices.length === 0) return null;
      return {
        ...group,
        ingredients: indices.map((index) => group.ingredients?.[index]),
        ingredientKeys: indices.map((index) => group.ingredientKeys?.[index]),
        ingredientIds: indices.map((index) => group.ingredientIds?.[index]),
        originalIndices: indices,
        checkedItems: indices.reduce((acc, _, nextIndex) => {
          acc[nextIndex] = isCheckedGroup;
          return acc;
        }, {}),
      };
    };

    return {
      uncheckedGroup: createGroupFromIndices(uncheckedIndices, false),
      checkedGroup: createGroupFromIndices(checkedIndices, true),
    };
  };

  const groupedSections = recipeGroups.map(splitRecipeGroupByChecked);
  const uncheckedRecipeGroups = groupedSections
    .map((group) => group.uncheckedGroup)
    .filter(Boolean);
  const checkedRecipeGroups = groupedSections
    .map((group) => group.checkedGroup)
    .filter(Boolean);

  return (
    <div
      className="shopping-list-view"
      style={{ '--keyboard-height': `${keyboardHeight}px` }}
      {...props}
    >
      {/* Header */}
      <header className="shopping-list-header">
        <h1 className="text-h1-bold">Einkaufsliste</h1>
        <div className="shopping-list-subtitle-row">
          <div className="shopping-list-subtitle-left">
            <ListSwitcher
              lists={lists.map((l) => ({
                ...l,
                isShared: l.memberCount > 1,
              }))}
              activeListId={activeListId}
              onSwitch={onSwitchList}
            />
            {memberCount > 1 && (
              <span className="shopping-list-share-badge text-caption-bold">
                <UsersIcon /> {memberCount}
              </span>
            )}
          </div>
          <div className="shopping-list-subtitle-right">
            <div className="shopping-list-view-toggle">
              <button
                className={`view-toggle-button ${viewMode === 'recipe' ? 'active' : ''}`}
                onClick={() => onViewModeChange?.('recipe')}
                aria-label="Group by recipe"
              >
                <GridIcon />
              </button>
              <button
                className={`view-toggle-button ${viewMode === 'smart' ? 'active' : ''}`}
                onClick={() => onViewModeChange?.('smart')}
                aria-label="Smart grouped list"
              >
                <SparkleIcon />
              </button>
            </div>
            {onMenuTap && (
              <button
                type="button"
                className="shopping-list-menu-btn"
                onClick={onMenuTap}
                aria-label="List options"
              >
                <MoreIcon />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="shopping-list-content">
        {pendingItems.length > 0 && (
          <div className="shopping-list-pending">
            {pendingItems.map(({ entryId, name }) => (
              <PendingIngredientRow
                key={entryId}
                entryId={entryId}
                name={name}
                onSetQuantity={onSetQuantity}
              />
            ))}
          </div>
        )}
        {summaryEntries.length > 0 && (
          <div className="shopping-list-summary">
            <p className="text-body-small-bold shopping-list-summary-title">For this week</p>
            <ul className="shopping-list-summary-list">
              {summaryEntries.map(({ recipeName, servings }) => (
                <li key={recipeName} className="text-body-small-regular shopping-list-summary-item">
                  <span className="shopping-list-summary-servings">×{servings}</span>
                  <span>{recipeName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {viewMode === 'recipe' && (
          <>
            <div className="shopping-list-recipe-groups">
              {uncheckedRecipeGroups.map((group, groupIndex) => (
                <motion.div
                  key={getRecipeGroupKey(group, groupIndex)}
                  className="recipe-group"
                  initial={false}
                  layout="position"
                  style={
                    removingRecipeKeys[getRecipeGroupKey(group, groupIndex)]
                      ? { pointerEvents: 'none', overflow: 'hidden' }
                      : { overflow: 'hidden' }
                  }
                  animate={
                    removingRecipeKeys[getRecipeGroupKey(group, groupIndex)]
                      ? { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, scale: 0.98 }
                      : { opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0, scale: 1 }
                  }
                  transition={{
                    duration: RECIPE_REMOVE_ANIMATION_MS / 1000,
                    ease: [0.22, 0.61, 0.36, 1],
                    layout: { type: 'spring', stiffness: 420, damping: 34, mass: 0.65 },
                  }}
                >
                  <div className="recipe-group-header">
                    <h3 className="text-body-base-bold">{group.recipeName}</h3>
                    <button
                      className="icon-button-delete"
                      onClick={() => handleRecipeGroupDelete(group, groupIndex)}
                      aria-label={`Delete ${group.recipeName}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <IngredientList
                    ingredients={group.ingredients}
                    itemKeys={group.ingredientKeys || []}
                    itemIds={group.ingredientIds || []}
                    checkedItems={group.checkedItems || {}}
                    onCheckedChange={(index, checked, itemId) =>
                      group.onIngredientCheck?.(group.originalIndices[index], checked, itemId)
                    }
                    onDelete={(index, itemId) =>
                      group.onIngredientDelete?.(group.originalIndices[index], itemId)
                    }
                    pantryStaples={pantryStaples}
                    onPantryToggle={(_, ingredient) => onTogglePantryStaple?.(ingredient?.toLowerCase())}
                  />
                </motion.div>
              ))}
            </div>
            {checkedRecipeGroups.length > 0 && (
              <>
                <h2 className="shopping-list-purchased-title text-body-small-bold">
                  {PURCHASED_SECTION_TITLE}
                </h2>
                <div className="shopping-list-recipe-groups">
                  {checkedRecipeGroups.map((group, groupIndex) => (
                    <motion.div
                      key={`purchased-${getRecipeGroupKey(group, groupIndex)}`}
                      className="recipe-group"
                      initial={false}
                      layout="position"
                      style={{ overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0, x: 0, scale: 1 }}
                      transition={{
                        duration: RECIPE_REMOVE_ANIMATION_MS / 1000,
                        ease: [0.22, 0.61, 0.36, 1],
                        layout: { type: 'spring', stiffness: 420, damping: 34, mass: 0.65 },
                      }}
                    >
                      <div className="recipe-group-header">
                        <h3 className="text-body-base-bold">{group.recipeName}</h3>
                        <button
                          className="icon-button-restore"
                          onClick={() => group.onRestore?.()}
                          aria-label={`Restore ${group.recipeName}`}
                        >
                          <RotateCcw size={20} />
                        </button>
                      </div>
                      <IngredientList
                        ingredients={group.ingredients}
                        itemKeys={group.ingredientKeys || []}
                        itemIds={group.ingredientIds || []}
                        checkedItems={group.checkedItems || {}}
                        onCheckedChange={(index, checked, itemId) =>
                          group.onIngredientCheck?.(group.originalIndices[index], checked, itemId)
                        }
                        onDelete={(index, itemId) =>
                          group.onIngredientDelete?.(group.originalIndices[index], itemId)
                        }
                        pantryStaples={pantryStaples}
                        onPantryToggle={(_, ingredient) => onTogglePantryStaple?.(ingredient?.toLowerCase())}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
            {recipeGroups.length > 0 && (
              <div className="shopping-list-clear">
                <Button variant="tertiary-delete" onClick={onClearList}>
                  Clear whole list
                </Button>
              </div>
            )}
          </>
        )}

        {viewMode === 'smart' && (
          <div className="shopping-list-smart">
            {smartStatus === 'loading' && (
              <div className="shopping-list-smart-loading">
                <SparkleIcon />
                <span className="text-body-regular">Organising your list…</span>
              </div>
            )}
            {smartStatus === 'error' && (
              <div className="shopping-list-smart-error">
                <p className="text-body-regular">Could not organise list.</p>
                <button type="button" className="shopping-list-smart-retry" onClick={onSmartRefresh}>
                  Try again
                </button>
              </div>
            )}
            {smartStatus === 'idle' && smartGroups.length === 0 && (
              <p className="shopping-list-smart-empty text-body-regular">
                Your list is empty.
              </p>
            )}
            {smartStatus === 'idle' && smartGroups.length > 0 && (
              <SmartListContent
                smartGroups={smartGroups}
                checkedItems={checkedItems}
                onItemCheck={onItemCheck}
                itemIds={itemIds}
                items={items}
                pantryStaples={pantryStaples}
                onTogglePantryStaple={onTogglePantryStaple}
                onSmartItemDelete={onSmartItemDelete}
                onSmartRefresh={onSmartRefresh}
                PURCHASED_SECTION_TITLE={PURCHASED_SECTION_TITLE}
              />
            )}
          </div>
        )}
      </div>

      {/* Suggestion sheet — partial overlay above add bar, visible while typing */}
      {trimmedQuery.length > 0 && (
        <div className="shopping-list-suggestions-sheet" role="listbox" aria-label="Ingredient suggestions">
          <button
            type="button"
            className="shopping-list-suggestion-item shopping-list-suggestion-add text-body-regular"
            role="option"
            aria-selected="false"
            onMouseDown={(e) => { e.preventDefault(); handleAddSuggestion(trimmedQuery); }}
          >
            Add &ldquo;{trimmedQuery}&rdquo;
          </button>
          {suggestions.map((name) => (
            <button
              key={name}
              type="button"
              className="shopping-list-suggestion-item text-body-regular"
              role="option"
              aria-selected="false"
              onMouseDown={(e) => { e.preventDefault(); handleAddSuggestion(name); }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Add ingredient bar — always visible above nav */}
      <div className="shopping-list-add-bar">
        <SearchBar
          inputRef={searchInputRef}
          placeholder="Ich brauche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleAddBarKeyDown}
          showTrailingIcon={false}
          inputMode="text"
          enterKeyHint="done"
        />
      </div>

      {/* Bottom Navigation */}
      <NavigationBarConnected activeItem="shopping-list" />
    </div>
  );
};

// Common ingredients for search suggestions
const INGREDIENT_SUGGESTIONS = [
  'Apples', 'Avocado', 'Bananas', 'Basil', 'Beef', 'Bell pepper',
  'Black pepper', 'Bread', 'Broccoli', 'Butter', 'Carrots', 'Celery',
  'Cheese', 'Chicken', 'Chickpeas', 'Chili flakes', 'Chocolate',
  'Cinnamon', 'Coconut milk', 'Coffee', 'Corn', 'Cream', 'Cucumbers',
  'Cumin', 'Eggs', 'Fish', 'Flour', 'Garlic', 'Ginger', 'Greek yogurt',
  'Honey', 'Kale', 'Lemons', 'Lentils', 'Lettuce', 'Limes', 'Milk',
  'Mushrooms', 'Mustard', 'Oats', 'Olive oil', 'Onions', 'Oranges',
  'Paprika', 'Parmesan', 'Parsley', 'Pasta', 'Peas', 'Potatoes',
  'Rice', 'Salmon', 'Salt', 'Shrimp', 'Soy sauce', 'Spinach', 'Sugar',
  'Sweet potato', 'Tomatoes', 'Tuna', 'Vanilla', 'Vinegar', 'Walnuts',
  'Yogurt', 'Zucchini',
];

/**
 * PendingIngredientRow — shows a newly added ingredient with an editable quantity field.
 * Quantity is prepended to the name when confirmed.
 */
function PendingIngredientRow({ entryId, name, onSetQuantity }) {
  const [quantity, setQuantity] = React.useState('');
  const inputRef = React.useRef(null);

  const handleCommit = () => {
    onSetQuantity?.(entryId, name, quantity);
  };

  return (
    <div className="pending-ingredient-row">
      <Divider />
      <div className="pending-ingredient-content">
        <input
          ref={inputRef}
          className="pending-ingredient-quantity text-body-small-regular"
          type="text"
          inputMode="decimal"
          value={quantity}
          placeholder="qty"
          onChange={(e) => setQuantity(e.target.value)}
          onBlur={handleCommit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); inputRef.current?.blur(); }
          }}
          aria-label={`Quantity for ${name}`}
          style={{ fontSize: '16px' }}
        />
        <span className="pending-ingredient-name text-body-small-regular">{name}</span>
      </div>
      <Divider />
    </div>
  );
}

/**
 * SmartListItem — tap to check/uncheck,
 * swipe RIGHT → pantry staple zone (brand colour, left side),
 * swipe LEFT  → delete zone (error colour, right side).
 */
function SmartListItem({ item, checked, isPantry, onToggle, onTogglePantryStaple, onDelete, isFirst }) {
  // positive = swiping left (delete), negative = swiping right (pantry)
  const [swipeX, setSwipeX] = React.useState(0);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = React.useState(false);
  const startXRef = React.useRef(0);
  const startYRef = React.useRef(0);
  const swipeDirectionRef = React.useRef(null); // 'horizontal' | 'vertical' | null

  const MAX_SWIPE = 120;
  const SWIPE_THRESHOLD = 84;
  const SWIPE_TRANSITION = '360ms cubic-bezier(0.22, 0.61, 0.36, 1)';
  const ANIMATE_OUT_MS = 320;

  const triggerDelete = React.useCallback(() => {
    if (isAnimatingOut) return;
    setSwipeX(MAX_SWIPE);
    setIsSwiping(false);
    setIsAnimatingOut(true);
    window.setTimeout(() => onDelete?.(), ANIMATE_OUT_MS);
  }, [isAnimatingOut, onDelete]);

  const triggerPantryToggle = React.useCallback(() => {
    if (isAnimatingOut) return;
    setSwipeX(-MAX_SWIPE);
    setIsSwiping(false);
    setIsAnimatingOut(true);
    window.setTimeout(() => {
      onTogglePantryStaple?.(item.name?.toLowerCase());
      setSwipeX(0);
      setIsAnimatingOut(false);
    }, ANIMATE_OUT_MS);
  }, [isAnimatingOut, item.name, onTogglePantryStaple]);

  const handleTouchStart = (e) => {
    if (isAnimatingOut) return;
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
    swipeDirectionRef.current = null;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const dx = startXRef.current - e.touches[0].clientX;
    const dy = startYRef.current - e.touches[0].clientY;

    if (swipeDirectionRef.current === null) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return;
      swipeDirectionRef.current = Math.abs(dy) > Math.abs(dx) ? 'vertical' : 'horizontal';
    }

    if (swipeDirectionRef.current === 'vertical') return;

    e.preventDefault();
    setSwipeX(Math.max(-MAX_SWIPE, Math.min(MAX_SWIPE, dx)));
  };

  const handleTouchEnd = () => {
    if (isAnimatingOut) return;
    swipeDirectionRef.current = null;
    if (swipeX > SWIPE_THRESHOLD) { triggerDelete(); return; }
    if (swipeX < -SWIPE_THRESHOLD) { triggerPantryToggle(); return; }
    setSwipeX(0);
    setIsSwiping(false);
  };

  const handleClick = () => {
    if (isSwiping || swipeX !== 0 || isAnimatingOut || isPantry) return;
    onToggle?.();
  };

  const leftProgress = Math.min(1, Math.max(0, swipeX) / MAX_SWIPE);   // left-swipe → delete
  const rightProgress = Math.min(1, Math.max(0, -swipeX) / MAX_SWIPE); // right-swipe → pantry
  const label = `${item.quantity ? item.quantity + ' ' : ''}${item.name}`;

  return (
    <motion.div
      className="smart-list-item"
      initial={false}
      layout="position"
      style={isAnimatingOut ? { pointerEvents: 'none', overflow: 'hidden' } : { overflow: 'hidden' }}
      animate={isAnimatingOut
        ? { opacity: 0, height: 0, marginTop: 0, marginBottom: 0, x: -16, scale: 0.98 }
        : { opacity: 1, height: 'auto', marginTop: 0, marginBottom: 0, x: 0, scale: 1 }}
      transition={{
        duration: ANIMATE_OUT_MS / 1000,
        ease: [0.22, 0.61, 0.36, 1],
        layout: { type: 'spring', stiffness: 420, damping: 34, mass: 0.65 },
      }}
    >
      {isFirst && <Divider />}
      <div
        className={`smart-list-item-wrapper${swipeX !== 0 ? ' is-swiping' : ''}`}
        style={{ '--left-swipe-progress': leftProgress, '--right-swipe-progress': rightProgress }}
      >
        {/* Pantry zone — sits on the LEFT, revealed by swiping RIGHT */}
        <button
          type="button"
          className="smart-list-item-pantry-zone"
          aria-label={isPantry ? `Remove ${item.name} from pantry staples` : `Mark ${item.name} as pantry staple`}
          onClick={triggerPantryToggle}
          tabIndex={rightProgress > 0 ? 0 : -1}
        >
          {isPantry ? <PantryRemoveIcon /> : <PantryIcon />}
        </button>

        {/* Delete zone — sits on the RIGHT, revealed by swiping LEFT */}
        <button
          type="button"
          className="smart-list-item-delete-zone"
          aria-label={`Delete ${label}`}
          onClick={triggerDelete}
          tabIndex={leftProgress > 0 ? 0 : -1}
        >
          <TrashIcon />
        </button>

        <div
          className={`smart-list-item-container${checked || isPantry ? ' is-checked' : ''}`}
          style={{
            transform: `translateX(${-swipeX}px)`,
            transition: isSwiping ? 'none' : `transform ${SWIPE_TRANSITION}`,
          }}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          aria-pressed={checked}
          aria-label={`${checked ? 'Uncheck' : 'Check'} ${label}`}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !isPantry) { e.preventDefault(); onToggle?.(); }
            if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); triggerDelete(); }
          }}
        >
          <span className="smart-list-item-quantity text-body-small-regular">{item.quantity || ''}</span>
          <span className="smart-list-item-name text-body-small-regular">{item.name}</span>
          {(checked || isPantry) && <CheckSmallIcon />}
        </div>
      </div>
      <Divider />
    </motion.div>
  );
}

function SmartListContent({ smartGroups, checkedItems, onItemCheck, itemIds, items, pantryStaples, onTogglePantryStaple, onSmartItemDelete, onSmartRefresh, PURCHASED_SECTION_TITLE }) {
  // Build a Set of checked item IDs for fast lookup
  const checkedIdSet = React.useMemo(() => {
    const set = new Set();
    itemIds.forEach((id, idx) => {
      if (checkedItems[idx]) set.add(id);
    });
    return set;
  }, [itemIds, checkedItems]);

  // Smart groups only contain unchecked items (AI merges quantities correctly).
  // A smart item is "checked" if ALL its sources are now checked in the shopping list.
  const isItemChecked = (item) => {
    if (item.sourceIds?.length > 0) {
      return item.sourceIds.every(id => checkedIdSet.has(id));
    }
    return false;
  };

  // Toggle a smart item — checks/unchecks all source shopping list items
  const handleToggle = (item) => {
    const checked = isItemChecked(item);
    if (item.sourceIds?.length > 0) {
      item.sourceIds.forEach(id => {
        const idx = itemIds.indexOf(id);
        if (idx !== -1 && onItemCheck) onItemCheck(idx, !checked, id);
      });
    }
  };

  // Unchecked toggle for items in "Eingekauft" — derived from shopping list, not smart groups
  const handleCheckedToggle = (id) => {
    const idx = itemIds.indexOf(id);
    if (idx !== -1 && onItemCheck) onItemCheck(idx, false, id);
  };

  // Checked items come directly from shopping list (not AI groups) — correct names/quantities
  const checkedShoppingItems = React.useMemo(() => {
    const result = [];
    items.forEach((name, idx) => {
      if (checkedItems[idx] && !pantryStaples.includes(name?.toLowerCase())) {
        result.push({ name, id: itemIds[idx] });
      }
    });
    return result;
  }, [items, checkedItems, itemIds, pantryStaples]);

  // Pantry items from smart groups
  const pantryItems = [];
  smartGroups.forEach((group, groupIdx) => {
    group.items.forEach((item) => {
      if (pantryStaples.includes(item.name?.toLowerCase())) {
        pantryItems.push({ item, key: `${groupIdx}-${item.name}` });
      }
    });
  });

  return (
    <>
      {smartGroups.map((group, groupIdx) => {
        const visibleItems = group.items
          .map((item) => ({ item, key: `${groupIdx}-${item.name}` }))
          .filter(({ item }) =>
            !pantryStaples.includes(item.name?.toLowerCase()) && !isItemChecked(item));
        if (visibleItems.length === 0) return null;
        return (
          <div key={group.category} className="smart-group">
            <h2 className="smart-group-header text-tiny-bold">
              <span aria-hidden="true">{group.emoji}</span> {group.category.toUpperCase()}
            </h2>
            {visibleItems.map(({ item, key }, idx) => (
              <SmartListItem
                key={key}
                item={item}
                checked={false}
                isPantry={false}
                onToggle={() => handleToggle(item)}
                onTogglePantryStaple={onTogglePantryStaple}
                onDelete={() => onSmartItemDelete?.(item.name)}
                isFirst={idx === 0}
              />
            ))}
          </div>
        );
      })}

      {checkedShoppingItems.length > 0 && (
        <div className="smart-group">
          <h2 className="smart-group-header text-tiny-bold">{PURCHASED_SECTION_TITLE.toUpperCase()}</h2>
          {checkedShoppingItems.map(({ name, id }, idx) => (
            <SmartListItem
              key={id}
              item={{ name, quantity: '' }}
              checked={true}
              isPantry={false}
              onToggle={() => handleCheckedToggle(id)}
              onTogglePantryStaple={onTogglePantryStaple}
              onDelete={() => onSmartItemDelete?.(name)}
              isFirst={idx === 0}
            />
          ))}
        </div>
      )}

      {pantryItems.length > 0 && (
        <div className="smart-group">
          <h2 className="smart-group-header text-tiny-bold smart-group-header--pantry">PANTRY STAPLES</h2>
          {pantryItems.map(({ item, key }, idx) => (
            <SmartListItem
              key={key}
              item={item}
              checked={true}
              isPantry={true}
              onTogglePantryStaple={onTogglePantryStaple}
              onDelete={() => onSmartItemDelete?.(item.name)}
              isFirst={idx === 0}
            />
          ))}
        </div>
      )}

      <div className="shopping-list-smart-refresh">
        <button type="button" className="shopping-list-smart-retry" onClick={onSmartRefresh}>Refresh</button>
      </div>
    </>
  );
}

const PantryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PantryRemoveIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <line x1="9" y1="12" x2="15" y2="18"/>
    <line x1="15" y1="12" x2="9" y2="18"/>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="10" y1="11" x2="10" y2="17"/>
    <line x1="14" y1="11" x2="14" y2="17"/>
  </svg>
);


const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="5" x2="10" y2="5"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="3" y1="20" x2="10" y2="20"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="5" r="1" fill="currentColor"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="12" cy="19" r="1" fill="currentColor"/>
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

ShoppingListView.displayName = 'ShoppingListView';
