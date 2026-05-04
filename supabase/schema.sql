-- CMS State (singleton — one row for the entire site config)
CREATE TABLE IF NOT EXISTS cms_state (
  id text PRIMARY KEY DEFAULT 'singleton',
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

CREATE POLICY "allow_all_cms"    ON cms_state FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_orders" ON orders    FOR ALL USING (true) WITH CHECK (true);
