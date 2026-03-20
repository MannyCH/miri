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
 * POST /api/shopping-list-share
 * Body: { inviteeEmail: string }
 * Creates a pending invite for the given email. Returns the invite token.
 *
 * GET /api/shopping-list-share
 * Returns all shares where current user is owner or invitee.
 */
export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  let ownerId;
  try {
    ownerId = await getUserId(req);
  } catch (err) {
    console.error('[shopping-list-share] auth failed:', err.message);
    return res.status(401).json({ error: 'Unauthorized', detail: err.message });
  }

  if (req.method === 'POST') {
    const { inviteeEmail } = req.body ?? {};
    if (!inviteeEmail) return res.status(400).json({ error: 'inviteeEmail is required' });

    const token = crypto.randomUUID().replace(/-/g, '');

    try {
      await sql`
        INSERT INTO shopping_list_shares (owner_id, invitee_email, status, token)
        VALUES (${ownerId}, ${inviteeEmail}, 'pending', ${token})
        ON CONFLICT (owner_id, invitee_email) DO UPDATE
          SET token = EXCLUDED.token, status = 'pending', updated_at = NOW()
      `;
      return res.json({ token, inviteeEmail });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT * FROM shopping_list_shares
        WHERE owner_id = ${ownerId} OR invitee_id = ${ownerId}
        ORDER BY created_at DESC
      `;
      return res.json({ shares: rows });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).end();
}
