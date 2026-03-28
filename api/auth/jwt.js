/**
 * POST /api/auth/jwt
 *
 * Server-side proxy to exchange a Better Auth session token for a Neon JWT.
 * Safari ITP blocks cross-domain cookies, so getSession() returns null and
 * the Data API has no JWT for RLS. Server-side has no ITP restrictions.
 *
 * ROOT CAUSE: Better Auth stores signed cookies (token.hmac_signature).
 * When we send the raw session token as a cookie it fails signature
 * verification and the server returns null session → no set-auth-jwt.
 *
 * STRATEGY (two attempts):
 * 1. GET /token with Authorization: Bearer <rawToken>
 *    If the Neon Auth server has the bearer plugin, it signs the raw token,
 *    verifies it, injects a valid session cookie, and /token returns the JWT.
 * 2. POST /sign-in to capture the signed Set-Cookie, then call /get-session
 *    with the properly signed cookie to trigger the set-auth-jwt header.
 *
 * NEON_AUTH_BASE_URL already includes the path (e.g. .../neondb/auth), so
 * endpoints are appended directly: ${authBaseUrl}/token
 *
 * Body: { sessionToken: string } OR { email: string, password: string }
 * Response: { jwt: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
  if (!authBaseUrl) {
    return res.status(500).json({ error: 'Auth base URL not configured' });
  }

  const body = req.body ?? {};

  // --- Mode A: exchange raw session token for JWT ---
  if (body.sessionToken && typeof body.sessionToken === 'string') {
    const jwt = await fetchJWTFromSessionToken(body.sessionToken, authBaseUrl);
    if (jwt) return res.status(200).json({ jwt });

    return res.status(401).json({ error: 'Could not obtain JWT from session token' });
  }

  // --- Mode B: sign-in proxy (captures signed Set-Cookie server-side) ---
  if (body.email && body.password) {
    try {
      const result = await signInAndGetJWT(body.email, body.password, authBaseUrl);
      if (result.jwt) {
        return res.status(200).json({
          jwt: result.jwt,
          user: result.user ?? null,
          sessionToken: result.sessionToken ?? null,
        });
      }
      return res.status(401).json({ error: result.error ?? 'Sign-in failed' });
    } catch (err) {
      return res.status(500).json({ error: 'Sign-in proxy failed' });
    }
  }

  return res.status(400).json({ error: 'Provide sessionToken or email+password' });
}

/**
 * Attempt 1: call GET /token with Authorization: Bearer <rawToken>.
 * Works if the Neon Auth server has the Better Auth bearer plugin enabled —
 * the plugin signs the raw token, sets it as a session cookie, and the
 * /token endpoint returns the JWT in the response body.
 *
 * Attempt 2: call GET /get-session with the raw token as a cookie.
 * This only works if the server accepts unsigned cookies — unlikely with
 * standard Better Auth, but kept as a fallback since it used to be our
 * only strategy.
 */
async function fetchJWTFromSessionToken(sessionToken, authBaseUrl) {
  // Match the exact X-Neon-Client-Info format the SDK sends (flat fields,
  // not nested objects — the previous format was wrong).
  const clientInfo = JSON.stringify({
    sdk: '@neondatabase/auth',
    version: '0.1.0-beta.21',
    runtime: 'node',
    runtimeVersion: process.versions?.node ?? 'unknown',
    platform: process.platform ?? 'unknown',
    arch: process.arch ?? 'unknown',
  });

  // Attempt 1: Bearer token → /token endpoint
  try {
    const tokenRes = await fetch(`${authBaseUrl}/token`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'X-Neon-Client-Info': clientInfo,
      },
    });
    if (tokenRes.ok) {
      const data = await tokenRes.json().catch(() => null);
      if (data?.token && typeof data.token === 'string') return data.token;
    }
  } catch (_) {
    // fall through to attempt 2
  }

  // Attempt 2: raw cookie → /get-session (works if server accepts unsigned)
  try {
    const sessionRes = await fetch(`${authBaseUrl}/get-session`, {
      headers: {
        Cookie: `__Secure-neon-auth.session_token=${sessionToken}`,
        'X-Neon-Client-Info': clientInfo,
      },
    });
    if (sessionRes.ok) {
      const jwt = sessionRes.headers.get('set-auth-jwt');
      if (jwt) return jwt;
    }
  } catch (_) {
    // fall through
  }

  return null;
}

/**
 * Mode B: proxy the sign-in to Neon Auth server-side so we can capture the
 * signed session cookie from the Set-Cookie response header (inaccessible to
 * browser JS). With the signed cookie we can call /get-session and receive
 * set-auth-jwt.
 *
 * Only called when the client sends { email, password } — i.e., when Mode A
 * failed and the client retries via the sign-in proxy.
 */
async function signInAndGetJWT(email, password, authBaseUrl) {
  const clientInfo = JSON.stringify({
    sdk: '@neondatabase/auth',
    version: '0.1.0-beta.21',
    runtime: 'node',
    runtimeVersion: process.versions?.node ?? 'unknown',
    platform: process.platform ?? 'unknown',
    arch: process.arch ?? 'unknown',
  });

  // Step 1: sign in to get the signed session cookie
  const signInRes = await fetch(`${authBaseUrl}/sign-in/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Neon-Client-Info': clientInfo,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!signInRes.ok) {
    const errBody = await signInRes.json().catch(() => null);
    return { error: errBody?.message || `Sign-in failed (${signInRes.status})` };
  }

  const signInData = await signInRes.json().catch(() => null);

  // Step 2: extract the signed session cookie from Set-Cookie
  const setCookies = signInRes.headers.getSetCookie?.() ?? [];
  const sessionCookieEntry = setCookies.find(c =>
    c.startsWith('__Secure-neon-auth.session_token=')
  );

  if (!sessionCookieEntry) {
    return { error: 'No session cookie in sign-in response' };
  }

  // Cookie format: __Secure-neon-auth.session_token=<signed_value>; Path=...; ...
  const signedToken = sessionCookieEntry.split('=').slice(1).join('=').split(';')[0];

  // Step 3: call /get-session with the signed cookie to trigger set-auth-jwt
  const sessionRes = await fetch(`${authBaseUrl}/get-session`, {
    headers: {
      Cookie: `__Secure-neon-auth.session_token=${signedToken}`,
      'X-Neon-Client-Info': clientInfo,
    },
  });

  const jwt = sessionRes.ok ? sessionRes.headers.get('set-auth-jwt') : null;

  return {
    jwt: jwt ?? null,
    user: signInData?.user ?? null,
    sessionToken: signInData?.token ?? null,
  };
}
