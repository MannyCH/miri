import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';
import { getPusher } from './_lib/pusher.js';

/**
 * /api/shopping-list-items
 *
 * GET    — Fetch all items for a list  ?listId=xxx
 * POST   — Add item { listId, entryId, name, recipeId?, recipeName? }
 * PATCH  — Toggle checked { listId, entryId, checked }
 * DELETE — Remove item { listId, entryId }
 */
export default async function handler(req, res) {
  try {
    const userId = await getUserId(req);

    // Helper: verify user is a member of the list
    async function verifyMembership(listId) {
      const rows = await sql`
        SELECT 1 FROM shopping_list_members
        WHERE list_id = ${listId} AND user_id = ${userId}
        LIMIT 1
      `;
      return rows.length > 0;
    }

    const socketId = req.headers['x-pusher-socket-id'] || null;

    // Helper: trigger Pusher event (must await so serverless doesn't kill before send)
    async function triggerEvent(listId, event, data) {
      try {
        const pusher = getPusher();
        await pusher.trigger(`private-list-${listId}`, event, data, { socket_id: socketId });
      } catch (e) {
        console.error(`Pusher trigger error (${event}):`, e.message);
      }
    }

    // ── GET: fetch items ──
    if (req.method === 'GET') {
      const listId = req.query.listId;
      if (!listId) return res.status(400).json({ error: 'listId required' });
      if (!(await verifyMembership(listId))) return res.status(403).json({ error: 'Not a member' });

      const items = await sql`
        SELECT entry_id, name, recipe_id, recipe_name, checked, created_at
        FROM shopping_list_items
        WHERE list_id = ${listId}
        ORDER BY created_at ASC
      `;
      return res.status(200).json({ items });
    }

    // ── POST: add item ──
    if (req.method === 'POST') {
      const { listId, entryId, name, recipeId = null, recipeName = null } = req.body ?? {};
      if (!listId || !entryId || !name) {
        return res.status(400).json({ error: 'listId, entryId, and name required' });
      }
      if (!(await verifyMembership(listId))) return res.status(403).json({ error: 'Not a member' });

      await sql`
        INSERT INTO shopping_list_items (list_id, entry_id, name, recipe_id, recipe_name)
        VALUES (${listId}, ${entryId}, ${name}, ${recipeId}, ${recipeName})
        ON CONFLICT (list_id, entry_id) DO NOTHING
      `;

      await triggerEvent(listId, 'item:added', { entryId, name, checked: false, recipeId, recipeName });
      return res.status(201).json({ ok: true });
    }

    // ── PATCH: toggle checked ──
    if (req.method === 'PATCH') {
      const { listId, entryId, checked } = req.body ?? {};
      if (!listId || !entryId || typeof checked !== 'boolean') {
        return res.status(400).json({ error: 'listId, entryId, and checked (boolean) required' });
      }
      if (!(await verifyMembership(listId))) return res.status(403).json({ error: 'Not a member' });

      await sql`
        UPDATE shopping_list_items
        SET checked = ${checked}, updated_at = NOW()
        WHERE list_id = ${listId} AND entry_id = ${entryId}
      `;

      await triggerEvent(listId, 'item:updated', { entryId, checked });
      return res.status(200).json({ ok: true });
    }

    // ── DELETE: remove item ──
    if (req.method === 'DELETE') {
      const { listId, entryId } = req.body ?? {};
      if (!listId || !entryId) return res.status(400).json({ error: 'listId and entryId required' });
      if (!(await verifyMembership(listId))) return res.status(403).json({ error: 'Not a member' });

      await sql`
        DELETE FROM shopping_list_items
        WHERE list_id = ${listId} AND entry_id = ${entryId}
      `;

      await triggerEvent(listId, 'item:removed', { entryId });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();
  } catch (err) {
    console.error('shopping-list-items error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
