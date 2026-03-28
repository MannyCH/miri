import { createClient } from '@neondatabase/neon-js';

// Safari ITP blocks cross-domain session cookies from the Neon Auth server.
// When a Bearer token is available (after sign-in), we rebuild the client with
// it baked into fetchOptions so that ALL auth requests — including the
// getSession() call inside getJWTToken() — include the Authorization header.
// Without this, getJWTToken() returns null and the Neon Data API rejects all
// queries (RLS sees no authenticated user).

function buildClient(bearerToken) {
  return createClient({
    auth: {
      url: import.meta.env.VITE_NEON_AUTH_URL,
      ...(bearerToken ? {
        fetchOptions: { headers: { Authorization: `Bearer ${bearerToken}` } },
      } : {}),
    },
    dataApi: {
      url: import.meta.env.VITE_NEON_DATA_API_URL,
    },
  });
}

function getStoredBearerToken() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem('miri-session-v1');
    if (!raw) return null;
    return JSON.parse(raw)?.session?.token ?? null;
  } catch {
    return null;
  }
}

// Initialise with stored token so page reloads also get Bearer auth.
export let dataClient = buildClient(getStoredBearerToken());

/**
 * Rebuild the data client with a fresh Bearer token after sign-in.
 * Called from AuthContext once we have the token from the sign-in response.
 */
export function upgradeDataClientAuth(token) {
  if (token) {
    dataClient = buildClient(token);
  }
}
