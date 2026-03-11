CREATE TABLE IF NOT EXISTS user_preferences (
  user_id      TEXT        PRIMARY KEY,
  servings     INTEGER     NOT NULL DEFAULT 2,
  eating_style TEXT,
  goal         TEXT,
  bmr_kcal     INTEGER,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security: users can only access their own preferences.
-- Requires Neon Data API to be enabled first (provides the auth.user_id() function).
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY user_preferences_own ON user_preferences
    FOR ALL TO authenticated
    USING (auth.user_id() = user_id)
    WITH CHECK (auth.user_id() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
