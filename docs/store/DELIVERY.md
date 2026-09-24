# SHIVSASTRA STORE // SECURE DIGITAL DELIVERY SPECIFICATION (V3)

## 1. Digital Delivery Architecture

Digital fulfillment follows a private-storage and temporary-token architecture designed to eliminate public file exposure, permanent download URLs, and arbitrary asset traversal.

```
Payment Verified
 ↓
Generate 256-bit Delivery Token (crypto.randomBytes(32))
 ↓
Compute Deterministic SHA-256 Digest & Store in orders.delivery_token_hash
 ↓
Dispatch Editorial Confirmation Email via Resend
 (Subject: "Your ShivSastra purchase is ready — [Product Title]")
 ↓
Delivery Email Link: /api/store/download/[orderId]?token=[rawToken]
 ↓
Server verifies:
  1. order exists & is PAID
  2. verifyDeliveryToken(token, hash) passes timing-safe comparison
  3. resolves product storage_asset_path from internal DB
 ↓
Supabase Storage API creates short-lived signed URL (10 minutes / 600s)
 ↓
Client receives 302 Redirect to signed URL / JSON response
```

---

## 2. Private Storage Bucket (`store-assets`)

- **Bucket Name**: `store-assets`
- **Visibility**: `public = false` (Private bucket).
- **Access Policies**:
  - `anon` and `authenticated` roles have ZERO direct read/write permissions.
  - Only `service_role` can upload or issue signed URLs.
- **File Expiry**: Signed URLs expire strictly in 10 minutes (600 seconds).

---

## 3. Resend Email Integration

- Reuses existing `resend` client (`src/lib/email/resend.ts`).
- HTML Template: `renderPurchaseDeliveryHtml` in `src/lib/email/templates.ts`.
- Content:
  - Product name snapshot
  - Order reference identifier
  - Settled price and currency
  - Secure temporary delivery link
  - Studio contact & support details
- **Delivery Failure Handling**:
  - If payment verification succeeds but Resend transmission fails:
    - Order remains in `status = 'paid'`.
    - `delivery_status` is updated to `'failed'`.
    - Payment is NEVER cancelled or reversed.
    - System permits administrative re-trigger from `/admin/orders`.

---

## 4. Live Activation Status

| Component | Status | Next Live Step |
| :--- | :--- | :--- |
| Token Generation & Validation | **PASS** | Validated (timingSafeEqual) |
| Download Endpoint Authorization | **PASS** | Server-authoritative asset derivation |
| Resend Delivery Templates | **PASS** | Editorial layout validated |
| Non-blocking Email Dispatch | **PASS** | Error-handling safety tested |
| Live Private Storage Bucket Creation | **PENDING** | Create bucket `store-assets` in Supabase Storage with `public: false` |
| Live Signed URL Generation | **PENDING** | Test against remote files once uploaded to `store-assets` |
| Live Resend Transmission | **PENDING** | Verify production DNS/domain status for sender address |
