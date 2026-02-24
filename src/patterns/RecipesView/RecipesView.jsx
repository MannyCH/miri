import React, { useEffect, useRef, useState } from 'react';
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
  const [viewportHeight, setViewportHeight] = useState(
    () => window.visualViewport?.height ?? window.innerHeight
  );
  const overlayInputRef = useRef(null);

  useEffect(() => {
    if (!isSearchOpen) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateViewportHeight = () => {
      setViewportHeight(viewport.height);
    };

    updateViewportHeight();
    viewport.addEventListener('resize', updateViewportHeight);
    viewport.addEventListener('scroll', updateViewportHeight);

    return () => {
      viewport.removeEventListener('resize', updateViewportHeight);
      viewport.removeEventListener('scroll', updateViewportHeight);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      overlayInputRef.current?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [isSearchOpen]);

  return (
    <div
      className={`recipes-view${isSearchOpen ? ' recipes-view--search-open' : ''}${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        '--recipes-viewport-height': `${viewportHeight}px`,
      }}
      {...props}
    >
      {/* Header */}
      <header className="recipes-header">
        <h1 className="text-h1-bold">Recipes</h1>
      </header>

      {/* Recipe List */}
      <div className="recipes-content">
        <RecipeList recipes={recipes} onRecipeClick={onRecipeClick} />
      </div>

      {!isSearchOpen && (
        <div className="recipes-search-trigger-layer">
          <button
            type="button"
            className="recipes-search-trigger"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search"
          >
            <SearchIcon />
          </button>
        </div>
      )}

      {isSearchOpen && (
        <div className="recipes-search-overlay">
          <SearchBar
            inputRef={overlayInputRef}
            placeholder="Rezepte suchen..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onBlur={() => setIsSearchOpen(false)}
            trailingIcon={<SearchIcon />}
          />
        </div>
      )}

      {/* Bottom Navigation — always rendered to preserve flex layout */}
      <NavigationBarConnected activeItem="recipes" />
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
