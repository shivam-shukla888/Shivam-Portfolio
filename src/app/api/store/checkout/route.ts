import { NextRequest, NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/validations/checkout";
import { getPublishedStoreProductById } from "@/lib/products";
import { createRazorpayOrder, isRazorpayConfigured, getRazorpayKeyId } from "@/lib/payments/razorpay";
import { createInternalOrder, updateOrderRazorpayId } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request payload" },
        { status: 400 }
      );
    }

    // 1. Validate request (ignores extraneous client fields like amount/currency/path)
    const parseResult = checkoutRequestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { productId, email } = parseResult.data;

    // 2. Load product through server-side product data layer
    const product = await getPublishedStoreProductById(productId);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found or unavailable for acquisition" },
        { status: 404 }
      );
    }

    // 3. Verify availability
    if (!product.isAvailable) {
      return NextResponse.json(
        { error: "This edition is currently unavailable" },
        { status: 400 }
      );
    }

    // 4. Verify price & currency from trusted server data
    if (
      product.priceInCents === null ||
      product.priceInCents === undefined ||
      product.priceInCents <= 0
    ) {
      return NextResponse.json(
        { error: "Product price is pending or not configured for commercial purchase" },
        { status: 400 }
      );
    }

    const trustedAmount = product.priceInCents;
    const trustedCurrency = (product.currency || "INR").toUpperCase();

    // 5. Check Razorpay configuration
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          error: "Payment gateway is not currently configured",
          status: "PENDING_GATEWAY_CONFIG",
        },
        { status: 503 }
      );
    }

    // 6. Create internal order record in PENDING state
    const internalOrder = await createInternalOrder({
      productId: product.id,
      productTitle: product.title,
      productSlug: product.slug,
      amountCents: trustedAmount,
      currency: trustedCurrency,
      customerEmail: email,
    });

    if (!internalOrder) {
      return NextResponse.json(
        { error: "Failed to initialize order record" },
        { status: 500 }
      );
    }

    // 7. Create Razorpay order via official Orders API
    let razorpayOrder;
    try {
      razorpayOrder = await createRazorpayOrder({
        amountCents: trustedAmount,
        currency: trustedCurrency,
        receipt: internalOrder.id,
        notes: {
          orderId: internalOrder.id,
          productId: product.id,
          productSlug: product.slug,
        },
      });
    } catch (gatewayErr) {
      console.error("[CHECKOUT GATEWAY ERROR]", gatewayErr instanceof Error ? gatewayErr.message : "Unknown");
      return NextResponse.json(
        { error: "Failed to initiate payment gateway session" },
        { status: 502 }
      );
    }

    // 8. Associate Razorpay Order ID with internal order
    await updateOrderRazorpayId(internalOrder.id, razorpayOrder.id);

    // 9. Return safe client response
    return NextResponse.json({
      success: true,
      orderId: internalOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: trustedAmount,
      currency: trustedCurrency,
      keyId: getRazorpayKeyId(),
      productTitle: product.title,
    });
  } catch (err) {
    console.error("[CHECKOUT HANDLER ERROR]", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json(
      { error: "An unexpected error occurred during checkout initialization" },
      { status: 500 }
    );
  }
}
