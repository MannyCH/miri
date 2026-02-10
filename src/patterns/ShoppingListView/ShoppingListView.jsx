import React from 'react';
import { IngredientList } from '../../components/IngredientList';
import { SearchBar } from '../../components/SearchBar';
import { Button } from '../../components/Button';
import { NavigationBar } from '../../components/NavigationBar';
import './ShoppingListView.css';

/**
 * ShoppingListView Pattern - Shopping list screen with ingredients
 * Composition of: IngredientList, SearchBar, Button, NavigationBar
 * Supports two view modes: list view and recipe-grouped view
 */
export const ShoppingListView = ({
  viewMode = 'list', // 'list' or 'recipe'
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
  return (
    <div className="shopping-list-view" {...props}>
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
        {/* List View Mode */}
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

        {/* Recipe View Mode */}
        {viewMode === 'recipe' && (
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
        )}
      </div>

      {/* Search Bar */}
      <div className="shopping-list-search">
        <SearchBar
          placeholder="Ich brauche..."
          value={searchQuery}
          onChange={(e) => onSearch?.(e.target.value)}
          trailingIcon={<SearchIcon />}
        />
      </div>

      {/* Bottom Navigation */}
      <NavigationBar activeItem="shopping-list" />
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
