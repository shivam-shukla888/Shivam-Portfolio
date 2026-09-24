if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import crypto from "crypto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/products";
import { sendPurchaseDeliveryEmail } from "@/lib/email/purchase-delivery";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";
export type DeliveryStatus = "pending" | "sent" | "failed";

/**
 * Strict Order State Machine Definitions
 *
 * Rules:
 * - pending can transition to: paid, failed, cancelled
 * - paid CANNOT transition to: pending, failed, cancelled (terminal payment state)
 * - failed/cancelled cannot transition back to pending
 * - Delivery: pending can transition to: sent, failed; sent cannot revert silently
 */
export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["paid", "failed", "cancelled"],
  paid: ["paid"], // A paid order remains paid
  failed: ["failed"],
  cancelled: ["cancelled"],
  refunded: ["refunded"],
};

export const VALID_DELIVERY_TRANSITIONS: Record<DeliveryStatus, readonly DeliveryStatus[]> = {
  pending: ["sent", "failed"],
  sent: ["sent"], // Sent delivery must never revert silently
  failed: ["failed", "sent"], // Failed delivery can be retried to sent
};

export function canTransitionOrderStatus(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return true;
  const allowed = VALID_ORDER_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}

export function canTransitionDeliveryStatus(current: DeliveryStatus, next: DeliveryStatus): boolean {
  if (current === next) return true;
  const allowed = VALID_DELIVERY_TRANSITIONS[current];
  return allowed ? allowed.includes(next) : false;
}

/**
 * Safe Structured Event Identifiers for Auditing (No PII, No Secrets)
 */
export type StoreLifecycleEvent =
  | "CHECKOUT_STARTED"
  | "ORDER_CREATED"
  | "CHECKOUT_OPENED"
  | "PAYMENT_CALLBACK_RECEIVED"
  | "PAYMENT_VERIFICATION_STARTED"
  | "PAYMENT_VERIFIED"
  | "PAYMENT_VERIFICATION_FAILED"
  | "WEBHOOK_RECEIVED"
  | "ORDER_SETTLED"
  | "DELIVERY_STARTED"
  | "DELIVERY_SENT"
  | "DELIVERY_FAILED";

export function logStoreEvent(
  event: StoreLifecycleEvent,
  details?: {
    orderId?: string;
    productId?: string;
    status?: string;
    deliveryStatus?: string;
    note?: string;
  }
): void {
  const timestamp = new Date().toISOString();
  console.log(
    JSON.stringify({
      tag: "SHIVSASTRA_STORE_AUDIT",
      event,
      timestamp,
      orderRef: details?.orderId ? details.orderId.slice(0, 8) + "..." : undefined,
      productId: details?.productId,
      status: details?.status,
      deliveryStatus: details?.deliveryStatus,
      note: details?.note,
    })
  );
}

export interface OrderRecord {
  id: string;
  product_id: string;
  product_title_snapshot: string;
  product_slug_snapshot: string;
  amount_cents: number;
  currency: string;
  customer_email: string;
  status: OrderStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  delivery_status: DeliveryStatus;
  delivery_token_version: number;
  delivery_token_hash: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Generates a high-entropy secret token for digital delivery download links.
 */
export function generateDeliveryToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = hashDeliveryToken(token);
  return { token, hash };
}

/**
 * Computes deterministic SHA-256 hash of a delivery token.
 */
export function hashDeliveryToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Validates delivery token against stored hash using timing-safe comparison.
 */
