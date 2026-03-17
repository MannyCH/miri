import { dataClient } from './dataClient';

/**
 * Fetch all recipes belonging to the current user, with their ingredients.
 * Returns an array shaped like the mock recipe objects in src/data/recipes.js.
 */
export async function fetchUserRecipes() {
  const { data: rows, error } = await dataClient
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!rows?.length) return [];

  const recipeIds = rows.map((r) => r.id);
  const { data: ingredientRows, error: ingError } = await dataClient
    .from('recipe_ingredients')
    .select('*')
    .in('recipe_id', recipeIds)
    .order('sort_order', { ascending: true });

  if (ingError) throw new Error(ingError.message);

  const byRecipe = {};
  for (const row of ingredientRows ?? []) {
    if (!byRecipe[row.recipe_id]) byRecipe[row.recipe_id] = [];
    byRecipe[row.recipe_id].push(row.name);
  }

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    categories: row.categories ?? [],
    image: row.image_url ?? null,
    thumbnail: row.image_url ?? null,
    servings: row.servings,
    directions: row.directions ?? [],
    ingredients: byRecipe[row.id] ?? [],
  }));
}

/**
 * Persist a new user recipe (with ingredients) and return its generated ID.
 */
export async function createRecipe({ title, ingredients, directions, servings, categories, image }) {
  const { data: sessionData } = await dataClient.auth.getSession();
  const userId = sessionData?.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const id = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const category = categories?.[0] ?? 'other';
  const servingsNum = parseInt(servings, 10) || 2;

  const { error: recipeError } = await dataClient.from('recipes').insert({
    id,
    user_id: userId,
    title,
    category,
    categories: categories ?? [],
    image_url: image ?? null,
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
