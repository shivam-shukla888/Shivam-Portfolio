-- Migration: 20260923000002_store_catalog_and_reviews.sql
-- Description: Phase 26 Store Architecture - Add category enum, specifications, requirements, FAQ, and product reviews architecture.

-- 1. Add category and extended fields to public.products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'digital_products',
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS requirements text,
  ADD COLUMN IF NOT EXISTS faq jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

-- Add check constraint for category if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'products_category_check'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_category_check
      CHECK (category IN ('design', 'ai_agents', 'digital_products'));
  END IF;
END $$;

-- 2. Recreate public_products view to include new catalog columns while STRICTLY omitting storage_asset_path
DROP VIEW IF EXISTS public.public_products CASCADE;

CREATE VIEW public.public_products AS
SELECT
  id,
  slug,
  release_code,
  title,
  short_description,
  description,
  price_in_cents,
  currency,
  category,
  product_type,
  features,
  requirements,
  faq,
  preview_image_url,
  is_available,
  is_featured,
  sort_order,
  created_at,
  updated_at
FROM public.products;

-- Grant SELECT on public_products view to anon and authenticated
GRANT SELECT ON public.public_products TO anon, authenticated;
GRANT ALL ON public.public_products TO service_role;

-- 3. Create product_reviews architecture table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title text,
  review_body text NOT NULL,
  reviewer_name text NOT NULL,
  is_verified_purchase boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Enable RLS on product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists to allow idempotent re-run
DROP POLICY IF EXISTS "Public read for published reviews" ON public.product_reviews;

CREATE POLICY "Public read for published reviews"
  ON public.product_reviews
  FOR SELECT
  TO public
  USING (is_published = true);

-- Revoke write privileges on product_reviews from public roles (Defense-in-depth)
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.product_reviews FROM anon, authenticated;
GRANT ALL ON TABLE public.product_reviews TO service_role;
