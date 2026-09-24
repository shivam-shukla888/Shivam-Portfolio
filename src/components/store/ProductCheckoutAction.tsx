"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ProductCheckoutActionProps {
  productId: string;
  productSlug: string;
  productTitle: string;
  productType: string;
  formattedPrice: string;
  isAvailable: boolean;
  priceInCents: number | null;
}

export type CheckoutStep =
  | "IDLE"
  | "COLLECTING_EMAIL"
  | "CREATING_ORDER"
  | "CHECKOUT_OPEN"
  | "PAYMENT_PROCESSING"
  | "VERIFYING_PAYMENT"
  | "PAID"
  | "DELIVERY_READY"
  | "DELIVERY_FAILED"
  | "CANCELLED"
  | "FAILED"
  | "VERIFICATION_FAILED"
  | "VERIFICATION_TIMEOUT";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    email?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: { error: { description: string } }) => void) => void;
    };
  }
}

/**
 * Dynamically loads Razorpay checkout script if not already present.
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function ProductCheckoutAction({
  productId,
  productTitle,
  productType,
  formattedPrice,
  isAvailable,
  priceInCents,
}: ProductCheckoutActionProps) {
  const [step, setStep] = useState<CheckoutStep>("IDLE");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [lastPaymentPayload, setLastPaymentPayload] = useState<RazorpayResponse | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    deliveryToken?: string;
    deliveryStatus?: string;
  } | null>(null);

  const idempotencyKeyRef = useRef<string>("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when entering email collection
  useEffect(() => {
    if (step === "COLLECTING_EMAIL" && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  // Handle Escape key to dismiss non-processing states
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (step === "COLLECTING_EMAIL" || step === "CANCELLED" || step === "FAILED") {
          setStep("IDLE");
          setErrorMessage(null);
          setEmailError(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step]);

  // If product is not available, render disabled state
  if (!isAvailable || priceInCents === null || priceInCents <= 0) {
    return (
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          disabled
          className="font-mono text-xs uppercase tracking-wider opacity-60 cursor-not-allowed min-h-[44px]"
        >
          Product Unavailable
        </Button>
        <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
          This product is currently unavailable.
        </span>
      </div>
    );
  }

  const actionLabel =
    productType === "code_license"
      ? "Buy License"
      : productType === "monograph"
      ? "Get Monograph"
      : productType === "template"
      ? "Buy Template"
      : "Buy Now";

  // Validate customer email with standard normalized regex
  const validateEmail = (val: string): boolean => {
    const clean = val.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setEmailError("Please enter a valid email address for order delivery.");
      return false;
    }
    if (clean.length > 255) {
      setEmailError("Email address is too long.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Perform cryptographic server verification
  const verifyPaymentOnServer = async (
    orderIdToVerify: string,
    paymentResponse: RazorpayResponse
  ) => {
    setStep("VERIFYING_PAYMENT");
    setErrorMessage(null);

    try {
      const verifyRes = await fetch("/api/store/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderIdToVerify,
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setStep("VERIFICATION_FAILED");
        setErrorMessage(
          verifyData.error ||
            "Payment could not be verified. No download has been issued."
        );
        return;
      }

      setCompletedOrder({
        orderId: orderIdToVerify,
        deliveryToken: verifyData.deliveryToken,
        deliveryStatus: verifyData.deliveryStatus,
      });

      if (verifyData.deliveryStatus === "failed") {
        setStep("DELIVERY_FAILED");
      } else {
        setStep(verifyData.deliveryToken ? "DELIVERY_READY" : "PAID");
      }
    } catch {
      // Network interruption during verification: never collapse into false failure
      setStep("VERIFICATION_TIMEOUT");
      setErrorMessage(
        "Payment status is being confirmed. Please don't pay again yet."
      );
    }
  };

  // Retry verification for existing payment callback without initiating new order
  const handleRetryVerification = async () => {
    if (!currentOrderId || !lastPaymentPayload) {
      setStep("COLLECTING_EMAIL");
      return;
    }
    await verifyPaymentOnServer(currentOrderId, lastPaymentPayload);
  };

  // Handle initiating checkout
  const handleInitiateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!validateEmail(cleanEmail)) {
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setStep("CREATING_ORDER");

    // Ensure session idempotency key exists
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    }

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setIsSubmitting(false);
        setStep("FAILED");
        setErrorMessage("Unable to load secure payment gateway. Please check your internet connection.");
        return;
      }

      // 2. Request order initialization from server (server authority)
      const res = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email: cleanEmail,
          idempotencyKey: idempotencyKeyRef.current,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsSubmitting(false);
        setStep("FAILED");
        setErrorMessage(
          data.error ||
            "Unable to initialize payment session. (PENDING live gateway credentials)"
        );
        return;
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = data;
      setCurrentOrderId(orderId);

      if (!window.Razorpay) {
        setIsSubmitting(false);
        setStep("FAILED");
        setErrorMessage("Payment SDK initialized abnormally.");
        return;
      }

      setStep("CHECKOUT_OPEN");

      // 3. Open Razorpay checkout modal
      const options: RazorpayOptions = {
        key: keyId,
        amount,
        currency,
        name: "ShivSastra Studio",
        description: productTitle,
        order_id: razorpayOrderId,
        prefill: {
          email: cleanEmail,
        },
        theme: {
          color: "#D45A2A",
        },
        handler: async (paymentResponse: RazorpayResponse) => {
          // Critical rule: Browser callback is NOT verification.
          setLastPaymentPayload(paymentResponse);
          setStep("PAYMENT_PROCESSING");
          setIsSubmitting(false);

          // Transition to server cryptographic verification
          await verifyPaymentOnServer(orderId, paymentResponse);
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setStep("CANCELLED");
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on("payment.failed", (failResponse) => {
        setIsSubmitting(false);
        setStep("FAILED");
        setErrorMessage(failResponse.error?.description || "Payment was rejected or cancelled by gateway.");
      });

      rzpInstance.open();
    } catch (err) {
      setIsSubmitting(false);
      setStep("FAILED");
      setErrorMessage(
        err instanceof Error ? err.message : "Checkout error occurred during session initiation."
      );
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Acquisition Checkout"
      className="pt-4 space-y-4 max-w-lg w-full"
    >
      {/* 1. Default Idle CTA */}
      {step === "IDLE" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              setStep("COLLECTING_EMAIL");
              setErrorMessage(null);
            }}
            className="font-mono text-xs uppercase tracking-wider min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
          >
            {actionLabel} — {formattedPrice} →
          </Button>
          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
            Instant digital fulfillment & commercial license upon verified purchase.
          </span>
        </div>
      )}

      {/* 2. Customer Email Collection Form */}
      {step === "COLLECTING_EMAIL" && (
        <div className="p-5 sm:p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
              ACQUISITION CHECKOUT // V3
            </span>
            <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
              Fulfillment Destination
            </h3>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Your purchase confirmation and secure download link will be sent to this email. Payment is cryptographically verified before digital release access is granted.
            </p>
          </div>

          <form onSubmit={handleInitiateCheckout} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="checkout-email"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-primary)]"
              >
                Customer Email
              </label>
              <input
                ref={emailInputRef}
                id="checkout-email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "checkout-email-error" : "checkout-email-help"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => {
                  if (email.trim()) validateEmail(email);
                }}
                placeholder="name@organization.com"
                className={`w-full px-3 py-2.5 bg-[var(--color-canvas-primary)] border font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-accent)] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] transition-colors min-h-[44px] ${
                  emailError ? "border-red-500" : "border-[var(--color-hairline)]"
                }`}
              />
              <p id="checkout-email-help" className="sr-only">
                Enter your valid email to receive digital fulfillment keys and receipts.
              </p>
            </div>

            {emailError && (
              <p
                id="checkout-email-error"
                role="alert"
                className="font-mono text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2.5 border border-red-200 dark:border-red-900/50"
              >
                {emailError}
              </p>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="font-mono text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2.5 border border-red-200 dark:border-red-900/50"
              >
                {errorMessage}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="font-mono text-xs uppercase tracking-wider min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:opacity-50"
              >
                {isSubmitting ? "Initiating Session..." : "Continue to Payment →"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={isSubmitting}
                onClick={() => {
                  setStep("IDLE");
                  setErrorMessage(null);
                  setEmailError(null);
                }}
                className="font-mono text-xs uppercase tracking-wider min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Creating Order State */}
      {step === "CREATING_ORDER" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center gap-4"
        >
          <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Preparing checkout...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Connecting to payment gateway...
            </p>
          </div>
        </div>
      )}

      {/* 4. Checkout Open in Gateway Modal */}
      {step === "CHECKOUT_OPEN" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] font-semibold">
              PAYMENT IN PROGRESS
            </span>
          </div>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
            Please complete your payment in the checkout window. If it closed, click below to restart.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsSubmitting(false);
                setStep("COLLECTING_EMAIL");
              }}
              className="font-mono text-xs uppercase min-h-[44px]"
            >
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsSubmitting(false);
                setStep("CANCELLED");
              }}
              className="font-mono text-xs uppercase min-h-[44px]"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* 5. Payment Processing / Callback Received */}
      {step === "PAYMENT_PROCESSING" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-accent)] bg-[var(--color-canvas-secondary)] flex items-center gap-4"
        >
          <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Payment received...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Confirming with server...
            </p>
          </div>
        </div>
      )}

      {/* 6. Verifying Cryptographic Signature */}
      {step === "VERIFYING_PAYMENT" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-accent)] bg-[var(--color-canvas-secondary)] flex items-center gap-4"
        >
          <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Verifying payment...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Confirming order details...
            </p>
          </div>
        </div>
      )}

      {/* 7. Success State (PAID & DELIVERY_READY) */}
      {(step === "PAID" || step === "DELIVERY_READY") && (
        <div
          role="region"
          aria-label="Payment Verified"
          className="p-5 sm:p-6 border-2 border-emerald-600 bg-[var(--color-canvas-secondary)] space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
              PAYMENT SUCCESSFUL
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
              {productTitle}
            </h3>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Your payment has been verified. Order reference:{" "}
              <span className="font-mono text-[var(--color-ink-primary)] font-medium">
                {completedOrder?.orderId ? completedOrder.orderId.slice(0, 8) + "…" : "Confirmed"}
              </span>
            </p>
          </div>

          <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
            A confirmation email has also been sent to your purchase email:{" "}
            <span className="text-[var(--color-accent)]">{email}</span>.
          </p>

          {completedOrder?.deliveryToken && (
            <div className="pt-2">
              <a
                href={`/api/store/download/${completedOrder.orderId}?token=${completedOrder.deliveryToken}`}
                className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-6 py-3 bg-[var(--color-accent)] text-white hover:bg-[var(--color-ink-primary)] transition-colors min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
                download
              >
                Download Files ↓
              </a>
            </div>
          )}
        </div>
      )}

      {/* 8. Delivery Failed State (Paid remains intact, email delayed) */}
      {step === "DELIVERY_FAILED" && (
        <div
          role="region"
          aria-label="Payment Verified With Delivery Notice"
          className="p-5 sm:p-6 border-2 border-amber-600 bg-[var(--color-canvas-secondary)] space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
              PAYMENT SUCCESSFUL
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
              {productTitle}
            </h3>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Your payment has been verified. Order reference:{" "}
              <span className="font-mono text-[var(--color-ink-primary)] font-medium">
                {completedOrder?.orderId ? completedOrder.orderId.slice(0, 8) + "…" : "Confirmed"}
              </span>
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-600/30 text-xs font-sans text-amber-800 dark:text-amber-300">
            Note: Email confirmation dispatch encountered a temporary delay and is queued for automated retry. You may safely download your files below.
          </div>

          {completedOrder?.deliveryToken && (
            <div className="pt-2">
              <a
                href={`/api/store/download/${completedOrder.orderId}?token=${completedOrder.deliveryToken}`}
                className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-6 py-3 bg-[var(--color-accent)] text-white hover:bg-[var(--color-ink-primary)] transition-colors min-h-[44px]"
                download
              >
                Download Files ↓
              </a>
            </div>
          )}
        </div>
      )}

      {/* 9. Payment Failed State */}
      {step === "FAILED" && (
        <div
          role="alert"
          className="p-5 sm:p-6 border border-red-400 bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-semibold">
              PAYMENT INCOMPLETE
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-primary)] leading-relaxed">
              {errorMessage || "Payment was rejected or could not be completed at this time."}
            </p>
          </div>
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("COLLECTING_EMAIL");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 10. Verification Failed State */}
      {step === "VERIFICATION_FAILED" && (
        <div
          role="alert"
          className="p-5 sm:p-6 border border-red-500 bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-semibold">
              VERIFICATION FAILED
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-primary)] leading-relaxed">
              Payment could not be verified. No download has been issued.
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              If funds were debited from your account, I will review order reference{" "}
              <span className="text-[var(--color-ink-primary)] font-medium">
                {currentOrderId ? currentOrderId.slice(0, 8) + "…" : "recorded"}
              </span>{" "}
              promptly.
            </p>
          </div>
          <div className="pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 11. Verification Timeout / Network Failure State */}
      {step === "VERIFICATION_TIMEOUT" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-amber-500 bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
              CONFIRMING STATUS
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-base text-[var(--color-ink-primary)]">
              Payment status is being confirmed. Please don&apos;t pay again yet.
            </h4>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              A network interruption occurred while confirming your transaction with the server. Your payment is safe. Click below to re-verify status without recharging.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleRetryVerification}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Check Verification Status ↻
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 12. Cancelled State */}
      {step === "CANCELLED" && (
        <div className="p-5 sm:p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3">
          <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
            Checkout was cancelled. No charges were made to your card or account.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("COLLECTING_EMAIL");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Resume Checkout
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
