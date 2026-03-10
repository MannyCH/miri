import { authClient } from './authClient';

async function getToken() {
  const result = await authClient.getSession();
  return result?.data?.session?.token ?? null;
}

export async function fetchPreferences() {
  const token = await getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error);
  return data.preferences;
}

export async function savePreferences({ servings, eatingStyle, goal, bmrKcal }) {
  const token = await getToken();
  if (!token) throw new Error('Not authenticated');

  const res = await fetch('/api/profile', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ servings, eatingStyle, goal, bmrKcal }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error);
  return data.preferences;
}
