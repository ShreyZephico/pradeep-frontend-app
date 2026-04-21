import fs from "node:fs";
import { Pool } from "pg";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!fs.existsSync(file)) {
      continue;
    }

    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separator = trimmed.indexOf("=");

      if (separator === -1) {
        continue;
      }

      const key = trimmed.slice(0, separator);
      const value = trimmed.slice(separator + 1).replace(/^['"]|['"]$/g, "");
      process.env[key] = process.env[key] ?? value;
    }
  }
}

loadEnv();

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-04";
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://zephico:zephico_password@localhost:5435/zephico_jewels";

if (!domain || !adminToken) {
  console.error(
    "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN in env."
  );
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

async function shopifyAdminFetch(query, variables = {}) {
  const response = await fetch(
    `https://${domain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const json = await response.json();

  if (!response.ok || json.errors) {
    throw new Error(JSON.stringify(json.errors ?? json, null, 2));
  }

  return json.data;
}

const PRODUCTS_QUERY = `
  query Products($cursor: String) {
    products(first: 100, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        handle
        description
        featuredMedia {
          preview {
            image {
              url
            }
          }
        }
        options {
          name
          values
        }
        variants(first: 250) {
          nodes {
            id
            price
            compareAtPrice
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductDbId(product) {
  return product.handle || slugify(product.title);
}

function getPrice(product) {
  return Math.round(Number(product.variants.nodes[0]?.price ?? 0));
}

function getCompareAtPrice(product, price) {
  const compareAt = Math.round(
    Number(product.variants.nodes[0]?.compareAtPrice ?? 0)
  );

  return compareAt > 0 ? compareAt : price;
}

async function fetchShopifyProducts() {
  const products = [];
  let cursor;

  do {
    const data = await shopifyAdminFetch(PRODUCTS_QUERY, { cursor });
    products.push(...data.products.nodes);
    cursor = data.products.pageInfo.endCursor;

    if (!data.products.pageInfo.hasNextPage) {
      break;
    }
  } while (cursor);

  return products;
}

async function ensureSchema() {
  await pool.query(
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS shopify_product_id TEXT UNIQUE`
  );
  await pool.query(
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS shopify_handle TEXT`
  );
}

async function syncProduct(product) {
  const id = getProductDbId(product);
  const price = getPrice(product);
  const compareAtPrice = getCompareAtPrice(product, price);
  const image = product.featuredMedia?.preview?.image?.url ?? "/products/ring-1.png";
  const variantId = product.variants.nodes[0]?.id ?? null;

  await pool.query(
    `UPDATE products
     SET shopify_product_id = $2,
         shopify_handle = $3
     WHERE id = $1
       AND shopify_product_id IS NULL`,
    [id, product.id, product.handle]
  );

  await pool.query(
    `INSERT INTO products (
      id,
      shopify_product_id,
      shopify_handle,
      name,
      description,
      price,
      compare_at_price,
      image,
      variant_id,
      badge,
      customizable
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NULL,FALSE)
    ON CONFLICT (shopify_product_id) DO UPDATE SET
      id = EXCLUDED.id,
      shopify_handle = EXCLUDED.shopify_handle,
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      compare_at_price = EXCLUDED.compare_at_price,
      image = EXCLUDED.image,
      variant_id = EXCLUDED.variant_id`,
    [
      id,
      product.id,
      product.handle,
      product.title,
      product.description || "Hand-finished gold and diamond detail",
      price,
      compareAtPrice,
      image,
      variantId,
    ]
  );

  await pool.query("DELETE FROM product_options WHERE product_id = $1", [id]);

  const realOptions = product.options.filter(
    (option) =>
      !(
        option.name === "Title" &&
        option.values.length === 1 &&
        option.values[0] === "Default Title"
      )
  );

  for (const [optionIndex, option] of realOptions.entries()) {
    const normalizedOptionName = option.name.toLowerCase();
    const optionType = normalizedOptionName.includes("size")
      ? "ring_size"
      : normalizedOptionName.includes("diamond")
        ? "diamond_quality"
        : normalizedOptionName.includes("carat")
          ? "carat"
          : "metal";

    for (const [valueIndex, value] of option.values.entries()) {
      await pool.query(
        `INSERT INTO product_options (
          product_id,
          option_type,
          option_label,
          option_note,
          size_mm,
          price_adjustment,
          display_order
        )
        VALUES ($1,$2,$3,'', $4, 0, $5)`,
        [
          id,
          optionType,
          value,
          optionType === "ring_size" ? value : null,
          optionIndex * 100 + valueIndex + 1,
        ]
      );
    }
  }

  await pool.query("DELETE FROM product_shopify_variants WHERE product_id = $1", [
    id,
  ]);

  for (const variant of product.variants.nodes) {
    const signature = variant.selectedOptions
      .map((option) => `${option.name}:${option.value}`)
      .join("|");

    await pool.query(
      `INSERT INTO product_shopify_variants (
        product_id,
        option_signature,
        shopify_variant_id
      )
      VALUES ($1,$2,$3)
      ON CONFLICT (product_id, option_signature) DO UPDATE SET
        shopify_variant_id = EXCLUDED.shopify_variant_id`,
      [id, signature || "Default Title:Default Title", variant.id]
    );
  }

  console.log(`synced Shopify -> DB: ${product.title} -> ${id}`);
}

async function main() {
  await ensureSchema();

  const products = await fetchShopifyProducts();
  const shopifyIds = products.map((product) => product.id);

  for (const product of products) {
    await syncProduct(product);
  }

  await pool.query(
    `DELETE FROM products
     WHERE shopify_product_id IS NULL
        OR NOT (shopify_product_id = ANY($1))`,
    [shopifyIds]
  );

  console.log(`Shopify products synced into DB: ${products.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
