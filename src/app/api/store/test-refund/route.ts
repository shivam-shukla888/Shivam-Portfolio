import { NextRequest, NextResponse } from "next/server";
import { testRefundSchema } from "@/lib/validations/checkout";
import { getOrderById, transitionOrderStatus, logStoreEvent } from "@/lib/orders";
import { createRazorpayRefund, getRazorpayRefund } from "@/lib/payments/razorpay";
import {
  isPaymentOnlyCheckoutOrder,
  isRazorpayLiveTestEmailAllowed,
  isRazorpayLiveTestEnvironmentEnabled,
  isRazorpayTestEnvironmentEnabled,
} from "@/lib/payments/test-checkout";
import { extractClientIp, hashClientIdentifier, checkVerifyPaymentRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sandboxEnabled = isRazorpayTestEnvironmentEnabled();
    const liveTestEnabled = isRazorpayLiveTestEnvironmentEnabled();
    if (!sandboxEnabled && !liveTestEnabled) {
      return NextResponse.json({ error: "Test refunds are disabled" }, { status: 404 });
    }

    const rateLimit = await checkVerifyPaymentRateLimit(hashClientIdentifier(extractClientIp(req.headers)));
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many refund status requests. Please wait before trying again." }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request" }, { status: 400 });
    }
    const parsed = testRefundSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid refund request" }, { status: 400 });
    }

    const order = await getOrderById(parsed.data.orderId);
    const isPaymentTestOrder = Boolean(order && isPaymentOnlyCheckoutOrder(order));
    if (!order || !isPaymentTestOrder || order.customer_email !== parsed.data.email) {
      return NextResponse.json({ error: "Test order not found for this email" }, { status: 404 });
    }
    if (liveTestEnabled && !isRazorpayLiveTestEmailAllowed(parsed.data.email)) {
      return NextResponse.json({ error: "Live payment-test refund is restricted to the configured test email" }, { status: 403 });
    }
    if (!order.razorpay_payment_id) {
      return NextResponse.json({ error: "No verified payment is available to refund" }, { status: 409 });
    }

    if (order.status === "refunded") {
      return NextResponse.json({ success: true, status: "processed", message: "This test payment has already been refunded." });
    }
    if (order.status !== "paid" && order.status !== "refund_pending") {
      return NextResponse.json({ error: "Only a verified test payment can be refunded" }, { status: 409 });
    }

    const refund = order.status === "refund_pending" && order.razorpay_refund_id
      ? await getRazorpayRefund(order.razorpay_refund_id)
      : await createRazorpayRefund({
          paymentId: order.razorpay_payment_id,
          amountCents: order.amount_cents,
          receipt: order.id,
        });

    if (refund.payment_id !== order.razorpay_payment_id || refund.amount !== order.amount_cents) {
      return NextResponse.json({ error: "Refund details did not match the test order" }, { status: 502 });
    }

    const nextStatus = refund.status === "processed" ? "refunded" : refund.status === "failed" ? "paid" : "refund_pending";
    const transition = await transitionOrderStatus(order.id, nextStatus, nextStatus === "paid" ? null : refund.id);
    if (!transition.success) {
      return NextResponse.json({ error: "Refund was sent to Razorpay, but order status could not be updated" }, { status: 500 });
    }

    logStoreEvent("ORDER_SETTLED", {
      orderId: order.id,
      productId: order.product_id,
      status: nextStatus,
      note: (liveTestEnabled ? "Live payment-test refund " : "Sandbox refund ") + (refund.status || "pending"),
    });

    return NextResponse.json({
      success: true,
      status: refund.status === "processed" ? "processed" : refund.status === "failed" ? "failed" : "pending",
      message: refund.status === "processed"
        ? (liveTestEnabled ? "Live ₹1 payment-test refund completed." : "Test refund completed.")
        : refund.status === "failed"
          ? (liveTestEnabled ? "Razorpay could not process this refund. Check the Live Mode dashboard before retrying." : "Razorpay could not process this refund. Please retry or check Test Mode dashboard.")
          : "Test refund requested. The status will update when Razorpay confirms it.",
    });
  } catch (err) {
    console.error("[TEST REFUND ERROR]", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json({ error: "Unable to process this test refund right now" }, { status: 502 });
  }
}
