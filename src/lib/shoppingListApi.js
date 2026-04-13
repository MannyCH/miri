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
 * Authenticated fetch helper — single gateway for all shopping list API calls.
 *
 * Fetches a Neon Auth Bearer token via `getAuthToken()`, attaches it to every
 * request, and optionally includes a Pusher socket ID header so the server can
 * suppress echo events back to the originating client.
 *
 * Every exported function in this file calls `authFetch`. If this function
 * breaks (token missing, network error, non-OK response), all 14 shopping list
 * operations fail: fetchLists, createList, renameList, deleteList, fetchItems,
 * addItem, toggleItem, updateItemName, removeItem, fetchMembers, removeMember,
 * fetchJoinInfo, joinList.
 *
 * @param {string} url - API endpoint path (e.g. '/api/shopping-lists')
 * @param {object} [options]
 * @param {'GET'|'POST'|'PATCH'|'DELETE'} [options.method='GET']
 * @param {object} [options.body] - Request body, JSON-serialised automatically
 * @param {string} [options.socketId] - Pusher socket ID; sets X-Pusher-Socket-Id header
 * @returns {Promise<any>} Parsed JSON response body
 * @throws {Error} 'Not authenticated' if no active session exists
 * @throws {Error} Server error message or 'HTTP {status}' on non-OK responses
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

export function updateItemName(listId, entryId, name, socketId) {
  return authFetch('/api/shopping-list-items', {
    method: 'PATCH',
    body: { listId, entryId, name },
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
  return authFetch(`/api/shopping-list-members?token=${encodeURIComponent(token)}`);
}

export function joinList(token, mergeFromListId) {
  return authFetch('/api/shopping-list-members', {
    method: 'POST',
    body: { token, mergeFromListId },
  });
}
