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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const overlayInputRef = useRef(null);

  useEffect(() => {
    if (!isSearchFocused) {
      setKeyboardOffset(0);
      return;
    }

    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }

    const updateKeyboardOffset = () => {
      const nextOffset = Math.max(
        0,
        window.innerHeight - (viewport.height + viewport.offsetTop)
      );
      setKeyboardOffset(nextOffset);
    };

    updateKeyboardOffset();
    viewport.addEventListener('resize', updateKeyboardOffset);
    viewport.addEventListener('scroll', updateKeyboardOffset);

    return () => {
      viewport.removeEventListener('resize', updateKeyboardOffset);
      viewport.removeEventListener('scroll', updateKeyboardOffset);
    };
  }, [isSearchFocused]);

  useEffect(() => {
    if (!isSearchFocused) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      overlayInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [isSearchFocused]);

  return (
    <div
      className={`recipes-view ${isSearchFocused ? 'recipes-view-search-active' : ''}${className ? ` ${className}` : ''}`}
      style={{
        ...style,
        '--recipes-keyboard-offset': `${keyboardOffset}px`,
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

      {/* Search Bar */}
      <div className="recipes-search">
        <SearchBar
          placeholder="Rezepte suchen..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          readOnly
          tabIndex={-1}
          onPointerDown={(event) => {
            event.preventDefault();
            setIsSearchFocused(true);
          }}
          trailingIcon={<SearchIcon />}
        />
      </div>

      {isSearchFocused && (
        <div className="recipes-search-overlay">
          <SearchBar
            inputRef={overlayInputRef}
            placeholder="Rezepte suchen..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onBlur={() => setIsSearchFocused(false)}
            trailingIcon={<SearchIcon />}
          />
        </div>
      )}

      {/* Bottom Navigation */}
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
