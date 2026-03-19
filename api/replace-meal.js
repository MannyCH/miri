import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/replace-meal
 * Body: {
 *   mealType: 'breakfast' | 'lunch' | 'dinner',
 *   currentRecipeId: string,
 *   recipes: [{ id, title, meal_type, categories }],
 *   usedRecipeIds: string[],   — IDs already in the current plan (to avoid repeats)
 *   preferences: { goal, eatingStyle, servings }
 * }
 * Returns: { recipeId: string }
 */

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// How many candidates the AI sees per call — keeps the list varied across calls
const AI_CANDIDATE_WINDOW = 10;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { mealType, currentRecipeId, recipes = [], usedRecipeIds = [], preferences = {} } = req.body ?? {};
  if (!mealType || !currentRecipeId) return res.status(400).json({ error: 'mealType and currentRecipeId are required' });

  // Use the recipe's own meal_type tag as the filter — no cross-slot guessing.
  // 'any' recipes fit every slot; otherwise the tag must match exactly.
  const matchesSlot = (r) => r.meal_type === mealType || r.meal_type === 'any';

  const usedSet = new Set(usedRecipeIds);

  // Prefer recipes not already in the plan this week
  let candidates = recipes.filter(
    r => r.id !== currentRecipeId && !usedSet.has(r.id) && matchesSlot(r)
  );

  // Fallback: allow already-used recipes if no fresh candidates exist
  if (candidates.length === 0) {
    candidates = recipes.filter(r => r.id !== currentRecipeId && matchesSlot(r));
  }

  if (candidates.length === 0) {
    return res.status(404).json({ error: 'No suitable replacement found' });
  }

  // Shuffle then take a window — AI picks the best match from a different subset
  // each call, so the same user profile produces genuinely varied suggestions.
  const window = shuffle(candidates).slice(0, AI_CANDIDATE_WINDOW);

  const { goal = '', eatingStyle = '', servings = 2 } = preferences;
  const recipeList = window.map(r => `- id: "${r.id}" | title: "${r.title}" | tags: ${r.meal_type}${r.categories?.length ? ', ' + r.categories.join(', ') : ''}`).join('\n');

  const prompt = `You are a meal planner. Pick ONE replacement recipe for a ${mealType} slot.

User profile: goal="${goal || 'none'}", eating style="${eatingStyle || 'none'}", servings=${servings}

Candidates (choose the best fit for the user's profile and meal type):
${recipeList}

Return ONLY valid JSON: { "recipeId": "<id>" }. No explanation.`;

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 64,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const { recipeId } = JSON.parse(jsonMatch[0]);
    if (!recipeId || !window.find(r => r.id === recipeId)) {
      throw new Error('Invalid ID returned');
    }

    return res.json({ recipeId });
  } catch (err) {
    console.error('replace-meal error:', err);
    // Fallback: pick a random candidate from the window
    const fallback = window[Math.floor(Math.random() * window.length)];
    return res.json({ recipeId: fallback.id });
  }
}
