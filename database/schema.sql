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

-- ── Shopping Lists (multi-list, no-ownership model) ─────────────────────────

-- Shopping lists: each list has an invite token for link sharing
CREATE TABLE IF NOT EXISTS shopping_lists (
  id           TEXT        PRIMARY KEY DEFAULT replace(gen_random_uuid()::text, '-', ''),
  name         TEXT        NOT NULL DEFAULT 'Einkaufsliste',
  invite_token TEXT        NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY sl_member_read ON shopping_lists
    FOR SELECT TO authenticated
    USING (id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.user_id()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY sl_token_read ON shopping_lists
    FOR SELECT TO authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY sl_member_update ON shopping_lists
    FOR UPDATE TO authenticated
    USING (id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.user_id()))
    WITH CHECK (id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.user_id()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Shopping list members: all members are equal (no owner concept)
CREATE TABLE IF NOT EXISTS shopping_list_members (
  list_id    TEXT        NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  user_id    TEXT        NOT NULL,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (list_id, user_id)
);

CREATE INDEX IF NOT EXISTS slm_user_id_idx ON shopping_list_members (user_id);

ALTER TABLE shopping_list_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY slm_member_read ON shopping_list_members
    FOR SELECT TO authenticated
    USING (list_id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.user_id()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY slm_member_insert ON shopping_list_members
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.user_id());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY slm_member_delete ON shopping_list_members
    FOR DELETE TO authenticated
    USING (user_id = auth.user_id());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Shopping list items: belongs to a list (not a user)
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id          BIGSERIAL   PRIMARY KEY,
  list_id     TEXT        NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  entry_id    TEXT        NOT NULL,
  name        TEXT        NOT NULL,
  recipe_id   TEXT,
  recipe_name TEXT,
  checked     BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS shopping_list_items_list_id_idx ON shopping_list_items (list_id);
CREATE UNIQUE INDEX IF NOT EXISTS shopping_list_items_list_entry_idx ON shopping_list_items (list_id, entry_id);

ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY shopping_list_items_member ON shopping_list_items
    FOR ALL TO authenticated
    USING (list_id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.user_id()))
    WITH CHECK (list_id IN (SELECT list_id FROM shopping_list_members WHERE user_id = auth.user_id()));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
