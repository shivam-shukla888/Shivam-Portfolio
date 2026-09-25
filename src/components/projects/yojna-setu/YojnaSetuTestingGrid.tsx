import React from "react";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";

export function YojnaSetuTestingGrid() {
  const { testCategories, testingMatrix } = YOJNA_SETU_DATA;
  const totalTests = 42;

  return (
    <section className="space-y-8" aria-labelledby="testing-heading">
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="testing-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          07 — AUTOMATED TEST SUITE
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          {totalTests}/{totalTests} Tests Passing: Core Test Areas
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Backend release-gate verification recorded {totalTests}/{totalTests} passing tests across four primary areas. Tests were written around actual regression vectors from the prototype.
        </p>
      </div>

      {/* 4 Human-Readable Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testCategories.map((cat, idx) => (
          <div
            key={idx}
            className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                  AREA 0{idx + 1}
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] text-[var(--color-ink-primary)] font-medium">
                  {cat.count} TESTS
                </span>
              </div>
              <h3 className="font-display text-xl text-[var(--color-ink-primary)] font-normal">
                {cat.name}
              </h3>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs font-mono">
              <span className="text-[var(--color-ink-secondary)]">STATUS</span>
              <span className="text-[var(--color-accent)] font-semibold">✓ ALL PASSING</span>
            </div>
          </div>
        ))}
      </div>

      {/* Unobtrusive Test Class Breakdown (for deep technical questions) */}
      <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-4 sm:p-5">
        <details className="group">
          <summary className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] cursor-pointer flex items-center justify-between">
            <span>View detailed test classes (9 test classes · 42 tests total)</span>
            <span className="text-[var(--color-accent)] group-open:rotate-180 transition-transform">
              ↓
            </span>
          </summary>
          <div className="pt-4 mt-3 border-t border-[var(--color-hairline)] divide-y divide-[var(--color-hairline)]">
            {testingMatrix.map((item, idx) => (
              <div
                key={idx}
                className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-accent)]">0{idx + 1}.</span>
                  <span className="text-[var(--color-ink-primary)] font-medium">{item.className}</span>
                </div>
                <div className="flex items-center gap-4 text-[var(--color-ink-secondary)]">
                  <span className="hidden md:inline font-sans text-[11px]">{item.focus}</span>
                  <span className="text-[var(--color-accent)] font-semibold">{item.testCount} tests</span>
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>

      <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <p className="font-mono text-xs text-[var(--color-ink-secondary)] leading-relaxed">
          <strong className="text-[var(--color-ink-primary)]">Interview Context:</strong>{" "}
          Passing {totalTests} automated tests confirms that specific security regressions, SSRF vectors, and eligibility matching invariants are protected in CI. It demonstrates solid engineering hygiene rather than a theoretical guarantee against all hypothetical bugs.
        </p>
      </div>
    </section>
  );
}
