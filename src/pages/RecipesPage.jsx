import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipesView } from '../patterns/RecipesView';
import { recipes } from '../data/recipes';
import { useApp } from '../context/AppContext';
import { parseRecipeTxt } from '../lib/recipeParser';

/**
 * Recipes Page
 * - Browse all available recipes (static + user-imported)
 * - Search recipes
 * - Import a recipe from a TXT file
 * - Navigate to recipe details
 */
export function RecipesPage() {
  const navigate = useNavigate();
  const { userRecipes } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  const allRecipes = [...recipes, ...userRecipes];

  const filteredRecipes = searchQuery
    ? allRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allRecipes;

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleImportRequest = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset so the same file can be re-selected later

    const text = await file.text();
    const parsed = parseRecipeTxt(text);
    navigate('/recipes/import', { state: { recipe: parsed } });
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <RecipesView
        recipes={filteredRecipes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRecipeClick={handleRecipeClick}
        onImportRequest={handleImportRequest}
      />
    </>
  );
}
