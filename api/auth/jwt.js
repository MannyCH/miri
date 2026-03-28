/**
 * POST /api/auth/jwt — legacy endpoint, no longer used.
 *
 * Safari ITP is now handled by the Edge Middleware (middleware.js) which
 * proxies all /neon-auth/* requests through our own domain so cookies are
 * same-site and never blocked by ITP.
 */
export default function handler(_req, res) {
  res.status(410).json({ error: 'This endpoint is no longer used.' });
}
