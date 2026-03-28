import { createClient } from '@neondatabase/neon-js';

export const dataClient = createClient({
  auth: {
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});

// Safari ITP blocks cross-domain cookies so getSession() returns null, which
// makes the adapter's getJWTToken() return null, which makes the Data API throw
// AuthRequiredError on every query. Fix: store the JWT ourselves (fetched via a
// server-side proxy that has no ITP restrictions) and patch the adapter instance
// so its getJWTToken() returns our stored value. The internal getAccessToken
// closure in createClient calls adapter.getJWTToken() dynamically, so patching
// the instance property shadows the prototype method and takes effect immediately.
let _jwt = null;

const _patchedGetJWT = async () => _jwt;

// Patch the adapter instance — must be done after createClient returns.
dataClient.auth.getJWTToken = _patchedGetJWT;

/**
 * Store a JWT so the Data API can authenticate requests in Safari.
 * Call this after sign-in with the JWT received from /api/auth/jwt.
 */
export function setDataJWT(jwt) {
  _jwt = jwt;
}

export function clearDataJWT() {
  _jwt = null;
}
