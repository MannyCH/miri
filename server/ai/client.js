import Anthropic from '@anthropic-ai/sdk';

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

export const anthropic = new Anthropic({
  apiKey: anthropicApiKey,
});

export const DEFAULT_CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929';
