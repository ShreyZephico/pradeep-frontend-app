CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT 'Hand-finished gold and diamond detail',
  price INTEGER NOT NULL,
  compare_at_price INTEGER NOT NULL,
  image TEXT NOT NULL,
  variant_id TEXT,
  badge TEXT,
  customizable BOOLEAN NOT NULL DEFAULT FALSE,
  metal_options JSONB,
  carat_options JSONB,
  diamond_qualities JSONB,
  size_options JSONB
);

ALTER TABLE products
ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT 'Hand-finished gold and diamond detail';

ALTER TABLE products ADD COLUMN IF NOT EXISTS carat_options JSONB;

ALTER TABLE products ADD COLUMN IF NOT EXISTS shopify_product_id TEXT UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shopify_handle TEXT;

CREATE TABLE IF NOT EXISTS product_options (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL CHECK (
    option_type IN ('metal', 'carat', 'diamond_quality', 'ring_size')
  ),
  option_label TEXT NOT NULL,
  option_note TEXT NOT NULL DEFAULT '',
  size_mm TEXT,
  price_adjustment INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_option_types (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  shopify_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_option_values (
  id SERIAL PRIMARY KEY,
  option_type_id INTEGER NOT NULL REFERENCES product_option_types(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  price_adjustment INTEGER NOT NULL DEFAULT 0,
  sku_suffix TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (option_type_id, value)
);

CREATE TABLE IF NOT EXISTS product_option_assignments (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_value_id INTEGER NOT NULL REFERENCES product_option_values(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, option_value_id)
);

CREATE TABLE IF NOT EXISTS product_shopify_variants (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_signature TEXT NOT NULL,
  shopify_variant_id TEXT NOT NULL,
  PRIMARY KEY (product_id, option_signature)
);

INSERT INTO products (
  id,
  name,
  description,
  price,
  compare_at_price,
  image,
  variant_id,
  badge,
  customizable,
  metal_options,
  carat_options,
  diamond_qualities,
  size_options
) VALUES
(
  'ray-of-infinite-diamond-ring',
  'Aurora Curve Diamond Ring',
  'Sculptural diamond ring with warm gold finishing and custom sizing options.',
  12342,
  15146,
  '/products/ring-1.png',
  'gid://shopify/ProductVariant/44504035393671',
  NULL,
  TRUE,
  '[{"label":"14 KT Yellow Gold","note":"Only 3 left!"},{"label":"18 KT Yellow Gold","note":"Made to Order"}]',
  '[{"label":"0.25 ct","note":"Subtle everyday sparkle"},{"label":"0.50 ct","note":"Most loved"},{"label":"0.75 ct","note":"Made to Order"}]',
  '[{"label":"IJ-SI","note":"Only 2 left!"},{"label":"FG-SI","note":"Only 3 left!"}]',
  '[{"size":"5","mm":"44.8 mm","note":"Made to Order"},{"size":"6","mm":"45.9 mm","note":"Only 5 left!"},{"size":"7","mm":"47.1 mm","note":"Made to Order"},{"size":"8","mm":"48.1 mm","note":"Only 2 left!"},{"size":"9","mm":"49.0 mm","note":"In Stock"},{"size":"10","mm":"50.0 mm","note":"Only 4 left!"}]'
),
(
  'classy-knot-diamond-ring',
  'Luna Knot Gold Ring',
  'A soft knot-inspired gold ring designed for everyday stacking.',
  12170,
  14924,
  '/products/ring-2.png',
  'gid://shopify/ProductVariant/44504036081799',
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'twight-twirl-diamond-ring',
  'Celeste Wave Diamond Ring',
  'Wave-shaped diamond ring with a polished gold profile.',
  12675,
  15689,
  '/products/ring-3.png',
  'gid://shopify/ProductVariant/44504035623047',
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'sunshine-diamond-band',
  'Solstice Minimal Diamond Band',
  'Minimal diamond band with a quiet, refined gold finish.',
  12162,
  14719,
  '/products/ring-4.png',
  'gid://shopify/ProductVariant/44504037359751',
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'swirly-flip-diamond-ring',
  'Marigold Halo Diamond Ring',
  'Slim halo-inspired diamond ring made for subtle daily shine.',
  55970,
  65523,
  '/products/ring-5.png',
  'gid://shopify/ProductVariant/44504036311175',
  'LATEST',
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'opal-dawn-diamond-ring',
  'Opal Dawn Diamond Ring',
  'Delicate diamond ring with a soft dawn-inspired gold curve.',
  18340,
  21990,
  '/products/ring-1.png',
  'gid://shopify/ProductVariant/44504036802695',
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'noor-thread-gold-ring',
  'Noor Thread Gold Ring',
  'Thread-like gold ring with a light, graceful silhouette.',
  14280,
  17440,
  '/products/ring-2.png',
  'gid://shopify/ProductVariant/44504036540551',
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'aurelia-drop-diamond-ring',
  'Aurelia Drop Diamond Ring',
  'Drop-inspired diamond ring with a polished statement setting.',
  23650,
  28120,
  '/products/ring-3.png',
  'gid://shopify/ProductVariant/44504027791495',
  'NEW',
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'serene-stack-diamond-band',
  'Serene Stack Diamond Band',
  'Stackable diamond band designed for clean everyday styling.',
  16490,
  19890,
  '/products/ring-4.png',
  'gid://shopify/ProductVariant/44504037032071',
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
),
(
  'iris-orbit-gold-ring',
  'Iris Orbit Gold Ring',
  'Orbit-inspired gold ring with a sculptural jewellery profile.',
  30990,
  36800,
  '/products/ring-5.png',
  'gid://shopify/ProductVariant/44504035852423',
  NULL,
  FALSE,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  image = EXCLUDED.image,
  variant_id = EXCLUDED.variant_id,
  badge = EXCLUDED.badge,
  customizable = EXCLUDED.customizable,
  metal_options = EXCLUDED.metal_options,
  carat_options = EXCLUDED.carat_options,
  diamond_qualities = EXCLUDED.diamond_qualities,
  size_options = EXCLUDED.size_options;

DELETE FROM product_options WHERE product_id = 'ray-of-infinite-diamond-ring';

INSERT INTO product_options (
  product_id,
  option_type,
  option_label,
  option_note,
  size_mm,
  price_adjustment,
  display_order
) VALUES
  ('ray-of-infinite-diamond-ring', 'metal', '14 KT Yellow Gold', 'Only 3 left!', NULL, 0, 1),
  ('ray-of-infinite-diamond-ring', 'metal', '18 KT Yellow Gold', 'Made to Order', NULL, 2200, 2),
  ('ray-of-infinite-diamond-ring', 'carat', '0.25 ct', 'Subtle everyday sparkle', NULL, 0, 1),
  ('ray-of-infinite-diamond-ring', 'carat', '0.50 ct', 'Most loved', NULL, 6500, 2),
  ('ray-of-infinite-diamond-ring', 'carat', '0.75 ct', 'Made to Order', NULL, 12500, 3),
  ('ray-of-infinite-diamond-ring', 'diamond_quality', 'IJ-SI', 'Only 2 left!', NULL, 0, 1),
  ('ray-of-infinite-diamond-ring', 'diamond_quality', 'FG-SI', 'Only 3 left!', NULL, 1800, 2),
  ('ray-of-infinite-diamond-ring', 'ring_size', '5', 'Made to Order', '44.8 mm', 0, 1),
  ('ray-of-infinite-diamond-ring', 'ring_size', '6', 'Only 5 left!', '45.9 mm', 0, 2),
  ('ray-of-infinite-diamond-ring', 'ring_size', '7', 'Made to Order', '47.1 mm', 600, 3),
  ('ray-of-infinite-diamond-ring', 'ring_size', '8', 'Only 2 left!', '48.1 mm', 600, 4),
  ('ray-of-infinite-diamond-ring', 'ring_size', '9', 'In Stock', '49.0 mm', 1200, 5),
  ('ray-of-infinite-diamond-ring', 'ring_size', '10', 'Only 4 left!', '50.0 mm', 1200, 6);

INSERT INTO product_option_types (code, shopify_name, display_order) VALUES
  ('material', 'Jewelry material', 1)
ON CONFLICT (code) DO UPDATE SET
  shopify_name = EXCLUDED.shopify_name,
  display_order = EXCLUDED.display_order;

INSERT INTO product_option_values (
  option_type_id,
  value,
  price_adjustment,
  sku_suffix,
  display_order
)
SELECT option_type.id, value.name, value.price_adjustment, value.sku_suffix, value.display_order
FROM product_option_types option_type
CROSS JOIN (
  VALUES
    ('Gold', 0, 'gold', 1),
    ('Rose Gold', 0, 'rose-gold', 2)
) AS value(name, price_adjustment, sku_suffix, display_order)
WHERE option_type.code = 'material'
ON CONFLICT (option_type_id, value) DO UPDATE SET
  price_adjustment = EXCLUDED.price_adjustment,
  sku_suffix = EXCLUDED.sku_suffix,
  display_order = EXCLUDED.display_order;

INSERT INTO product_option_assignments (product_id, option_value_id)
SELECT product.id, option_value.id
FROM products product
CROSS JOIN product_option_values option_value
JOIN product_option_types option_type ON option_type.id = option_value.option_type_id
WHERE option_type.code = 'material'
ON CONFLICT (product_id, option_value_id) DO NOTHING;
