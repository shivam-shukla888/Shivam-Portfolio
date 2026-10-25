import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import {
  getOrderByRazorpayOrderId,
  getOrderByRazorpayPaymentId,
  markOrderPaidAndFulfill,
  transitionOrderStatus,
  logStoreEvent,
} from "@/lib/orders";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    // Read RAW body BEFORE any JSON parsing
    const rawBody = await req.text();
    if (!rawBody || rawBody.trim().length === 0) {
      return NextResponse.json(
        { error: "Empty webhook payload" },
        { status: 400 }
      );
    }

    // Cryptographically verify webhook HMAC signature
    const isValid = verifyWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.warn("[WEBHOOK] Invalid Razorpay webhook signature detected");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    logStoreEvent("WEBHOOK_RECEIVED", {
      note: "Cryptographically verified webhook payload",
    });

    // Parse JSON only AFTER signature verification has succeeded
    let eventPayload: {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            currency?: string;
            status?: string;
          };
        };
        order?: {
          entity?: {
            id?: string;
            status?: string;
            receipt?: string;
          };
        };
        refund?: {
          entity?: {
            id?: string;
            payment_id?: string;
            status?: string;
          };
        };
      };
    };

    try {
      eventPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON payload" },
        { status: 400 }
      );
    }

    const eventType = eventPayload.event;

    if (eventType === "refund.processed" || eventType === "refund.failed") {
      const refund = eventPayload.payload?.refund?.entity;
      const order = refund?.payment_id
        ? await getOrderByRazorpayPaymentId(refund.payment_id)
        : null;

      if (!order) {
        return NextResponse.json({ received: true, ignoredEvent: eventType }, { status: 200 });
      }

      // Restrict refund transitions strictly to verified paid or refund_pending orders
      if (order.status !== "paid" && order.status !== "refund_pending" && order.status !== "refunded") {
        return NextResponse.json({ received: true, note: "Order not in refundable state" }, { status: 200 });
      }

      // Idempotent guard for already processed refund
      if (order.status === "refunded" && eventType === "refund.processed") {
        return NextResponse.json({ received: true, orderId: order.id, status: "refunded", alreadyRefunded: true });
      }

      // Ignore a late failure notification after a refund has already completed.
      if (order.status === "refunded" && eventType === "refund.failed") {
        return NextResponse.json({ received: true, orderId: order.id, status: "refunded", ignoredLateFailure: true });
      }

      const nextStatus = eventType === "refund.processed" ? "refunded" : "paid";
      const transition = await transitionOrderStatus(
        order.id,
        nextStatus,
        eventType === "refund.processed" ? (refund?.id || order.razorpay_refund_id || null) : null
      );
      if (!transition.success) {
        return NextResponse.json({ error: "Could not update refund status" }, { status: 500 });
      }

      logStoreEvent("ORDER_SETTLED", {
        orderId: order.id,
        productId: order.product_id,
        status: nextStatus,
        note: `Webhook refund outcome: ${refund?.status || eventType}`,
      });

      return NextResponse.json({ received: true, orderId: order.id, status: nextStatus });
    }

    // A payment.failed event represents one failed attempt, not a terminal order state.
    // Keep the order pending so the customer can retry with another payment method.
    if (eventType === "payment.failed") {
      const paymentEntity = eventPayload.payload?.payment?.entity;
      const order = paymentEntity?.order_id
        ? await getOrderByRazorpayOrderId(paymentEntity.order_id)
        : null;
      if (order) {
        logStoreEvent("PAYMENT_VERIFICATION_FAILED", {
          orderId: order.id,
          productId: order.product_id,
          note: "A payment attempt failed; order remains available for retry",
        });
      }
      return NextResponse.json({ received: true, event: "payment.failed" }, { status: 200 });
    }
    // Fulfill only a captured payment matching the trusted internal order.
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = eventPayload.payload?.payment?.entity;
      const orderEntity = eventPayload.payload?.order?.entity;

      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;

      if (!razorpayOrderId) {
        return NextResponse.json(
          { error: "Missing order reference in webhook payload" },
          { status: 400 }
        );
      }

      const order = await getOrderByRazorpayOrderId(razorpayOrderId);
      if (!order) {
        // Order not recognized; acknowledge to prevent endless webhook redelivery
        console.warn(`[WEBHOOK] Order with Razorpay ID ${razorpayOrderId} not found in database`);
        return NextResponse.json({ received: true, note: "Order not found" }, { status: 200 });
      }

      if (
        !paymentEntity?.id ||
        paymentEntity.status !== "captured" ||
        paymentEntity.amount !== order.amount_cents ||
        typeof paymentEntity.currency !== "string" ||
        paymentEntity.currency.toUpperCase() !== order.currency.toUpperCase()
      ) {
        logStoreEvent("PAYMENT_VERIFICATION_FAILED", {
          orderId: order.id,
          productId: order.product_id,
          note: "Webhook payment missing, not captured, or amount/currency mismatches internal order",
        });
        return NextResponse.json({ received: true, note: "Payment does not match expected captured order" }, { status: 200 });
      }


      // Idempotent fulfillment
      const origin = req.nextUrl.origin && req.nextUrl.origin !== "null" ? req.nextUrl.origin : SITE_URL;
      const fulfillment = await markOrderPaidAndFulfill({
        orderId: order.id,
        razorpayPaymentId: paymentEntity.id,
        baseUrl: origin,
      });

      return NextResponse.json({
        received: true,
        orderId: order.id,
        status: fulfillment.order.status,
        alreadyPaid: fulfillment.alreadyPaid,
      });
    }

    // Unhandled events are acknowledged safely
    return NextResponse.json({ received: true, ignoredEvent: eventType }, { status: 200 });
  } catch (err) {
    console.error("[WEBHOOK HANDLER ERROR]", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json(
      { error: "Webhook processing failure" },
      { status: 500 }
    );
  }
}
