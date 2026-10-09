-- Migration: 20260925000001_add_download_token_expiry.sql
-- Description: Add delivery_token_expires_at column to public.orders table for 24-hour expiring paid download links.
-- NOTE: DO NOT EXECUTE DIRECTLY - REQUIRES EXPLICIT AUTHORIZATION / PRODUCTION REVIEW

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_token_expires_at timestamp with time zone;

-- Create index for expiration evaluation
CREATE INDEX IF NOT EXISTS idx_orders_delivery_token_expires_at
ON public.orders (delivery_token_expires_at);

COMMENT ON COLUMN public.orders.delivery_token_expires_at IS 
'Timestamp after which digital delivery download token is strictly invalidated (default: 24h from order paid_at)';
