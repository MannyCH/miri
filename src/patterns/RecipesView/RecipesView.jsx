import React, { useState } from 'react';
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

      {/* Search overlay — slides in from top, sits above header */}
      {isSearchOpen && (
        <div className="recipes-search-overlay">
          <SearchBar
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            placeholder="Rezepte suchen..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            showTrailingIcon={false}
          />
        </div>
      )}

      {/* Floating search trigger — bottom right, above nav bar, always visible */}
      <button
        type="button"
        className="recipes-search-fab"
        onClick={() => {
          if (isSearchOpen) onSearchChange?.('');
          setIsSearchOpen((open) => !open);
        }}
        aria-label={isSearchOpen ? 'Close search' : 'Search recipes'}
      >
        {isSearchOpen ? <CloseIcon /> : <SearchIcon />}
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

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

RecipesView.displayName = 'RecipesView';
