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

-- ── Shopping list items ───────────────────────────────────────────────────
-- Note: this table pre-existed; updated_at was added for live sync.

CREATE TABLE IF NOT EXISTS shopping_list_items (
  id          BIGSERIAL   PRIMARY KEY,
  user_id     TEXT        NOT NULL,
  entry_id    TEXT,
  item_id     TEXT,
  name        TEXT        NOT NULL,
  recipe_id   TEXT,
  recipe_name TEXT,
  checked     BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS shopping_list_items_updated_idx ON shopping_list_items (user_id, updated_at);

ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

-- Owners can do everything on their own items
CREATE POLICY shopping_list_items_access ON shopping_list_items
  FOR SELECT TO authenticated
  USING (
    user_id = auth.user_id()
    OR user_id IN (
      SELECT owner_id FROM shopping_list_shares
      WHERE invitee_id = auth.user_id() AND status = 'accepted'
    )
  );

-- Owners and accepted shared members can update (e.g. check/uncheck)
CREATE POLICY shopping_list_items_shared_update ON shopping_list_items
  FOR UPDATE TO authenticated
  USING (
    user_id = auth.user_id()
    OR user_id IN (
      SELECT owner_id FROM shopping_list_shares
      WHERE invitee_id = auth.user_id() AND status = 'accepted'
    )
  )
  WITH CHECK (
    user_id = auth.user_id()
    OR user_id IN (
      SELECT owner_id FROM shopping_list_shares
      WHERE invitee_id = auth.user_id() AND status = 'accepted'
    )
  );

-- Only owner can insert/delete
CREATE POLICY shopping_list_items_own_write ON shopping_list_items
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.user_id());

CREATE POLICY shopping_list_items_own_delete ON shopping_list_items
  FOR DELETE TO authenticated
  USING (user_id = auth.user_id());

-- ── Shopping list shares ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shopping_list_shares (
  id            BIGSERIAL   PRIMARY KEY,
  owner_id      TEXT        NOT NULL,
  invitee_email TEXT        NOT NULL,
  invitee_id    TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending',
  token         TEXT        NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (owner_id, invitee_email)
);

ALTER TABLE shopping_list_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY shopping_list_shares_access ON shopping_list_shares
  FOR ALL TO authenticated
  USING (owner_id = auth.user_id() OR invitee_id = auth.user_id());

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
