/**
 * Run this script AFTER enabling the Neon Data API in the Neon Console.
 * The Data API must be enabled first because it installs the auth.user_id()
 * function that the RLS policy depends on.
 *
 * Usage: node database/migrate-rls.js
 */
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

await sql`ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY`;

await sql`
  DO $$ BEGIN
    CREATE POLICY user_preferences_own ON user_preferences
      FOR ALL TO authenticated
      USING (auth.user_id() = user_id)
      WITH CHECK (auth.user_id() = user_id);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$
`;

console.log('RLS migration complete.');
