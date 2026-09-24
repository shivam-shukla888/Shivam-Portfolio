import { z } from "zod";

/**
 * Validates public visitor checkout initiation request.
 * Strictly ignores and strips any client-provided prices, currency, or storage paths.
 */
export const checkoutRequestSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, "Product identifier is required")
    .max(100, "Invalid product identifier length"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("A valid email address is required for order delivery")
    .max(255, "Email address is too long"),
  idempotencyKey: z
    .string()
    .trim()
    .max(100, "Invalid idempotency key format")
    .optional(),
});

export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;

/**
 * Validates client-submitted Razorpay payment credentials for server-side verification.
 */
export const verifyPaymentSchema = z.object({
  orderId: z
    .string()
    .trim()
    .uuid("Invalid internal order reference"),
  razorpayOrderId: z
    .string()
    .trim()
    .min(1, "Razorpay order ID is required")
    .startsWith("order_", "Invalid Razorpay order identifier format"),
  razorpayPaymentId: z
    .string()
    .trim()
    .min(1, "Razorpay payment ID is required")
    .startsWith("pay_", "Invalid Razorpay payment identifier format"),
  razorpaySignature: z
    .string()
    .trim()
    .min(1, "Razorpay signature is required")
    .regex(/^[a-f0-9]{64}$/i, "Invalid Razorpay HMAC signature format"),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
