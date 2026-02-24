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
  const [visualViewportBottom, setVisualViewportBottom] = useState(
    () => window.visualViewport
      ? window.visualViewport.offsetTop + window.visualViewport.height
      : window.innerHeight
  );
  const overlayInputRef = useRef(null);

  useEffect(() => {
    if (!isSearchOpen) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateVisualViewportBottom = () => {
      setVisualViewportBottom(viewport.offsetTop + viewport.height);

      // iOS WebKit ignores overflow:hidden on html/body when the keyboard
      // opens and forcibly scrolls the document to reveal the focused input.
      // Reset that scroll so the header / recipe list stay in place.
      window.scrollTo(0, 0);
    };

    updateVisualViewportBottom();
    viewport.addEventListener('resize', updateVisualViewportBottom);
    viewport.addEventListener('scroll', updateVisualViewportBottom);

    return () => {
      viewport.removeEventListener('resize', updateVisualViewportBottom);
      viewport.removeEventListener('scroll', updateVisualViewportBottom);
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
      className={`recipes-view ${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        '--recipes-visual-bottom': `${visualViewportBottom}px`,
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
      <NavigationBarConnected
        activeItem="recipes"
        style={isSearchOpen ? { visibility: 'hidden' } : undefined}
      />
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
