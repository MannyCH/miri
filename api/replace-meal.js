import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/replace-meal
 * Body: {
 *   mealType: 'breakfast' | 'lunch' | 'dinner',
 *   currentRecipeId: string,
 *   recipes: [{ id, title, meal_type }],
 *   preferences: { goal, eatingStyle, servings }
 * }
 * Returns: { recipeId: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { mealType, currentRecipeId, recipes = [], preferences = {} } = req.body ?? {};
  if (!mealType || !currentRecipeId) return res.status(400).json({ error: 'mealType and currentRecipeId are required' });

  // Filter candidates: must match meal slot, must not be the current recipe
  const SLOT_RULES = {
    breakfast: (r) => r.meal_type === 'breakfast',
    lunch: (r) => r.meal_type === 'lunch' || r.meal_type === 'any' || r.meal_type === 'dinner',
    dinner: (r) => r.meal_type === 'dinner' || r.meal_type === 'any' || r.meal_type === 'lunch',
  };

  const candidates = recipes.filter(r => r.id !== currentRecipeId && SLOT_RULES[mealType]?.(r));

  if (candidates.length === 0) {
    return res.status(404).json({ error: 'No suitable replacement found' });
  }

  const { goal = '', eatingStyle = '', servings = 2 } = preferences;
  const recipeList = candidates.map(r => `- id: "${r.id}" | title: "${r.title}"`).join('\n');

  const prompt = `You are a meal planner. Suggest ONE replacement recipe for a ${mealType} slot.

Current recipe being replaced: id "${currentRecipeId}"
User profile: goal="${goal || 'none'}", eating style="${eatingStyle || 'none'}", servings=${servings}

Available replacements:
${recipeList}

Return ONLY valid JSON with this shape: { "recipeId": "<id>" }
Pick the best match for the user's profile. No explanation.`;

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 128,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const { recipeId } = JSON.parse(jsonMatch[0]);
    if (!recipeId || !candidates.find(r => r.id === recipeId)) {
      // Fall back to random candidate if AI returned invalid ID
      const fallback = candidates[Math.floor(Math.random() * candidates.length)];
      return res.json({ recipeId: fallback.id });
    }

    return res.json({ recipeId });
  } catch (err) {
    console.error('replace-meal error:', err);
    // Fallback: pick a random candidate
    const fallback = candidates[Math.floor(Math.random() * candidates.length)];
    return res.json({ recipeId: fallback.id });
  }
}
