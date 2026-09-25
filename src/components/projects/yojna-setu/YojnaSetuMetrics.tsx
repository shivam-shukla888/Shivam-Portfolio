import React from "react";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";

export function YojnaSetuMetrics() {
  const { metrics } = YOJNA_SETU_DATA;

  return (
    <section className="space-y-6" aria-labelledby="metrics-heading">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--color-hairline)]">
        <span
          id="metrics-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          {"01 // VERIFIED SYSTEM BENCHMARKS"}
        </span>
        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
          VERIFIED PROJECT METRICS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
                {metric.label}
              </span>
              <div className="font-display text-4xl sm:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
                {metric.value}
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-[var(--color-hairline)]">
              <p className="font-mono text-xs text-[var(--color-accent)] font-medium leading-tight">
                {metric.sublabel}
              </p>
              {metric.detail && (
                <p className="font-sans text-[11px] text-[var(--color-ink-secondary)] leading-relaxed">
                  {metric.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Explicit Latency Footnote */}
      <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
        <p className="font-mono text-xs text-[var(--color-ink-secondary)] leading-relaxed">
          <strong className="text-[var(--color-ink-primary)]">Note on execution metrics:</strong>{" "}
          The &lt;1 ms benchmark denotes observed direct SQL eligibility query execution in the verified Supabase PostgreSQL 17 environment. It measures indexed relational query performance and does not represent end-to-end application round-trip or network delivery latency.
        </p>
      </div>
    </section>
  );
}
