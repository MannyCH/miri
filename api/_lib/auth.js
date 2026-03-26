import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`)
);

/**
 * Extract and verify the user ID from the Authorization header.
 * Throws if missing or invalid.
 */
export async function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) throw new Error('Missing Bearer token');
  const token = auth.slice(7);
  const { payload } = await jwtVerify(token, JWKS);
  if (!payload.sub) throw new Error('No sub in JWT payload');
  return payload.sub;
}
