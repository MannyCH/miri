import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCcw } from 'react-feather';
import { IngredientList } from '../../components/IngredientList';
import { SearchBar } from '../../components/SearchBar';
import { Button } from '../../components/Button';
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
  smartGroups = [],
  smartStatus = 'idle',
  searchQuery = '',
  onSearch,
  ...props
}) => {
  const [smartChecked, setSmartChecked] = useState({});

  const toggleSmartItem = (key) =>
    setSmartChecked(prev => ({ ...prev, [key]: !prev[key] }));
  const PURCHASED_SECTION_TITLE = 'Eingekauft';
  const RECIPE_REMOVE_ANIMATION_MS = 320;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  const handleFabClick = () => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleCancel = () => {
    setIsSearchOpen(false);
    onSearch?.('');
  };

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

    (group.ingredients || []).forEach((_, index) => {
      const checkedValue = group.checkedItems?.[index];
      if (checkedValue === true) {
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
        <h1 className="text-h1-bold">Shopping list</h1>

        {/* View Mode Toggle */}
        <div className="shopping-list-view-toggle">
          <button
            className={`view-toggle-button ${viewMode === 'recipe' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('recipe')}
            aria-label="Group by recipe"
          >
            <GridIcon />
          </button>
          <button
            className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('list')}
            aria-label="Simple list"
          >
            <ListIcon />
          </button>
          <button
            className={`view-toggle-button ${viewMode === 'smart' ? 'active' : ''}`}
            onClick={() => onViewModeChange?.('smart')}
            aria-label="Smart grouped list"
          >
            <SparkleIcon />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="shopping-list-content">
        {viewMode === 'list' && (
          <>
            <IngredientList
              ingredients={uncheckedItems.ingredients}
              itemKeys={uncheckedItems.itemKeys}
              itemIds={uncheckedItems.itemIds}
              checkedItems={{}}
              onCheckedChange={(sectionIndex, checked, itemId) =>
                onItemCheck?.(uncheckedItems.originalIndices[sectionIndex], checked, itemId)
              }
              onDelete={(sectionIndex, itemId) =>
                onItemDelete?.(uncheckedItems.originalIndices[sectionIndex], itemId)
              }
            />
            {checkedListItems.ingredients.length > 0 && (
              <>
                <h2 className="shopping-list-purchased-title text-body-small-bold">
                  {PURCHASED_SECTION_TITLE}
                </h2>
                <IngredientList
                  ingredients={checkedListItems.ingredients}
                  itemKeys={checkedListItems.itemKeys}
                  itemIds={checkedListItems.itemIds}
                  checkedItems={checkedListItems.ingredients.reduce((acc, _, index) => {
                    acc[index] = true;
                    return acc;
                  }, {})}
                  onCheckedChange={(sectionIndex, checked, itemId) =>
                    onItemCheck?.(checkedListItems.originalIndices[sectionIndex], checked, itemId)
                  }
                  onDelete={(sectionIndex, itemId) =>
                    onItemDelete?.(checkedListItems.originalIndices[sectionIndex], itemId)
                  }
                />
              </>
            )}
            {items.length > 0 && (
              <div className="shopping-list-clear">
                <Button variant="tertiary-delete" onClick={onClearList}>
                  Clear whole list
                </Button>
              </div>
            )}
          </>
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
              <>
                {smartGroups.map((group, groupIdx) => (
                  <div key={group.category} className="smart-group">
                    <h2 className="smart-group-header text-tiny-bold">
                      <span aria-hidden="true">{group.emoji}</span> {group.category.toUpperCase()}
                    </h2>
                    <ul className="smart-group-items">
                      {group.items.map((item, itemIdx) => {
                        const key = `${groupIdx}-${itemIdx}`;
                        const checked = !!smartChecked[key];
                        return (
                          <li key={key}>
                            <button
                              type="button"
                              className={`smart-item${checked ? ' smart-item--checked' : ''}`}
                              onClick={() => toggleSmartItem(key)}
                              aria-pressed={checked}
                            >
                              {item.quantity && (
                                <span className="smart-item-quantity text-body-regular">
                                  {item.quantity}
                                </span>
                              )}
                              <span className="smart-item-name text-body-regular">{item.name}</span>
                              {checked && <CheckSmallIcon />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                <div className="shopping-list-smart-refresh">
                  <button type="button" className="shopping-list-smart-retry" onClick={onSmartRefresh}>
                    Refresh
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <NavigationBarConnected activeItem="shopping-list" />

      {/* Search overlay — slides in from top, Cancel always visible above keyboard */}
      {isSearchOpen && (
        <div className="shopping-list-search-overlay">
          <SearchBar
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            inputRef={searchInputRef}
            placeholder="Ich brauche..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            showTrailingIcon={false}
          />
          <button
            type="button"
            className="shopping-list-search-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Floating search FAB — fixed, floats above keyboard */}
      <button
        type="button"
        className="shopping-list-search-fab"
        onClick={handleFabClick}
        aria-label="Search shopping list"
      >
        <SearchIcon />
      </button>
    </div>
  );
};

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

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/>
    <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5z"/>
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

ShoppingListView.displayName = 'ShoppingListView';
