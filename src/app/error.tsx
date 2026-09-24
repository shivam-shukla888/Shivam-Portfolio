"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { Button, buttonStyles } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log non-sensitive reference or digest in development
    if (process.env.NODE_ENV === "development") {
      console.error("Runtime exception captured:", error);
    }
  }, [error]);

  return (
    <div className="w-full min-h-[70vh] flex items-center py-20 md:py-32">
      <SectionContainer>
        <div className="max-w-2xl mx-auto space-y-8 text-center sm:text-left">
          {/* Status Flag */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <span className="w-2 h-2 bg-[var(--color-accent)] inline-block shrink-0" />
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
              500
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
              Something went wrong.
            </h1>
            <p className="font-sans text-sm sm:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
              An unexpected error occurred while loading this page. You can try refreshing or returning home.
            </p>
          </div>

          {/* Action Controls */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => reset()}
              className="font-mono text-xs uppercase tracking-wider"
            >
              Try again ↺
            </Button>
            <Link
              href="/"
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "font-mono text-xs uppercase tracking-wider",
              })}
            >
              Back home →
            </Link>
          </div>

          {/* Reference Colophon */}
          <div className="pt-8 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
            <span>
              500 — Application error
              {error.digest ? ` [REF: ${error.digest.slice(0, 8)}]` : ""}
            </span>
            <Link href="/contact" className="hover:text-[var(--color-accent)] transition-colors underline">
              Get in touch →
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
