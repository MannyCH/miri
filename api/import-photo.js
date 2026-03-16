import Anthropic from '@anthropic-ai/sdk';

/**
 * POST /api/import-photo
 * Body: { image: string (base64), mediaType: string (e.g. "image/jpeg") }
 *
 * Sends the image to Claude Vision which identifies and structures the recipe.
 * No manual section marking required — Claude reads layout and context naturally.
 *
 * Returns: { title, ingredients[], directions[], servings, categories[] }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image, mediaType = 'image/jpeg' } = req.body ?? {};
  if (!image) return res.status(400).json({ error: 'image is required' });

  const client = new Anthropic();

  let message;
  try {
    message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: image,
            },
          },
          {
            type: 'text',
            text: `Extract the recipe from this image. Return ONLY a JSON object with these keys:
- title: string
- ingredients: array of strings (e.g. "2 cups flour", "1 kg chicken")
- directions: array of strings (one step per item)
- servings: string (e.g. "4")
- categories: array of strings

If a field is not present, use an empty string or empty array. Output only the JSON, no explanation.`,
          },
        ],
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
    return res.status(422).json({ error: 'Could not parse recipe from image' });
  }
}
