const NEON_AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL;

/**
 * Request a fresh JWT from the Neon Auth /token endpoint.
 * The browser sends the Neon Auth session cookie automatically because
 * this request goes directly to the Neon Auth domain (same origin as where
 * the cookie was set). Returns the JWT string or throws if not authenticated.
 */
async function getJwt() {
  const res = await fetch(`${NEON_AUTH_URL}/token`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Not authenticated');
  const data = await res.json();
  const token = data?.token ?? data?.jwt ?? data?.access_token;
  if (!token) throw new Error('No token in response');
  return token;
}

export async function fetchPreferences() {
  const jwt = await getJwt();
  const res = await fetch('/api/profile', {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error);
  return data.preferences;
}

export async function savePreferences({ servings, eatingStyle, goal, bmrKcal }) {
  const jwt = await getJwt();
  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ servings, eatingStyle, goal, bmrKcal }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error);
  return data.preferences;
}
