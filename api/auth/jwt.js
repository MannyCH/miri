/**
 * POST /api/auth/jwt
 *
 * Server-side proxy to exchange a Better Auth session token for a Neon JWT.
 * Safari ITP blocks cross-domain cookies, so getSession() returns null and
 * the Data API has no JWT for RLS. Server-side has no ITP restrictions.
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

    // Include X-Neon-Client-Info — the Neon Auth server uses this to decide
    // whether to include the set-auth-jwt header in the response.
    const clientInfo = JSON.stringify({
      sdk: { name: '@neondatabase/neon-js', version: '0.2.0-beta.1' },
      runtime: { name: 'node', version: process.version },
    });

    const response = await fetch(`${authBaseUrl}/api/auth/get-session`, {
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
        'X-Neon-Client-Info': clientInfo,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: `Auth server error: ${response.status}` });
    }

    // Neon Auth returns the JWT in the set-auth-jwt response header.
    const jwt = response.headers.get('set-auth-jwt');
    if (jwt) {
      return res.status(200).json({ jwt });
    }

    // Fallback: use session.token from response body (may be a JWE).
    const data = await response.json();
    const sessionJwt = data?.data?.session?.token ?? data?.session?.token ?? null;
    if (sessionJwt) {
      return res.status(200).json({ jwt: sessionJwt });
    }

    return res.status(401).json({ error: 'No JWT in auth server response' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch JWT from auth server' });
  }
}
