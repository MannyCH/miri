import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';
import { getPusher } from './_lib/pusher.js';

/**
 * /api/shopping-list-join
 *
 * GET  — Get list info by invite token  ?token=xxx
 *         Returns: list name, item count, member names (for the accept screen)
 * POST — Join a list { token, mergeFromListId? }
 *         If mergeFromListId is provided, unchecked items from that list are copied
 *         to the joined list and the old list is deleted.
 */
export default async function handler(req, res) {
  try {
    const userId = await getUserId(req);

    // ── GET: list info by token ──
    if (req.method === 'GET') {
      const { token } = req.query;
      if (!token) return res.status(400).json({ error: 'token required' });

      const lists = await sql`
        SELECT id, name FROM shopping_lists WHERE invite_token = ${token}
      `;
      if (lists.length === 0) {
        return res.status(404).json({ error: 'List not found or link expired' });
      }
      const list = lists[0];

      // Check if already a member
      const existing = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${list.id} AND user_id = ${userId}
        LIMIT 1
      `;
      if (existing.length > 0) {
        return res.status(200).json({ list, alreadyMember: true });
      }

      // Get item count and members
      const countRows = await sql`
        SELECT COUNT(*)::int AS count FROM shopping_list_items WHERE list_id = ${list.id}
      `;
      const members = await sql`
        SELECT slm.user_id, up.default_servings
        FROM shopping_list_members slm
        LEFT JOIN user_profile up ON up.user_id = slm.user_id
        WHERE slm.list_id = ${list.id}
      `;

      return res.status(200).json({
        list,
        alreadyMember: false,
        itemCount: countRows[0].count,
        memberCount: members.length,
      });
    }

    // ── POST: join list ──
    if (req.method === 'POST') {
      const { token, mergeFromListId } = req.body ?? {};
      if (!token) return res.status(400).json({ error: 'token required' });

      const lists = await sql`
        SELECT id, name FROM shopping_lists WHERE invite_token = ${token}
      `;
      if (lists.length === 0) {
        return res.status(404).json({ error: 'List not found or link expired' });
      }
      const list = lists[0];

      // Check if already a member
      const existing = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${list.id} AND user_id = ${userId}
        LIMIT 1
      `;
      if (existing.length > 0) {
        return res.status(200).json({ listId: list.id, alreadyMember: true });
      }

      // Add as member
      await sql`
        INSERT INTO shopping_list_members (list_id, user_id)
        VALUES (${list.id}, ${userId})
      `;

      // If merging: copy unchecked items from old list, then delete old list
      if (mergeFromListId) {
        // Verify user owns the merge-from list
        const memberCheck = await sql`
          SELECT 1 FROM shopping_list_members
          WHERE list_id = ${mergeFromListId} AND user_id = ${userId}
          LIMIT 1
        `;
        if (memberCheck.length > 0) {
          // Copy unchecked items
          await sql`
            INSERT INTO shopping_list_items (list_id, entry_id, name, recipe_id, recipe_name, checked)
            SELECT ${list.id}, entry_id || '-merged', name, recipe_id, recipe_name, false
            FROM shopping_list_items
            WHERE list_id = ${mergeFromListId} AND checked = false
          `;

          // Check if old list has other members
          const oldMembers = await sql`
            SELECT COUNT(*)::int AS count FROM shopping_list_members
            WHERE list_id = ${mergeFromListId}
          `;
          if (oldMembers[0].count <= 1) {
            // Solo list — delete it (CASCADE removes items + membership)
            await sql`DELETE FROM shopping_lists WHERE id = ${mergeFromListId}`;
          } else {
            // Just remove this user from old list
            await sql`
              DELETE FROM shopping_list_members
              WHERE list_id = ${mergeFromListId} AND user_id = ${userId}
            `;
          }
        }
      }

      // Trigger Pusher event: member joined
      try {
        const pusher = getPusher();
        await pusher.trigger(`private-list-${list.id}`, 'member:joined', { userId });
      } catch (e) {
        console.error('Pusher trigger error (member:joined):', e.message);
      }

      return res.status(200).json({ listId: list.id, alreadyMember: false });
    }

    return res.status(405).end();
  } catch (err) {
    console.error('shopping-list-join error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
