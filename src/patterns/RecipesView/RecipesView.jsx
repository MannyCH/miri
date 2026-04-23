import React, { useRef, useState } from 'react';
import { Plus } from 'react-feather';
import { RecipeList } from '../../components/RecipeList';
import { SearchBar } from '../../components/SearchBar';
import { Button } from '../../components/Button/Button';
import { Chip } from '../../components/Chip';
import { NavigationBarConnected } from '../../components/NavigationBar/NavigationBarConnected';
import './RecipesView.css';

/**
 * RecipesView Pattern - Recipe browsing screen with search
 * Composition of: SearchBar, RecipeList, NavigationBar
 */
export const RecipesView = ({
  recipes = [],
  searchQuery = '',
  onSearchChange,
  onRecipeClick,
  onImportRequest,
  availableFilters = [],
  activeFilters = [],
  onFilterToggle,
  className,
  style,
  ...props
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const handleFabClick = () => {
    if (isSearchOpen) {
      // Search bar already visible — re-focus directly within the user gesture
      // so mobile browsers allow the keyboard to reappear
      searchInputRef.current?.focus();
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleCancel = () => {
    setIsSearchOpen(false);
    onSearchChange?.('');
  };

  return (
    <div
      className={`recipes-view${className ? ` ${className}` : ''}`}
      style={style}
      {...props}
    >
      <header className="recipes-header">
        <h1 className="text-h1-bold">Recipes</h1>
        {onImportRequest && (
          <Button
            variant="tertiary"
            iconOnly
            icon={<Plus size={22} />}
            aria-label="Import recipe"
            onClick={onImportRequest}
          />
        )}
      </header>

      {activeFilters.length > 0 && !isSearchOpen && (
        <div className="recipes-active-filters" role="group" aria-label="Active filters">
          {activeFilters.map(value => {
            const filter = availableFilters.find(f => f.value === value);
            return (
              <Chip
                key={value}
                active
                showClose
                onClick={() => onFilterToggle?.(value)}
                aria-label={`Remove filter: ${filter?.label ?? value}`}
              >
                {filter?.label ?? value}
              </Chip>
            );
          })}
        </div>
      )}

      <div className="recipes-content">
        <RecipeList recipes={recipes} onRecipeClick={onRecipeClick} />
      </div>

      {/* Search overlay — slides down from top, covers the header */}
      {isSearchOpen && (
        <div className="recipes-search-overlay">
          <div className="recipes-search-row">
            <SearchBar
              autoFocus
              inputRef={searchInputRef}
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              showTrailingIcon={false}
            />
            <Button variant="ghost" onClick={handleCancel} style={{ flexShrink: 0 }}>
              Cancel
            </Button>
          </div>
          {availableFilters.length > 0 && (
            <div className="recipes-filter-chips" role="group" aria-label="Filter recipes">
              {availableFilters.map(filter => {
                const isActive = activeFilters.includes(filter.value);
                return (
                  <Chip
                    key={filter.value}
                    active={isActive}
                    showClose={isActive}
                    onClick={() => onFilterToggle?.(filter.value)}
                  >
                    {filter.label}
                  </Chip>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Nav area: FAB is anchored just above the NavigationBar */}
      <div className="recipes-nav-area">
        {/* Search FAB — 48×48 pill with elevation; distinct from 32×32 iconOnly Button (see SearchFab story in RecipesView.stories.jsx) */}
        {/* eslint-disable-next-line design-system/no-native-interactive-elements */}
        <button
          type="button"
          className="recipes-search-fab"
          onClick={handleFabClick}
          aria-label="Search recipes"
        >
          <SearchIcon />
        </button>
        <NavigationBarConnected activeItem="recipes" />
      </div>
    </div>
  );
};

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);


RecipesView.displayName = 'RecipesView';
