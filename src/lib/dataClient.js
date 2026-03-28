import { createClient } from '@neondatabase/neon-js';

// Route auth through our own domain (/neon-auth) so Safari ITP never
// blocks the session cookie. The Edge Middleware (middleware.js) proxies
// these requests to the real Neon Auth server and strips the cross-site
// Domain attribute from Set-Cookie, making cookies same-site.
//
// window.location.origin is used at runtime so preview deployments get
// their own host automatically without additional env vars.
const authUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/neon-auth`
  : import.meta.env.VITE_NEON_AUTH_URL;

export const dataClient = createClient({
  auth: {
    url: authUrl,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});
