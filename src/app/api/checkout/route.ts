import { NextResponse } from 'next/server';

const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? '2026-04';

function getCookieValue(cookieHeader: string | null, name: string) {
  return cookieHeader
    ?.split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

export async function POST(request: Request) {
  try {
    const { variantId, attributes, productName, customPrice } = await request.json();

    console.log('Checkout request received:', { variantId, productName, customPrice });

    if (!variantId) {
      return NextResponse.json(
        { error: 'Missing product variant.' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : null;
    const cookieToken = getCookieValue(request.headers.get('cookie'), 'customerAccessToken');
    const customerAccessToken = decodeURIComponent(headerToken ?? cookieToken ?? '');

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'Please login before checkout.' },
        { status: 401 }
      );
    }

    const verifyQuery = `
      query VerifyCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
        }
      }
    `;

    const storefrontUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/${apiVersion}/graphql.json`;
    const shopifyHeaders = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    };

    const verifyResponse = await fetch(storefrontUrl, {
      method: 'POST',
      headers: shopifyHeaders,
      body: JSON.stringify({
        query: verifyQuery,
        variables: { customerAccessToken },
      }),
    });

    const verifyData = await verifyResponse.json();
    const customer = verifyData.data?.customer;

    if (!customer) {
      console.log('Invalid or expired Shopify customer token');
      return NextResponse.json(
        { error: 'Your login expired. Please login again.' },
        { status: 401 }
      );
    }

    const cartMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const cartResponse = await fetch(storefrontUrl, {
      method: 'POST',
      headers: shopifyHeaders,
      body: JSON.stringify({
        query: cartMutation,
        variables: {
          input: {
            buyerIdentity: {
              customerAccessToken,
            },
            lines: [
              {
                merchandiseId: variantId,
                quantity: 1,
                attributes: attributes || [],
              },
            ],
          },
        },
      }),
    });

    const cartData = await cartResponse.json();

    if (cartData.errors) {
      console.error('Cart creation errors:', cartData.errors);
      return NextResponse.json(
        { error: 'Failed to create cart' },
        { status: 500 }
      );
    }

    const cartError = cartData.data?.cartCreate?.userErrors?.[0];

    if (cartError) {
      console.error('Cart user error:', cartError);
      return NextResponse.json(
        { error: cartError.message },
        { status: 400 }
      );
    }

    const checkoutUrl = cartData.data?.cartCreate?.cart?.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to create checkout URL' },
        { status: 500 }
      );
    }

    console.log('Checkout created for customer:', customer.email);

    return NextResponse.json({
      success: true,
      checkoutUrl,
      customerEmail: customer.email,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
