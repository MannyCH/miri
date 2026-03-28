import { createClient, BetterAuthVanillaAdapter } from '@neondatabase/neon-js';

// Safari ITP blocks cross-domain session cookies from the Neon Auth server.
// getSession() returns null → getJWTToken() returns null → RLS sees no user.
//
// Fix: pass a custom adapter wrapper that merges the Bearer token into
// fetchOptions. createClient() hardcodes fetchOptions (only the client-info
// header) and does NOT merge authConfig.fetchOptions, so we inject the token
// via the adapter path instead — the adapter builder receives those same
// fetchOptions and CAN merge them.

function buildClient(bearerToken) {
  const authConfig = { url: import.meta.env.VITE_NEON_AUTH_URL };

  if (bearerToken) {
    // Wrap the default adapter builder so it merges our Bearer token into
    // whatever fetchOptions neon-js passes down (which includes the client-info
    // header). The wrapped builder is called as adapterBuilder(url, fetchOptions)
    // by createInternalNeonAuth.
    const baseBuilder = BetterAuthVanillaAdapter();
    authConfig.adapter = (url, fetchOptions) => baseBuilder(url, {
      ...fetchOptions,
      headers: {
        ...fetchOptions?.headers,
        Authorization: `Bearer ${bearerToken}`,
      },
    });
  }

  return createClient({
    auth: authConfig,
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
