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

    const cookieHeader = `better-auth.session_token=${sessionToken}`;

    // Strategy 1: Call the dedicated /token endpoint (GET) which directly
    // returns the JWT as { token: <jwt> }. This is simpler than extracting
    // set-auth-jwt from the get-session response headers.
    const tokenResponse = await fetch(`${authBaseUrl}/api/auth/token`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      const jwt = tokenData?.token ?? null;
      if (jwt) {
        return res.status(200).json({ jwt });
      }
    }

    // Strategy 2: Fall back to /get-session and read set-auth-jwt header.
    const sessionResponse = await fetch(`${authBaseUrl}/api/auth/get-session`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!sessionResponse.ok) {
      return res.status(401).json({ error: `Auth server error: ${sessionResponse.status}` });
    }

    const jwt = sessionResponse.headers.get('set-auth-jwt');
    if (jwt) {
      return res.status(200).json({ jwt });
    }

    return res.status(401).json({ error: 'No JWT in auth server response' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch JWT from auth server' });
  }
}
