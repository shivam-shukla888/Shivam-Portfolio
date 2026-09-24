-- Migration: 20260924000001_store_orders_and_delivery.sql
-- Description: Phase 27 Store V3 Purchase & Payment Architecture - Orders table, Private RLS, and Storage bucket preparation.
-- NOTE: DO NOT EXECUTE DIRECTLY - PENDING LIVE SUPABASE ACCESS

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_title_snapshot text NOT NULL,
  product_slug_snapshot text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'INR',
  customer_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text UNIQUE,
  razorpay_signature text,
  delivery_status text NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'failed')),
  delivery_token_version integer NOT NULL DEFAULT 1,
  delivery_token_hash text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 2. Trigger for updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. Indexes for deterministic lookups and idempotency
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders (product_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- 4. ORDER SECURITY - Zero Public Access (Defense-in-depth)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Revoke all table-level privileges from untrusted roles
REVOKE ALL ON TABLE public.orders FROM anon, authenticated, public;

-- Service role has full administrative access
GRANT ALL ON TABLE public.orders TO service_role;

-- Strictly ensure no public policies exist
DROP POLICY IF EXISTS "Public users cannot read orders" ON public.orders;
DROP POLICY IF EXISTS "Public users cannot create orders" ON public.orders;
DROP POLICY IF EXISTS "Public users cannot update orders" ON public.orders;
DROP POLICY IF EXISTS "Public users cannot delete orders" ON public.orders;

-- 5. STORAGE BUCKET PREPARATION (store-assets)
-- Private bucket for digital product fulfillment files
-- Public access is strictly FALSE
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'store-assets',
  'store-assets',
  false,
  524288000, -- 500MB maximum limit
  ARRAY['application/zip', 'application/pdf', 'application/gzip', 'application/octet-stream', 'application/json']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 524288000;

-- Ensure storage policies strictly deny unauthenticated / anon access
DROP POLICY IF EXISTS "Deny anon access to store assets" ON storage.objects;
CREATE POLICY "Deny anon access to store assets"
  ON storage.objects
  FOR ALL
  TO anon
  USING (bucket_id <> 'store-assets');

-- Status: PENDING — REQUIRES LIVE SUPABASE ACCESS TO APPLY