export function verifyDeliveryToken(token: string, storedHash: string | null | undefined): boolean {
  if (!token || !storedHash) return false;
  try {
    const computedHash = hashDeliveryToken(token);
    const computedBuf = Buffer.from(computedHash, "utf8");
    const storedBuf = Buffer.from(storedHash, "utf8");
    if (computedBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(computedBuf, storedBuf);
  } catch {
    return false;
  }
}

/**
 * Finds a recent pending order for the same product and email to prevent duplicate orders
 * caused by double-clicks, browser retries, or repeated submissions.
 */
export async function findRecentPendingOrder(
  productId: string,
  customerEmail: string,
  maxAgeMs: number = 300000 // 5 minutes window
): Promise<OrderRecord | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  try {
    const thresholdIso = new Date(Date.now() - maxAgeMs).toISOString();

    const { data, error } = await client
      .from("orders")
      .select("*")
      .eq("product_id", productId)
      .eq("customer_email", customerEmail.toLowerCase().trim())
      .eq("status", "pending")
      .gte("created_at", thresholdIso)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0] as OrderRecord;
  } catch {
    return null;
  }
}

/**
 * Creates an initial internal order record in PENDING state.
 */
export async function createInternalOrder(params: {
  productId: string;
  productTitle: string;
  productSlug: string;
  amountCents: number;
  currency: string;
  customerEmail: string;
  razorpayOrderId?: string;
}): Promise<OrderRecord | null> {
  const client = getSupabaseServerClient();
  if (!client) {
    console.error("[ORDERS] Supabase server client not configured");
    return null;
  }

  const payload = {
    product_id: params.productId,
    product_title_snapshot: params.productTitle,
    product_slug_snapshot: params.productSlug,
    amount_cents: params.amountCents,
    currency: (params.currency || "INR").toUpperCase(),
    customer_email: params.customerEmail.toLowerCase().trim(),
    status: "pending" as OrderStatus,
    razorpay_order_id: params.razorpayOrderId || null,
    delivery_status: "pending" as DeliveryStatus,
    delivery_token_version: 1,
  };

  const { data, error } = await client
    .from("orders")
    .insert(payload)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[ORDERS] Order creation failed:", error?.message || error?.code);
    return null;
  }

  return data as OrderRecord;
}

/**
 * Updates internal order with Razorpay Order ID.
 */
export async function updateOrderRazorpayId(
  orderId: string,
  razorpayOrderId: string
): Promise<OrderRecord | null> {
  const client = getSupabaseServerClient();
  if (!client) return null;

  const { data, error } = await client
    .from("orders")
    .update({ razorpay_order_id: razorpayOrderId, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[ORDERS] Failed to update razorpay_order_id:", error?.message);
    return null;
  }

  return data as OrderRecord;
}

/**
 * Safely updates order status following the strict state machine.
 * Prevents paid orders from reverting to pending, failed, or cancelled.
 */
export async function transitionOrderStatus(
  orderId: string,
  nextStatus: OrderStatus
): Promise<{ success: boolean; order?: OrderRecord; error?: string }> {
  const client = getSupabaseServerClient();
  if (!client) {
    return { success: false, error: "Database unavailable" };
  }

  const existing = await getOrderById(orderId);
  if (!existing) {
    return { success: false, error: "Order not found" };
  }

  if (existing.status === nextStatus) {
    return { success: true, order: existing };
  }

  if (!canTransitionOrderStatus(existing.status, nextStatus)) {
    return {
      success: false,
      error: `Illegal state transition from ${existing.status} to ${nextStatus}`,
    };
  }

  const { data, error } = await client
    .from("orders")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message || "Failed to update order status" };
  }

  return { success: true, order: data as OrderRecord };
}

/**
 * Resolves internal order by internal UUID.
 */
export async function getOrderById(orderId: string): Promise<OrderRecord | null> {
  const client = getSupabaseServerClient();
  if (!client || !orderId) return null;

  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as OrderRecord;
}

/**
 * Resolves internal order by Razorpay Order ID.
 */
export async function getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<OrderRecord | null> {
  const client = getSupabaseServerClient();
  if (!client || !razorpayOrderId) return null;

  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as OrderRecord;
}

/**
 * Idempotently marks an order as PAID and initiates digital delivery fulfillment.
 * If already paid, returns existing state and avoids duplicate email dispatch.
 * Conforms strictly to the Order State Machine and convergence of Webhook + Browser paths.
 */
