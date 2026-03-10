import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS_URI = `${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`;
const jwks = createRemoteJWKSet(new URL(JWKS_URI));

/**
 * Verifies a Neon Auth JWT and returns the payload.
 * Throws if the token is invalid or expired.
 */
export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, jwks);
  return payload;
}

/**
 * Extracts and verifies the Bearer token from an Authorization header.
 * Returns the user ID (sub) or throws on failure.
 */
export async function getUserId(authHeader) {
  if (!authHeader || !String(authHeader).startsWith('Bearer ')) {
    throw new Error('Missing bearer token');
  }
  const token = authHeader.slice(7);
  const payload = await verifyToken(token);
  if (!payload.sub) throw new Error('Token has no subject');
  return payload.sub;
}
