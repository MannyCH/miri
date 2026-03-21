import { getUserId } from './_lib/auth.js';
import { getPusher } from './_lib/pusher.js';
import { sql } from './_lib/db.js';

/**
 * POST /api/pusher-auth
 * Authorizes a client to subscribe to a private Pusher channel.
 * Verifies JWT + checks list membership before returning signed auth token.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const userId = await getUserId(req);
    const { socket_id, channel_name } = req.body;

    if (!socket_id || !channel_name) {
      return res.status(400).json({ error: 'socket_id and channel_name required' });
    }

    // Parse list ID from channel name (private-list-{listId})
    const match = channel_name.match(/^private-list-(.+)$/);
    if (!match) {
      return res.status(403).json({ error: 'Invalid channel name' });
    }
    const listId = match[1];

    // Check membership
    const rows = await sql`
      SELECT 1 FROM shopping_list_members
      WHERE list_id = ${listId} AND user_id = ${userId}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized for this channel' });
    }

    const pusher = getPusher();
    const authResponse = pusher.authorizeChannel(socket_id, channel_name);
    return res.status(200).json(authResponse);
  } catch (err) {
    console.error('pusher-auth error:', err.message);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
