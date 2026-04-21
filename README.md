# Zephico Jewellery Website

A Next.js jewellery storefront connected to Shopify for products, variants, checkout, and order/payment flow. The project also includes PostgreSQL sync scripts for keeping a local product database aligned with Shopify.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Shopify Storefront API
- Shopify Admin API
- PostgreSQL with Docker

## Features

- Jewellery homepage with product search.
- Shopify products rendered on the frontend.
- Product modal with Shopify variant options.
- Variant-specific image support.
- Shopify checkout and draft order support.
- Order custom attributes, notes, and tags for jewellery customization.
- PostgreSQL product sync from Shopify.
- PostgreSQL to Shopify variant sync with dry-run and apply modes.

## Prerequisites

Install these before running the project:

- Node.js 20 or newer
- npm
- Docker Desktop
- Shopify store
- Shopify Storefront access token
- Shopify Admin API access token

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then update the values:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_api_access_token
SHOPIFY_STOREFRONT_API_VERSION=2026-04
DATABASE_URL=postgresql://zephico:zephico_password@localhost:5435/zephico_jewels
```

Do not commit real `.env` values.

## Shopify Setup

### Storefront API

The frontend uses the Storefront API to read products, variants, prices, images, descriptions, and selected options.

Required Storefront access:

- Read products
- Read product variants
- Read product images

### Admin API

The backend scripts use Admin API for product/variant sync and draft order checkout.

Recommended Admin API scopes:

- `read_products`
- `write_products`
- `read_draft_orders`
- `write_draft_orders`

If inventory sync is added later, also add inventory/location scopes.

## Database Setup

Start PostgreSQL:

```bash
docker compose up -d
```

The database runs on:

```text
Host: localhost
Port: 5435
Database: zephico_jewels
User: zephico
Password: zephico_password
```

The seed file is loaded automatically when the database container is created for the first time:

```text
db/init/001_seed_products.sql
```

If the database already exists and you want to apply the latest schema manually:

```bash
docker exec -i zephico-postgres psql -U zephico -d zephico_jewels < db/init/001_seed_products.sql
```

## Running Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Builds the production app.

```bash
npm run start
```

Starts the production server after build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run sync:db
```

Pulls products, options, variants, prices, images, and Shopify IDs from Shopify into PostgreSQL.

```bash
npm run sync:shopify
```

Dry-runs the database-to-Shopify product/variant sync. This does not change Shopify.

```bash
npm run sync:shopify:apply
```

Applies database-driven product/variant updates to Shopify.

To sync one product only:

```bash
npm run sync:shopify -- --product=radiant-heart-diamond-ring
npm run sync:shopify:apply -- --product=radiant-heart-diamond-ring
```

## Data Flow

The current frontend reads products from Shopify:

```text
Shopify Storefront API
↓
Next.js server component
↓
React product cards and modal
```

The local database can be synced from Shopify:

```text
Shopify Admin API
↓
npm run sync:db
↓
PostgreSQL
```

The database can also push product variants back to Shopify:

```text
PostgreSQL
↓
npm run sync:shopify:apply
↓
Shopify Admin API
```

## Product Variants

Shopify supports up to 3 option groups per product. Example:

```text
Size
Jewelry material
Diamond
```

The frontend reads these Shopify variant options and displays them in the product modal.

Variant-specific images are supported. If a selected variant has an image, the modal shows that variant image. Otherwise, it falls back to the main product image.

## Checkout

Normal products use Shopify cart checkout.

Customized products can use draft order checkout so selected attributes and custom pricing can be passed to Shopify.

Customization details are sent as:

- Line item attributes
- Order notes
- Order tags

This makes details easier to see in Shopify orders and searchable in exports.

## Important Notes

- Shopify's default order CSV export cannot be customized with arbitrary new columns.
- Product metafields can help with product export/reporting, but order analysis usually needs a custom export or app.
- Keep Shopify tokens private.
- Run `npm run sync:shopify` before `npm run sync:shopify:apply` to preview changes.

## Deployment

Recommended deployment:

- Vercel for Next.js
- Shopify for products and checkout
- Hosted PostgreSQL if database sync is needed in production

Set the same environment variables in the deployment platform.
