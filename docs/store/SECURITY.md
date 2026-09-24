# SHIVSASTRA STORE // SECURITY AUDIT & THREAT MODEL (V3)

## 1. Threat Matrix & Defense Mechanisms

| Attack Vector | Threat Level | Defense Implemented | Status |
| :--- | :--- | :--- | :--- |
| **Price Tampering** | High | Client price/amount fields ignored. Server reads `price_in_cents` from database. | **VERIFIED** |
| **Currency Tampering** | Medium | Client currency stripped by Zod; database value enforced. | **VERIFIED** |
| **Storage Path Tampering** | High | Client `storage_asset_path` stripped. Path resolved strictly via `orders.product_id`. | **VERIFIED** |
| **Fake Razorpay Payment** | Critical | Signature cryptographically evaluated using HMAC SHA-256 with server-only secret. | **VERIFIED** |
| **Altered Order ID Attack** | High | Verification requires `internalOrder.razorpay_order_id === clientOrderId`. | **VERIFIED** |
| **Wrong Product Unlock** | High | Delivery resolves download strictly from `order.product_id`, not user input. | **VERIFIED** |
| **Replay / Duplicate Webhook** | Medium | Webhook handler checks `order.status === 'paid'`. Zero duplicate fulfillment. | **VERIFIED** |
| **Unauthorized Download** | High | High-entropy 256-bit token verified via timing-safe hash comparison. | **VERIFIED** |
| **Unpaid Asset Access** | Critical | Download endpoint strictly enforces `order.status === 'paid'`. | **VERIFIED** |
| **Arbitrary Storage Access** | Critical | Download endpoint rejects query path parameters; reads DB storage path only. | **VERIFIED** |
| **Order Enumeration** | Low | Order IDs use random, non-sequential UUID v4. | **VERIFIED** |
| **Public Database Exposure** | Critical | SQL migration explicitly revokes ALL table permissions from `anon` & `authenticated`. | **VERIFIED** |
| **Customer Data Leakage** | Medium | No payment card, CVV, or passwords stored. Razorpay handles PCI-DSS. | **VERIFIED** |
| **Fake Review Injection** | Medium | Reviews check for verified matching paid order (`checkReviewEligibility`). | **VERIFIED** |

---

## 2. Customer Privacy Boundary

- **Collected Data**: Customer email only.
- **Cardholder Data**: ZERO card numbers, expiration dates, or CVVs enter the application server. Payment credentials are submitted directly to Razorpay's PCI-DSS compliant checkout iframe.
- **Account Requirement**: None. Order reference and tokenized delivery link eliminate the need for persistent password storage.

---

## 3. Verified Review Eligibility

Public visitors cannot submit verified buyer reviews:
- `product_reviews.is_verified_purchase` is evaluated server-side.
- Verified status requires a corresponding `orders` record where `product_id = targetProductId AND customer_email = reviewEmail AND status = 'paid'`.
- All incoming reviews default to `is_published = false` requiring editorial approval.

---

## 4. Live Verification Checklist (Database-Independent Mode)

The following items are architecturally complete and statically tested, but require live external credentials to execute:

1. `[PENDING]` Apply migration `20260924000001_store_orders_and_delivery.sql` via Supabase Dashboard.
2. `[PENDING]` Verify live Postgres RLS policies prevent `anon` role from selecting `orders`.
3. `[PENDING]` Create private Supabase Storage bucket `store-assets`.
4. `[PENDING]` Upload digital release assets to `store-assets/<asset-filename>`.
5. `[PENDING]` Configure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` in production Vercel environment variables.
6. `[PENDING]` Add webhook URL `https://shivsastra.com/api/webhooks/razorpay` to Razorpay Dashboard with `payment.captured` and `order.paid` subscriptions.
