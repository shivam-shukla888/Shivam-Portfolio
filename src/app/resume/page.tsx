import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Resume — Shivam Shukla",
  description:
    "Curriculum vitae and technical background of Shivam Shukla — AI agents, AI security, automation, and digital products.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/resume",
  },
  openGraph: {
    title: "Resume — Shivam Shukla",
    description:
      "Curriculum vitae and technical background of Shivam Shukla — AI agents, AI security, automation, and digital products.",
    url: "https://shivsastra.vercel.app/resume",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Shivam Shukla",
    description:
      "Curriculum vitae and technical background of Shivam Shukla — AI agents, AI security, automation, and digital products.",
  },
};

export default function ResumePage() {
  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/about.webp"
        opacity={0.2}
        position="top"
      />
      <SectionContainer>
        <div className="max-w-3xl space-y-12">
          {/* Header */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                <Link href="/" className="hover:text-[var(--color-ink-primary)]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[var(--color-accent)] font-medium">Resume</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Resume
              </h1>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Curriculum Vitae &amp; Engineering Credentials
              </p>
            </div>
          </InnerPageEntrance>

          {/* Clean Placeholder Block */}
          <InnerPageEntrance delayIndex={1}>
            <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 md:p-12 space-y-6">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                  DOCUMENT STATUS
                </span>
                <h2 className="font-display text-2xl md:text-3xl text-[var(--color-ink-primary)]">
                  Resume will be added here.
                </h2>
                <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed max-w-xl pt-2">
                  This section is structurally prepared for an updated curriculum vitae. An authoritative PDF copy will be published directly here.
                </p>
              </div>

              {/* Disabled Action Button */}
              <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-[var(--color-hairline)]">
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "md",
                    className:
                      "opacity-60 cursor-not-allowed font-mono text-xs uppercase tracking-wider select-none",
                  })}
                >
                  <span>PDF Upload Pending</span>
                  <span className="ml-1.5 opacity-60">⏳</span>
                </button>

                <Link
                  href="/contact?subject=Resume%20Inquiry"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors underline underline-offset-4"
                >
                  Request CV Directly →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Supporting Links */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                <span>← Back to Home</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/projects"
                  className="hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  View Projects →
                </Link>
                <Link
                  href="/about"
                  className="hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  About Me →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
