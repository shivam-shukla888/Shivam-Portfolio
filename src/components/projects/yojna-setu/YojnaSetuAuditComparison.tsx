import React from "react";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";

export function YojnaSetuAuditComparison() {
  const { forensicAudit } = YOJNA_SETU_DATA;

  return (
    <section className="space-y-8" aria-labelledby="audit-heading">
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="audit-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          03 — FORENSIC AUDIT &amp; FIXES
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          From Prototype to Hardened Backend
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          The original prototype had critical security and correctness issues. Here are the 5 key engineering fixes made in V2 to make the backend production-ready.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
        {forensicAudit.map((item, index) => (
          <div
            key={item.id}
            className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Category Column */}
            <div className="lg:col-span-3 space-y-1">
              <span className="font-mono text-[11px] text-[var(--color-accent)] font-semibold">
                0{index + 1} {"//"}
              </span>
              <h3 className="font-sans text-sm font-semibold text-[var(--color-ink-primary)]">
                {item.category}
              </h3>
            </div>

            {/* Before (Legacy V1) Column */}
            <div className="lg:col-span-4 p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#BA471F] inline-block" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-secondary)] font-medium">
                  BEFORE {"//"} LEGACY PROTOTYPE
                </span>
              </div>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                {item.legacyV1}
              </p>
            </div>

            {/* Transition Arrow Indicator (Desktop) */}
            <div className="hidden lg:flex lg:col-span-1 justify-center items-center h-full pt-6">
              <span className="font-mono text-sm text-[var(--color-accent)]">→</span>
            </div>

            {/* After (Hardened V2) Column */}
            <div className="lg:col-span-4 p-4 border border-[var(--color-ink-primary)] bg-[var(--color-canvas-primary)] space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-medium">
                  AFTER {"//"} V2 HARDENED SYSTEM
                </span>
              </div>
              <p className="font-sans text-xs text-[var(--color-ink-primary)] font-medium leading-relaxed">
                {item.hardenedV2}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <p className="font-mono text-xs text-[var(--color-ink-secondary)] leading-relaxed">
          <strong className="text-[var(--color-ink-primary)]">Security Scope:</strong>{" "}
          Hardening focused on verifiable engineering controls: eliminating hardcoded secrets, guaranteeing mathematical determinism in benefits matching, sanitizing inputs and remote media, and enforcing strict session idempotency.
        </p>
      </div>
    </section>
  );
}
