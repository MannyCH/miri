-- Recipes: user-created/imported recipes
CREATE TABLE IF NOT EXISTS recipes (
  id          TEXT        PRIMARY KEY,
  user_id     TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  categories  JSONB       NOT NULL DEFAULT '[]'::jsonb,
  image_url   TEXT,
  servings    INTEGER     NOT NULL DEFAULT 2,
  directions  JSONB       NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON recipes (user_id);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY recipes_own ON recipes
    FOR ALL TO authenticated
    USING (auth.user_id() = user_id)
    WITH CHECK (auth.user_id() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Recipe ingredients: normalized ingredient rows per recipe
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id          BIGSERIAL   PRIMARY KEY,
  recipe_id   TEXT        NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  amount      TEXT,
  unit        TEXT,
  sort_order  INTEGER     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS recipe_ingredients_recipe_id_idx ON recipe_ingredients (recipe_id);

ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY recipe_ingredients_own ON recipe_ingredients
    FOR ALL TO authenticated
    USING (recipe_id IN (SELECT id FROM recipes WHERE user_id = auth.user_id()))
    WITH CHECK (recipe_id IN (SELECT id FROM recipes WHERE user_id = auth.user_id()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── User preferences ──────────────────────────────────────────────────────

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
