import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';

/**
 * /api/shopping-list-share
 *
 * GET ?listId=xxx — Get the invite token for a list (must be a member)
 */
export default async function handler(req, res) {
  try {
    const userId = await getUserId(req);

    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { listId } = req.query;
    if (!listId) return res.status(400).json({ error: 'listId required' });

    // Verify membership
    const check = await sql`
      SELECT 1 FROM shopping_list_members
      WHERE list_id = ${listId} AND user_id = ${userId}
      LIMIT 1
    `;
    if (check.length === 0) return res.status(403).json({ error: 'Not a member' });

    // Get invite token
    const rows = await sql`
      SELECT invite_token FROM shopping_lists WHERE id = ${listId}
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'List not found' });

    return res.status(200).json({ token: rows[0].invite_token });
  } catch (err) {
    console.error('shopping-list-share error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
