import React, { useRef, useState } from 'react';
import { RecipeList } from '../../components/RecipeList';
import { SearchBar } from '../../components/SearchBar';
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
      </header>

      <div className="recipes-content">
        <RecipeList recipes={recipes} onRecipeClick={onRecipeClick} />
      </div>

      <NavigationBarConnected activeItem="recipes" />

      {/* Search overlay — slides in from top, Cancel always visible above keyboard */}
      {isSearchOpen && (
        <div className="recipes-search-overlay">
          <SearchBar
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            inputRef={searchInputRef}
            placeholder="Rezepte suchen..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            showTrailingIcon={false}
          />
          <button
            type="button"
            className="recipes-search-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Floating search trigger — bottom right, above nav bar, always a search icon */}
      <button
        type="button"
        className="recipes-search-fab"
        onClick={handleFabClick}
        aria-label="Search recipes"
      >
        <SearchIcon />
      </button>
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
