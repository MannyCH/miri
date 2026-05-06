import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RecipeDetailView } from '../patterns/RecipeDetailView';
import { CookingModeView } from '../patterns/CookingModeView';
import { useApp } from '../context/AppContext';
import { usePreferences } from '../context/PreferencesContext';
import { fetchRecipeById } from '../lib/recipesApi';
import { convertIngredients, scaleIngredients } from '../lib/unitConverter';
import { Button } from '../components/Button/Button';

const STEP_ICONS = ['🍳', '🔪', '🥣', '🔥', '🌡️', '💧', '🧂', '🥄', '🍋', '💪'];

const DURATION_RE = /\b(\d+(?:[–-]\d+)?)\s*(min(?:utes?)?|hours?|hrs?|seconds?|secs?)\b/i;

function directionToStep(direction, index) {
  const words = direction.trim().split(/\s+/);
  const verb = words[0].replace(/[^a-zA-Z]/g, '') || 'Step';
  const durationMatch = direction.match(DURATION_RE);
  const duration = durationMatch
    ? { num: durationMatch[1], unit: durationMatch[2].replace(/utes?/, '') }
    : null;
  return {
    verb: verb.charAt(0).toUpperCase() + verb.slice(1).toLowerCase(),
    icon: STEP_ICONS[index % STEP_ICONS.length],
    items: [{ note: direction }],
    duration,
  };
}

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
  const [isCooking, setIsCooking] = useState(false);
  const [cookingStep, setCookingStep] = useState(0);

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
        <Button variant="secondary" showIcon={false} onClick={() => navigate('/recipes')}>Back to Recipes</Button>
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

  const cookingSteps = (displayRecipe.directions ?? []).map(directionToStep);

  if (isCooking) {
    return (
      <CookingModeView
        title={displayRecipe.title}
        steps={cookingSteps}
        currentStepIndex={cookingStep}
        onNext={() => {
          if (cookingStep < cookingSteps.length - 1) {
            setCookingStep(i => i + 1);
          } else {
            setIsCooking(false);
            setCookingStep(0);
          }
        }}
        onBack={() => setCookingStep(i => Math.max(0, i - 1))}
        onQuit={() => { setIsCooking(false); setCookingStep(0); }}
      />
    );
  }

  return (
    <RecipeDetailView
      recipe={displayRecipe}
      onAddToList={handleAddToList}
      isAdded={isAdded}
      onCook={cookingSteps.length > 0 ? () => { setCookingStep(0); setIsCooking(true); } : undefined}
    />
  );
}
