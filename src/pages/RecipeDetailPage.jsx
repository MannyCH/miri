import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetailView } from '../patterns/RecipeDetailView';
import { useApp } from '../context/AppContext';
import { getRecipeById } from '../data/recipes';

/**
 * Recipe Detail Page
 * Displays recipe image, title, ingredients (read-only), and directions
 * Button at bottom to add ingredients to shopping list
 */
export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecipeToShoppingList } = useApp();
  
  const recipe = getRecipeById(id);
  
  if (!recipe) {
    return (
      <div style={{ padding: 'var(--spacing-32)', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/recipes')}>Back to Recipes</button>
      </div>
    );
  }
  
  const handleAddToList = () => {
    addRecipeToShoppingList(recipe.id);
  };
  
  return (
    <RecipeDetailView
      recipe={recipe}
      onAddToList={handleAddToList}
    />
  );
}
