import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/classify-meal-type
 * Body: { title: string, ingredients: string[] }
 *
 * Returns: { meal_type: 'breakfast' | 'lunch' | 'dinner' | 'any' }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { title = '', ingredients = [] } = req.body ?? {};

  const prompt = `Classify this recipe into exactly one meal type.

Recipe: ${title}
Ingredients (sample): ${ingredients.slice(0, 5).join(', ')}

Reply with exactly one word — no punctuation, no explanation:
- breakfast  (morning meals: eggs, oats, pancakes, smoothies, toast, yogurt, etc.)
- lunch      (midday meals: sandwiches, salads, soups, wraps, light pasta, etc.)
- dinner     (evening meals: meat dishes, heavy pasta, casseroles, stews, etc.)
- any        (works for multiple meal times)`;

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim().toLowerCase();
    const VALID = new Set(['breakfast', 'lunch', 'dinner', 'any']);
    const meal_type = VALID.has(raw) ? raw : 'any';

    return res.json({ meal_type });
  } catch (err) {
    console.error('classify-meal-type error:', err);
    return res.json({ meal_type: 'any' });
  }
}
