import { products as fallbackProducts } from "@/data/products";
import type { Product } from "@/types/product";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-04";

type ShopifyProductNode = {
  id: string;
  title: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  description: string;
  options: {
    name: string;
    values: string[];
  }[];
  variants: {
    edges: {
      node: {
        id: string;
        image: {
          url: string;
          altText: string | null;
        } | null;
        price: {
          amount: string;
        };
        selectedOptions: {
          name: string;
          value: string;
        }[];
      };
    }[];
  };
};

type ShopifyProductsResponse = {
  products: {
    edges: {
      node: ShopifyProductNode;
    }[];
  };
};

const PRODUCTS_QUERY = `
  query Products {
    products(first: 50) {
      edges {
        node {
          id
          title
          description
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
            }
          }
          options {
            name
            values
          }
          variants(first: 100) {
            edges {
              node {
                id
                image {
                  url
                  altText
                }
                price {
                  amount
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!domain || !token) {
    throw new Error("Missing Shopify environment variables.");
  }

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: variables ? "no-store" : "force-cache",
    next: variables ? undefined : { revalidate: 60 },
  });

  const json = await response.json();

  if (!response.ok || json.errors) {
    throw new Error(JSON.stringify(json.errors ?? json));
  }

  return json.data as T;
}

async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!domain || !adminToken) {
    throw new Error("Missing Shopify Admin API environment variables.");
  }

  const response = await fetch(
    `https://${domain}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );

  const json = await response.json();

  if (!response.ok || json.errors) {
    throw new Error(JSON.stringify(json.errors ?? json));
  }

  return json.data as T;
}

function mapShopifyProduct(node: ShopifyProductNode, index: number): Product {
  const metalOption = node.options.find((option) =>
    option.name.toLowerCase().includes("metal") ||
    option.name.toLowerCase().includes("material")
  );
  const diamondOption = node.options.find((option) =>
    option.name.toLowerCase().includes("diamond")
  );
  const sizeOption = node.options.find((option) =>
    option.name.toLowerCase().includes("size")
  );
  const fallback = fallbackProducts[index % fallbackProducts.length];
  const compareAtPrice = Number(node.compareAtPriceRange.minVariantPrice.amount);
  const price = Number(node.priceRange.minVariantPrice.amount);

  return {
    id: node.id,
    name: node.title,
    description: node.description || fallback.description,
    price,
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice : price,
    image: node.featuredImage?.url ?? fallback.image,
    variantId: node.variants.edges[0]?.node.id,
    variants: node.variants.edges.map(({ node: variant }) => ({
      id: variant.id,
      image: variant.image?.url,
      price: Number(variant.price.amount),
      selectedOptions: variant.selectedOptions,
    })),
    customizable: false,
    metalOptionName: metalOption?.name,
    diamondOptionName: diamondOption?.name,
    sizeOptionName: sizeOption?.name,
    metalOptions:
      metalOption?.values.map((value) => ({
        label: value,
      })) ?? fallback.metalOptions,
    diamondQualities:
      diamondOption?.values.map((value) => ({
        label: value,
      })) ?? fallback.diamondQualities,
    sizeOptions:
      sizeOption?.values.map((value) => ({
        size: value,
      })) ?? fallback.sizeOptions,
  };
}

type CartCreateResponse = {
  cartCreate: {
    cart: {
      checkoutUrl: string;
    } | null;
    userErrors: {
      field: string[] | null;
      message: string;
    }[];
  };
};

