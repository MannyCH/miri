import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetailView } from '../patterns/RecipeDetailView';
import { useApp } from '../context/AppContext';
import { usePreferences } from '../context/PreferencesContext';
import { fetchRecipeById } from '../lib/recipesApi';
import { convertIngredients, scaleIngredients } from '../lib/unitConverter';

/**
 * Recipe Detail Page
 * Fetches the full recipe (including image) individually so the list
 * fetch can skip image_url and stay under the 10 MB Data API limit.
 */
export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecipeToShoppingList } = useApp();
  const { preferences } = usePreferences();
  const [isAdded, setIsAdded] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchRecipeById(id)
      .then(setRecipe)
      .catch(() => setRecipe(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return null;
  }

  if (!recipe) {
    return (
      <div style={{ padding: 'var(--spacing-32)', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/recipes')}>Back to Recipes</button>
      </div>
    );
  }

  const handleAddToList = () => {
    if (isAdded) return;
    addRecipeToShoppingList(recipe.id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const scaleFactor = recipe.servings ? preferences.servings / recipe.servings : 1;
  const scaledIngredients = scaleIngredients(recipe.ingredients, scaleFactor);
  const displayRecipe = {
    ...recipe,
    ingredients: convertIngredients(scaledIngredients, preferences.unitSystem),
    servings: preferences.servings,
  };

  return (
    <RecipeDetailView
      recipe={displayRecipe}
      onAddToList={handleAddToList}
      isAdded={isAdded}
    />
  );
}
