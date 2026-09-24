import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonStyles } from "@/components/ui/Button";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The requested route or artifact does not exist or has been relocated.",
};

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center py-20 md:py-32">
      <SectionContainer>
        <div className="max-w-2xl mx-auto space-y-8 text-center sm:text-left">
          {/* Status Flag */}
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <span className="w-2 h-2 bg-[var(--color-accent)] inline-block shrink-0" />
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
              404
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
              Nothing here.
            </h1>
            <p className="font-sans text-sm sm:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
              This page doesn&apos;t exist or has moved.
            </p>
          </div>

          {/* Navigation Action Anchors */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/"
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "font-mono text-xs uppercase tracking-wider",
              })}
            >
              ← Back home
            </Link>
            <Link
              href="/projects"
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "font-mono text-xs uppercase tracking-wider",
              })}
            >
              View my work
            </Link>
            <Link
              href="/store"
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "font-mono text-xs uppercase tracking-wider",
              })}
            >
              Visit Store
            </Link>
          </div>

          {/* Colophon Note */}
          <div className="pt-8 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
            <span>404 — Not found</span>
            <Link href="/contact" className="hover:text-[var(--color-accent)] transition-colors underline">
              Get in touch →
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
