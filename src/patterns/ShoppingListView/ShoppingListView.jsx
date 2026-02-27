import React, { useEffect, useRef, useState } from 'react';
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
  recipeGroups = [],
  checkedItems = {},
  onItemCheck,
  onItemDelete,
  onClearList,
  onViewModeChange,
  searchQuery = '',
  onSearch,
  ...props
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
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
        </div>
      </header>

      {/* Content */}
      <div className="shopping-list-content">
        {viewMode === 'list' && (
          <>
            <IngredientList
              ingredients={items}
              checkedItems={checkedItems}
              onCheckedChange={onItemCheck}
              onDelete={onItemDelete}
            />
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
              {recipeGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="recipe-group">
                  <div className="recipe-group-header">
                    <h3 className="text-body-base-bold">{group.recipeName}</h3>
                    <button
                      className="icon-button-delete"
                      onClick={() => group.onDelete?.()}
                      aria-label={`Delete ${group.recipeName}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  <IngredientList
                    ingredients={group.ingredients}
                    checkedItems={group.checkedItems || {}}
                    onCheckedChange={(index, checked) =>
                      group.onIngredientCheck?.(index, checked)
                    }
                    onDelete={(index) => group.onIngredientDelete?.(index)}
                  />
                </div>
              ))}
            </div>
            {recipeGroups.length > 0 && (
              <div className="shopping-list-clear">
                <Button variant="tertiary-delete" onClick={onClearList}>
                  Clear whole list
                </Button>
              </div>
            )}
          </>
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

ShoppingListView.displayName = 'ShoppingListView';
