import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Yojna Setu — Agent Showcase Card
 *
 * A static editorial showcase card for the Store > AI Agents page.
 * This is NOT a purchasable product. It's a project showcase that
 * links to the full case study at /projects/yojna-setu.
 *
 * All facts here are verified from the Yojna Setu V2 codebase:
 * - 82 normalized schemes (63 Central, 11 State, 8 Philanthropic)
 * - 42/42 automated tests passing
 * - 0 critical/high security findings
 */
export function YojnaSetuShowcase() {
  return (
    <section
      aria-labelledby="yojna-setu-showcase-title"
      className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden"
    >
      {/* Full-width layout: left column = content, right column = visual */}
      <div className="flex flex-col lg:flex-row">
        {/* Content Column */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 space-y-5 flex flex-col justify-between">
          {/* Badge Row */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5">
                Agent Showcase
              </span>
              <span className="inline-block font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)]">
                YS-V2 · 2026
              </span>
              <span className="inline-block font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)]">
                Backend Systems · AI Security
              </span>
            </div>

            {/* Title & Summary */}
            <div className="space-y-2">
              <h3
                id="yojna-setu-showcase-title"
                className="font-display text-2xl sm:text-3xl font-normal text-[var(--color-ink-primary)] tracking-tight"
              >
                Yojna Setu
              </h3>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed max-w-lg">
                A WhatsApp AI agent for government welfare-scheme discovery.
                Users describe themselves in natural language — AI extracts
                demographic attributes, then deterministic Java rules evaluate
                eligibility across 82 normalized schemes.
              </p>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="space-y-0.5">
                <span className="font-mono text-lg font-medium text-[var(--color-ink-primary)]">
                  82
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
                  Schemes
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-lg font-medium text-[var(--color-ink-primary)]">
                  42/42
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
                  Tests Passing
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-lg font-medium text-[var(--color-accent)]">
                  0
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
                  Critical Findings
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="font-mono text-lg font-medium text-[var(--color-ink-primary)]">
                  &lt;1 ms
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-secondary)]">
                  SQL Query
                </span>
              </div>
            </div>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                "Java 21",
                "Spring Boot",
                "PostgreSQL 17",
                "Groq Cloud",
                "Twilio",
                "Supabase",
              ].map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[10px] text-[var(--color-ink-secondary)] uppercase tracking-wider">
              Not a store product — Full engineering case study
            </span>
            <Link
              href="/projects/yojna-setu"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] font-mono text-[11px] uppercase tracking-wider hover:bg-[var(--color-accent)] transition-colors duration-150 group"
            >
              <span>View Case Study</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Visual Column — WhatsApp Evidence Preview */}
        <div className="lg:w-[320px] xl:w-[380px] shrink-0 border-t lg:border-t-0 lg:border-l border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-4 sm:p-6 flex items-center justify-center">
          <div className="relative w-full max-w-[260px] aspect-[9/16] border border-[var(--color-hairline)] overflow-hidden bg-[var(--color-canvas-secondary)]">
            <Image
              src="/images/projects/yojna-setu/evidence-whatsapp-discovery.png"
              alt="Yojna Setu WhatsApp conversation showing multilingual demographic extraction and scheme recommendations"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 260px, 320px"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--color-canvas-primary)] to-transparent h-16" />
            <div className="absolute bottom-2 left-2 right-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]/90 px-1.5 py-0.5">
                Historical WhatsApp Evidence
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
