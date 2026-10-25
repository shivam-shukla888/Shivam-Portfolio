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

export function isTestCheckoutOrder(order: {
  product_id: string;
  product_slug_snapshot: string;
  amount_cents: number;
  currency: string;
}): boolean {
  return Boolean(
    isRazorpayTestEnvironmentEnabled() &&
      order.product_id === TEST_CHECKOUT_PRODUCT_ID &&
      order.product_slug_snapshot === TEST_CHECKOUT_PRODUCT_SLUG &&
      order.amount_cents === TEST_CHECKOUT_AMOUNT_PAISE &&
      order.currency.toUpperCase() === "INR"
  );
}