export async function markOrderPaidAndFulfill(params: {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  deliveryTokenHash?: string;
  deliveryToken?: string;
  baseUrl?: string;
}): Promise<{
  order: OrderRecord;
  alreadyPaid: boolean;
  deliveryEmailSent: boolean;
  deliveryToken?: string;
}> {
  const client = getSupabaseServerClient();
  if (!client) {
    throw new Error("Database client not available");
  }

  // 1. Fetch current order
  const existingOrder = await getOrderById(params.orderId);
  if (!existingOrder) {
    throw new Error(`Order ${params.orderId} not found`);
  }

  // 2. IDEMPOTENCY CHECK: If already paid, do not re-fulfill
  if (existingOrder.status === "paid") {
    logStoreEvent("ORDER_SETTLED", {
      orderId: existingOrder.id,
      status: "paid",
      deliveryStatus: existingOrder.delivery_status,
      note: "Idempotent settlement; order was already marked paid",
    });

    // If caller provided a deliveryToken or needs access, generate/return safely
    let deliveryToken = params.deliveryToken;
    if (!deliveryToken && !existingOrder.delivery_token_hash) {
      const generated = generateDeliveryToken();
      deliveryToken = generated.token;
      await client
        .from("orders")
        .update({ delivery_token_hash: generated.hash, updated_at: new Date().toISOString() })
        .eq("id", existingOrder.id);
    }

    return {
      order: existingOrder,
      alreadyPaid: true,
      deliveryEmailSent: existingOrder.delivery_status === "sent",
      deliveryToken: deliveryToken || params.deliveryToken,
    };
  }

  // 3. State machine validation: ensure pending -> paid is allowed
  if (!canTransitionOrderStatus(existingOrder.status, "paid")) {
    throw new Error(`Invalid state transition: Cannot mark order as paid from status ${existingOrder.status}`);
  }

  // Generate delivery token if not supplied
  let deliveryToken = params.deliveryToken;
  let deliveryTokenHash = params.deliveryTokenHash;
  if (!deliveryTokenHash) {
    const generated = generateDeliveryToken();
    deliveryToken = generated.token;
    deliveryTokenHash = generated.hash;
  }

  const now = new Date().toISOString();

  // 4. Transition to PAID (atomic update)
  const { data: updatedOrder, error: updateError } = await client
    .from("orders")
    .update({
      status: "paid",
      razorpay_payment_id: params.razorpayPaymentId,
      razorpay_signature: params.razorpaySignature || existingOrder.razorpay_signature,
      delivery_token_hash: deliveryTokenHash,
      paid_at: now,
      updated_at: now,
    })
    .eq("id", params.orderId)
    .select("*")
    .single();

  if (updateError || !updatedOrder) {
    throw new Error(`Failed to transition order to paid: ${updateError?.message}`);
  }

  const paidOrder = updatedOrder as OrderRecord;
  logStoreEvent("PAYMENT_VERIFIED", {
    orderId: paidOrder.id,
    productId: paidOrder.product_id,
    status: "paid",
  });

  // 5. Fetch product details to verify digital asset requirements
  const { data: productData } = await client
    .from("products")
    .select("id, title, product_type, storage_asset_path")
    .eq("id", paidOrder.product_id)
    .maybeSingle();

  const baseUrl = params.baseUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://shivsastra.com";
  let downloadUrl: string | null = null;

  if (productData?.storage_asset_path && deliveryToken) {
    downloadUrl = `${baseUrl.replace(/\/$/, "")}/api/store/download/${paidOrder.id}?token=${deliveryToken}`;
  }

  // 6. Send Resend confirmation email
  logStoreEvent("DELIVERY_STARTED", {
    orderId: paidOrder.id,
    deliveryStatus: "pending",
  });

  let deliveryEmailSent = false;
  try {
    const formattedAmount = formatPrice(paidOrder.amount_cents, paidOrder.currency);
    const emailResult = await sendPurchaseDeliveryEmail({
      customerEmail: paidOrder.customer_email,
      orderId: paidOrder.id,
      productTitle: paidOrder.product_title_snapshot,
      productType: productData?.product_type || "Digital Release",
      amountFormatted: formattedAmount,
      paidAt: now,
      downloadUrl,
    });

    if (emailResult.success) {
      deliveryEmailSent = true;
      if (canTransitionDeliveryStatus(paidOrder.delivery_status, "sent")) {
        await client
          .from("orders")
          .update({ delivery_status: "sent", updated_at: new Date().toISOString() })
          .eq("id", paidOrder.id);
        paidOrder.delivery_status = "sent";
      }
      logStoreEvent("DELIVERY_SENT", {
        orderId: paidOrder.id,
        deliveryStatus: "sent",
      });
    } else {
      // Do not reverse paid status; mark delivery failed for admin retry
      if (canTransitionDeliveryStatus(paidOrder.delivery_status, "failed")) {
        await client
          .from("orders")
          .update({ delivery_status: "failed", updated_at: new Date().toISOString() })
          .eq("id", paidOrder.id);
        paidOrder.delivery_status = "failed";
      }
      logStoreEvent("DELIVERY_FAILED", {
        orderId: paidOrder.id,
        deliveryStatus: "failed",
        note: "Email service reported failure; paid status preserved",
      });
    }
  } catch (err) {
    console.error("[ORDERS] Delivery email dispatch failed:", err instanceof Error ? err.message : "Unknown");
    if (canTransitionDeliveryStatus(paidOrder.delivery_status, "failed")) {
      await client
        .from("orders")
        .update({ delivery_status: "failed", updated_at: new Date().toISOString() })
        .eq("id", paidOrder.id);
      paidOrder.delivery_status = "failed";
    }
    logStoreEvent("DELIVERY_FAILED", {
      orderId: paidOrder.id,
      deliveryStatus: "failed",
      note: "Email dispatch exception; paid status preserved",
    });
  }

  logStoreEvent("ORDER_SETTLED", {
    orderId: paidOrder.id,
    status: paidOrder.status,
    deliveryStatus: paidOrder.delivery_status,
  });

  return {
    order: paidOrder,
    alreadyPaid: false,
    deliveryEmailSent,
    deliveryToken,
  };
}

