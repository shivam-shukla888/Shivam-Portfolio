# STORE V3 — PHASE 1: RAZORPAY CHECKOUT & VERIFIED PAYMENT FOUNDATION

> **CRITICAL SECURITY NOTICE**
> **"Browser payment success is not payment verification."**
> A browser-side payment callback from Razorpay Checkout is an unauthenticated client notification. Orders must **NEVER** be marked paid or fulfilled until the server cryptographically validates the HMAC-SHA256 signature using the secret key or receives a verified webhook event.

---

## 1. System Architecture Overview

ShivSastra Store V1 implements a secure, database-authoritative purchase and digital delivery lifecycle for digital assets without requiring customer account registration.

```
Visitor (Browser)                 Server API Layer                   Razorpay / Supabase / Resend
       │                                 │                                          │
       │─── 1. POST /api/store/checkout ─▶ Validate Input via Zod                   │
       │    (productId, email)           │ Fetch Product from Database              │
       │                                 │ Enforce Database Price & Currency        │
       │                                 │ Create Internal Order (Status: pending)  │
       │                                 │─── Create Gateway Order ────────────────▶│ (Basic Auth: key_id:secret)
       │                                 │◀── Return Razorpay Order ID ─────────────│
       │◀── Return { orderId, keyId } ───│                                          │
       │                                 │                                          │
       │─── 2. Launch Razorpay Modal ────┼─────────────────────────────────────────▶│
       │◀── Browser Success Callback ────┼──────────────────────────────────────────│
       │    (orderId, paymentId, sig)    │                                          │
       │                                 │                                          │
       │─── 3. POST /verify-payment ────▶│ Timing-Safe HMAC-SHA256 Signature Check  │
       │                                 │ Idempotent Order State Transition (paid) │
       │                                 │ Generate 256-bit Delivery Token          │
       │                                 │ Dispatch Delivery Email Non-Blocking ───▶│ (Resend API)
       │◀── Return Success + Download ───│                                          │
       │                                 │                                          │
       │                                 │◀── 4. Webhook: order.paid / captured ────│ (Raw Body HMAC-SHA256)
       │                                 │    Idempotent Background State Settlement│
```

---

## 2. Environment Variables

The following environment variables govern payment processing, webhooks, and private delivery. 
Never expose secrets or commit real credentials to version control.

| Variable Name | Environment | Browser Exposed? | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client / Server | Yes | Public Razorpay key used by browser to open checkout modal |
| `RAZORPAY_KEY_ID` | Server only | **NO** | Gateway API identifier for Basic Auth |
| `RAZORPAY_KEY_SECRET` | Server only | **NO** | Gateway secret key for order creation & HMAC verification |
| `RAZORPAY_WEBHOOK_SECRET` | Server only | **NO** | Shared secret to cryptographically verify webhook payloads |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | **NO** | Supabase key for privileged order management and private signed URLs |
| `RESEND_API_KEY` | Server only | **NO** | Resend API credential to dispatch delivery confirmation emails |

---

## 3. Order Lifecycle & State Machine

Every purchase proceeds through an internal, controlled state transition. Unauthenticated public visitors cannot manipulate database order records.

```
       ┌───────────┐
       │  pending  │ (Order created; awaiting payment at gateway)
       └─────┬─────┘
             │
     ┌───────┴───────────────────────┐
     ▼                               ▼
┌─────────┐                    ┌───────────┐
│  paid   │                    │  failed   │
└────┬────┘                    └───────────┘
     │ (Verified payment)            ▲
     │                               │
     ▼                               │
┌──────────────┐                     │
│  cancelled   │─────────────────────┘
└──────────────┘
```

### Order Statuses
- **`pending`**: Order created on server; pending visitor payment completion and verification.
- **`paid`**: Cryptographically verified via HMAC signature or webhook. Digital fulfillment authorized.
- **`failed`**: Payment authorization failed or signature verification failed.
- **`cancelled`**: Visitor dismissed modal or checkout expired.

### Delivery Statuses
- **`pending`**: Delivery token generated; email dispatch queued.
- **`sent`**: Delivery email successfully dispatched through Resend.
- **`failed`**: Delivery email dispatch encountered an error. Order status remains `paid`.