const CART_CREATE_MUTATION = `
  mutation CartCreate($variantId: ID!, $attributes: [AttributeInput!]) {
    cartCreate(
      input: {
        lines: [
          {
            merchandiseId: $variantId
            quantity: 1
            attributes: $attributes
          }
        ]
      }
    ) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export type CheckoutAttribute = {
  key: string;
  value: string;
};

function cleanAttributes(attributes: CheckoutAttribute[]) {
  return attributes.filter(
    (attribute) => attribute.key.trim() && attribute.value.trim()
  );
}

function getAttributeValue(attributes: CheckoutAttribute[], key: string) {
  return attributes.find((attribute) => attribute.key === key)?.value.trim();
}

function slugifyTag(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildOrderTags(attributes: CheckoutAttribute[]) {
  const tagKeys = ["Metal", "Carat", "Diamond Quality", "Ring Size"];

  return tagKeys
    .map((key) => {
      const value = getAttributeValue(attributes, key);

      return value ? `${slugifyTag(key)}-${slugifyTag(value)}` : "";
    })
    .filter(Boolean);
}

function buildOrderNote(attributes: CheckoutAttribute[]) {
  const metal = getAttributeValue(attributes, "Metal");
  const carat = getAttributeValue(attributes, "Carat");
  const diamondQuality = getAttributeValue(attributes, "Diamond Quality");
  const ringSize = getAttributeValue(attributes, "Ring Size");
  const estimatedPrice = getAttributeValue(attributes, "Estimated Custom Price");

  return [
    "Custom jewellery order created from Zephico website.",
    metal ? `Metal: ${metal}` : "",
    carat ? `Carat: ${carat}` : "",
    diamondQuality ? `Diamond Quality: ${diamondQuality}` : "",
    ringSize ? `Ring Size: ${ringSize}` : "",
    estimatedPrice ? `Estimated Custom Price: ${estimatedPrice}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

export async function createCheckout(
  variantId: string,
  attributes: CheckoutAttribute[] = []
): Promise<string> {
  const data = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION, {
    variantId,
    attributes: cleanAttributes(attributes),
  });
  const error = data.cartCreate.userErrors[0];

  if (error) {
    throw new Error(error.message);
  }

  if (!data.cartCreate.cart?.checkoutUrl) {
    throw new Error("Shopify did not return a checkout URL.");
  }

  return data.cartCreate.cart.checkoutUrl;
}

type DraftOrderCreateResponse = {
  draftOrderCreate: {
    draftOrder: {
      invoiceUrl: string;
    } | null;
    userErrors: {
      field: string[] | null;
      message: string;
    }[];
  };
};

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation DraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        invoiceUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

type CreateDraftCheckoutInput = {
  productName: string;
  variantId: string;
  price: number;
  attributes: CheckoutAttribute[];
};

export async function createDraftCheckout({
  productName,
  variantId,
  price,
  attributes,
}: CreateDraftCheckoutInput): Promise<string> {
  const cleanedAttributes = cleanAttributes(attributes);
  const customizationTags = buildOrderTags(cleanedAttributes);

  const data = await shopifyAdminFetch<DraftOrderCreateResponse>(
    DRAFT_ORDER_CREATE_MUTATION,
    {
      input: {
        visibleToCustomer: true,
        note: buildOrderNote(cleanedAttributes),
        tags: ["custom-jewellery", "zephico", ...customizationTags],
        customAttributes: cleanedAttributes,
        lineItems: [
          {
            variantId,
            title: productName,
            quantity: 1,
            priceOverride: {
              amount: String(price),
              currencyCode: "INR",
            },
            customAttributes: cleanedAttributes,
          },
        ],
      },
    }
  );
  const error = data.draftOrderCreate.userErrors[0];

  if (error) {
    throw new Error(error.message);
  }

  if (!data.draftOrderCreate.draftOrder?.invoiceUrl) {
    throw new Error("Shopify did not return a draft order payment URL.");
  }

  return data.draftOrderCreate.draftOrder.invoiceUrl;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await shopifyFetch<ShopifyProductsResponse>(PRODUCTS_QUERY);
    const shopifyProducts = data.products.edges.map(({ node }, index) =>
      mapShopifyProduct(node, index)
    );

    return shopifyProducts.length > 0 ? shopifyProducts : fallbackProducts;
  } catch (error) {
    console.warn("Using fallback products because Shopify fetch failed:", error);
    return fallbackProducts;
  }
}
