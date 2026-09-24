"use client";

import React, { useState } from "react";
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

type CheckoutStep =
  | "idle"
  | "collect_email"
  | "initiating"
  | "awaiting_payment"
  | "verifying"
  | "success"
  | "failed"
  | "cancelled";

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
  const [step, setStep] = useState<CheckoutStep>("idle");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    deliveryToken?: string;
  } | null>(null);

  // If product is not available, render disabled state
  if (!isAvailable || priceInCents === null || priceInCents <= 0) {
    return (
      <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button
          variant="secondary"
          size="lg"
          disabled
          className="font-mono text-xs uppercase tracking-wider opacity-60 cursor-not-allowed"
        >
          Edition Unavailable
        </Button>
        <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
          This release is currently archived or private.
        </span>
      </div>
    );
  }

  const actionLabel =
    productType === "code_license"
      ? "Acquire License"
      : productType === "monograph"
      ? "Acquire Monograph"
      : productType === "template"
      ? "Acquire Template"
      : "Buy Now";

  // Handle initiating checkout
  const handleInitiateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage("Please enter a valid email address for delivery.");
      return;
    }

    setStep("initiating");

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setStep("failed");
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
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStep("failed");
        setErrorMessage(
          data.error ||
            "Unable to initialize payment session. (PENDING live gateway credentials)"
        );
        return;
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = data;

      if (!window.Razorpay) {
        setStep("failed");
        setErrorMessage("Payment SDK initialized abnormally.");
        return;
      }

      setStep("awaiting_payment");

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
          // Never claim payment success on client alone
          setStep("verifying");

          try {
            const verifyRes = await fetch("/api/store/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              setStep("failed");
              setErrorMessage(
                verifyData.error ||
                  "Cryptographic verification failed. If payment was deducted, our team will resolve it promptly."
              );
              return;
            }

            setCompletedOrder({
              orderId,
              deliveryToken: verifyData.deliveryToken,
            });
            setStep("success");
          } catch {
            setStep("failed");
            setErrorMessage(
              "Network interruption during signature verification. Your order state will be finalized via background webhook."
            );
          }
        },
        modal: {
          ondismiss: () => {
            setStep("cancelled");
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on("payment.failed", (failResponse) => {
        setStep("failed");
        setErrorMessage(failResponse.error?.description || "Payment was rejected or cancelled.");
      });

      rzpInstance.open();
    } catch (err) {
      setStep("failed");
      setErrorMessage(err instanceof Error ? err.message : "Checkout error occurred.");
    }
  };

  return (
    <div className="pt-4 space-y-4">
      {/* 1. Default Idle CTA */}
      {step === "idle" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => setStep("collect_email")}
            className="font-mono text-xs uppercase tracking-wider"
          >
            {actionLabel} — {formattedPrice} →
          </Button>
          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
            Instant digital fulfillment & commercial license upon verified purchase.
          </span>
        </div>
      )}

      {/* 2. Customer Email Collection Form */}
      {step === "collect_email" && (
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] max-w-lg space-y-4">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
              ACQUISITION CHECKOUT // V1
            </span>
            <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
              Fulfillment Destination
            </h3>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Enter your email address to receive immediate delivery credentials and purchase receipts. No account required.
            </p>
          </div>

          <form onSubmit={handleInitiateCheckout} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="checkout-email"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-primary)]"
              >
                Customer Email
              </label>
              <input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-3 py-2 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>

            {errorMessage && (
              <p className="font-mono text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2 border border-red-200 dark:border-red-900/50">
                {errorMessage}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="font-mono text-xs uppercase tracking-wider"
              >
                Proceed to Secure Payment →
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => {
                  setStep("idle");
                  setErrorMessage(null);
                }}
                className="font-mono text-xs uppercase tracking-wider"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Initiating State */}
      {step === "initiating" && (
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] max-w-lg flex items-center gap-4">
          <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Initiating secure checkout session...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Connecting with payment gateway.
            </p>
          </div>
        </div>
      )}

      {/* 4. Awaiting Payment in Gateway Modal */}
      {step === "awaiting_payment" && (
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] max-w-lg space-y-2">
          <p className="font-mono text-xs text-[var(--color-ink-primary)]">
            Payment gateway window active.
          </p>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Please complete checkout in the payment dialog. If closed accidentally, click below to restart.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep("collect_email")}
              className="font-mono text-xs uppercase"
            >
              Reset Session
            </Button>
          </div>
        </div>
      )}

      {/* 5. Verifying Cryptographic Signature */}
      {step === "verifying" && (
        <div className="p-6 border border-[var(--color-accent)] bg-[var(--color-canvas-secondary)] max-w-lg flex items-center gap-4">
          <div className="w-4 h-4 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Verifying cryptographic payment signature...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Ensuring transaction authenticity on ShivSastra server.
            </p>
          </div>
        </div>
      )}

      {/* 6. Success State */}
      {step === "success" && (
        <div className="p-6 border-2 border-emerald-600 bg-[var(--color-canvas-secondary)] max-w-lg space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
              ACQUISITION CONFIRMED
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
              Purchase Verified Successfully
            </h3>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Your payment has been verified by the server. Order reference:{" "}
              <span className="font-mono text-[var(--color-ink-primary)] font-medium">
                {completedOrder?.orderId}
              </span>
            </p>
          </div>

          <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
            Delivery confirmation and access links have been dispatched to{" "}
            <span className="text-[var(--color-accent)]">{email}</span>.
          </p>

          {completedOrder?.deliveryToken && (
            <div className="pt-2">
              <a
                href={`/api/store/download/${completedOrder.orderId}?token=${completedOrder.deliveryToken}`}
                className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-6 py-2.5 bg-[var(--color-accent)] text-white hover:bg-[var(--color-ink-primary)] transition-colors"
                download
              >
                Download Digital Assets ↓
              </a>
            </div>
          )}
        </div>
      )}

      {/* 7. Failed State */}
      {step === "failed" && (
        <div className="p-6 border border-red-400 bg-[var(--color-canvas-secondary)] max-w-lg space-y-3">
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-semibold">
              TRANSACTION INCOMPLETE
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-primary)]">
              {errorMessage || "Payment could not be completed at this time."}
            </p>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("collect_email");
              }}
              className="font-mono text-xs uppercase tracking-wider"
            >
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("idle");
              }}
              className="font-mono text-xs uppercase tracking-wider"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 8. Cancelled State */}
      {step === "cancelled" && (
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] max-w-lg space-y-3">
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Checkout was cancelled. No charges were made to your card or account.
          </p>
          <div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setStep("collect_email")}
              className="font-mono text-xs uppercase tracking-wider"
            >
              Resume Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
