import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS_URI = `${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`;

let jwks;
function getJwks() {
  if (!jwks) jwks = createRemoteJWKSet(new URL(JWKS_URI));
  return jwks;
}

/**
 * Verify the JWT sent as Bearer token and return the user ID (sub claim).
 * The JWT is obtained by the client calling Neon Auth's /token endpoint,
 * which issues a proper signed JWT (EdDSA/Ed25519) verifiable via JWKS.
 */
export async function getUserId(authHeader) {
  if (!authHeader || !String(authHeader).startsWith('Bearer ')) {
    throw new Error('Missing bearer token');
  }
  const token = authHeader.slice(7);
  const { payload } = await jwtVerify(token, getJwks());
  const userId = payload.sub ?? payload.userId ?? payload.id;
  if (!userId) throw new Error('No user ID in JWT payload');
  return userId;
}
