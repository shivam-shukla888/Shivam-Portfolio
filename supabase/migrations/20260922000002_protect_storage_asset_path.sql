-- Migration: 20260922000002_protect_storage_asset_path.sql
-- Description: SEC-DB-01 remediation - Protect products.storage_asset_path from public/anonymous SELECT access.
-- Preserves server/service_role boundary while maintaining public access to legitimate storefront columns.

-- 1. Revoke whole-table SELECT privileges on public.products from anon and authenticated roles.
REVOKE SELECT ON TABLE public.products FROM anon, authenticated;

-- 2. Grant column-level SELECT on ONLY intentionally public columns to anon and authenticated roles.
GRANT SELECT (
    id,
    slug,
    release_code,
    title,
    description,
    price_in_cents,
    currency,
    product_type,
    preview_image_url,
    is_available,
    sort_order,
    created_at,
    updated_at
) ON TABLE public.products TO anon, authenticated;

-- 3. Explicitly ensure service_role retains unrestricted access to the entire products table.
GRANT ALL ON TABLE public.products TO service_role;

-- 4. Create an intentional public projection view for client consumption with security_invoker enabled.
CREATE OR REPLACE VIEW public.public_products
WITH (security_invoker = true)
AS
SELECT
    id,
    slug,
    release_code,
    title,
    description,
    price_in_cents,
    currency,
    product_type,
    preview_image_url,
    is_available,
    sort_order,
    created_at,
    updated_at
FROM public.products;

-- 5. Grant SELECT on the public view to anon and authenticated roles.
GRANT SELECT ON public.public_products TO anon, authenticated;
