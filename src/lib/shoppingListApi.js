import { dataClient } from './dataClient';

/**
 * Get a Bearer token from the current Neon Auth session.
 * Throws if no active session exists.
 */
async function getAuthToken() {
  const { data: sessionData } = await dataClient.auth.getSession();
  const token = sessionData?.session?.token;
  if (!token) throw new Error('Not authenticated');
  return token;
}

/**
 * Authenticated fetch helper.
 * Automatically attaches Bearer token and optional Pusher socket ID.
 */
async function authFetch(url, { method = 'GET', body, socketId } = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  if (socketId) {
    headers['X-Pusher-Socket-Id'] = socketId;
  }

  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Lists ──

export function fetchLists() {
  return authFetch('/api/shopping-lists');
}

export function createList(name) {
  return authFetch('/api/shopping-lists', { method: 'POST', body: { name } });
}

export function renameList(listId, name, socketId) {
  return authFetch('/api/shopping-lists', { method: 'PATCH', body: { listId, name }, socketId });
}

export function deleteList(listId) {
  return authFetch('/api/shopping-lists', { method: 'DELETE', body: { listId } });
}

// ── Items ──

export function fetchItems(listId) {
  return authFetch(`/api/shopping-list-items?listId=${encodeURIComponent(listId)}`);
}

export function addItem(listId, { entryId, name, recipeId, recipeName }, socketId) {
  return authFetch('/api/shopping-list-items', {
    method: 'POST',
    body: { listId, entryId, name, recipeId, recipeName },
    socketId,
  });
}

export function toggleItem(listId, entryId, checked, socketId) {
  return authFetch('/api/shopping-list-items', {
    method: 'PATCH',
    body: { listId, entryId, checked },
    socketId,
  });
}

export function removeItem(listId, entryId, socketId) {
  return authFetch('/api/shopping-list-items', {
    method: 'DELETE',
    body: { listId, entryId },
    socketId,
  });
}

// ── Members ──

export function fetchMembers(listId) {
  return authFetch(`/api/shopping-list-members?listId=${encodeURIComponent(listId)}`);
}

export function removeMember(listId, targetUserId, socketId) {
  return authFetch('/api/shopping-list-members', {
    method: 'DELETE',
    body: { listId, targetUserId },
    socketId,
  });
}

// ── Join ──

export function fetchJoinInfo(token) {
  return authFetch(`/api/shopping-list-join?token=${encodeURIComponent(token)}`);
}

export function joinList(token, mergeFromListId) {
  return authFetch('/api/shopping-list-join', {
    method: 'POST',
    body: { token, mergeFromListId },
  });
}
