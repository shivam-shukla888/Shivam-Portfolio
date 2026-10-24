-- Adds an isolated, hidden store record for sandbox payment testing and refund state tracking.
-- The test product is not purchasable through the normal catalog; checkout is gated by test keys and an explicit server flag.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS razorpay_refund_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_refund_id
  ON public.orders (razorpay_refund_id)
  WHERE razorpay_refund_id IS NOT NULL;

DO $$
DECLARE
  constraint_name text;
BEGIN
  SELECT c.conname INTO constraint_name
  FROM pg_constraint c
  WHERE c.conrelid = 'public.orders'::regclass
    AND c.contype = 'c'
    AND pg_get_constraintdef(c.oid) ILIKE '%status%';

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.orders DROP CONSTRAINT %I', constraint_name);
  END IF;

  ALTER TABLE public.orders
    ADD CONSTRAINT orders_status_check
    CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refund_pending', 'refunded'));
END $$;

INSERT INTO public.products (
  id, slug, release_code, title, short_description, description,
  price_in_cents, currency, category, product_type, features, requirements,
  faq, preview_image_url, is_available, is_featured, sort_order
)
VALUES (
  'a9eac140-877c-4e98-9b6a-87c6712e4f03',
  'spring-boot-starter',
  'SB3-KIT',
  'Spring Boot 3 API Boilerplate',
  'Structured backend starter featuring Spring Boot 3, Spring Security, JWT rotation, migrations, rate limiting, and clean MVC architecture.',
  'A clean architectural starter kit for Java and Spring Boot developers. This release is still in development.',
  0,
  'INR',
  'digital_products',
  'template',
  ARRAY['Spring Boot 3', 'Spring Security', 'JWT refresh rotation', 'PostgreSQL migrations'],
  'Java 17+, Maven 3.8+, Docker optional',
  '[]'::jsonb,
  '/images/quickeats.svg',
  false,
  false,
  2
)
ON CONFLICT (id) DO NOTHING;
