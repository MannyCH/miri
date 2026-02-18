import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetailView } from '../patterns/RecipeDetailView';
import { useApp } from '../context/AppContext';
import { getRecipeById } from '../data/recipes';

/**
 * Recipe Detail Page
 * - Shows recipe image, title, ingredients, and directions
 * - Add recipe ingredients to shopping list
 * - Navigate back to recipes
 */
export function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addRecipeToShoppingList, shoppingList, toggleIngredientCheck, deleteIngredient } = useApp();
  
  // Get recipe data
  const recipe = getRecipeById(id);
  
  if (!recipe) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/recipes')}>Back to Recipes</button>
      </div>
    );
  }
  
  // Check which ingredients are already in shopping list
  const checkedIngredients = {};
  recipe.ingredients.forEach((_, idx) => {
    const itemId = `${recipe.id}-${idx}`;
    const item = shoppingList.find(i => i.id === itemId);
    if (item) {
      checkedIngredients[idx] = item.checked;
    }
  });
  
  const handleAddToList = () => {
    addRecipeToShoppingList(recipe.id);
  };
  
  return (
    <RecipeDetailView
      recipe={{
        ...recipe,
        ingredients: recipe.ingredients.map(name => name),
      }}
      checkedIngredients={checkedIngredients}
      onIngredientCheck={(idx, checked) => {
        const itemId = `${recipe.id}-${idx}`;
        toggleIngredientCheck(itemId);
      }}
      onIngredientDelete={(idx) => {
        const itemId = `${recipe.id}-${idx}`;
        deleteIngredient(itemId);
      }}
      onAddToList={handleAddToList}
    />
  );
}
