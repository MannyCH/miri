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

    // Neon Auth uses __Secure-neon-auth.session_token, not better-auth.session_token
    const cookieHeader = `__Secure-neon-auth.session_token=${sessionToken}`;

    // Call /get-session with the session token as a cookie.
    // The Neon Auth server returns the JWT in the set-auth-jwt response header.
    const response = await fetch(`${authBaseUrl}/get-session`, {
      headers: {
        Cookie: cookieHeader,
      },
    });

    const responseHeaders = {};
    response.headers.forEach((value, key) => { responseHeaders[key] = value; });

    if (!response.ok) {
      return res.status(401).json({
        error: `Auth server error: ${response.status}`,
        debug: { status: response.status, headers: Object.keys(responseHeaders) },
      });
    }

    const jwt = response.headers.get('set-auth-jwt');
    if (jwt) {
      return res.status(200).json({ jwt });
    }

    const body = await response.json().catch(() => null);
    return res.status(401).json({
      error: 'No JWT in auth server response',
      debug: {
        status: response.status,
        headers: Object.keys(responseHeaders),
        hasSetAuthJwt: responseHeaders['set-auth-jwt'] !== undefined,
        bodyKeys: body ? Object.keys(body) : null,
        sessionTokenPresent: !!(body?.data?.session?.token ?? body?.session?.token),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch JWT from auth server' });
  }
}
