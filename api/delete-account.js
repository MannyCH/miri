import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';

/**
 * POST /api/delete-account
 *
 * Deletes all app data for the authenticated user, then removes their
 * auth record from neon_auth."user". The Neon Auth hosted instance does
 * not expose the Better Auth /delete-user endpoint, so we handle deletion
 * server-side using the superuser DATABASE_URL connection.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const userId = await getUserId(req);

    // Delete app data — recipes cascade to recipe_ingredients automatically.
    await sql`DELETE FROM recipes WHERE user_id = ${userId}`;
    await sql`DELETE FROM user_preferences WHERE user_id = ${userId}`;
    await sql`DELETE FROM shopping_list_members WHERE user_id = ${userId}`;

    // Delete the auth user — sessions and accounts cascade from this table.
    await sql`DELETE FROM neon_auth."user" WHERE id = ${userId}`;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[delete-account]', err);
    return res.status(500).json({ error: 'Could not delete account.' });
  }
}
