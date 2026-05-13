import { NextResponse } from 'next/server';

type ShopifyMoney = {
  amount: string;
  currencyCode?: string;
};

type ShopifyImage = {
  url: string;
  altText?: string | null;
};

type ShopifyOption = {
  name: string;
  values: string[];
};

type ShopifyVariantNode = {
  id: string;
  title: string;
  price: ShopifyMoney;
  compareAtPrice?: Pick<ShopifyMoney, 'amount'> | null;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage | null;
};

type ShopifyProductNode = {
  id: string;
  title: string;
  description?: string | null;
  handle?: string;
  productType?: string;
  tags?: string[];
  featuredImage?: ShopifyImage | null;
  images?: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice?: ShopifyMoney | null;
  };
  options?: ShopifyOption[];
  variants?: {
    edges: {
      node: ShopifyVariantNode;
    }[];
  };
};

type ShopifyProductsResponse = {
  data?: {
    products: {
      edges: {
        node: ShopifyProductNode;
      }[];
    };
  };
  errors?: {
    message?: string;
  }[];
};

export async function GET() {
  try {
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
      console.error('Missing Shopify configuration');
      return NextResponse.json(
        { error: 'Shopify configuration missing', products: [] },
        { status: 500 }
      );
    }

    // ✅ Complete GraphQL query with images
    const query = `
      query getProducts {
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              handle
              productType
              tags
              featuredImage {
                url
                altText
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
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
                    title
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                    }
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const storefrontUrl = `https://${storeDomain}/api/2024-01/graphql.json`;
    console.log('📤 Fetching products from Shopify...');

    const response = await fetch(storefrontUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error('HTTP Error:', response.status);
      return NextResponse.json(
        { error: `HTTP ${response.status}`, products: [] },
        { status: response.status }
      );
    }

    const data = (await response.json()) as ShopifyProductsResponse;

    if (data.errors) {
      console.error('GraphQL Errors:', data.errors);
      return NextResponse.json(
        { error: data.errors[0]?.message || 'GraphQL error', products: [] },
        { status: 500 }
      );
    }

    // ✅ Transform products with proper image handling
    const products = data.data?.products.edges.map((edge) => {
      const node = edge.node;
      
      // Get primary image
      let primaryImage = '/placeholder.jpg';
      const allImages: string[] = [];
      
      // Try featuredImage first
      if (node.featuredImage?.url) {
        primaryImage = node.featuredImage.url;
        allImages.push(node.featuredImage.url);
      }
      
      // Get additional images
      if (node.images?.edges && node.images.edges.length > 0) {
        node.images.edges.forEach((img) => {
          if (img.node.url) {
            allImages.push(img.node.url);
          }
        });
        if (primaryImage === '/placeholder.jpg' && allImages.length > 0) {
          primaryImage = allImages[0];
        }
      }
      
      // Try variant image if no product image
      if (primaryImage === '/placeholder.jpg' && 
          node.variants?.edges?.[0]?.node?.image?.url) {
        primaryImage = node.variants.edges[0].node.image.url;
        allImages.push(primaryImage);
      }
      
      // Get variants
      const variants = node.variants?.edges.map((v) => ({
        id: v.node.id,
        title: v.node.title,
        price: parseFloat(v.node.price.amount),
        compareAtPrice: v.node.compareAtPrice ? parseFloat(v.node.compareAtPrice.amount) : null,
        availableForSale: v.node.availableForSale,
        selectedOptions: v.node.selectedOptions || [],
        image: v.node.image?.url || primaryImage,
      })) || [];
      
      // Get default variant
      const defaultVariant = variants.find((v) => v.availableForSale) || variants[0];
      
      // Get option values for customization
      const metalOption = node.options?.find((opt) => 
        opt.name.toLowerCase().includes('metal') || 
        opt.name.toLowerCase().includes('material')
      );
      const diamondOption = node.options?.find((opt) => 
        opt.name.toLowerCase().includes('diamond')
      );
      const sizeOption = node.options?.find((opt) => 
        opt.name.toLowerCase().includes('size')
      );
      
      return {
        id: node.id,
        name: node.title,
        description: node.description || '',
        price: defaultVariant?.price || parseFloat(node.priceRange.minVariantPrice.amount),
        compareAtPrice: node.compareAtPriceRange?.minVariantPrice?.amount 
          ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount) 
          : (defaultVariant?.compareAtPrice || 0),
        image: primaryImage,
        images: allImages.length > 0 ? allImages : [primaryImage],
        variantId: defaultVariant?.id,
        variants: variants,
        handle: node.handle,
        productType: node.productType,
        tags: node.tags || [],
        customizable: false,
        metalOptionName: metalOption?.name,
        diamondOptionName: diamondOption?.name,
        sizeOptionName: sizeOption?.name,
        metalOptions: metalOption?.values?.map((value: string) => ({ label: value })) || [],
        diamondQualities: diamondOption?.values?.map((value: string) => ({ label: value })) || [],
        sizeOptions: sizeOption?.values?.map((value: string) => ({ size: value })) || [],
      };
    }) || [];

    // ✅ FIXED: Type-safe image count
    const productsWithImagesCount = products.filter((product) => 
      product.image && product.image !== '/placeholder.jpg'
    ).length;
    
    console.log(`📊 Image Stats: ${productsWithImagesCount}/${products.length} products have images`);
    console.log(`✅ Successfully fetched ${products.length} products`);

    return NextResponse.json({
      success: true,
      products: products,
      total: products.length,
    });

  } catch (error) {
    console.error('🔴 Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error', products: [] },
      { status: 500 }
    );
  }
}
