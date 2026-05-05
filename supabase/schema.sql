-- CMS State (storefront — one row for the entire site config)
CREATE TABLE IF NOT EXISTS cms_state (
  id text PRIMARY KEY DEFAULT 'storefront',
  state jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Orders log
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security (open read/write via anon key — admin protected at app level)
ALTER TABLE cms_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_cms" ON cms_state;
DROP POLICY IF EXISTS "allow_all_orders" ON orders;

CREATE POLICY "allow_all_cms"    ON cms_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_orders" ON orders    FOR ALL USING (true) WITH CHECK (true);

-- One-time migration from the previous singleton key to the live storefront key.
INSERT INTO cms_state (id, state, updated_at)
SELECT 'storefront', state, now()
FROM cms_state
WHERE id = 'singleton'
ON CONFLICT (id) DO NOTHING;

-- Required for the storefront to receive Admin Matrix changes instantly.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE cms_state;
EXCEPTION
  WHEN duplicate_object OR undefined_object THEN NULL;
END $$;
