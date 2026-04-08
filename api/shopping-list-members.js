import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';
import { getPusher } from './_lib/pusher.js';

/**
 * /api/shopping-list-members
 *
 * GET  ?listId=xxx  — Get members of a list
 * GET  ?token=xxx   — Get list info by invite token (for join screen)
 * POST              — Join a list { token, mergeFromListId? }
 * DELETE            — Remove a member (self = leave, other = remove)
 *                     Body: { listId, targetUserId }
 */
export default async function handler(req, res) {
  try {
    const userId = await getUserId(req);

    // ── GET: list members or list info by invite token ──
    if (req.method === 'GET') {
      const { listId, token } = req.query;

      // Join screen: get list info by invite token
      if (token) {
        const lists = await sql`
          SELECT id, name FROM shopping_lists WHERE invite_token = ${token}
        `;
        if (lists.length === 0) {
          return res.status(404).json({ error: 'List not found or link expired' });
        }
        const list = lists[0];

        const existing = await sql`
          SELECT 1 FROM shopping_list_members
          WHERE list_id = ${list.id} AND user_id = ${userId}
          LIMIT 1
        `;
        if (existing.length > 0) {
          return res.status(200).json({ list, alreadyMember: true });
        }

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

      // Members list: get members by listId
      if (!listId) return res.status(400).json({ error: 'listId or token required' });

      const check = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${userId}
        LIMIT 1
      `;
      if (check.length === 0) return res.status(403).json({ error: 'Not a member' });

      const [members, listInfo] = await Promise.all([
        sql`
          SELECT slm.user_id, slm.joined_at,
                 na.name AS user_name, na.email AS user_email
          FROM shopping_list_members slm
          LEFT JOIN neon_auth."user" na ON na.id::text = slm.user_id
          WHERE slm.list_id = ${listId}
          ORDER BY slm.joined_at ASC
        `,
        sql`SELECT invite_token FROM shopping_lists WHERE id = ${listId}`,
      ]);

      return res.status(200).json({
        members: members.map((m) => ({
          id: m.user_id,
          name: m.user_name || m.user_email || 'Unknown',
          isSelf: m.user_id === userId,
        })),
        inviteToken: listInfo[0]?.invite_token || null,
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

      const existing = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${list.id} AND user_id = ${userId}
        LIMIT 1
      `;
      if (existing.length > 0) {
        return res.status(200).json({ listId: list.id, alreadyMember: true });
      }

      await sql`
        INSERT INTO shopping_list_members (list_id, user_id)
        VALUES (${list.id}, ${userId})
      `;

      if (mergeFromListId) {
        const memberCheck = await sql`
          SELECT 1 FROM shopping_list_members
          WHERE list_id = ${mergeFromListId} AND user_id = ${userId}
          LIMIT 1
        `;
        if (memberCheck.length > 0) {
          await sql`
            INSERT INTO shopping_list_items (list_id, entry_id, name, recipe_id, recipe_name, checked)
            SELECT ${list.id}, entry_id || '-merged', name, recipe_id, recipe_name, false
            FROM shopping_list_items
            WHERE list_id = ${mergeFromListId} AND checked = false
          `;

          const oldMembers = await sql`
            SELECT COUNT(*)::int AS count FROM shopping_list_members
            WHERE list_id = ${mergeFromListId}
          `;
          if (oldMembers[0].count <= 1) {
            await sql`DELETE FROM shopping_lists WHERE id = ${mergeFromListId}`;
          } else {
            await sql`
              DELETE FROM shopping_list_members
              WHERE list_id = ${mergeFromListId} AND user_id = ${userId}
            `;
          }
        }
      }

      try {
        const pusher = getPusher();
        await pusher.trigger(`private-list-${list.id}`, 'member:joined', { userId });
      } catch (e) {
        console.error('Pusher trigger error (member:joined):', e.message);
      }

      return res.status(200).json({ listId: list.id, alreadyMember: false });
    }

    // ── DELETE: remove member (leave or kick) ──
    if (req.method === 'DELETE') {
      const { listId, targetUserId } = req.body ?? {};
      if (!listId || !targetUserId) {
        return res.status(400).json({ error: 'listId and targetUserId required' });
      }

      const check = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${userId}
        LIMIT 1
      `;
      if (check.length === 0) return res.status(403).json({ error: 'Not a member' });

      await sql`
        DELETE FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${targetUserId}
      `;

      const remaining = await sql`
        SELECT COUNT(*)::int AS count FROM shopping_list_members
        WHERE list_id = ${listId}
      `;

      if (remaining[0].count === 0) {
        await sql`DELETE FROM shopping_lists WHERE id = ${listId}`;
      }

      const socketId = req.headers['x-pusher-socket-id'] || null;
      const isSelf = targetUserId === userId;
      try {
        const pusher = getPusher();
        const event = isSelf ? 'member:left' : 'member:removed';
        await pusher.trigger(
          `private-list-${listId}`,
          event,
          { userId: targetUserId },
          { socket_id: socketId }
        );
      } catch (e) {
        console.error('Pusher trigger error (member remove):', e.message);
      }

      return res.status(200).json({ ok: true, listDeleted: remaining[0].count === 0 });
    }

    return res.status(405).end();
  } catch (err) {
    console.error('shopping-list-members error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
