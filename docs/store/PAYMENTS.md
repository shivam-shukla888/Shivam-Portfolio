# SHIVSASTRA STORE // PAYMENTS ARCHITECTURE & SPECIFICATION (V3)

## 1. Executive Summary & Flow Overview

The ShivSastra Store purchase flow is built on a zero-trust model where the browser provides only the minimal customer email and product identifier. All critical commercial properties (amount, currency, storage path, availability) are resolved authoritatively on the server.

```
Visitor
 ↓
Product Detail Page (/store/[slug])
 ↓
Buy Now CTA (ProductCheckoutAction.tsx)
 ↓
Email Collection (No account required)
 ↓
Server Endpoint: POST /api/store/checkout
 (Validates availability, reads price from DB, creates internal order, creates Razorpay order)
 ↓
Browser opens Razorpay Checkout Modal (using public key & server order_id)
 ↓
Customer Completes Payment
 ↓
Browser receives Razorpay Payment Credentials
 ↓
Server Verification: POST /api/store/verify-payment
 (HMAC SHA-256 signature verification using server secret)
 ↓
Webhook Fallback: POST /api/webhooks/razorpay
 (Raw body HMAC SHA-256 verification; idempotent state settlement)
 ↓
Order Transitions to PAID
 ↓
Digital Delivery Triggered (Resend Email + Signed Storage URL)
```

---

## 2. Razorpay Trust Boundary

1. **Client Trust Level**: ZERO.
   - The browser never supplies price, currency, or entitlements.
   - Any client-submitted `amount`, `currency`, `price`, or `storage_asset_path` is stripped by Zod schemas.
2. **Secret Isolation**:
   - `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are strictly server-only environment variables.
   - Any attempt to import them or execute `razorpay.ts` on the browser immediately throws a runtime error.
   - Only `RAZORPAY_KEY_ID` (or `NEXT_PUBLIC_RAZORPAY_KEY_ID`) is shared with the client.
3. **Price Authority**:
   - The price charged to Razorpay is derived exclusively from `public.products.price_in_cents` in Supabase Postgres.

---

## 3. Order State Machine

Orders progress deterministically through explicit states:

```
[ pending ] ──(signature verified / webhook captured)──> [ paid ]
     │
     ├──(gateway rejection / user close)───────────────> [ cancelled / failed ]
     │
     └──(administrative settlement)───────────────────> [ refunded ]
```

- **`pending`**: Order created internally; awaiting payment gateway processing.
- **`paid`**: Cryptographically verified via HMAC signature; eligible for digital delivery and verified review.
- **`failed`**: Payment declined or interrupted.
- **`cancelled`**: Session dismissed by user.
- **`refunded`**: Manually or programmatically refunded.

---

## 4. Payment Signature Verification

Payment signature verification occurs strictly on the server:

$$\text{expectedSignature} = \text{HMAC\_SHA256}(\text{razorpay\_order\_id} \parallel "|" \parallel \text{razorpay\_payment\_id}, \text{RAZORPAY\_KEY\_SECRET})$$

Both signatures are compared using Node.js `crypto.timingSafeEqual` after buffer length verification to eliminate timing attack vectors.

---

## 5. Webhook Signature Verification & Idempotency

- Endpoint: `POST /api/webhooks/razorpay`
- **Raw Request Body**: The raw text body is read before any JSON parsing.
- **HMAC Verification**: Evaluated using `RAZORPAY_WEBHOOK_SECRET`.
- **Idempotent Settlement**:
  - Webhooks check whether `order.status === 'paid'`.
  - If already paid, the endpoint returns HTTP 200 `{ received: true, alreadyPaid: true }` without duplicating delivery emails or regenerating tokens.

---

## 6. Live Activation Status

| Component | Status | Next Live Step |
| :--- | :--- | :--- |
| Checkout Schema & Validation | **PASS** | Automated tests passing |
| Server Order Generation | **PASS** | Ready for live keys |
| Cryptographic Signature Verification | **PASS** | Validated with test HMAC suites |
| Webhook Verification & Idempotency | **PASS** | Validated with replay suites |
| Live Orders Table Migration | **PENDING** | Apply `20260924000001_store_orders_and_delivery.sql` via Supabase Dashboard / CLI |
| Live Razorpay Credentials | **PENDING** | Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` to environment |
| Live Webhook URL Configuration | **PENDING** | Register `https://shivsastra.com/api/webhooks/razorpay` in Razorpay Dashboard |
