import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';
import { getPusher } from './_lib/pusher.js';

/**
 * /api/shopping-lists
 *
 * GET    — Fetch all lists the user belongs to (with member counts)
 * POST   — Create a new list (auto-adds user as member)
 * PATCH  — Rename a list { listId, name }
 * DELETE — Delete a list { listId } (only if solo, non-shared)
 */
export default async function handler(req, res) {
  try {
    const userId = await getUserId(req);

    // ── GET: all lists for this user ──
    if (req.method === 'GET') {
      const lists = await sql`
        SELECT
          sl.id,
          sl.name,
          sl.invite_token,
          sl.created_at,
          (SELECT COUNT(*)::int FROM shopping_list_members WHERE list_id = sl.id) AS member_count
        FROM shopping_lists sl
        JOIN shopping_list_members slm ON slm.list_id = sl.id
        WHERE slm.user_id = ${userId}
        ORDER BY sl.created_at ASC
      `;
      return res.status(200).json({ lists });
    }

    // ── POST: create new list ──
    if (req.method === 'POST') {
      const { name = 'Einkaufsliste' } = req.body ?? {};
      const rows = await sql`
        INSERT INTO shopping_lists (name)
        VALUES (${name})
        RETURNING id, name, invite_token, created_at
      `;
      const list = rows[0];

      // Add creator as member
      await sql`
        INSERT INTO shopping_list_members (list_id, user_id)
        VALUES (${list.id}, ${userId})
      `;

      return res.status(201).json({ list: { ...list, member_count: 1 } });
    }

    // ── PATCH: rename list ──
    if (req.method === 'PATCH') {
      const { listId, name } = req.body ?? {};
      if (!listId || !name) return res.status(400).json({ error: 'listId and name required' });

      // Verify membership
      const membership = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${userId}
        LIMIT 1
      `;
      if (membership.length === 0) return res.status(403).json({ error: 'Not a member' });

      await sql`UPDATE shopping_lists SET name = ${name} WHERE id = ${listId}`;

      // Trigger Pusher event for other members
      const socketId = req.headers['x-pusher-socket-id'] || null;
      try {
        const pusher = getPusher();
        await pusher.trigger(`private-list-${listId}`, 'list:renamed', { name }, { socket_id: socketId });
      } catch (e) {
        console.error('Pusher trigger error (rename):', e.message);
      }

      return res.status(200).json({ ok: true });
    }

    // ── DELETE: delete a non-shared list ──
    if (req.method === 'DELETE') {
      const { listId } = req.body ?? {};
      if (!listId) return res.status(400).json({ error: 'listId required' });

      // Verify membership
      const membership = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${userId}
        LIMIT 1
      `;
      if (membership.length === 0) return res.status(403).json({ error: 'Not a member' });

      // Check that list is solo (only this user)
      const memberCount = await sql`
        SELECT COUNT(*)::int AS count FROM shopping_list_members
        WHERE list_id = ${listId}
      `;
      if (memberCount[0].count > 1) {
        return res.status(400).json({ error: 'Cannot delete a shared list — leave instead' });
      }

      // CASCADE deletes members + items
      await sql`DELETE FROM shopping_lists WHERE id = ${listId}`;

      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();
  } catch (err) {
    console.error('shopping-lists error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
