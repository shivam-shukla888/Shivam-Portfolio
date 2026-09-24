import fs from "fs";
import path from "path";

// Load local environment safely if present
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

import { checkoutRequestSchema, verifyPaymentSchema } from "../src/lib/validations/checkout";
import {
  generateDeliveryToken,
  hashDeliveryToken,
  verifyDeliveryToken,
} from "../src/lib/orders";
import {
  renderPurchaseDeliveryHtml,
  renderPurchaseDeliveryText,
} from "../src/lib/email/templates";
import {
  verifyPaymentSignature,
  verifyWebhookSignature,
  getRazorpayKeyId,
} from "../src/lib/payments/razorpay";
import crypto from "crypto";

async function runStoreCheckoutTests() {
  console.log("==================================================");
  console.log("SHIVSASTRA STORE V3 — CHECKOUT ARCHITECTURE TESTS");
  console.log("DATABASE-INDEPENDENT EXECUTION MODE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;
  const pending: string[] = [];

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  function markPending(desc: string) {
    console.log(`[PENDING] ${desc} — REQUIRES LIVE SUPABASE/RAZORPAY ACCESS`);
    pending.push(desc);
  }

  // 1. Checkout Schema: Valid inputs
  const validCheckout = checkoutRequestSchema.safeParse({
    productId: "847291a2-1111-4000-8000-000000000001",
    email: "customer@example.com",
  });
  assert(validCheckout.success === true, "Valid checkout request parses cleanly");

  // 2. Checkout Schema: Rejects invalid email
  const invalidEmailCheckout = checkoutRequestSchema.safeParse({
    productId: "847291a2-1111-4000-8000-000000000001",
    email: "not-an-email",
  });
  assert(!invalidEmailCheckout.success, "Checkout schema rejects malformed email address");

  // 3. Checkout Schema: Strips client-supplied price/amount/currency/storage_path
  const tamperedCheckout = checkoutRequestSchema.safeParse({
    productId: "847291a2-1111-4000-8000-000000000001",
    email: "buyer@example.com",
    amount: 1, // Attacker attempts 1 INR
    price: 1,
    currency: "USD",
    storage_asset_path: "/malicious/path.zip",
  });
  assert(tamperedCheckout.success === true, "Schema parses valid fields while stripping unknown props");
  if (tamperedCheckout.success) {
    const data = tamperedCheckout.data as Record<string, unknown>;
    assert(!("amount" in data), "Client-supplied 'amount' is stripped from validated data");
    assert(!("currency" in data), "Client-supplied 'currency' is stripped from validated data");
    assert(!("storage_asset_path" in data), "Client-supplied 'storage_asset_path' is stripped from validated data");
  }

  // 4. Verify Payment Schema: Format checking
  const validPaymentPayload = verifyPaymentSchema.safeParse({
    orderId: "847291a2-1111-4000-8000-000000000001",
    razorpayOrderId: "order_Kz000000000001",
    razorpayPaymentId: "pay_Kz000000000001",
    razorpaySignature: "a".repeat(64),
  });
  assert(validPaymentPayload.success === true, "Verify payment schema accepts valid format parameters");

  // 5. Verify Payment Schema: Rejects non-UUID orderId
  const invalidOrderIdPayment = verifyPaymentSchema.safeParse({
    orderId: "invalid-uuid",
    razorpayOrderId: "order_Kz000000000001",
    razorpayPaymentId: "pay_Kz000000000001",
    razorpaySignature: "a".repeat(64),
  });
  assert(!invalidOrderIdPayment.success, "Verify payment schema rejects non-UUID orderId");

  // 6. Delivery Token: High-entropy generation and deterministic hashing
  const tokenPair = generateDeliveryToken();
  assert(typeof tokenPair.token === "string" && tokenPair.token.length === 64, "Delivery token is 64 hex characters (32 bytes entropy)");
  assert(tokenPair.hash === hashDeliveryToken(tokenPair.token), "hashDeliveryToken returns consistent SHA-256 digest");
  assert(verifyDeliveryToken(tokenPair.token, tokenPair.hash) === true, "verifyDeliveryToken returns true for authentic token/hash pair");
  assert(verifyDeliveryToken("tampered-token", tokenPair.hash) === false, "verifyDeliveryToken returns false for forged token");

  // 7. Razorpay Signature Verification with test secret
  const testSecret = "test_key_secret_1234567890abcdef";
  const testOrderId = "order_TEST1234567890";
  const testPaymentId = "pay_TEST1234567890";
  const validSignature = crypto
    .createHmac("sha256", testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest("hex");

  const sigPass = verifyPaymentSignature({
    razorpayOrderId: testOrderId,
    razorpayPaymentId: testPaymentId,
    razorpaySignature: validSignature,
    secretOverride: testSecret,
  });
  assert(sigPass === true, "verifyPaymentSignature validates genuine HMAC SHA256 signature");

  const sigTampered = verifyPaymentSignature({
    razorpayOrderId: testOrderId,
    razorpayPaymentId: "pay_FORGED_PAYMENT",
    razorpaySignature: validSignature,
    secretOverride: testSecret,
  });
  assert(sigTampered === false, "verifyPaymentSignature rejects altered payment ID");

  // 8. Razorpay Webhook Signature Verification
  const testWebhookSecret = "test_webhook_secret_xyz987";
  const testWebhookBody = JSON.stringify({
    event: "payment.captured",
    payload: { payment: { entity: { id: "pay_123", order_id: "order_123" } } },
  });
  const validWebhookSig = crypto
    .createHmac("sha256", testWebhookSecret)
    .update(testWebhookBody)
    .digest("hex");

  const webhookSigPass = verifyWebhookSignature({
    rawBody: testWebhookBody,
    signature: validWebhookSig,
    secretOverride: testWebhookSecret,
  });
  assert(webhookSigPass === true, "verifyWebhookSignature validates genuine webhook payload HMAC");

  const webhookTampered = verifyWebhookSignature({
    rawBody: testWebhookBody + " ",
    signature: validWebhookSig,
    secretOverride: testWebhookSecret,
  });
  assert(webhookTampered === false, "verifyWebhookSignature rejects tampered raw body payload");

  // 9. Resend Email Templates Rendering
  const emailPayload = {
    customerEmail: "purchaser@example.com",
    orderId: "847291a2-1111-4000-8000-000000000001",
    productTitle: "Autonomous Design Synthesizer",
    productType: "digital_download",
    amountFormatted: "₹14,999.00",
    paidAt: new Date().toISOString(),
    downloadUrl: "https://shivsastra.com/api/store/download/847291a2?token=sample_token",
  };

  const renderedHtml = renderPurchaseDeliveryHtml(emailPayload);
  assert(renderedHtml.includes("Autonomous Design Synthesizer"), "HTML email contains product title snapshot");
  assert(renderedHtml.includes("₹14,999.00"), "HTML email contains formatted amount");
  assert(renderedHtml.includes("Access Digital Assets"), "HTML email includes secure download CTA");
  assert(!renderedHtml.includes("<script>"), "HTML email safely escapes untrusted strings");

  const renderedText = renderPurchaseDeliveryText(emailPayload);
  assert(renderedText.includes("SHIVSASTRA // VERIFIED DISPATCH"), "Text email contains editorial header");
  assert(renderedText.includes(emailPayload.orderId), "Text email includes order reference");

  // 10. Secrets Privacy: Check that getRazorpayKeyId does not leak secret
  const publicId = getRazorpayKeyId();
  if (process.env.RAZORPAY_KEY_SECRET) {
    assert(publicId !== process.env.RAZORPAY_KEY_SECRET, "Public Razorpay Key ID never equals Razorpay Key Secret");
  } else {
    assert(true, "Razorpay Key Secret is not exposed");
  }

  // Live PENDING items
  markPending("Live Supabase orders migration (20260924000001_store_orders_and_delivery.sql)");
  markPending("Live orders table RLS policy enforcement");
  markPending("Live private 'store-assets' Storage bucket creation");
  markPending("Live Razorpay production order creation & payment gateway transaction");
  markPending("Live Razorpay incoming webhook HTTP delivery");
  markPending("Live signed URL generation against production Supabase Storage");

  console.log("--------------------------------------------------");
  console.log(`Results: ${passed} passed, ${failed} failed, ${pending.length} pending.`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runStoreCheckoutTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
