import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getPublishedServices } from "@/lib/services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services & Engagements — Shivam Shukla",
  description:
    "Professional technology services and bespoke engineering engagements across Backend Systems, Agentic AI, and AI Security by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.com/services",
  },
  openGraph: {
    title: "Services & Engagements — Shivam Shukla",
    description:
      "Professional technology services and bespoke engineering engagements across Backend Systems, Agentic AI, and AI Security by Shivam Shukla.",
    url: "https://shivsastra.com/services",
    type: "website",
  },
};

const SERVICE_DOMAINS = [
  {
    index: "01",
    domain: "BACKEND SYSTEMS",
    title: "Backend Systems Engineering",
    summary:
      "Resilient systems architecture, distributed data layers, deterministic APIs, and high-integrity transactional backends engineered for stability.",
    engagement: "Bespoke Scopes · Architecture Audits · Advisory",
    ctaSubject: "Backend Systems Inquiry",
    ctaLabel: "Discuss a Project",
  },
  {
    index: "02",
    domain: "AGENTIC AI",
    title: "Agentic AI & Orchestration",
    summary:
      "Autonomous cognitive agents, multi-agent workflows, tool execution interfaces, and deterministic evaluation harnesses designed for production reliability.",
    engagement: "Workflow Design · Agent Implementation · Advisory",
    ctaSubject: "Agentic AI Inquiry",
    ctaLabel: "Start a Conversation",
  },
  {
    index: "03",
    domain: "AI SECURITY",
    title: "AI Security & System Hardening",
    summary:
      "Vulnerability surface analysis, agentic permission boundaries, runtime defenses, defense-in-depth isolation, and secure sandbox execution.",
    engagement: "Security Architecture · Boundary Hardening · Advisory",
    ctaSubject: "AI Security Inquiry",
    ctaLabel: "Get in Touch",
  },
];

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/services.webp"
        opacity={0.25}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-12">
          {/* Header Block with Dual Identity Clarity */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  WORK WITH SHIVAM · PROFESSIONAL SERVICES
                </span>
                <Link
                  href="/store"
                  className="font-mono text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                >
                  <span>Looking to purchase digital tools? Visit Store</span>
                  <span>→</span>
                </Link>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Services & Engagements
              </h1>
              <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                Tailored technical engagements and advisory scopes across Backend Systems, Agentic AI, and AI Security.
                Each engagement is scoped directly around project requirements, architecture constraints, and technical integrity.
              </p>
            </div>
          </InnerPageEntrance>

          {/* Service Grid: Real Published Services or Refined Domain Positioning */}
          <InnerPageEntrance delayIndex={1}>
            <div>
            {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-hairline)] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-8 space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {service.programCode && (
                      <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block">
                        {service.programCode}
                      </span>
                    )}
                    <h2 className="font-display text-2xl font-normal text-[var(--color-ink-primary)]">
                      {service.title}
                    </h2>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      {service.summary}
                    </p>

                    {service.deliverables && service.deliverables.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[var(--color-hairline)]">
                        <span className="font-sans text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] font-medium">
                          Deliverables
                        </span>
                        <ul className="space-y-1.5 font-sans text-xs text-[var(--color-ink-primary)] list-none">
                          {service.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="text-[var(--color-accent)] select-none">
                                —
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-[var(--color-hairline)]">
                    {service.engagementModel && (
                      <div className="font-mono text-xs text-[var(--color-ink-secondary)]">
                        {service.engagementModel}
                      </div>
                    )}
                    <div>
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                      >
                        <span>View Details</span>
                        <span className="transition-transform duration-150 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Editorial Positioning Architecture (Zero Fake Cards) */
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-hairline)] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                {SERVICE_DOMAINS.map((domain) => (
                  <div
                    key={domain.index}
                    className="p-8 space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                          {`${domain.index} — ${domain.domain}`}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-normal text-[var(--color-ink-primary)]">
                        {domain.title}
                      </h2>
                      <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                        {domain.summary}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[var(--color-hairline)]">
                      <div className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                        {domain.engagement}
                      </div>
                      <div>
                        <Link
                          href={`/contact?subject=${encodeURIComponent(domain.ctaSubject)}`}
                          className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                        >
                          <span>{domain.ctaLabel}</span>
                          <span className="transition-transform duration-150 group-hover:translate-x-1">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Note on Packaged Scopes */}
              <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-medium">
                    ADVISORY NOTE
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-2xl leading-relaxed">
                    Formal packaged programs are currently under editorial review. Custom scopes, technical reviews, and engineering advisory across these domains are arranged via direct conversation.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] transition-colors self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  Start a Conversation →
                </Link>
              </div>
            </div>
          )}
            </div>
          </InnerPageEntrance>

          {/* Cross-Link Distinction: Services vs Store */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                <span>← Back to Home</span>
              </Link>
              <div className="flex items-center gap-4">
                <span>EXPLORE SHIVSASTRA:</span>
                <Link
                  href="/store"
                  className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                >
                  The Store (Digital Products) →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
