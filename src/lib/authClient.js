import { createAuthClient } from '@neondatabase/auth';

const authBaseUrl = import.meta.env.VITE_NEON_AUTH_URL;

if (!authBaseUrl) {
  // Keep a visible signal in development if auth URL is missing.
  // The app still loads, but auth requests will fail until this is set.
  // eslint-disable-next-line no-console
  console.warn('Missing VITE_NEON_AUTH_URL. Neon Auth client is not configured.');
}

export const authClient = createAuthClient(authBaseUrl || '');
