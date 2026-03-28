/**
 * POST /api/auth/jwt
 *
 * Server-side proxy to exchange a Better Auth session token for a Neon JWT.
 * Client-side: Safari ITP blocks cross-domain cookies from the Neon Auth
 * server, so getSession() returns null and the Data API has no JWT for RLS.
 * Server-side: no ITP restrictions — we send the session token as a cookie
 * (the standard Better Auth auth mechanism) and extract the JWT from the
 * set-auth-jwt response header that Neon Auth includes on session responses.
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

    // Better Auth authenticates via a session cookie. The default cookie name
    // is "better-auth.session_token". Server-side fetch has no ITP, so we can
    // set this header directly without any cross-domain cookie restrictions.
    const response = await fetch(`${authBaseUrl}/api/auth/get-session`, {
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
      },
    });

    if (!response.ok) {
      return res.status(401).json({ error: `Auth server error: ${response.status}` });
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
