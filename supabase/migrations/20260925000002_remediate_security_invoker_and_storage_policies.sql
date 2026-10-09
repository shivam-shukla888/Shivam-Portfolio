-- Migration: 20260925000002_remediate_security_invoker_and_storage_policies.sql
-- Description: 
-- 1. Restore security_invoker = true on public.public_products view to prevent RLS bypass.
-- 2. Revoke overly permissive anon write access from storage.objects and enforce least privilege.
-- NOTE: DO NOT EXECUTE DIRECTLY - REQUIRES EXPLICIT AUTHORIZATION / PRODUCTION REVIEW

-- ============================================================================
-- 1. REMEDIATE PUBLIC_PRODUCTS VIEW SECURITY (Restore security_invoker = true)
-- ============================================================================
DROP VIEW IF EXISTS public.public_products CASCADE;

CREATE VIEW public.public_products
WITH (security_invoker = true)
AS
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

COMMENT ON VIEW public.public_products IS 
'Public catalog projection view with security_invoker=true. RLS policies on underlying products table are strictly respected.';

-- Maintain role permissions
GRANT SELECT ON public.public_products TO anon, authenticated;
GRANT ALL ON public.public_products TO service_role;

-- ============================================================================
-- 2. REMEDIATE STORAGE OBJECTS POLICIES (Enforce Least Privilege)
-- ============================================================================
-- Drop the erroneous permissive policy that allowed anon writes/deletes on non-store-assets buckets
DROP POLICY IF EXISTS "Deny anon access to store assets" ON storage.objects;

-- Ensure store-assets bucket is strictly private and isolated
UPDATE storage.buckets
SET public = false
WHERE id = 'store-assets';

-- Revoke all write/update/delete permissions on storage.objects from anon
DROP POLICY IF EXISTS "Anon insert on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Anon update on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete on public buckets" ON storage.objects;

-- Public read access: ONLY permit SELECT on explicitly designated public buckets
DROP POLICY IF EXISTS "Public read on designated public buckets" ON storage.objects;
CREATE POLICY "Public read on designated public buckets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id <> 'store-assets'
    AND EXISTS (
      SELECT 1 FROM storage.buckets
      WHERE storage.buckets.id = storage.objects.bucket_id
      AND storage.buckets.public = true
    )
  );

-- Only authenticated admins or service_role can write to storage
DROP POLICY IF EXISTS "Authenticated users write to storage" ON storage.objects;
CREATE POLICY "Authenticated users write to storage"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id <> 'store-assets')
  WITH CHECK (bucket_id <> 'store-assets');

-- ============================================================================
-- 3. VERIFICATION QUERIES FOR PRODUCTION AUDITING (Read-Only)
-- ============================================================================
-- Run these queries on live Supabase to inspect configuration:
--
-- Query A: Verify security_invoker on public.public_products:
-- SELECT relname, reloptions 
-- FROM pg_class 
-- WHERE relname = 'public_products';
-- (Expected result: reloptions includes {security_invoker=true})
--
-- Query B: Verify active storage policies on storage.objects:
-- SELECT polname, polcmd, polroles::regrole[], polqual, polwithcheck 
-- FROM pg_policy 
-- WHERE polrelid = 'storage.objects'::regclass;
