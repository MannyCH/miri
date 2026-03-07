export default function handler(_req, res) {
  res.status(200).json({
    ok: true,
    provider: 'anthropic',
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
    configured: Boolean(process.env.ANTHROPIC_API_KEY),
  });
}