---

## 4. Payment Verification Architecture

### Dual-Verification Strategy
Payment settlement is handled through two independent, cryptographically validated channels:

1. **Immediate Modal Verification (`POST /api/store/verify-payment`)**:
   - Client sends `{ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }`.
   - Server re-calculates: `HMAC_SHA256(razorpayOrderId + "|" + razorpayPaymentId, RAZORPAY_KEY_SECRET)`.
   - Verified using `crypto.timingSafeEqual` with strict buffer length checks to eliminate timing attacks.
   - Internal order is retrieved using `SUPABASE_SERVICE_ROLE_KEY`. Verified that `orders.razorpay_order_id === razorpayOrderId`.
   - Order marked `paid`.

2. **Asynchronous Webhook Settlement (`POST /api/webhooks/razorpay`)**:
   - Razorpay fires `order.paid` or `payment.captured` directly to `/api/webhooks/razorpay`.
   - Raw request body read before JSON parsing.
   - Verified using `HMAC_SHA256(rawBody, RAZORPAY_WEBHOOK_SECRET)` via `crypto.timingSafeEqual`.
   - Resolves internal order by `razorpay_order_id` and marks `paid` if not already settled.

---

## 5. Deterministic Idempotency

Both the verification endpoint and the webhook handler implement strict idempotency:

- If an order is already marked `paid`:
  - No new order rows are inserted.
  - No duplicate delivery emails are sent.
  - No duplicate tokens are minted.
  - The endpoint returns `{ success: true, alreadyProcessed: true }` with the existing delivery token.
- Reprocessed webhooks exit with HTTP `200 OK` immediately upon discovering `order.status === "paid"`.

---

## 6. Secure Digital Delivery Flow

### Asset Privacy Guarantees
- The `products.storage_asset_path` column is **strictly private**. It is omitted from all public GraphQL/REST responses, HTML source, serialized JSON, and client bundles.
- Products assets reside in a private Supabase Storage bucket (`store-assets`). Public read access is completely disabled.

### High-Entropy Token Delivery
- Direct downloads utilize a 256-bit cryptographically secure token (`crypto.randomBytes(32).toString("hex")`).
- The plain token is sent only to the customer's email and displayed in the immediate post-payment success card.
- The database stores only the SHA-256 hash: `orders.delivery_token_hash`.
- Download endpoint: `GET /api/store/download/[orderId]?token=...`
  - Validates `order.status === "paid"`.
  - Verifies token hash timing-safely.
  - Queries `products.storage_asset_path` via service role.
  - Generates a short-lived (10-minute / 600-second) signed URL via Supabase Storage.
  - Redirects customer directly to the temporary download stream.

---

## 7. Price Tampering & Security Protections

1. **Client Price Stripping**:
   - `checkoutRequestSchema` explicitly ignores any client-supplied `amount`, `price`, `currency`, or `storage_asset_path`.
   - The authoritative price is read from `products.price_in_cents` in the database.
2. **Availability Check**:
   - Products with `is_available === false` or deleted records are rejected with HTTP 400.
3. **Email Normalization**:
   - Customer email is trimmed, lowercased, and validated via Zod.
4. **AI Isolation**:
   - The public ShivSastra AI Assistant has **zero** access to payment tools, Razorpay APIs, customer orders, or delivery endpoints.
5. **Sanitized Errors**:
   - Client responses never expose database connection strings, stack traces, or gateway secret keys.

---

## 8. Live Setup Status & Pending Checkpoints

In accordance with Database-Independent / No MCP mode, this foundation is fully coded, type-checked, and unit-tested without fabricating live cloud state.

