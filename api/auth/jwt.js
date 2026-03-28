/**
 * POST /api/auth/jwt
 *
 * Server-side proxy to exchange a Better Auth session token for a Neon JWT.
 * Safari ITP blocks cross-domain cookies, so getSession() returns null and
 * the Data API has no JWT for RLS. Server-side has no ITP restrictions.
 *
 * NEON_AUTH_BASE_URL already includes the path (e.g. .../neondb/auth), so
 * endpoints are appended directly: ${authBaseUrl}/get-session
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

    // Call /get-session with the session token as a cookie.
    // The Neon Auth server returns the JWT in the set-auth-jwt response header.
    const response = await fetch(`${authBaseUrl}/get-session`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: `Auth server error: ${response.status}` });
    }

    const jwt = response.headers.get('set-auth-jwt');
    if (jwt) {
      return res.status(200).json({ jwt });
    }

    return res.status(401).json({ error: 'No JWT in auth server response' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch JWT from auth server' });
  }
}
