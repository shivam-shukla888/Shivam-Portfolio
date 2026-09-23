"use client";

import React, { useActionState } from "react";
import { loginAdmin, type LoginActionState } from "@/app/actions/auth";
import { buttonStyles } from "@/components/ui/Button";

const initialState: LoginActionState = {
  error: null,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAdmin,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 border border-[var(--color-accent)] bg-[var(--color-accent)]/5 text-[var(--color-accent)] font-mono text-xs space-y-1"
        >
          <div className="font-semibold uppercase tracking-wider">
            AUTHENTICATION ERROR
          </div>
          <p>{state.error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="admin-email"
          className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
        >
          Email Address
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isPending}
          className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
          placeholder="admin@domain.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
          placeholder="••••••••••••"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className={buttonStyles({
            variant: "primary",
            size: "lg",
            className: "w-full justify-center disabled:opacity-50",
          })}
        >
          {isPending ? "Authenticating..." : "Authorize Access →"}
        </button>
      </div>
    </form>
  );
}
