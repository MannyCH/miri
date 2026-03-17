import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RecipeImportView } from '../patterns/RecipeImportView';
import { createRecipe } from '../lib/recipesApi';
import { compressImageToDataUrl } from '../lib/recipeParser';
import { useApp } from '../context/AppContext';
import { usePreferences } from '../context/PreferencesContext';

/**
 * Recipe Import Page
 * Reads parsed recipe data from router location state (set by RecipesPage after
 * parsing a TXT file), presents it as an editable form, and saves to the DB on confirm.
 */
export function RecipeImportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addUserRecipe, showToast } = useApp();
  const { preferences } = usePreferences();
  const [isSaving, setIsSaving] = useState(false);

  const initialRecipe = location.state?.recipe ?? {};

  const handleSave = async ({ imageFile, ...recipeData }) => {
    setIsSaving(true);
    try {
      let image = null;
      let thumbnail = null;
      if (imageFile) {
        [image, thumbnail] = await Promise.all([
          compressImageToDataUrl(imageFile),
          compressImageToDataUrl(imageFile, 200, 0.7),
        ]);
      }

      const id = await createRecipe({ ...recipeData, image, thumbnail });

      // Optimistically add to local state so the detail page renders immediately
      addUserRecipe({
        ...recipeData,
        id,
        image,
        thumbnail,
        directions: recipeData.directions ?? [],
        ingredients: recipeData.ingredients ?? [],
      });

      navigate(`/recipes/${id}`, { replace: true });
    } catch (err) {
      console.error('[import] save failed:', err);
      showToast('error', 'Could not save recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/recipes');
  };

  return (
    <RecipeImportView
      initialRecipe={initialRecipe}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={isSaving}
      preferredServings={preferences.servings}
    />
  );
}
