-- ============================================================
-- Supabase schema + seed for ecommerce-fullstack-design (Week 2)
-- Run in Supabase SQL Editor
-- ============================================================

-- TABLE 1: categories
CREATE TABLE IF NOT EXISTS categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT,
  parent_id   UUID REFERENCES categories(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 2: products
CREATE TABLE IF NOT EXISTS products (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  price           DECIMAL(10,2) NOT NULL,
  original_price  DECIMAL(10,2),
  min_order       INT DEFAULT 1,
  unit            TEXT DEFAULT 'piece',
  stock           INT DEFAULT 0,
  sold            INT DEFAULT 0,
  rating          DECIMAL(2,1) DEFAULT 0,
  reviews_count   INT DEFAULT 0,
  category_id     UUID REFERENCES categories(id),
  subcategory     TEXT,
  seller_name     TEXT,
  seller_country  TEXT,
  seller_flag     TEXT,
  free_shipping   BOOLEAN DEFAULT false,
  is_featured     BOOLEAN DEFAULT false,
  badge           TEXT CHECK (badge IN ('Hot', 'New', 'Sale', 'Verified')),
  images          TEXT[] DEFAULT '{}',
  specs           JSONB DEFAULT '[]',
  tags            TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE 3: cart_items
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  TEXT NOT NULL,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity    INT DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, product_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Session cart access" ON cart_items;

CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Session cart access" ON cart_items FOR ALL USING (true);

-- Allow service role full access (default); anon can read via policies above

-- ============================================================
-- SEED: Categories
-- ============================================================
INSERT INTO categories (name, slug, icon) VALUES
  ('Electronics', 'electronics', '💻'),
  ('Clothes', 'clothes', '👔'),
  ('Home & Garden', 'home-garden', '🌿'),
  ('Automobiles', 'automobiles', '🚗'),
  ('Beauty & Health', 'beauty-health', '💄'),
  ('Sports', 'sports', '⚽'),
  ('Toys', 'toys', '🧸'),
  ('Books', 'books', '📚')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Electronics (8 products)
-- ============================================================
INSERT INTO products (name, slug, description, price, original_price, min_order, unit, stock, sold, rating, reviews_count, category_id, subcategory, seller_name, seller_country, seller_flag, free_shipping, is_featured, badge, images, specs, tags)
SELECT
  v.name, v.slug, v.description, v.price, v.original_price, v.min_order, v.unit, v.stock, v.sold, v.rating, v.reviews_count,
  c.id, v.subcategory, v.seller_name, v.seller_country, v.seller_flag, v.free_shipping, v.is_featured, v.badge, v.images, v.specs::jsonb, v.tags
FROM (VALUES
  ('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Flagship smartphone with 200MP camera and S Pen support.', 1199.00, 1299.00, 1, 'piece', 120, 5400, 4.8, 2100, 'Phones', 'Shenzhen Mobile', 'China', '🇨🇳', true, true, 'Hot',
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=Samsung+S24'],
    '[{"key":"Brand","value":"Samsung"},{"key":"RAM","value":"12GB"}]', ARRAY['phone','samsung']),
  ('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Titanium design with A17 Pro chip and USB-C.', 1099.00, NULL, 1, 'piece', 80, 3200, 4.9, 1800, 'Phones', 'Apple Hub Trading', 'China', '🇨🇳', true, true, 'Verified',
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=iPhone+15'],
    '[{"key":"Brand","value":"Apple"},{"key":"Storage","value":"256GB"}]', ARRAY['iphone','apple']),
  ('MacBook Pro 14 M3', 'macbook-pro-14-m3', 'Professional laptop for creators and developers.', 1999.00, 2199.00, 1, 'piece', 45, 890, 4.7, 650, 'Laptops', 'Tech World Ltd', 'China', '🇨🇳', true, true, 'Sale',
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=MacBook+Pro'],
    '[{"key":"CPU","value":"M3 Pro"},{"key":"RAM","value":"18GB"}]', ARRAY['laptop','macbook']),
  ('Dell XPS 15 Laptop', 'dell-xps-15', 'Premium Windows laptop with OLED display option.', 1499.00, NULL, 1, 'piece', 60, 1200, 4.6, 430, 'Laptops', 'Computer World', 'China', '🇨🇳', true, false, NULL,
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=Dell+XPS'],
    '[{"key":"Brand","value":"Dell"},{"key":"Screen","value":"15.6 inch"}]', ARRAY['laptop','dell']),
  ('Canon EOS R6 Camera', 'canon-eos-r6', 'Full-frame mirrorless camera for photo and video.', 2499.00, 2699.00, 1, 'piece', 25, 340, 4.8, 210, 'Cameras', 'Optics Pro', 'Germany', '🇩🇪', true, false, 'Verified',
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=Canon+EOS'],
    '[{"key":"Sensor","value":"Full Frame"},{"key":"Video","value":"4K60"}]', ARRAY['camera','canon']),
  ('GoPro HERO12 Black', 'gopro-hero12', 'Action camera with HyperSmooth stabilization.', 399.00, 449.00, 1, 'piece', 200, 5600, 4.5, 890, 'Cameras', 'Action Gear Co', 'China', '🇨🇳', true, false, 'Sale',
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=GoPro'],
    '[{"key":"Resolution","value":"5.3K"},{"key":"Waterproof","value":"10m"}]', ARRAY['gopro','action']),
  ('Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5', 'Industry-leading noise cancelling over-ear headphones.', 348.00, NULL, 1, 'piece', 300, 8900, 4.9, 3200, 'Headphones', 'Audio Masters', 'Japan', '🇯🇵', true, true, 'Hot',
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=Sony+Headphones'],
    '[{"key":"ANC","value":"Yes"},{"key":"Battery","value":"30h"}]', ARRAY['headphones','sony']),
  ('JBL Flip 6 Bluetooth Speaker', 'jbl-flip-6', 'Portable waterproof speaker with bold sound.', 129.00, 149.00, 5, 'piece', 500, 12000, 4.4, 4500, 'Audio', 'Sound Wholesale', 'China', '🇨🇳', true, false, 'New',
    ARRAY['https://placehold.co/400x400/e8f4fd/0D6EFD?text=JBL+Speaker'],
    '[{"key":"Waterproof","value":"IP67"},{"key":"Power","value":"12W"}]', ARRAY['speaker','bluetooth'])
) AS v(name, slug, description, price, original_price, min_order, unit, stock, sold, rating, reviews_count, subcategory, seller_name, seller_country, seller_flag, free_shipping, is_featured, badge, images, specs, tags)
JOIN categories c ON c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Clothes (8 products)
-- ============================================================
INSERT INTO products (name, slug, description, price, original_price, min_order, unit, stock, sold, rating, reviews_count, category_id, subcategory, seller_name, seller_country, seller_flag, free_shipping, is_featured, badge, images, specs, tags)
SELECT
  v.name, v.slug, v.description, v.price, v.original_price, v.min_order, v.unit, v.stock, v.sold, v.rating, v.reviews_count,
  c.id, v.subcategory, v.seller_name, v.seller_country, v.seller_flag, v.free_shipping, v.is_featured, v.badge, v.images, v.specs::jsonb, v.tags
FROM (VALUES
  ('Mens Cotton T-Shirt Pack', 'mens-cotton-tshirt-pack', 'Soft cotton tees in assorted colors.', 19.00, 29.00, 10, 'piece', 2000, 15000, 4.5, 3200, 'Men', 'Fashion Textile', 'China', '🇨🇳', true, false, 'Sale',
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Mens+T-Shirt'],
    '[{"key":"Material","value":"Cotton"},{"key":"Sizes","value":"S-XXL"}]', ARRAY['tshirt','men']),
  ('Womens Summer Floral Dress', 'womens-floral-dress', 'Lightweight midi dress for summer events.', 35.00, NULL, 5, 'piece', 800, 4200, 4.6, 890, 'Women', 'Style House', 'China', '🇨🇳', true, true, 'New',
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Floral+Dress'],
    '[{"key":"Length","value":"Midi"},{"key":"Pattern","value":"Floral"}]', ARRAY['dress','women']),
  ('Slim Fit Denim Jeans', 'slim-fit-denim-jeans', 'Classic blue denim with stretch comfort.', 28.00, 39.00, 10, 'piece', 1500, 9800, 4.4, 2100, 'Men', 'Denim Factory', 'China', '🇨🇳', true, false, 'Sale',
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Denim+Jeans'],
    '[{"key":"Fit","value":"Slim"},{"key":"Wash","value":"Medium"}]', ARRAY['jeans','denim']),
  ('Leather Jacket Mens', 'leather-jacket-mens', 'Genuine leather biker style jacket.', 89.00, 120.00, 1, 'piece', 120, 650, 4.7, 340, 'Men', 'Leather Craft', 'Italy', '🇮🇹', true, true, 'Hot',
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Leather+Jacket'],
    '[{"key":"Material","value":"Leather"},{"key":"Lining","value":"Polyester"}]', ARRAY['jacket','leather']),
  ('Running Sneakers Unisex', 'running-sneakers-unisex', 'Breathable mesh sneakers for daily wear.', 45.00, NULL, 5, 'pair', 600, 7200, 4.5, 1800, 'Shoes', 'Shoe Export', 'China', '🇨🇳', true, false, NULL,
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Sneakers'],
    '[{"key":"Sole","value":"Rubber"},{"key":"Upper","value":"Mesh"}]', ARRAY['shoes','sneakers']),
  ('Canvas Tote Bag', 'canvas-tote-bag', 'Eco-friendly large capacity tote.', 12.00, 18.00, 20, 'piece', 3000, 22000, 4.3, 4100, 'Bags', 'Bag Makers', 'China', '🇨🇳', true, false, 'Sale',
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Tote+Bag'],
    '[{"key":"Material","value":"Canvas"}]', ARRAY['bag','tote']),
  ('Wool Winter Scarf', 'wool-winter-scarf', 'Soft wool blend scarf for cold weather.', 15.00, NULL, 10, 'piece', 900, 3400, 4.6, 560, 'Accessories', 'Warm Knit Co', 'China', '🇨🇳', true, false, NULL,
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Wool+Scarf'],
    '[{"key":"Material","value":"Wool Blend"}]', ARRAY['scarf','winter']),
  ('Kids Hooded Sweatshirt', 'kids-hooded-sweatshirt', 'Cozy fleece hoodie for children ages 4-12.', 14.50, NULL, 10, 'piece', 1200, 5600, 4.7, 780, 'Kids', 'Kids Wear', 'China', '🇨🇳', true, false, 'Verified',
    ARRAY['https://placehold.co/400x400/fff3e0/FF6600?text=Kids+Hoodie'],
    '[{"key":"Material","value":"Fleece"}]', ARRAY['kids','hoodie'])
) AS v(name, slug, description, price, original_price, min_order, unit, stock, sold, rating, reviews_count, subcategory, seller_name, seller_country, seller_flag, free_shipping, is_featured, badge, images, specs, tags)
JOIN categories c ON c.slug = 'clothes'
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED: Home & Garden (8 products)
-- ============================================================
INSERT INTO products (name, slug, description, price, original_price, min_order, unit, stock, sold, rating, reviews_count, category_id, subcategory, seller_name, seller_country, seller_flag, free_shipping, is_featured, badge, images, specs, tags)
SELECT
  v.name, v.slug, v.description, v.price, v.original_price, v.min_order, v.unit, v.stock, v.sold, v.rating, v.reviews_count,
  c.id, v.subcategory, v.seller_name, v.seller_country, v.seller_flag, v.free_shipping, v.is_featured, v.badge, v.images, v.specs::jsonb, v.tags
FROM (VALUES
  ('Modern Fabric Armchair', 'modern-fabric-armchair', 'Comfortable beige accent chair with black legs.', 199.00, 249.00, 1, 'piece', 80, 420, 4.6, 180, 'Furniture', 'Home Comfort', 'China', '🇨🇳', true, true, 'Hot',
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=Armchair'],
    '[{"key":"Material","value":"Fabric"},{"key":"Color","value":"Beige"}]', ARRAY['chair','furniture']),
  ('LED Desk Lamp Dimmable', 'led-desk-lamp', 'Adjustable LED lamp with touch dimmer.', 29.00, 39.00, 5, 'piece', 400, 2100, 4.5, 670, 'Lighting', 'Bright Home', 'China', '🇨🇳', true, false, 'Sale',
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=Desk+Lamp'],
    '[{"key":"Power","value":"12W LED"}]', ARRAY['lamp','led']),
  ('Ceramic Plant Pot Set', 'ceramic-plant-pot-set', 'Set of 3 terracotta-style indoor pots.', 25.00, NULL, 10, 'set', 600, 1800, 4.4, 320, 'Decor', 'Garden Decor', 'China', '🇨🇳', true, false, NULL,
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=Plant+Pots'],
    '[{"key":"Count","value":"3"}]', ARRAY['pot','decor']),
  ('Wooden Coffee Table', 'wooden-coffee-table', 'Minimal oak finish coffee table for living room.', 159.00, 199.00, 1, 'piece', 50, 290, 4.7, 140, 'Furniture', 'Wood Craft', 'China', '🇨🇳', true, false, 'Sale',
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=Coffee+Table'],
    '[{"key":"Material","value":"Wood"}]', ARRAY['table','furniture']),
  ('Stainless Steel Kettle', 'stainless-steel-kettle', 'Fast boil electric kettle 1.5L capacity.', 42.00, NULL, 5, 'piece', 350, 3400, 4.6, 890, 'Kitchen', 'Kitchen Pro', 'China', '🇨🇳', true, true, 'Verified',
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=Kettle'],
    '[{"key":"Capacity","value":"1.5L"}]', ARRAY['kettle','kitchen']),
  ('Wall Art Canvas Print', 'wall-art-canvas', 'Abstract landscape canvas ready to hang.', 35.00, 49.00, 1, 'piece', 200, 1100, 4.3, 450, 'Decor', 'Art Prints', 'China', '🇨🇳', true, false, NULL,
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=Wall+Art'],
    '[{"key":"Size","value":"60x90cm"}]', ARRAY['art','decor']),
  ('Bamboo Storage Basket', 'bamboo-storage-basket', 'Handwoven bamboo organizer basket.', 18.00, NULL, 10, 'piece', 700, 2900, 4.5, 520, 'Storage', 'Eco Home', 'China', '🇨🇳', true, false, 'New',
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=Basket'],
    '[{"key":"Material","value":"Bamboo"}]', ARRAY['basket','storage']),
  ('Outdoor Patio String Lights', 'patio-string-lights', 'Weatherproof LED string lights 10m.', 22.00, 32.00, 5, 'piece', 900, 4500, 4.4, 1200, 'Lighting', 'Outdoor Living', 'China', '🇨🇳', true, false, 'Sale',
    ARRAY['https://placehold.co/400x400/e8f5e9/28A745?text=String+Lights'],
    '[{"key":"Length","value":"10m"}]', ARRAY['lights','outdoor'])
) AS v(name, slug, description, price, original_price, min_order, unit, stock, sold, rating, reviews_count, subcategory, seller_name, seller_country, seller_flag, free_shipping, is_featured, badge, images, specs, tags)
JOIN categories c ON c.slug = 'home-garden'
ON CONFLICT (slug) DO NOTHING;
