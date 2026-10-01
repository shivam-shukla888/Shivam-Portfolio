import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Resume — Shivam Shukla",
  description:
    "Resume of Shivam Shukla — AI Engineer, AI Agents and Backend Engineering.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/resume",
  },
  openGraph: {
    title: "Resume — Shivam Shukla",
    description:
      "Resume of Shivam Shukla — AI Engineer, AI Agents and Backend Engineering.",
    url: "https://shivsastra.vercel.app/resume",
    type: "profile",
    images: [{ url: "/images/resume-preview.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume — Shivam Shukla",
    description:
      "Resume of Shivam Shukla — AI Engineer, AI Agents and Backend Engineering.",
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
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                <Link href="/" className="hover:text-[var(--color-ink-primary)]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[var(--color-accent)] font-medium">Resume</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-2">
                  <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Resume
                  </h1>
                  <p className="font-sans text-xs sm:text-sm text-[var(--color-accent)] font-medium">
                    AI Engineer · AI Agents · Backend Engineering
                  </p>
                </div>
                {/* Authoritative Action Links */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({
                      variant: "primary",
                      size: "md",
                      className: "font-mono text-xs uppercase tracking-wider group",
                    })}
                  >
                    <span>View Resume</span>
                    <span className="inline-block transition-transform duration-150 group-hover:translate-x-0.5 ml-1">
                      ↗
                    </span>
                  </a>
                  <a
                    href="/resume.pdf"
                    download="Shivam_Shukla_Resume.pdf"
                    className={buttonStyles({
                      variant: "secondary",
                      size: "md",
                      className: "font-mono text-xs uppercase tracking-wider group",
                    })}
                  >
                    <span>Download Resume</span>
                    <span className="inline-block transition-transform duration-150 group-hover:translate-y-0.5 ml-1">
                      ↓
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Document Preview & Verification Meta */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-8">
              {/* Document Overview Bar */}
              <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                    DOCUMENT
                  </span>
                  <span>Shivam_Shukla_Resume.pdf</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>1 Page</span>
                  <span>·</span>
                  <span>PDF Format</span>
                  <span>·</span>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                  >
                    Open in New Tab ↗
                  </a>
                </div>
              </div>

              {/* High-Fidelity Visual Preview Frame */}
              <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] shadow-sm overflow-hidden">
                <div className="p-2 sm:p-4 bg-[var(--color-canvas-secondary)] border-b border-[var(--color-hairline)] flex items-center justify-between font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  <span>Authentic Document Preview</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--color-ink-primary)] transition-colors"
                    >
                      Fullscreen ↗
                    </a>
                  </div>
                </div>
                <div className="relative w-full aspect-[1/1.414] bg-white">
                  <Image
                    src="/images/resume-preview.png"
                    alt="Resume — Shivam Shukla"
                    fill
                    priority
                    unoptimized
                    className="object-contain"
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                </div>
              </div>

              {/* Bottom Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                    Looking for direct engineering contact?
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    Reach out directly for software roles, AI agent workflows, and backend engineering inquiries.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/resume.pdf"
                    download="Shivam_Shukla_Resume.pdf"
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                      className: "font-mono text-xs uppercase tracking-wider",
                    })}
                  >
                    Download PDF ↓
                  </a>
                  <Link
                    href="/contact"
                    className={buttonStyles({
                      variant: "primary",
                      size: "sm",
                      className: "font-mono text-xs uppercase tracking-wider",
                    })}
                  >
                    Get in Touch →
                  </Link>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Navigation Footer */}
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
