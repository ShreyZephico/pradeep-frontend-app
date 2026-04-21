import { NextResponse } from "next/server";
import {
  createCheckout,
  createDraftCheckout,
  type CheckoutAttribute,
} from "@/lib/shopify";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const variantId = body.variantId;

    if (typeof variantId !== "string" || !variantId) {
      return NextResponse.json(
        { error: "Missing Shopify variant ID." },
        { status: 400 }
      );
    }

    const rawAttributes = body.attributes;
    const productName = body.productName;
    const customPrice = body.customPrice;
    const useDraftOrder = body.useDraftOrder === true;
    const attributes: CheckoutAttribute[] = Array.isArray(rawAttributes)
      ? rawAttributes.filter(
          (attribute): attribute is CheckoutAttribute =>
            typeof attribute?.key === "string" &&
            typeof attribute?.value === "string"
        )
      : [];

    if (useDraftOrder) {
      if (typeof productName !== "string" || !productName) {
        return NextResponse.json(
          { error: "Missing product name for custom checkout." },
          { status: 400 }
        );
      }

      if (typeof customPrice !== "number" || customPrice <= 0) {
        return NextResponse.json(
          { error: "Missing custom price for custom checkout." },
          { status: 400 }
        );
      }

      const checkoutUrl = await createDraftCheckout({
        productName,
        variantId,
        price: customPrice,
        attributes,
      });

      return NextResponse.json({ checkoutUrl });
    }

    const checkoutUrl = await createCheckout(variantId, attributes);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
