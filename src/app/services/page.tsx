import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getPublishedServices } from "@/lib/services";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services — Shivam Shukla",
  description:
    "Software engineering and consulting across backend systems, AI agents, and AI application security by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/services",
  },
  openGraph: {
    title: "Services — Shivam Shukla",
    description:
      "Software engineering and consulting across backend systems, AI agents, and AI application security by Shivam Shukla.",
    url: "https://shivsastra.vercel.app/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Shivam Shukla",
    description:
      "Software engineering and consulting across backend systems, AI agents, and AI application security by Shivam Shukla.",
  },
};

import { SERVICES_CATALOG } from "@/data/portfolio-data";

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
          {/* Header Block with Clear Service Context */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Work with Me
                </span>
                <Link
                  href="/store"
                  className="font-mono text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                >
                  <span>Looking for digital products or tools? Visit the Store</span>
                  <span>→</span>
                </Link>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Services
              </h1>
              <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                I work with clients on custom software development and consulting across backend systems, AI agents, and AI security.
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
                        <span>View details</span>
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
            /* Practical Deliverables Architecture */
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SERVICES_CATALOG.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                          {srv.code}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                          {srv.engagement}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl font-normal text-[var(--color-ink-primary)]">
                        {srv.title}
                      </h2>
                      <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                        {srv.summary}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-[var(--color-hairline)]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                          Key Deliverables
                        </span>
                        <ul className="space-y-1.5 font-sans text-xs text-[var(--color-ink-primary)]">
                          {srv.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="text-[var(--color-accent)] select-none">—</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-hairline)]">
                      <Link
                        href={`/contact?subject=${encodeURIComponent(srv.subject)}`}
                        className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                      >
                        <span>Discuss a Project</span>
                        <span className="transition-transform duration-150 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Note on Packaged Scopes */}
              <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-medium">
                    Custom Projects
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-2xl leading-relaxed">
                    I take on custom development projects and technical consulting directly. If you have a specific system or feature you need built, send me a message with details.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] transition-colors self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  Get in Touch →
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
                <span>Store:</span>
                <Link
                  href="/store"
                  className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                >
                  Visit the Store →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
