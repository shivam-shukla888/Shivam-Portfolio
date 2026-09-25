import React from "react";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";

export function YojnaSetuReleaseNotes() {
  const { releaseConditions } = YOJNA_SETU_DATA;

  return (
    <section className="space-y-8" aria-labelledby="release-heading">
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="release-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          08 — RELEASE STATUS &amp; BOUNDARIES
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          Release Status &amp; Known Boundaries
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          What is verified in V2, and what known limitations remain. The independent release gate classified Yojna Setu V2 as <strong>Release Ready With Documented Conditions</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Verified Capabilities */}
        <div className="lg:col-span-6 p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] font-semibold">
              VERIFIED CAPABILITIES
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-[var(--color-ink-primary)] text-white">
              7 / 7 VERIFIED
            </span>
          </div>

          <ul className="space-y-3 list-none">
            {releaseConditions.verified.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="font-mono text-xs text-[var(--color-accent)] shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="font-sans text-xs sm:text-sm text-[var(--color-ink-primary)] leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documented Conditions & Scope Boundaries */}
        <div className="lg:col-span-6 p-6 sm:p-8 border-2 border-[var(--color-accent)] bg-[var(--color-canvas-primary)] space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
              DOCUMENTED CONDITIONS
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-accent)] text-[var(--color-accent)]">
              EXPLICIT BOUNDARIES
            </span>
          </div>

          <div className="space-y-4">
            {releaseConditions.documentedConditions.map((cond, idx) => (
              <div
                key={idx}
                className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-1.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-[var(--color-ink-primary)]">
                    {cond.area}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-accent)] font-medium">
                    {cond.status}
                  </span>
                </div>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  {cond.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
