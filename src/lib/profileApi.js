export async function fetchPreferences() {
  const res = await fetch('/api/profile', {
    credentials: 'include',
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error);
  return data.preferences;
}

export async function savePreferences({ servings, eatingStyle, goal, bmrKcal }) {
  const res = await fetch('/api/profile', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ servings, eatingStyle, goal, bmrKcal }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error);
  return data.preferences;
}
