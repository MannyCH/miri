import { dataClient } from './dataClient';

async function getAuthToken() {
  const { data } = await dataClient.auth.getSession();
  return data?.session?.token ?? null;
}

async function apiFetch(method, body) {
  const token = await getAuthToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch('/api/user-preferences', {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchPreferences() {
  return apiFetch('GET');
}

export async function savePreferences({ servings, eatingStyle, goal, bmrKcal, cookingFrequency, unitSystem, onboardedAt }) {
  return apiFetch('PUT', { servings, eatingStyle, goal, bmrKcal, cookingFrequency, unitSystem, onboardedAt });
}
