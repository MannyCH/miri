import { neon } from '@neondatabase/serverless';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`)
);

async function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) throw new Error('Missing Bearer token');
  const token = auth.slice(7);
  const { payload } = await jwtVerify(token, JWKS);
  if (!payload.sub) throw new Error('No sub in JWT payload');
  return payload.sub;
}

/**
 * GET  /api/shopping-list-items?ownerId=<uid>
 *   Returns items for the given owner (own or shared, verified).
 *
 * PATCH /api/shopping-list-items?ownerId=<uid>&entryId=<id>
 *   Updates checked state on a shared list item.
 *   Caller must have an accepted share for ownerId.
 */
export default async function handler(req, res) {
  const ALLOWED = ['GET', 'POST', 'PATCH', 'DELETE'];
  if (!ALLOWED.includes(req.method)) return res.status(405).end();

  const sql = neon(process.env.DATABASE_URL);

  let callerId;
  try {
    callerId = await getUserId(req);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', detail: err.message });
  }

  const ownerId = req.query.ownerId ?? callerId;

  // If requesting someone else's list, verify there is an accepted share
  if (ownerId !== callerId) {
    const share = await sql`
      SELECT id FROM shopping_list_shares
      WHERE owner_id = ${ownerId} AND invitee_id = ${callerId} AND status = 'accepted'
      LIMIT 1
    `;
    if (!share.length) {
      return res.status(403).json({ error: 'No accepted share found' });
    }
  }

  if (req.method === 'POST') {
    const { name, entryId, itemId } = req.body ?? {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    const newEntryId = entryId ?? crypto.randomUUID().replace(/-/g, '');
    const newItemId = itemId ?? newEntryId;
    try {
      await sql`
        INSERT INTO shopping_list_items (user_id, entry_id, item_id, name)
        VALUES (${ownerId}, ${newEntryId}, ${newItemId}, ${name})
      `;
      return res.json({ ok: true, entryId: newEntryId });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const entryId = req.query.entryId;
    if (!entryId) return res.status(400).json({ error: 'entryId is required' });
    try {
      await sql`
        DELETE FROM shopping_list_items
        WHERE entry_id = ${entryId} AND user_id = ${ownerId}
      `;
      return res.json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PATCH') {
    const entryId = req.query.entryId;
    const { checked } = req.body ?? {};
    if (!entryId || checked === undefined) {
      return res.status(400).json({ error: 'entryId and checked are required' });
    }
    try {
      await sql`
        UPDATE shopping_list_items
        SET checked = ${Boolean(checked)}
        WHERE entry_id = ${entryId} AND user_id = ${ownerId}
      `;
      return res.json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  try {
    const rows = await sql`
      SELECT entry_id, item_id, name, recipe_id, recipe_name, checked, user_id
      FROM shopping_list_items
      WHERE user_id = ${ownerId}
      ORDER BY created_at ASC
    `;
    return res.json({ items: rows });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
