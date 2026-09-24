"use client";

import React from "react";
import { FaqItem } from "@/lib/products";

interface ProductFaqAccordionProps {
  faq: FaqItem[];
}

/**
 * Editorial Expandable FAQ Accordion for Store Products.
 * Uses native semantic <details> and <summary> disclosure elements for
 * flawless keyboard accessibility, screen-reader compatibility, and zero-JS fallback.
 */
export function ProductFaqAccordion({ faq }: ProductFaqAccordionProps) {
  if (!faq || faq.length === 0) return null;

  return (
    <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
      <div className="space-y-1">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
          QUESTIONS & CLARIFICATIONS
        </span>
        <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-3">
        {faq.map((item, idx) => (
          <details
            key={idx}
            className="group border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] transition-colors duration-150 open:bg-[var(--color-canvas-primary)]"
          >
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]">
              <span className="font-sans text-sm font-semibold text-[var(--color-ink-primary)] pr-4">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-[var(--color-accent)] shrink-0 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1 border-t border-[var(--color-hairline)]/60 text-sm font-sans text-[var(--color-ink-secondary)] leading-relaxed">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