| Component | Status | Required Action Upon Deployment |
| :--- | :--- | :--- |
| **Orders Database Migration** | `PENDING LIVE SUPABASE` | Apply `supabase/migrations/20260924000001_store_orders_and_delivery.sql` via Supabase Dashboard or CLI. |
| **RLS Policies** | `PENDING LIVE SUPABASE` | Verify live row-level security policies deny public table access. |
| **Private Storage Bucket** | `PENDING LIVE STORAGE` | Create private bucket `store-assets` and upload digital ZIP/PDF deliverables. |
| **Razorpay Credentials** | `PENDING RAZORPAY CREDENTIALS` | Populate `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` in `.env.local` / host environment. |
| **Webhook Endpoint Configuration**| `PENDING LIVE CONFIGURATION` | Configure Razorpay dashboard webhook to point to `https://<domain>/api/webhooks/razorpay` with `order.paid` event. |
| **End-to-End Live Payment** | `PENDING REAL PAYMENT TEST` | Execute sandbox transaction with Razorpay test card / UPI. |


---

## 9. Razorpay Sandbox Checkout & Refund Test

The Spring Boot starter has a dedicated sandbox path. It is hidden from the purchasable catalog and can only create a fixed ₹1 INR order when the server is explicitly enabled with a Test Mode key. It does not deliver the upcoming template or send a purchase email.

### Preview / local environment

Use freshly generated Razorpay Test Mode keys. A key secret previously pasted into a chat must be regenerated before testing.

Set these server environment values in .env.local for local testing or in a non-production preview environment:

~~~env
RAZORPAY_KEY_ID=rzp_test_<fresh-key-id>
RAZORPAY_KEY_SECRET=<fresh-test-key-secret>
RAZORPAY_TEST_CHECKOUT_ENABLED=true
RAZORPAY_WEBHOOK_SECRET=<test-mode-webhook-secret>
~~~

Keep the flag false or unset in production. Never add the secret to a NEXT_PUBLIC_* variable.

### One-time setup

1. Apply supabase/migrations/20261025000001_razorpay_sandbox_refunds.sql to the project database. It adds the hidden Spring Boot test record, a refund reference, and the refund_pending order state.
2. In Razorpay Test Mode, configure a webhook to https://<preview-domain>/api/webhooks/razorpay with the same webhook secret and events payment.captured, order.paid, refund.processed, and refund.failed.
3. Restart the local app or redeploy the preview after environment changes.

### End-to-end check

1. Open /store/spring-boot-starter. It shows a ₹1 sandbox checkout only when the test key and flag are active.
2. Enter an email and continue. Razorpay Checkout opens with ShivSastra branding.
3. Close the Razorpay window to test cancellation. No successful payment is recorded and no refund is needed. Razorpay Test Mode is simulated and moves no real money.
4. Complete a successful test transaction to verify the server signature, internal order state, and Razorpay webhook.
5. On the success panel, select Refund this test payment. If Razorpay reports a pending refund, the same button checks that refund instead of creating another. The webhook updates the final refund state.
6. Check Razorpay Dashboard in Test Mode → Transactions and confirm the payment/refund statuses.

A modal dismissal is not a captured payment, so it cannot be refunded. The refund control appears only after a signature-verified payment. The separate live-test refund path below is disabled by default and limited to the configured tester email.

## 10. Restricted Live ₹1 Payment Verification

This is a payment-flow verification tool, not a product launch. The Spring Boot starter remains marked upcoming; a successful ₹1 payment records a verified payment only and never sends a download, purchase email, or product access. The buyer can request a refund from the confirmation panel after payment verification. Closing checkout before capture does not create a refundable payment.

Enable only for a short supervised test after the Razorpay account is live and the refund webhook is configured. In Vercel Production Environment Variables, set `RAZORPAY_LIVE_TEST_CHECKOUT_ENABLED=true` and `RAZORPAY_LIVE_TEST_EMAIL` to the single tester email. Keep `RAZORPAY_TEST_CHECKOUT_ENABLED=false`; use the `rzp_live_` key ID and the matching server-only live secret. Never expose the secret in a `NEXT_PUBLIC_*` variable. Redeploy after changing variables. The order API fixes the amount to ₹1 INR, rejects other products, checks the allowlisted email server-side, and records this order without fulfilling a product. Disable the live-test flag after the test.

A captured live payment moves real money until Razorpay processes the refund; refund timing depends on the payment method and bank. Verify the payment and refund in Razorpay Live Mode → Transactions before repeating a test. A checkout dismissal by itself does not debit or refund money.
