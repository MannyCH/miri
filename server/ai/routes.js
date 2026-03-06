import { Router } from 'express';
import { anthropic, DEFAULT_CLAUDE_MODEL } from './client.js';

const router = Router();

const DEFAULT_MAX_TOKENS = 512;

function getTextFromClaudeMessage(message) {
  return (message.content || [])
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();
}

router.get('/health', (_req, res) => {
  const hasApiKey = Boolean(process.env.ANTHROPIC_API_KEY);
  res.json({
    ok: true,
    provider: 'anthropic',
    model: DEFAULT_CLAUDE_MODEL,
    configured: hasApiKey,
  });
});

router.post('/chat', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      ok: false,
      error: 'ANTHROPIC_API_KEY is missing on the server.',
    });
  }

  const { message, systemPrompt, maxTokens, temperature } = req.body ?? {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'message must be a non-empty string.',
    });
  }

  try {
    const response = await anthropic.messages.create({
      model: DEFAULT_CLAUDE_MODEL,
      max_tokens: Number.isFinite(maxTokens) ? maxTokens : DEFAULT_MAX_TOKENS,
      temperature: Number.isFinite(temperature) ? temperature : undefined,
      system: typeof systemPrompt === 'string' ? systemPrompt : undefined,
      messages: [{ role: 'user', content: message }],
    });

    return res.json({
      ok: true,
      model: response.model,
      text: getTextFromClaudeMessage(response),
      usage: response.usage,
    });
  } catch (error) {
    const status = error?.status || 500;
    return res.status(status).json({
      ok: false,
      error: error?.message || 'Unknown Claude request error.',
    });
  }
});

export default router;
