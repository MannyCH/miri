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
 * POST /api/shopping-list-accept
 * Body: { token: string }
 * Marks the share as accepted and sets the invitee_id.
 * Returns { ownerId } so the client can switch to the shared list.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sql = neon(process.env.DATABASE_URL);

  let inviteeId;
  try {
    inviteeId = await getUserId(req);
  } catch (err) {
    console.error('[shopping-list-accept] auth failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized', detail: err.message });
  }

  const { token } = req.body ?? {};
  if (!token) return res.status(400).json({ error: 'token is required' });

  try {
    // Try to accept a pending invite
    const updated = await sql`
      UPDATE shopping_list_shares
      SET invitee_id = ${inviteeId}, status = 'accepted'
      WHERE token = ${token} AND status = 'pending'
      RETURNING owner_id, list_name
    `;

    if (updated.length) {
      return res.json({ ownerId: updated[0].owner_id, listName: updated[0].list_name ?? null });
    }

    // Already accepted by this user — still return the owner so the app can switch
    const existing = await sql`
      SELECT owner_id, list_name FROM shopping_list_shares
      WHERE token = ${token} AND invitee_id = ${inviteeId} AND status = 'accepted'
    `;

    if (existing.length) {
      return res.json({ ownerId: existing[0].owner_id, listName: existing[0].list_name ?? null });
    }

    return res.status(404).json({ error: 'Invalid or already used token' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
