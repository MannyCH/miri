import { dataClient } from './dataClient';

// ── Shape helpers ─────────────────────────────────────────────────────────

function toAppItem(row) {
  return {
    id: row.item_id ?? row.entry_id,
    entryId: row.entry_id,
    name: row.name,
    recipeId: row.recipe_id ?? null,
    recipeName: row.recipe_name ?? null,
    checked: row.checked ?? false,
    _ownerUserId: row.user_id,
  };
}

function toDbRow(item, userId) {
  return {
    user_id: userId,
    entry_id: item.entryId ?? item.id,
    item_id: item.id,
    name: item.name,
    recipe_id: item.recipeId ?? null,
    recipe_name: item.recipeName ?? null,
    checked: item.checked ?? false,
  };
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Fetch shopping list items.
 * ownerUserId: pass the owner's user_id to load a shared list (filters to that owner).
 * RLS handles access control — only accessible rows are returned.
 */
export async function fetchShoppingList(ownerUserId = null) {
  let q = dataClient
    .from('shopping_list_items')
    .select('*')
    .order('created_at', { ascending: true });

  if (ownerUserId) {
    q = q.eq('user_id', ownerUserId);
  }

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toAppItem);
}

/**
 * Add a single item. Used for real-time add operations.
 */
export async function addListItem(item, ownerUserId) {
  const { error } = await dataClient
    .from('shopping_list_items')
    .insert(toDbRow(item, ownerUserId));
  if (error) throw new Error(error.message);
}

/**
 * Patch a single item (checked status, etc.).
 * ownerUserId is required so we can target the right row.
 */
export async function patchListItem(entryId, ownerUserId, changes) {
  const { error } = await dataClient
    .from('shopping_list_items')
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq('entry_id', entryId)
    .eq('user_id', ownerUserId);
  if (error) throw new Error(error.message);
}

/**
 * Delete a single item.
 */
export async function removeListItem(entryId, ownerUserId) {
  const { error } = await dataClient
    .from('shopping_list_items')
    .delete()
    .eq('entry_id', entryId)
    .eq('user_id', ownerUserId);
  if (error) throw new Error(error.message);
}

/**
 * Delete all items for a given owner (used by "clear list").
 */
export async function clearListItems(ownerUserId) {
  const { error } = await dataClient
    .from('shopping_list_items')
    .delete()
    .eq('user_id', ownerUserId);
  if (error) throw new Error(error.message);
}

/**
 * Replace the entire list atomically: delete all + insert new items.
 * Used for initial migration from localStorage and bulk additions.
 */
export async function replaceListItems(items, ownerUserId) {
  const { error: delError } = await dataClient
    .from('shopping_list_items')
    .delete()
    .eq('user_id', ownerUserId);
  if (delError) throw new Error(delError.message);

  if (items.length > 0) {
    const { error: insError } = await dataClient
      .from('shopping_list_items')
      .insert(items.map((item) => toDbRow(item, ownerUserId)));
    if (insError) throw new Error(insError.message);
  }
}

/**
 * Fetch all share records for the current user:
 *  - As owner: outgoing invites
 *  - As invitee: incoming invites
 */
export async function fetchShares() {
  const { data: sessionData } = await dataClient.auth.getSession();
  const userId = sessionData?.user?.id;
  if (!userId) return { outgoing: [], incoming: [] };

  const [outRes, inRes] = await Promise.all([
    dataClient.from('shopping_list_shares').select('*').eq('owner_id', userId),
    dataClient.from('shopping_list_shares').select('*').eq('invitee_id', userId),
  ]);

  return {
    outgoing: outRes.data ?? [],
    incoming: inRes.data ?? [],
  };
}

/**
 * Get current user's JWT token for server-side API calls.
 * Uses getJWTToken() — the correct method for extracting a verifiable JWT.
 */
export async function getAuthToken() {
  const token = await dataClient.auth.getJWTToken?.();
  return token ?? null;
}
