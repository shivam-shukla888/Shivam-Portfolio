import type { ProductDisplayData } from "@/lib/products";

export const TEST_CHECKOUT_PRODUCT_ID = "a9eac140-877c-4e98-9b6a-87c6712e4f03";
export const TEST_CHECKOUT_PRODUCT_SLUG = "spring-boot-starter";
export const TEST_CHECKOUT_AMOUNT_PAISE = 100;

export function isRazorpayTestEnvironmentEnabled(): boolean {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.RAZORPAY_TEST_CHECKOUT_ENABLED === "true" &&
    keyId.startsWith("rzp_test_")
  );
}

/** Production-only live payment test; restricted to one explicitly configured email. */
export function isRazorpayLiveTestEnvironmentEnabled(): boolean {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const allowedEmail = (process.env.RAZORPAY_LIVE_TEST_EMAIL || "").trim();
  return (
    process.env.NODE_ENV === "production" &&
    process.env.RAZORPAY_LIVE_TEST_CHECKOUT_ENABLED === "true" &&
    keyId.startsWith("rzp_live_") &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(allowedEmail)
  );
}

export function isRazorpayLiveTestEmailAllowed(email: string): boolean {
  const allowedEmail = (process.env.RAZORPAY_LIVE_TEST_EMAIL || "").trim().toLowerCase();
  return Boolean(
    isRazorpayLiveTestEnvironmentEnabled() &&
      email.trim().toLowerCase() === allowedEmail
  );
}

export function isTestCheckoutProduct(product: ProductDisplayData): boolean {
  return Boolean(
    isRazorpayTestEnvironmentEnabled() &&
      product.id === TEST_CHECKOUT_PRODUCT_ID &&
      product.slug === TEST_CHECKOUT_PRODUCT_SLUG &&
      product.isAvailable &&
      product.priceInCents === null &&
      product.currency === null
  );
}

export function isLivePaymentTestProduct(product: ProductDisplayData): boolean {
  return Boolean(
    isRazorpayLiveTestEnvironmentEnabled() &&
      product.id === TEST_CHECKOUT_PRODUCT_ID &&
      product.slug === TEST_CHECKOUT_PRODUCT_SLUG &&
      product.isAvailable &&
      product.priceInCents === null &&
      product.currency === null
  );
}

/** Fixed ₹1 test orders never grant product access or trigger product delivery. */
export function isPaymentOnlyCheckoutOrder(order: {
  product_id: string;
  product_slug_snapshot: string;
  amount_cents: number;
  currency: string;
}): boolean {
  return Boolean(
    order.product_id === TEST_CHECKOUT_PRODUCT_ID &&
      order.product_slug_snapshot === TEST_CHECKOUT_PRODUCT_SLUG &&
      order.amount_cents === TEST_CHECKOUT_AMOUNT_PAISE &&
      order.currency.toUpperCase() === "INR"
  );
}

export function isTestCheckoutOrder(order: {
  product_id: string;
  product_slug_snapshot: string;
  amount_cents: number;
  currency: string;
}): boolean {
  return isRazorpayTestEnvironmentEnabled() && isPaymentOnlyCheckoutOrder(order);
}

export function isLivePaymentTestOrder(order: {
  product_id: string;
  product_slug_snapshot: string;
  amount_cents: number;
  currency: string;
}): boolean {
  return isRazorpayLiveTestEnvironmentEnabled() && isPaymentOnlyCheckoutOrder(order);
}
