/**
 * Validate the current user session by forwarding the browser's session cookie
 * to the Neon Auth server. Returns the user ID or throws on failure.
 *
 * This works because the frontend (miri-meal.vercel.app) and the API functions
 * (/api/*) share the same origin, so the Better Auth session cookie is sent
 * automatically with every fetch({ credentials: 'include' }) call.
 */
export async function getUserId(cookieHeader) {
  if (!cookieHeader) throw new Error('No session cookie');

  const res = await fetch(`${process.env.NEON_AUTH_BASE_URL}/get-session`, {
    headers: { Cookie: cookieHeader },
  });

  if (!res.ok) throw new Error(`Session validation failed: ${res.status}`);

  const data = await res.json();
  const userId = data?.user?.id ?? data?.session?.userId;
  if (!userId) throw new Error('No user ID in session response');
  return userId;
}
