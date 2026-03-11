import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS user_preferences (
    user_id      TEXT        PRIMARY KEY,
    servings     INTEGER     NOT NULL DEFAULT 2,
    eating_style TEXT,
    goal         TEXT,
    bmr_kcal     INTEGER,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

console.log('Migration complete.');
