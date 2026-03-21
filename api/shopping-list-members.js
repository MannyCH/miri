import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';
import { getPusher } from './_lib/pusher.js';

/**
 * /api/shopping-list-members
 *
 * GET    — Get members of a list  ?listId=xxx
 * DELETE — Remove a member (self = leave, other = remove)
 *          Body: { listId, targetUserId }
 */
export default async function handler(req, res) {
  try {
    const userId = await getUserId(req);

    // ── GET: list members ──
    if (req.method === 'GET') {
      const { listId } = req.query;
      if (!listId) return res.status(400).json({ error: 'listId required' });

      // Verify membership
      const check = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${userId}
        LIMIT 1
      `;
      if (check.length === 0) return res.status(403).json({ error: 'Not a member' });

      const members = await sql`
        SELECT slm.user_id, slm.joined_at,
               na.name AS user_name, na.email AS user_email
        FROM shopping_list_members slm
        LEFT JOIN neon_auth."user" na ON na.id::text = slm.user_id
        WHERE slm.list_id = ${listId}
        ORDER BY slm.joined_at ASC
      `;

      return res.status(200).json({
        members: members.map((m) => ({
          id: m.user_id,
          name: m.user_name || m.user_email || 'Unknown',
          isSelf: m.user_id === userId,
        })),
      });
    }

    // ── DELETE: remove member (leave or kick) ──
    if (req.method === 'DELETE') {
      const { listId, targetUserId } = req.body ?? {};
      if (!listId || !targetUserId) {
        return res.status(400).json({ error: 'listId and targetUserId required' });
      }

      // Verify caller is a member
      const check = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${userId}
        LIMIT 1
      `;
      if (check.length === 0) return res.status(403).json({ error: 'Not a member' });

      // Remove target member
      await sql`
        DELETE FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${targetUserId}
      `;

      // Check remaining members
      const remaining = await sql`
        SELECT COUNT(*)::int AS count FROM shopping_list_members
        WHERE list_id = ${listId}
      `;

      if (remaining[0].count === 0) {
        // Last person left — delete the list entirely
        await sql`DELETE FROM shopping_lists WHERE id = ${listId}`;
      }

      // Trigger Pusher event
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