/**
 * Creates short-lived signed storage URL from private 'store-assets' bucket.
 * Bucket is private; signed URL expires in 10 minutes (600s).
 */
export async function createShortLivedStorageUrl(
  storageAssetPath: string,
  expiresInSeconds: number = 600
): Promise<string | null> {
  const client = getSupabaseServerClient();
  if (!client) {
    return null;
  }

  try {
    const { data, error } = await client.storage
      .from("store-assets")
      .createSignedUrl(storageAssetPath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      console.error("[STORAGE] createSignedUrl error:", error?.message);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("[STORAGE] createSignedUrl exception:", err);
    return null;
  }
}

/**
 * Verifies if an email is eligible to submit a verified purchase review.
 * Phase 21: Derived from verified paid order + matching product.
 */
export async function checkReviewEligibility(
  productId: string,
  email: string
): Promise<boolean> {
  const client = getSupabaseServerClient();
  if (!client || !productId || !email) return false;

  try {
    const { data, error } = await client
      .from("orders")
      .select("id")
      .eq("product_id", productId)
      .eq("customer_email", email.toLowerCase().trim())
      .eq("status", "paid")
      .limit(1);

    if (error || !data || data.length === 0) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves all orders for administrative audit and management.
 */
export async function getAllOrdersForAdmin(options?: {
  limit?: number;
  offset?: number;
}): Promise<OrderRecord[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  try {
    let query = client
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }

    return data as OrderRecord[];
  } catch (err) {
    console.error("[ORDERS ADMIN QUERY EXCEPTION]", err);
    return [];
  }
}
