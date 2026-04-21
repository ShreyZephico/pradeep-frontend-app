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

const args = new Set(process.argv.slice(2));
const shouldApply = args.has("--apply");
const productFilter = process.argv
  .slice(2)
  .find((argument) => argument.startsWith("--product="))
  ?.split("=")[1];
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

const PRODUCT_BY_TITLE_QUERY = `
  query ProductByTitle($query: String!) {
    products(first: 1, query: $query) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

const PRODUCT_SET_MUTATION = `
  mutation ProductSet(
    $identifier: ProductSetIdentifiers
    $input: ProductSetInput!
    $synchronous: Boolean!
  ) {
    productSet(
      identifier: $identifier
      input: $input
      synchronous: $synchronous
    ) {
      product {
        id
        title
        handle
        variants(first: 250) {
          nodes {
            id
            title
            selectedOptions {
              name
              value
            }
          }
        }
      }
      productSetOperation {
        id
        status
        userErrors {
          field
          message
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

function escapeTitleQuery(title) {
  return title.replaceAll("'", "\\'");
}

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatMoney(value) {
  return String(Number(value).toFixed(2));
}

function getOptionSignature(optionValues) {
  return optionValues
    .map((option) => `${option.optionName}:${option.name}`)
    .join("|");
}

function cartesianProduct(optionGroups) {
  return optionGroups.reduce(
    (combinations, optionGroup) =>
      combinations.flatMap((combination) =>
        optionGroup.values.map((value) => [
          ...combination,
          {
            optionName: optionGroup.shopifyName,
            name: value.value,
            priceAdjustment: value.priceAdjustment,
            skuSuffix: value.skuSuffix ?? slugify(value.value),
          },
        ])
      ),
    [[]]
  );
}

async function findShopifyProduct(title) {
  const data = await shopifyAdminFetch(PRODUCT_BY_TITLE_QUERY, {
    query: `title:'${escapeTitleQuery(title)}'`,
  });
  const product = data.products.edges[0]?.node;

  if (!product || product.title !== title) {
    return null;
  }

  return product;
}

async function getProductsFromDatabase() {
  const filterSql = productFilter ? "WHERE product.id = $1" : "";
  const params = productFilter ? [productFilter] : [];
  const { rows } = await pool.query(
    `SELECT
      product.id,
      product.name,
      product.description,
      product.price,
      product.compare_at_price,
      option_type.code AS option_type_code,
      option_type.shopify_name,
      option_type.display_order AS option_type_order,
      option_value.value AS option_value,
      option_value.price_adjustment,
      option_value.sku_suffix,
      option_value.display_order AS option_value_order
    FROM products product
    LEFT JOIN product_option_assignments assignment
      ON assignment.product_id = product.id
    LEFT JOIN product_option_values option_value
      ON option_value.id = assignment.option_value_id
    LEFT JOIN product_option_types option_type
      ON option_type.id = option_value.option_type_id
    ${filterSql}
    ORDER BY
      product.name ASC,
      option_type.display_order ASC,
      option_value.display_order ASC`,
    params
  );
  const products = new Map();

  for (const row of rows) {
    if (!products.has(row.id)) {
      products.set(row.id, {
        id: row.id,
        name: row.name,
        description: row.description,
        price: Number(row.price),
        compareAtPrice: Number(row.compare_at_price),
        optionGroups: new Map(),
      });
    }

    if (!row.option_type_code) {
      continue;
    }

    const product = products.get(row.id);

    if (!product.optionGroups.has(row.option_type_code)) {
      product.optionGroups.set(row.option_type_code, {
        code: row.option_type_code,
        shopifyName: row.shopify_name,
        order: row.option_type_order,
        values: [],
      });
    }

    product.optionGroups.get(row.option_type_code).values.push({
      value: row.option_value,
      priceAdjustment: Number(row.price_adjustment),
      skuSuffix: row.sku_suffix,
      order: row.option_value_order,
    });
  }

  return [...products.values()].map((product) => ({
    ...product,
    optionGroups: [...product.optionGroups.values()]
      .sort((a, b) => a.order - b.order)
      .map((optionGroup) => ({
        ...optionGroup,
        values: optionGroup.values.sort((a, b) => a.order - b.order),
      })),
  }));
}

function buildProductSetInput(product) {
  if (product.optionGroups.length > 3) {
    throw new Error(
      `${product.name} has ${product.optionGroups.length} option groups. Shopify allows a maximum of 3.`
    );
  }

  const optionGroups =
    product.optionGroups.length > 0
      ? product.optionGroups
      : [
          {
            shopifyName: "Title",
            values: [{ value: "Default Title", priceAdjustment: 0 }],
          },
        ];
  const combinations = cartesianProduct(optionGroups);

  if (combinations.length > 2048) {
    throw new Error(
      `${product.name} would create ${combinations.length} variants. Shopify allows a maximum of 2048.`
    );
  }

  return {
    title: product.name,
    handle: product.id,
    descriptionHtml: `<p>${htmlEscape(product.description)}</p>`,
    vendor: "Zephico",
    productType: "Jewellery",
    status: "ACTIVE",
    tags: ["zephico-db-sync"],
    productOptions: optionGroups.map((optionGroup, index) => ({
      name: optionGroup.shopifyName,
      position: index + 1,
      values: optionGroup.values.map((value) => ({
        name: value.value,
      })),
    })),
    variants: combinations.map((combination, index) => {
      const priceAdjustment = combination.reduce(
        (total, option) => total + option.priceAdjustment,
        0
      );
      const skuSuffix = combination.map((option) => option.skuSuffix).join("-");

      return {
        optionValues: combination.map((option) => ({
          optionName: option.optionName,
          name: option.name,
        })),
        price: formatMoney(product.price + priceAdjustment),
        compareAtPrice:
          product.compareAtPrice > 0 ? formatMoney(product.compareAtPrice) : null,
        sku: `${product.id}-${skuSuffix}`,
        position: index + 1,
        inventoryPolicy: "CONTINUE",
      };
    }),
  };
}

async function syncProduct(product) {
  const existingProduct = await findShopifyProduct(product.name);
  const input = buildProductSetInput(product);
  const identifier = existingProduct
    ? { id: existingProduct.id }
    : { handle: product.id };

  console.log(
    `${shouldApply ? "Syncing" : "Dry run"}: ${product.name} (${input.variants.length} variants)`
  );
  console.log(
    `  options: ${input.productOptions
      .map((option) => `${option.name}=[${option.values.map((value) => value.name).join(", ")}]`)
      .join("; ")}`
  );

  if (!shouldApply) {
    return;
  }

  const data = await shopifyAdminFetch(PRODUCT_SET_MUTATION, {
    identifier,
    input,
    synchronous: true,
  });
  const payload = data.productSet;
  const operationErrors = payload.productSetOperation?.userErrors ?? [];
  const errors = [...payload.userErrors, ...operationErrors];

  if (errors.length > 0) {
    throw new Error(errors.map((error) => error.message).join(", "));
  }

  if (!payload.product?.id) {
    throw new Error(`Shopify did not return a product for ${product.name}.`);
  }

  await pool.query("UPDATE products SET variant_id = $1 WHERE id = $2", [
    payload.product.variants.nodes[0]?.id ?? null,
    product.id,
  ]);

  for (const variant of payload.product.variants.nodes) {
    const optionSignature = getOptionSignature(
      variant.selectedOptions.map((option) => ({
        optionName: option.name,
        name: option.value,
      }))
    );

    await pool.query(
      `INSERT INTO product_shopify_variants (
        product_id,
        option_signature,
        shopify_variant_id
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (product_id, option_signature) DO UPDATE SET
        shopify_variant_id = EXCLUDED.shopify_variant_id`,
      [product.id, optionSignature, variant.id]
    );
  }

  console.log(`  synced Shopify product: ${payload.product.id}`);
}

async function main() {
  const products = await getProductsFromDatabase();

  if (products.length === 0) {
    console.log("No products found in Postgres.");
    return;
  }

  if (!shouldApply) {
    console.log("Running in dry-run mode. Add --apply to update Shopify.");
  }

  for (const product of products) {
    await syncProduct(product);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
