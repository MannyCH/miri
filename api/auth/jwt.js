/**
 * POST /api/auth/jwt
 *
 * Server-side proxy to exchange a Better Auth session token for a JWT.
 * Client-side: Safari ITP blocks cross-domain cookies from the Neon Auth
 * server, so getSession() returns null and the Data API has no JWT for RLS.
 * Server-side: no ITP restrictions — we can call the auth server directly
 * with the session token as a Bearer token and receive the JWT from the
 * set-auth-jwt response header.
 *
 * Body: { sessionToken: string }
 * Response: { jwt: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sessionToken } = req.body ?? {};
  if (!sessionToken || typeof sessionToken !== 'string') {
    return res.status(400).json({ error: 'Missing sessionToken' });
  }

  try {
    const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
    if (!authBaseUrl) {
      return res.status(500).json({ error: 'Auth base URL not configured' });
    }

    const response = await fetch(`${authBaseUrl}/api/auth/get-session`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: 'Auth server rejected session token' });
    }

    const jwt = response.headers.get('set-auth-jwt');
    if (!jwt) {
      return res.status(401).json({ error: 'No JWT in auth server response' });
    }

    return res.status(200).json({ jwt });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch JWT from auth server' });
  }
}
