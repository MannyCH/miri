import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipesView } from '../patterns/RecipesView';
import { recipes } from '../data/recipes';

/**
 * Recipes Page
 * - Browse all available recipes
 * - Search recipes
 * - Navigate to recipe details
 */
export function RecipesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter recipes based on search query
  const filteredRecipes = searchQuery
    ? recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recipes;
  
  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };
  
  return (
    <RecipesView
      recipes={filteredRecipes}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onRecipeClick={handleRecipeClick}
    />
  );
}
