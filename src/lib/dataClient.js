import { createClient } from '@neondatabase/neon-js';

/**
 * Neon client that combines auth (token management) and Data API queries.
 * The auth part reuses the same Neon Auth backend as our authClient so
 * both clients share the same browser session cookies.
 */
export const dataClient = createClient({
  auth: {
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});
