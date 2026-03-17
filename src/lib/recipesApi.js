import { dataClient } from './dataClient';

/**
 * Fetch all recipes belonging to the current user, with their ingredients.
 * Returns an array shaped like the mock recipe objects in src/data/recipes.js.
 */
export async function fetchUserRecipes() {
  // Exclude image_url — base64 images make the response exceed the 10 MB Data API limit.
  // Images are loaded individually when the detail page opens.
  const { data: rows, error } = await dataClient
    .from('recipes')
    .select('id, title, category, categories, meal_type, servings, directions, thumbnail_url, created_at, recipe_ingredients(name, sort_order)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!rows?.length) return [];

  return rows.map((row) => {
    const ingredients = (row.recipe_ingredients ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => i.name);

    return {
      id: row.id,
      title: row.title,
      category: row.category,
      categories: row.categories ?? [],
      meal_type: row.meal_type ?? 'any',
      image: null,
      thumbnail: row.thumbnail_url ?? null,
      servings: row.servings,
      directions: row.directions ?? [],
      ingredients,
    };
  });
}

export async function fetchRecipeById(id) {
  const { data: row, error } = await dataClient
    .from('recipes')
    .select('*, recipe_ingredients(name, sort_order)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  const ingredients = (row.recipe_ingredients ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.name);

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    categories: row.categories ?? [],
    image: row.image_url ?? null,
    thumbnail: row.image_url ?? null,
    servings: row.servings,
    directions: row.directions ?? [],
    ingredients,
  };
}

/**
 * Persist a new user recipe (with ingredients) and return its generated ID.
 */
/**
 * Generates a stable recipe ID from userId + title so re-importing the
 * same file updates the existing record instead of creating a duplicate.
 */
function stableRecipeId(userId, title) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
  return `${userId.slice(0, 8)}-${slug}`;
}

export async function createRecipe({ title, ingredients, directions, servings, categories, image, thumbnail }) {
  const { data: sessionData } = await dataClient.auth.getSession();
  const userId = sessionData?.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const id = stableRecipeId(userId, title);
  const category = categories?.[0] ?? 'other';
  const servingsNum = parseInt(servings, 10) || 2;

  // Classify meal type via AI (best-effort — defaults to 'any' on failure)
  let meal_type = 'any';
  try {
    const clf = await fetch('/api/classify-meal-type', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, ingredients: ingredients ?? [] }),
    });
    if (clf.ok) ({ meal_type } = await clf.json());
  } catch {
    // non-critical — keep default 'any'
  }

  // Delete existing record first (stable ID means re-import = update)
  await dataClient.from('recipe_ingredients').delete().eq('recipe_id', id);
  await dataClient.from('recipes').delete().eq('id', id);

  const { error: recipeError } = await dataClient.from('recipes').insert({
    id,
    user_id: userId,
    title,
    category,
    categories: categories ?? [],
    meal_type,
    image_url: image ?? null,
    thumbnail_url: thumbnail ?? null,
    servings: servingsNum,
    directions: directions ?? [],
  });

  if (recipeError) throw new Error(recipeError.message);

  if (ingredients?.length) {
    const ingredientRows = ingredients.map((name, idx) => ({
      recipe_id: id,
      name,
      sort_order: idx,
    }));
    const { error: ingError } = await dataClient.from('recipe_ingredients').insert(ingredientRows);
    if (ingError) throw new Error(ingError.message);
  }

  return id;
}
