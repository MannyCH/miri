import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/generate-meal-plan
 * Body: {
 *   preferences: { goal, eatingStyle, bmr, cookingFrequency, servings },
 *   recipes: [{ id, title, category }],
 * }
 *
 * Returns: { days: [{ date, meals: { breakfast, lunch, dinner } }] }
 * where each meal value is a recipe id or null.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { preferences = {}, recipes = [] } = req.body ?? {};
  if (recipes.length === 0) return res.status(400).json({ error: 'recipes are required' });

  const {
    goal = '',
    eatingStyle = '',
    bmr = '',
    cookingFrequency = 'daily',
    servings = 2,
  } = preferences;

  const cookingFrequencyDescriptions = {
    daily: 'The user cooks fresh every day — each meal should ideally be a different recipe. Avoid repeating the same recipe more than once per week.',
    'few-times': 'The user cooks a few times a week — it is fine and encouraged to repeat lunch or dinner recipes 2–3 times during the week to minimise cooking sessions.',
    minimal: 'The user does meal prep and cooks as little as possible — repeat lunch and dinner recipes heavily (cook once, eat 3–4 times). Aim for only 2–3 unique dinner recipes and 1–2 unique lunch recipes for the whole week.',
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const recipeList = recipes
    .map(r => `- id: "${r.id}" | title: "${r.title}" | meal type: ${r.meal_type}`)
    .join('\n');

  const prompt = `You are a smart meal planner. Create a personalised 7-day meal plan using ONLY the recipes listed below.

User profile:
- Goal: ${goal || 'not specified'}
- Eating style: ${eatingStyle || 'no preference'}
- Metabolic basal rate: ${bmr ? `${bmr} kcal/day` : 'not specified'}
- Cooking for: ${servings} ${servings === 1 ? 'person' : 'people'}
- Cooking frequency: ${cookingFrequencyDescriptions[cookingFrequency] || cookingFrequencyDescriptions.daily}

Available recipes:
${recipeList}

Rules:
1. Use ONLY recipe IDs from the list above — never invent new IDs.
2. Respect the meal type tag: "breakfast" → any slot (breakfast food also works for lunch/dinner), "lunch" → lunch slot only, "dinner" → dinner slot only, "any" → lunch or dinner slots only (never breakfast).
3. Cooking frequency affects only how much recipes repeat — never whether a slot is filled.
4. ALL 21 slots (7 days × 3 meals) must have a recipe ID. Using null is not allowed under any circumstances. If you run out of variety, repeat recipes.
5. Prefer recipes that match the user's eating style and goal where possible.
6. Return ONLY valid JSON — no explanation, no markdown.

Dates: ${dates.join(', ')}

Return this exact JSON shape:
{
  "days": [
    {
      "date": "YYYY-MM-DD",
      "meals": {
        "breakfast": "recipe-id",
        "lunch": "recipe-id",
        "dinner": "recipe-id"
      }
    }
  ]
}`;

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return res.json(result);
  } catch (err) {
    console.error('generate-meal-plan error:', err);
    return res.status(500).json({ error: 'Failed to generate meal plan' });
  }
}
