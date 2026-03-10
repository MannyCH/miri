import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS_URI = `${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`;
const SESSION_URI = `${process.env.NEON_AUTH_BASE_URL}/get-session`;

let jwks;
function getJwks() {
  if (!jwks) jwks = createRemoteJWKSet(new URL(JWKS_URI));
  return jwks;
}

/**
 * Verify a token — first tries JWKS (JWT path), then falls back to
 * the Neon Auth session endpoint (opaque token path).
 * Returns the user ID (sub / user.id) or throws.
 */
export async function getUserId(authHeader) {
  if (!authHeader || !String(authHeader).startsWith('Bearer ')) {
    throw new Error('Missing bearer token');
  }
  const token = authHeader.slice(7);

  // Try JWT verification first (fast, no extra network call)
  try {
    const { payload } = await jwtVerify(token, getJwks());
    if (payload.sub) return payload.sub;
  } catch {
    // Not a JWT or signature invalid — fall through to session endpoint
  }

  // Fall back: validate via Neon Auth session endpoint
  const res = await fetch(SESSION_URI, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Session validation failed: ${res.status}`);
  const data = await res.json();
  const userId = data?.user?.id ?? data?.session?.userId;
  if (!userId) throw new Error('Could not extract user ID from session');
  return userId;
}
