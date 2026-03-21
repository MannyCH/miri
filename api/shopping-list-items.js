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
 * GET /api/shopping-list-items?ownerId=<uid>
 * Returns shopping list items for the given owner.
 * - If ownerId === caller's user id, returns their own items.
 * - Otherwise verifies an accepted share exists before returning.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

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
