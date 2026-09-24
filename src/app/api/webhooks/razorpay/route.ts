import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { getOrderByRazorpayOrderId, markOrderPaidAndFulfill } from "@/lib/orders";

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

    // Parse JSON only AFTER signature verification has succeeded
    let eventPayload: {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
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

    // Handle payment.captured or order.paid events
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = eventPayload.payload?.payment?.entity;
      const orderEntity = eventPayload.payload?.order?.entity;

      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id || "webhook_captured";

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

      // Idempotent fulfillment
      const origin = req.nextUrl.origin || "https://shivsastra.com";
      const fulfillment = await markOrderPaidAndFulfill({
        orderId: order.id,
        razorpayPaymentId,
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
