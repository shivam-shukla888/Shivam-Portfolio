-- Migration: 20261009161706_add_stripe_orders_columns.sql
-- Description: Add Stripe Checkout and payment tracking fields to public.orders table.
-- Preserves existing Razorpay columns for historical compatibility.

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id
ON public.orders (stripe_session_id);

CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id
ON public.orders (stripe_payment_intent_id);

COMMENT ON COLUMN public.orders.stripe_session_id IS 
'Stripe Checkout Session identifier (cs_...) for commercial order settlement';

COMMENT ON COLUMN public.orders.stripe_payment_intent_id IS 
'Stripe Payment Intent identifier (pi_...) associated with successful order settlement';
