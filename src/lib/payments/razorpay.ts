if (typeof window !== "undefined") {
  throw new Error("This module cannot be executed on the client");
}

import crypto from "crypto";

export interface CreateOrderParams {
  amountCents: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayRefundResult {
  id: string;
  payment_id: string;
  amount: number;
  status?: "pending" | "processed" | "failed";
}

/**
 * Validates whether required Razorpay server environment credentials are set.
 */
export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return Boolean(keyId && keySecret && keyId.trim().length > 0 && keySecret.trim().length > 0);
}

/**
 * Validates whether the active Razorpay credentials belong to Live Mode (starts with rzp_live_).
 */
export function isRazorpayLiveMode(): boolean {
  const keyId = getRazorpayKeyId();
  return Boolean(keyId && keyId.startsWith("rzp_live_"));
}

/**
 * Returns the public Razorpay Key ID for client-side modal initiation.
 */
export function getRazorpayKeyId(): string | null {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  return keyId ? keyId.trim() : null;
}

/**
 * Returns the server-only Razorpay Key Secret.
 * Throws if unconfigured.
 */
function getRazorpayKeySecret(): string {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || keySecret.trim().length === 0) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured on the server");
  }
  return keySecret.trim();
}

/**
 * Returns the server-only Razorpay Webhook Secret.
 * Throws if unconfigured.
 */
function getRazorpayWebhookSecret(): string {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret || webhookSecret.trim().length === 0) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured on the server");
  }
  return webhookSecret.trim();
}

export interface RazorpayPaymentDetails {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  order_id: string;
  method?: string;
  email?: string;
  contact?: string;
  captured?: boolean;
}

/**
 * Fetches verified payment details directly from the Razorpay API.
 */
export async function fetchRazorpayPayment(paymentId: string): Promise<RazorpayPaymentDetails> {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server");
  }

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    let errorDetail = "Failed to fetch Razorpay payment";
    try {
      const errorJson = await response.json();
      if (errorJson?.error?.description) {
        errorDetail = errorJson.error.description;
      }
    } catch {}
    throw new Error(`Razorpay payment fetch failed: ${errorDetail}`);
  }

  return response.json();
}

/**
 * Explicitly captures an authorized payment via Razorpay Payments API.
 */
export async function captureRazorpayPayment(
  paymentId: string,
  amountCents: number,
  currency: string = "INR"
): Promise<RazorpayPaymentDetails> {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server");
  }

  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount: amountCents,
      currency: currency.toUpperCase(),
    }),
  });

  if (!response.ok) {
    let errorDetail = "Failed to capture Razorpay payment";
    try {
      const errorJson = await response.json();
      if (errorJson?.error?.description) {
        errorDetail = errorJson.error.description;
      }
    } catch {}
    throw new Error(`Razorpay payment capture failed: ${errorDetail}`);
  }

  return response.json();
}

/**
 * Creates an authorized order record on Razorpay servers using Basic Auth.
 * Amounts are always converted to integer paise/cents.
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrderResult> {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();

  if (!keyId) {
    throw new Error("RAZORPAY_KEY_ID is not configured");
  }

  if (!Number.isInteger(params.amountCents) || params.amountCents < 100) {
    throw new Error("Order amount must be an integer of at least 100 paise (1 INR)");
  }

  const currency = (params.currency || "INR").toUpperCase().trim();
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount: params.amountCents,
      currency,
      receipt: params.receipt.slice(0, 40),
      notes: params.notes || {},
    }),
  });

  if (!response.ok) {
    let errorDetail = "Failed to create Razorpay order";
    try {
      const errorJson = await response.json();
      if (errorJson && errorJson.error && errorJson.error.description) {
        errorDetail = errorJson.error.description;
      }
    } catch {
      // Ignore JSON parse error from upstream
    }
    throw new Error(`Razorpay order creation failed: ${errorDetail}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    amount: data.amount,
    currency: data.currency,
    receipt: data.receipt,
  };
}

/**
 * Initiates a refund for a verified paid order via Razorpay API.
 */
export async function createRazorpayRefund(params: {
  paymentId: string;
  amountCents: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayRefundResult> {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server");
  }
  if (!/^pay_[A-Za-z0-9]+$/.test(params.paymentId) || !Number.isInteger(params.amountCents) || params.amountCents < 100) {
    throw new Error("Invalid refund request parameters");
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(params.paymentId)}/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      amount: params.amountCents,
      notes: params.notes || { internal_order: params.receipt },
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.id || data.payment_id !== params.paymentId) {
    throw new Error(data?.error?.description || "Razorpay could not create the refund");
  }

  return { id: data.id, payment_id: data.payment_id, amount: data.amount, status: data.status };
}

/**
 * Retrieves refund status from Razorpay API.
 */
export async function getRazorpayRefund(refundId: string): Promise<RazorpayRefundResult> {
  const keyId = getRazorpayKeyId();
  const keySecret = getRazorpayKeySecret();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server");
  }
  if (!/^rfnd_[A-Za-z0-9]+$/.test(refundId)) {
    throw new Error("Invalid refund identifier format");
  }
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/refunds/${encodeURIComponent(refundId)}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.id) {
    throw new Error(data?.error?.description || "Unable to check the refund status");
  }
  return { id: data.id, payment_id: data.payment_id, amount: data.amount, status: data.status };
}

export function verifyPaymentSignature({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  secretOverride,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  secretOverride?: string;
}): boolean {
  try {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return false;
    }

    const secret = secretOverride || getRazorpayKeySecret();
    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf8");
    const actualBuf = Buffer.from(razorpaySignature, "utf8");

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch (err) {
    console.error("[PAYMENT SIGNATURE VERIFICATION ERROR]", err instanceof Error ? err.message : "Unknown");
    return false;
  }
}

/**
 * Cryptographically verifies Razorpay webhook HMAC signature using timing-safe comparison.
 * Formula: HMAC_SHA256(rawBody, webhookSecret) == x-razorpay-signature
 */
export function verifyWebhookSignature({
  rawBody,
  signature,
  secretOverride,
}: {
  rawBody: string;
  signature: string;
  secretOverride?: string;
}): boolean {
  try {
    if (!rawBody || !signature) {
      return false;
    }

    const secret = secretOverride || getRazorpayWebhookSecret();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf8");
    const actualBuf = Buffer.from(signature, "utf8");

    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch (err) {
    console.error("[WEBHOOK SIGNATURE VERIFICATION ERROR]", err instanceof Error ? err.message : "Unknown");
    return false;
  }
}
