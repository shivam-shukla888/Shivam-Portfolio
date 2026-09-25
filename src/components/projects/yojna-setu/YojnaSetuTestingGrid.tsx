import React from "react";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";

export function YojnaSetuTestingGrid() {
  const { testingMatrix } = YOJNA_SETU_DATA;
  const totalTests = testingMatrix.reduce((acc, curr) => acc + curr.testCount, 0);

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
          {totalTests}/{totalTests} Tests Passing: Continuous Verification
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Independent release-gate verification recorded {totalTests}/{totalTests} passing automated unit, integration, and security tests. Test suites were designed around historical regression points rather than superficial coverage targets.
        </p>
      </div>

      {/* Test Matrix Table / Grid */}
      <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <div className="p-4 sm:p-6 border-b border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-4 bg-[var(--color-canvas-primary)]">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl text-[var(--color-ink-primary)] font-normal">
              {totalTests} Automated Tests
            </span>
            <span className="font-mono text-[11px] px-2.5 py-1 bg-[var(--color-accent)] text-white font-medium">
              100% SUITE PASS RATE
            </span>
          </div>
          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
            SPRING BOOT 3.2 · JUNIT 5 · MOCKITO
          </span>
        </div>

        <div className="divide-y divide-[var(--color-hairline)]">
          {testingMatrix.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              <div className="md:col-span-5 flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--color-accent)] font-semibold w-8">
                  0{idx + 1}.
                </span>
                <span className="font-mono text-xs font-semibold text-[var(--color-ink-primary)] truncate">
                  {item.className}
                </span>
              </div>

              <div className="md:col-span-5">
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  {item.focus}
                </p>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <span className="font-mono text-xs font-semibold text-[var(--color-ink-primary)]">
                  {item.testCount} tests
                </span>
                <span className="font-mono text-[11px] text-[var(--color-accent)]">
                  ✓ PASS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
        <p className="font-mono text-xs text-[var(--color-ink-secondary)] leading-relaxed">
          <strong className="text-[var(--color-ink-primary)]">Verification Scope:</strong>{" "}
          Passing {totalTests} automated tests confirms that specific security regressions, SSRF vectors, and eligibility matching invariants are reliably protected in CI. It demonstrates rigorous engineering hygiene rather than a theoretical guarantee against all hypothetical issues.
        </p>
      </div>
    </section>
  );
}
