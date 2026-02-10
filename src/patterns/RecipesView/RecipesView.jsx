import React from 'react';
import { RecipeList } from '../../components/RecipeList';
import { SearchBar } from '../../components/SearchBar';
import { NavigationBar } from '../../components/NavigationBar';
import './RecipesView.css';

/**
 * RecipesView Pattern - Recipe browsing screen with search
 * Composition of: SearchBar, RecipeList, NavigationBar
 */
export const RecipesView = ({
  recipes = [],
  searchQuery = '',
  onSearch,
  onRecipeClick,
  ...props
}) => {
  return (
    <div className="recipes-view" {...props}>
      {/* Header */}
      <header className="recipes-header">
        <h1 className="text-h1-bold">Recipes</h1>
      </header>

      {/* Recipe List */}
      <div className="recipes-content">
        <RecipeList recipes={recipes} />
      </div>

      {/* Search Bar */}
      <div className="recipes-search">
        <SearchBar
          placeholder="Rezepte suchen..."
          value={searchQuery}
          onChange={(e) => onSearch?.(e.target.value)}
          trailingIcon={<SearchIcon />}
        />
      </div>

      {/* Bottom Navigation */}
      <NavigationBar activeItem="recipes" />
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
