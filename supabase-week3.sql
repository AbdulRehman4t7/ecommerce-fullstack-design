-- Week 3: profiles, cart user_id, auth trigger
-- Run in Supabase SQL Editor after supabase-schema.sql

CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  email       TEXT UNIQUE NOT NULL,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone       TEXT,
  address     TEXT,
  city        TEXT,
  country     TEXT DEFAULT 'Pakistan',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin read all profiles" ON profiles;

CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Cart: link to authenticated users
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);

-- Unique per user (logged in)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_user_product
  ON cart_items(user_id, product_id) WHERE user_id IS NOT NULL;

DROP POLICY IF EXISTS "Session cart access" ON cart_items;
DROP POLICY IF EXISTS "User cart access" ON cart_items;

CREATE POLICY "User cart access" ON cart_items
  FOR ALL USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- Make yourself admin after signup:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@gmail.com';
