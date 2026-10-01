"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SERVICES_CATALOG } from "@/data/portfolio-data";

export function EditorialServices() {
  const [activeId, setActiveId] = useState<string>(SERVICES_CATALOG[0]?.id || "");

  return (
    <div className="divide-y divide-[var(--color-hairline)] border-t border-b border-[var(--color-hairline)]">
      {SERVICES_CATALOG.map((srv, idx) => {
        const isExpanded = activeId === srv.id;
        const num = String(idx + 1).padStart(2, "0");

        return (
          <div
            key={srv.id}
            className={cn(
              "group transition-colors duration-200",
              isExpanded
                ? "bg-[var(--color-canvas-primary)]"
                : "bg-transparent hover:bg-[var(--color-canvas-primary)]/50"
            )}
          >
            {/* Header / Clickable Row */}
            <button
              type="button"
              onClick={() => setActiveId(isExpanded ? "" : srv.id)}
              aria-expanded={isExpanded}
              className="w-full py-6 md:py-8 px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <div className="flex items-baseline gap-6 md:gap-10">
                <span className="font-mono text-sm md:text-base text-[var(--color-accent)] font-semibold shrink-0">
                  {num}
                </span>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    {srv.title}
                  </h3>
                  <div className="font-mono text-xs text-[var(--color-ink-secondary)] pt-1 flex items-center gap-3">
                    <span>{srv.code}</span>
                    <span className="text-[var(--color-hairline)]">·</span>
                    <span>{srv.engagement}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <span className="font-mono text-xs text-[var(--color-ink-secondary)] uppercase tracking-wider hidden sm:inline">
                  {isExpanded ? "Collapse" : "Explore"}
                </span>
                <span
                  className={cn(
                    "w-8 h-8 rounded-none border border-[var(--color-hairline)] flex items-center justify-center font-mono text-xs transition-transform duration-200",
                    isExpanded ? "rotate-90 bg-[var(--color-ink-primary)] text-white border-[var(--color-ink-primary)]" : "text-[var(--color-ink-primary)]"
                  )}
                >
                  →
                </span>
              </div>
            </button>

            {/* Expanded Editorial Content */}
            {isExpanded && (
              <div className="px-4 sm:px-6 pb-8 md:pl-24 grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-[var(--color-hairline)]/60">
                <div className="lg:col-span-6 space-y-4">
                  <p className="font-sans text-sm sm:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                    {srv.summary}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/contact?subject=${encodeURIComponent(srv.subject)}`}
                      className="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] hover:bg-[var(--color-accent)] transition-colors inline-flex items-center gap-2"
                    >
                      <span>Inquire About {srv.title}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-3 p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Verified Deliverables &amp; Artifacts
                  </span>
                  <ul className="space-y-2 font-sans text-xs text-[var(--color-ink-primary)]">
                    {srv.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5">
                        <span className="text-[var(--color-accent)] font-mono select-none">—</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
