import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSchema } from "@/lib/validations/checkout";
import {
  verifyPaymentSignature,
  isRazorpayConfigured,
  isRazorpayLiveMode,
  fetchRazorpayPayment,
  captureRazorpayPayment,
} from "@/lib/payments/razorpay";
import { getOrderById, markOrderPaidAndFulfill, logStoreEvent } from "@/lib/orders";
import {
  extractClientIp,
  hashClientIdentifier,
  checkVerifyPaymentRateLimit,
} from "@/lib/rate-limit";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawIp = extractClientIp(req.headers);
    const hashedId = hashClientIdentifier(rawIp);

    // Rate limiting: 15 verification attempts / 10 minutes per IP
    const rateLimit = await checkVerifyPaymentRateLimit(hashedId);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Verification rate limit exceeded. Please wait a few moments before trying again." },
        { status: 429 }
      );
    }

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

    // 5b. For live commercial orders, verify payment entity is bound and CAPTURED on gateway
    if (isRazorpayLiveMode()) {
      try {
        let paymentDetails = await fetchRazorpayPayment(razorpayPaymentId);

        if (paymentDetails.order_id !== razorpayOrderId) {
          logStoreEvent("PAYMENT_VERIFICATION_FAILED", {
            orderId,
            note: "Gateway payment order_id mismatch",
          });
          return NextResponse.json(
            { error: "Payment does not correspond to this order record" },
            { status: 400 }
          );
        }

        if (
          paymentDetails.amount !== internalOrder.amount_cents ||
          paymentDetails.currency.toUpperCase() !== internalOrder.currency.toUpperCase()
        ) {
          logStoreEvent("PAYMENT_VERIFICATION_FAILED", {
            orderId,
            note: "Gateway payment amount or currency does not match internal order",
          });
          return NextResponse.json(
            { error: "Payment amount or currency does not match this order. Please contact support." },
            { status: 400 }
          );
        }

        if (paymentDetails.status === "authorized") {
          paymentDetails = await captureRazorpayPayment(
            razorpayPaymentId,
            internalOrder.amount_cents,
            internalOrder.currency
          );
        }

        if (paymentDetails.status !== "captured") {
          logStoreEvent("PAYMENT_VERIFICATION_FAILED", {
            orderId,
            note: `Payment status is ${paymentDetails.status}, expected captured`,
          });
          return NextResponse.json(
            { error: `Payment is not yet captured (status: ${paymentDetails.status}). Digital fulfillment requires settlement capture.` },
            { status: 400 }
          );
        }
      } catch (gatewayErr) {
        console.error("[PAYMENT CAPTURE CHECK ERROR]", gatewayErr instanceof Error ? gatewayErr.message : "Unknown");
        return NextResponse.json(
          { error: "Unable to confirm payment capture with gateway. Please check your order status." },
          { status: 502 }
        );
      }
    }

    // 6. Transition order to PAID and fulfill digital delivery (idempotent)
    const origin = req.nextUrl.origin && req.nextUrl.origin !== "null" ? req.nextUrl.origin : SITE_URL;
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
