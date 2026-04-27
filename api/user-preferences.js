import { getUserId } from './_lib/auth.js';
import { sql } from './_lib/db.js';

export default async function handler(req, res) {
  if (!['GET', 'PUT'].includes(req.method)) return res.status(405).end();

  try {
    const userId = await getUserId(req);

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM user_preferences WHERE user_id = ${userId} LIMIT 1
      `;
      return res.status(200).json(rows[0] ?? null);
    }

    if (req.method === 'PUT') {
      const {
        servings, eatingStyle, goal, bmrKcal,
        cookingFrequency, unitSystem, onboardedAt,
      } = req.body ?? {};

      const rows = await sql`
        INSERT INTO user_preferences
          (user_id, servings, eating_style, goal, bmr_kcal, cooking_frequency, unit_system, onboarded_at, updated_at)
        VALUES
          (${userId}, ${servings ?? 2}, ${eatingStyle ?? null}, ${goal ?? null},
           ${bmrKcal ?? null}, ${cookingFrequency ?? 'daily'}, ${unitSystem ?? 'metric'},
           ${onboardedAt ?? null}, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          servings        = EXCLUDED.servings,
          eating_style    = EXCLUDED.eating_style,
          goal            = EXCLUDED.goal,
          bmr_kcal        = EXCLUDED.bmr_kcal,
          cooking_frequency = EXCLUDED.cooking_frequency,
          unit_system     = EXCLUDED.unit_system,
          onboarded_at    = COALESCE(EXCLUDED.onboarded_at, user_preferences.onboarded_at),
          updated_at      = NOW()
        RETURNING *
      `;
      return res.status(200).json(rows[0]);
    }
  } catch (err) {
    console.error('[user-preferences]', err);
    return res.status(500).json({ error: err.message });
  }
}
