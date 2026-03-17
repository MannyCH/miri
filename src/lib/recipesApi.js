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
    .select('id, title, category, categories, servings, directions, thumbnail_url, created_at, recipe_ingredients(name, sort_order)')
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
export async function createRecipe({ title, ingredients, directions, servings, categories, image, thumbnail }) {
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
