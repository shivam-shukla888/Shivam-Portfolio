"use client";

import React, { useActionState, useState } from "react";
import { loginAdmin, type LoginActionState } from "@/app/actions/auth";
import { buttonStyles } from "@/components/ui/Button";

const initialState: LoginActionState = {
  error: null,
};

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            disabled={isPending}
            className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] pl-4 pr-16 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            placeholder="••••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isPending}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
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
