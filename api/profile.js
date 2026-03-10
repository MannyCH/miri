import { sql } from './_lib/db.js';
import { getUserId } from './_lib/auth.js';

export default async function handler(req, res) {
  let userId;
  try {
    userId = await getUserId(req.headers.authorization || req.headers.Authorization);
  } catch {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT * FROM user_preferences WHERE user_id = ${userId}
    `;
    return res.status(200).json({ ok: true, preferences: rows[0] ?? null });
  }

  if (req.method === 'POST') {
    const { servings, eatingStyle, goal, bmrKcal } = req.body ?? {};
    const rows = await sql`
      INSERT INTO user_preferences (user_id, servings, eating_style, goal, bmr_kcal)
      VALUES (
        ${userId},
        ${servings ?? 2},
        ${eatingStyle ?? null},
        ${goal ?? null},
        ${bmrKcal ?? null}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        servings     = EXCLUDED.servings,
        eating_style = EXCLUDED.eating_style,
        goal         = EXCLUDED.goal,
        bmr_kcal     = EXCLUDED.bmr_kcal,
        updated_at   = NOW()
      RETURNING *
    `;
    return res.status(200).json({ ok: true, preferences: rows[0] });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
