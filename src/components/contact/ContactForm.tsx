"use client";

import React, { useActionState, useState, useRef, useEffect, useCallback } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import { submitContactInquiry } from "@/app/actions/contact";
import { initialContactState } from "@/lib/validations/contact";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface ContactFormProps {
  variant?: "dark" | "light";
  labels?: {
    name?: string;
    email?: string;
    brief?: string;
    submit?: string;
  };
  className?: string;
}

export function ContactForm({
  variant = "dark",
  labels = {
    name: "Name / Organization",
    email: "Direct Email",
    brief: "Project Brief & Intent",
    submit: "Send Message →",
  },
  className,
}: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactInquiry,
    initialContactState
  );

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

  const isDark = variant === "dark";

  // Explicit Turnstile Rendering
  const renderTurnstile = useCallback(() => {
    if (
      typeof window === "undefined" ||
      !window.turnstile ||
      !turnstileContainerRef.current ||
      !siteKey
    ) {
      return;
    }

    if (widgetIdRef.current) {
      return;
    }

    try {
      const widgetId = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: siteKey,
        theme: isDark ? "dark" : "light",
        callback: (token: string) => {
          setTurnstileToken(token);
        },
        "expired-callback": () => {
          setTurnstileToken("");
        },
        "error-callback": () => {
          setTurnstileToken("");
        },
      });
      widgetIdRef.current = widgetId;
    } catch {
      // Container may have already been rendered
    }
  }, [siteKey, isDark]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.turnstile) {
      renderTurnstile();
    }
  }, [renderTurnstile]);

  // Reset challenge on verification/submission errors
  useEffect(() => {
    if (
      state.status === "verification_error" ||
      state.status === "validation_error" ||
      state.status === "server_error"
    ) {
      if (
        typeof window !== "undefined" &&
        window.turnstile &&
        widgetIdRef.current
      ) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken("");
      }
    }
  }, [state.status]);

  // Cleanup widget on unmount
  useEffect(() => {
    return () => {
      if (
        typeof window !== "undefined" &&
        window.turnstile &&
        widgetIdRef.current
      ) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore unmount error
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  // If successfully submitted, present a dignified, editorial confirmation
  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`p-8 border ${
          isDark
            ? "border-[var(--color-dark-hairline)] bg-[var(--color-surface-dark)] text-white"
            : "border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-primary)]"
        } space-y-4`}
      >
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Message Sent
          </span>
        </div>
        <p className="font-display text-2xl font-normal tracking-tight">
          {state.message || "Thank you for getting in touch. Your message has been received."}
        </p>
        <p
          className={`font-sans text-sm leading-relaxed ${
            isDark
              ? "text-[var(--color-dark-ink-secondary)]"
              : "text-[var(--color-ink-secondary)]"
          }`}
        >
          Your inquiry has been received. If the project aligns with current availability, you will hear back shortly.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-mono text-xs uppercase tracking-[0.08em] underline hover:text-[var(--color-accent)] transition-colors cursor-pointer"
          >
            Send Another Message →
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={`space-y-5 ${className || ""}`}>
      {/* Global Status Banner for rate limits, verification errors, or server errors */}
      {(state.status === "rate_limited" ||
        state.status === "server_error" ||
        state.status === "verification_error") && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 border border-[var(--color-accent)] bg-[var(--color-accent)]/10 font-mono text-xs text-[var(--color-accent)] space-y-1"
        >
          <span className="font-semibold uppercase tracking-wider">[Notice]</span>
          <p>{state.message}</p>
        </div>
      )}

      {/* Honeypot field (hidden from visual users and screen readers, attracts automated bots) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <label htmlFor="hp_website">Leave this field blank</label>
        <input
          type="text"
          id="hp_website"
          name="hp_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Two-Column Grid for Name and Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className={
              isDark
                ? "block font-sans text-xs font-medium text-white/90"
                : "block font-sans text-xs font-medium text-[var(--color-ink-primary)]"
            }
          >
            {labels.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            disabled={isPending}
            placeholder="Your Name"
            aria-invalid={!!state.errors?.name}
            aria-describedby={state.errors?.name ? "name-error" : undefined}
            className={
              isDark
                ? "w-full px-4 py-3.5 bg-[var(--color-surface-dark)] border border-[var(--color-dark-hairline)] text-white placeholder-[var(--color-dark-ink-secondary)] text-sm rounded-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50"
                : "w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] text-[var(--color-ink-primary)] text-sm rounded-none focus:outline-none focus:border-[var(--color-ink-primary)] focus:ring-1 focus:ring-[var(--color-ink-primary)] disabled:opacity-50"
            }
          />
          {state.errors?.name && (
            <p id="name-error" role="alert" className="font-mono text-[11px] text-[var(--color-accent)] pt-1">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className={
              isDark
                ? "block font-sans text-xs font-medium text-white/90"
                : "block font-sans text-xs font-medium text-[var(--color-ink-primary)]"
            }
          >
            {labels.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            disabled={isPending}
            placeholder="your.email@domain.com"
            aria-invalid={!!state.errors?.email}
            aria-describedby={state.errors?.email ? "email-error" : undefined}
            className={
              isDark
                ? "w-full px-4 py-3.5 bg-[var(--color-surface-dark)] border border-[var(--color-dark-hairline)] text-white placeholder-[var(--color-dark-ink-secondary)] text-sm rounded-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] disabled:opacity-50"
                : "w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] text-[var(--color-ink-primary)] text-sm rounded-none focus:outline-none focus:border-[var(--color-ink-primary)] focus:ring-1 focus:ring-[var(--color-ink-primary)] disabled:opacity-50"
            }
          />
          {state.errors?.email && (
            <p id="email-error" role="alert" className="font-mono text-[11px] text-[var(--color-accent)] pt-1">
              {state.errors.email[0]}
            </p>
          )}
        </div>
      </div>

      {/* Inquiry Brief Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="contact-brief"
          className={
            isDark
              ? "block font-sans text-xs font-medium text-white/90"
              : "block font-sans text-xs font-medium text-[var(--color-ink-primary)]"
          }
        >
          {labels.brief}
        </label>
        <textarea
          id="contact-brief"
          name="brief"
          rows={isDark ? 4 : 5}
          required
          disabled={isPending}
          placeholder={
            isDark
              ? "Describe your inquiry or commission..."
              : "Please describe the nature and timeline of your engagement..."
          }
          aria-invalid={!!state.errors?.brief}
          aria-describedby={state.errors?.brief ? "brief-error" : undefined}
          className={
            isDark
              ? "w-full px-4 py-3.5 bg-[var(--color-surface-dark)] border border-[var(--color-dark-hairline)] text-white placeholder-[var(--color-dark-ink-secondary)] text-sm rounded-none focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] resize-none disabled:opacity-50"
              : "w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] text-[var(--color-ink-primary)] text-sm rounded-none focus:outline-none focus:border-[var(--color-ink-primary)] focus:ring-1 focus:ring-[var(--color-ink-primary)] resize-none disabled:opacity-50"
          }
        />
        {state.errors?.brief && (
          <p id="brief-error" role="alert" className="font-mono text-[11px] text-[var(--color-accent)] pt-1">
            {state.errors.brief[0]}
          </p>
        )}
      </div>

      {/* Cloudflare Turnstile Challenge Container */}
      {siteKey && (
        <div className="space-y-2 pt-1">
          <div
            ref={turnstileContainerRef}
            className="min-h-[65px] flex items-center"
            aria-label="Security verification challenge"
          />
          <input
            type="hidden"
            name="cf-turnstile-response"
            value={turnstileToken}
          />
          {state.errors?.turnstile && (
            <p id="turnstile-error" role="alert" className="font-mono text-[11px] text-[var(--color-accent)]">
              {state.errors.turnstile[0]}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        variant={isDark ? "accent" : "primary"}
        size="lg"
        type="submit"
        disabled={isPending}
        className={isDark ? "w-full sm:w-auto" : "w-full"}
      >
        {isPending ? "Sending..." : labels.submit}
      </Button>

      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}
    </form>
  );
}
