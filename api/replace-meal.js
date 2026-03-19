/**
 * POST /api/replace-meal
 * Body: {
 *   mealType: 'breakfast' | 'lunch' | 'dinner',
 *   currentRecipeId: string,
 *   recipes: [{ id, title, meal_type }],
 *   usedRecipeIds: string[],   — IDs already in the current plan (to avoid repeats)
 *   preferences: { goal, eatingStyle, servings }
 * }
 * Returns: { recipeId: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { mealType, currentRecipeId, recipes = [], usedRecipeIds = [], preferences = {} } = req.body ?? {};
  if (!mealType || !currentRecipeId) return res.status(400).json({ error: 'mealType and currentRecipeId are required' });

  // Slot rules: breakfast/lunch/dinner each accept 'any'; breakfast does NOT accept lunch/dinner.
  const SLOT_RULES = {
    breakfast: (r) => r.meal_type === 'breakfast' || r.meal_type === 'any',
    lunch:     (r) => r.meal_type === 'lunch' || r.meal_type === 'any' || r.meal_type === 'dinner',
    dinner:    (r) => r.meal_type === 'dinner' || r.meal_type === 'any' || r.meal_type === 'lunch',
  };

  const usedSet = new Set(usedRecipeIds);

  // Preferred: not current, not already in the plan, matches slot
  let candidates = recipes.filter(
    r => r.id !== currentRecipeId && !usedSet.has(r.id) && SLOT_RULES[mealType]?.(r)
  );

  // Fallback: allow already-used recipes if no fresh candidates exist
  if (candidates.length === 0) {
    candidates = recipes.filter(r => r.id !== currentRecipeId && SLOT_RULES[mealType]?.(r));
  }

  if (candidates.length === 0) {
    return res.status(404).json({ error: 'No suitable replacement found' });
  }

  // Pick a random candidate — avoids the AI determinism problem where the same
  // "best" recipe is always chosen for a given user profile.
  const picked = candidates[Math.floor(Math.random() * candidates.length)];
  return res.json({ recipeId: picked.id });
}
