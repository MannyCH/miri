import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/normalize-shopping-list
 * Body: { items: string[] }
 *
 * Takes a raw shopping list (may contain duplicates, German/English mix,
 * different units) and returns a deduplicated, quantity-merged list
 * grouped by supermarket category in logical shopping order.
 *
 * Returns: { groups: [{ category, emoji, items: [{ name, quantity }] }] }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' });
  }

  const client = new Anthropic();

  const prompt = `You are a smart shopping list assistant. Normalize and group the following ingredients.

Rules:
1. Merge duplicates only when they are truly the same ingredient — same language, same variety, same type. Plurals and multilingual synonyms count as the same (e.g. "1 onion", "2 onions", "Zwiebel", "Zwiebeln" → "Onions", quantity "3"). DO NOT merge ingredients that differ by colour, variety, or type — e.g. "red pepper" and "yellow pepper" are different ingredients and must remain separate entries.
2. Sum quantities where units match (100g + 200g = 300g, 1l + 500ml = 1.5l). If units differ and can't be converted, keep the largest unit.
3. Assign each ingredient to exactly one of these categories (in this shopping order):
   Vegetables | Fruits | Herbs & Spices | Dairy & Eggs | Meat & Fish | Bakery | Canned & Dry Goods | Frozen | Beverages | Other
4. Use natural ingredient names. Prefer the language the user seems to use (if mostly German, use German names).
5. Leave quantity empty string if no quantity was given.
6. Return ONLY valid JSON — no explanation, no markdown.

Ingredients:
${items.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Return this exact JSON shape:
{
  "groups": [
    {
      "category": "Vegetables",
      "emoji": "🥦",
      "items": [
        { "name": "Onions", "quantity": "3" },
        { "name": "Asparagus", "quantity": "320g" }
      ]
    }
  ]
}

Category emojis to use: Vegetables=🥦, Fruits=🍎, Herbs & Spices=🌿, Dairy & Eggs=🥛, Meat & Fish=🥩, Bakery=🍞, Canned & Dry Goods=🥫, Frozen=🧊, Beverages=🥤, Other=🛒
Only include categories that have at least one item.`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    return res.json(result);
  } catch (err) {
    console.error('normalize-shopping-list error:', err);
    return res.status(500).json({ error: 'Failed to normalize shopping list' });
  }
}
