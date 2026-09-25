import React from "react";
import Image from "next/image";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";

export function YojnaSetuEvidence() {
  const { evidenceAssets } = YOJNA_SETU_DATA;

  return (
    <section id="product-evidence" className="space-y-12" aria-labelledby="evidence-heading">
      {/* Section Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
        <span
          id="evidence-heading"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold"
        >
          02 — PRODUCT EVIDENCE
        </span>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
          Real-World Multilingual Scheme Discovery
        </h2>
        <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          Historical interaction captures from the original Yojna Setu conversational pipeline. These unedited captures demonstrate how real citizens interface with natural-language intake, slot filling, and eligibility resolution.
        </p>
      </div>

      {/* Two-Column Editorial Diptych */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {evidenceAssets.map((asset, index) => (
          <article
            key={asset.id}
            className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-col justify-between"
          >
            {/* Top Evidence Metadata Strip */}
            <div className="p-4 border-b border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                {asset.eyebrow}
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-primary)] font-medium">
                HISTORICAL PRODUCT ARTIFACT
              </span>
            </div>

            {/* Visual Frame — Strict 0px Geometry & Unaltered Aspect Ratio */}
            <div className="p-4 sm:p-6 flex justify-center bg-[var(--color-surface-dark)]">
              <div className="relative w-full max-w-[380px] aspect-[907/1600] border border-[var(--color-dark-hairline)] overflow-hidden">
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </div>

            {/* Narrative & Verification Observations */}
            <div className="p-6 space-y-4 border-t border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
                  <h3 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)]">
                    {asset.title}
                  </h3>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                  {asset.observation}
                </p>
              </div>

              {/* Archival Label */}
              <div className="pt-3 border-t border-[var(--color-hairline)]">
                <p className="font-mono text-[11px] text-[var(--color-ink-secondary)] italic">
                  {asset.caption}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Editorial Journey Walkthrough */}
      <div className="p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
            CHRONOLOGICAL INTERACTION JOURNEY
          </span>
          <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
            How The Conversational Pipeline Resolves Citizen Demographics
          </h3>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
            The screenshots record an unbroken 9-step interaction sequence. Natural language allows citizens to express their situation without navigating bureaucratic dropdowns, while the underlying engine progressively collects the necessary relational predicates:
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 list-none">
          <li className="space-y-2 p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
            <span className="font-mono text-xs font-semibold text-[var(--color-accent)]">
              PHASE I: INTAKE &amp; DISAMBIGUATION
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              1. Citizen sends <code className="font-mono text-[11px] bg-[var(--color-canvas-secondary)] px-1 py-0.5">Reset</code>.<br />
              2. Citizen provides unformatted Hinglish text containing age, state, student occupation, income, and religion.<br />
              3. System identifies missing gender slot and prompts for exact clarification.
            </p>
          </li>

          <li className="space-y-2 p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
            <span className="font-mono text-xs font-semibold text-[var(--color-accent)]">
              PHASE II: SCHEME EVALUATION
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              4. Citizen replies <code className="font-mono text-[11px] bg-[var(--color-canvas-secondary)] px-1 py-0.5">Purush</code>.<br />
              5. All demographic criteria are satisfied; rules engine filters 82 schemes down to 5 qualified programs.<br />
              6. Citizen receives verified scheme titles with direct portal application URLs.
            </p>
          </li>

          <li className="space-y-2 p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
            <span className="font-mono text-xs font-semibold text-[var(--color-accent)]">
              PHASE III: GUIDANCE &amp; CHECKLISTS
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              7. Citizen requests <code className="font-mono text-[11px] bg-[var(--color-canvas-secondary)] px-1 py-0.5">Deadline</code>, receiving upcoming cutoff dates.<br />
              8. Citizen requests <code className="font-mono text-[11px] bg-[var(--color-canvas-secondary)] px-1 py-0.5">Documents</code>.<br />
              9. System details the necessary identity and verification paperwork for each scheme.
            </p>
          </li>
        </ol>

        <div className="pt-2 border-t border-[var(--color-hairline)]">
          <p className="font-mono text-xs text-[var(--color-ink-secondary)] leading-relaxed">
            <strong className="text-[var(--color-ink-primary)]">Architecture Distinction:</strong>{" "}
            These captures represent authentic product behavior recorded during early conversational pipeline testing. The V2 engineering rebuild retained this conversational model while replacing the entire underlying backend with the hardened, testable, and defense-in-depth architecture documented below.
          </p>
        </div>
      </div>
    </section>
  );
}
