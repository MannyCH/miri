import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetailView } from '../patterns/RecipeDetailView';
import { useApp } from '../context/AppContext';
import { fetchRecipeById } from '../lib/recipesApi';

/**
 * Recipe Detail Page
 * Fetches the full recipe (including image) individually so the list
 * fetch can skip image_url and stay under the 10 MB Data API limit.
 */
export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecipeToShoppingList } = useApp();
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

  return (
    <RecipeDetailView
      recipe={recipe}
      onAddToList={handleAddToList}
      isAdded={isAdded}
    />
  );
}
