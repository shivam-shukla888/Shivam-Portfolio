import React from "react";
import Link from "next/link";
import { YojnaSetuHero } from "./YojnaSetuHero";
import { YojnaSetuMetrics } from "./YojnaSetuMetrics";
import { YojnaSetuEvidence } from "./YojnaSetuEvidence";
import { YojnaSetuAuditComparison } from "./YojnaSetuAuditComparison";
import { YojnaSetuArchitectureDiagram } from "./YojnaSetuArchitectureDiagram";
import { YojnaSetuDeterministicSection } from "./YojnaSetuDeterministicSection";
import { YojnaSetuSecurityFindings } from "./YojnaSetuSecurityFindings";
import { YojnaSetuTestingGrid } from "./YojnaSetuTestingGrid";
import { YojnaSetuReleaseNotes } from "./YojnaSetuReleaseNotes";
import { YojnaSetuSafeDemo } from "./YojnaSetuSafeDemo";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";

export function YojnaSetuCaseStudy() {
  const data = YOJNA_SETU_DATA;

  return (
    <article className="w-full pt-16 md:pt-24 pb-20 md:pb-28 selection:bg-[var(--color-accent)] selection:text-white">
      <ScrollProgress />
      <BackToTop />

      <SectionContainer>
        <div className="space-y-20 max-w-5xl mx-auto">
          {/* 01. Hero Section */}
          <YojnaSetuHero />

          {/* 02. Verified Metrics Snapshot */}
          <YojnaSetuMetrics />

          {/* 03. Real Historical Product Evidence */}
          <YojnaSetuEvidence />

          {/* 04. V1 -> V2 Forensic Transformation */}
          <YojnaSetuAuditComparison />

          {/* 05. Decoupled System Architecture Schematic */}
          <YojnaSetuArchitectureDiagram />

          {/* 06. Core Design Philosophy: AI Understands. Rules Decide. */}
          <YojnaSetuDeterministicSection />

          {/* 07. Security Engineering & SSRF Controls */}
          <YojnaSetuSecurityFindings />

          {/* 08. Automated Testing Matrix */}
          <YojnaSetuTestingGrid />

          {/* 09. Transparent Release Conditions */}
          <YojnaSetuReleaseNotes />

          {/* 10. Portfolio-Safe Interactive Simulator */}
          <YojnaSetuSafeDemo />

          {/* 11. Engineering Takeaways & Navigation Footer */}
          <footer className="pt-12 border-t border-[var(--color-hairline)] space-y-8">
            <div className="p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                ARCHITECTURAL SUMMARY
              </span>
              <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                The Engineering Takeaway
              </h3>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                Yojna Setu V2 proves that generative AI and public-sector reliability are not mutually exclusive. By restricting language models to natural-language comprehension and delegating all statutory authority to a deterministic relational engine, the system delivers intuitive citizen accessibility without sacrificing legal correctness, privacy, or auditability.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <Link
                href="/projects"
                className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Back to Work Archive</span>
              </Link>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  GitHub Repository ↗
                </a>
                <Link
                  href="/contact?subject=Discussion%3A%20Yojna%20Setu%20Architecture"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-white hover:bg-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
                >
                  Discuss This Architecture →
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </SectionContainer>
    </article>
  );
}
