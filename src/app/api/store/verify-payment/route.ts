import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSchema } from "@/lib/validations/checkout";
import { verifyPaymentSignature, isRazorpayConfigured } from "@/lib/payments/razorpay";
import { getOrderById, markOrderPaidAndFulfill, logStoreEvent } from "@/lib/orders";

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

    // 1. Validate incoming verification payload
    const parseResult = verifyPaymentSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parseResult.data;

    logStoreEvent("PAYMENT_VERIFICATION_STARTED", {
      orderId,
    });

    // 2. Fetch trusted internal order record
    const internalOrder = await getOrderById(orderId);
    if (!internalOrder) {
      return NextResponse.json(
        { error: "Order record not found" },
        { status: 404 }
      );
    }

    // 3. Verify razorpay_order_id matches trusted internal order
    if (internalOrder.razorpay_order_id !== razorpayOrderId) {
      logStoreEvent("PAYMENT_VERIFICATION_FAILED", {
        orderId,
        note: "Order reference mismatch",
      });
      return NextResponse.json(
        { error: "Order reference mismatch: Razorpay order ID does not match internal record" },
        { status: 400 }
      );
    }

    // 4. Verify Razorpay configuration
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          error: "Payment gateway configuration is missing on server",
          status: "PENDING_GATEWAY_CONFIG",
        },
        { status: 503 }
      );
    }

    // 5. Cryptographically verify signature using server-only secret
    const isValid = verifyPaymentSignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      logStoreEvent("PAYMENT_VERIFICATION_FAILED", {
        orderId,
        note: "Cryptographic HMAC signature verification failed",
      });
      return NextResponse.json(
        { error: "Cryptographic signature verification failed" },
        { status: 400 }
      );
    }

    // 6. Transition order to PAID and fulfill digital delivery (idempotent)
    const origin = req.nextUrl.origin || "https://shivsastra.com";
    const fulfillment = await markOrderPaidAndFulfill({
      orderId: internalOrder.id,
      razorpayPaymentId,
      razorpaySignature,
      baseUrl: origin,
    });

    return NextResponse.json({
      success: true,
      orderId: fulfillment.order.id,
      status: fulfillment.order.status,
      deliveryStatus: fulfillment.order.delivery_status,
      deliveryToken: fulfillment.deliveryToken,
      alreadyPaid: fulfillment.alreadyPaid,
    });
  } catch (err) {
    console.error("[PAYMENT VERIFICATION HANDLER ERROR]", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json(
      { error: "An unexpected error occurred during payment verification" },
      { status: 500 }
    );
  }
}
