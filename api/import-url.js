import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/import-url
 * Body: { url: string }
 *
 * 1. Fetches the page server-side (avoids browser CORS restrictions).
 * 2. Tries to extract a Recipe JSON-LD block — covers most major recipe sites.
 * 3. Falls back to Claude (Haiku) which parses the stripped page text.
 *
 * Returns: { title, ingredients[], directions[], servings, categories[] }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body ?? {};
  if (!url) return res.status(400).json({ error: 'url is required' });

  let html;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Miribot/1.0)' },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    html = await response.text();
  } catch (err) {
    return res.status(422).json({ error: `Could not fetch URL: ${err.message}` });
  }

  // Try JSON-LD Recipe schema first (zero AI cost, instant)
  const structured = extractJsonLdRecipe(html);
  if (structured) return res.json(structured);

  // Fall back to Claude for sites without structured data
  const client = new Anthropic();
  const pageText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 12_000);

  let message;
  try {
    message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Extract the recipe from this webpage text. Return ONLY a JSON object with these keys:
- title: string
- ingredients: array of strings (e.g. "2 cups flour", "1 kg chicken")
- directions: array of strings (one step per item)
- servings: string (e.g. "4")
- categories: array of strings

If a field is not present, use an empty string or empty array. Output only the JSON, no explanation.

${pageText}`,
      }],
    });
  } catch (err) {
    return res.status(502).json({ error: `AI parsing failed: ${err.message}` });
  }

  try {
    const jsonMatch = message.content[0].text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('no JSON in response');
    return res.json(JSON.parse(jsonMatch[0]));
  } catch {
    return res.status(422).json({ error: 'Could not parse recipe from page' });
  }
}

// ── JSON-LD extraction ──────────────────────────────────────────────────────

function extractJsonLdRecipe(html) {
  const scriptRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const schemas = Array.isArray(data)
        ? data
        : data['@graph']
          ? data['@graph']
          : [data];
      for (const schema of schemas) {
        if (schema['@type'] === 'Recipe') return normalizeJsonLdRecipe(schema);
      }
    } catch {
      // malformed JSON-LD block — try next
    }
  }
  return null;
}

function normalizeJsonLdRecipe(schema) {
  const ingredients = schema.recipeIngredient ?? [];

  const directions = (schema.recipeInstructions ?? []).map((step) =>
    typeof step === 'string' ? step : step.text ?? ''
  ).filter(Boolean);

  const rawYield = schema.recipeYield;
  const servings = rawYield
    ? (Array.isArray(rawYield) ? rawYield[0] : rawYield).toString()
    : '';

  const toArray = (val) =>
    !val ? [] : Array.isArray(val) ? val : [val];

  const categories = [
    ...toArray(schema.recipeCategory),
    ...toArray(schema.recipeCuisine),
  ].filter(Boolean);

  return {
    title: schema.name ?? '',
    ingredients,
    directions,
    servings,
    categories,
  };
}
