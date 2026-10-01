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
    "Practical software engineering and consulting across AI agents, AI automation, AI security, and digital products by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/services",
  },
  openGraph: {
    title: "Services — Shivam Shukla",
    description:
      "Practical software engineering and consulting across AI agents, AI automation, AI security, and digital products by Shivam Shukla.",
    url: "https://shivsastra.vercel.app/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Shivam Shukla",
    description:
      "Practical software engineering and consulting across AI agents, AI automation, AI security, and digital products by Shivam Shukla.",
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
                  <span>Looking for templates or blueprints? Visit the Store</span>
                  <span>→</span>
                </Link>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Services
              </h1>
              <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                Practical engineering across AI agents, workflow automation, AI security guardrails, digital products, and backend systems.
              </p>
            </div>
          </InnerPageEntrance>

          {/* Service Rows: Real Published Services or Refined Domain Positioning */}
          <InnerPageEntrance delayIndex={1}>
            <div>
            {services.length > 0 ? (
              <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="py-10 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start hover:bg-[#F8F9FA] transition-colors duration-200 px-4 -mx-4 group"
                  >
                    <div className="md:col-span-1 font-mono text-sm text-[#2C3480] font-bold">
                      {service.programCode || "01"}
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      <h2 className="font-display text-2xl sm:text-3xl text-[#000000] group-hover:text-[#2C3480] transition-colors">
                        {service.title}
                      </h2>
                      {service.engagementModel && (
                        <span className="font-mono text-xs text-[#777777] uppercase tracking-wider block">
                          {service.engagementModel}
                        </span>
                      )}
                    </div>
                    <div className="md:col-span-5 space-y-4">
                      <p className="font-sans text-sm text-[#555555] leading-relaxed">
                        {service.summary}
                      </p>
                      {service.deliverables && service.deliverables.length > 0 && (
                        <ul className="space-y-1 font-sans text-xs text-[#111111]">
                          {service.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="text-[#2C3480] font-bold select-none">—</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="md:col-span-2 flex justify-start md:justify-end">
                      <Link
                        href={`/services/${service.slug}`}
                        className="font-mono text-xs uppercase tracking-wider text-[#000000] group-hover:text-[#2C3480] transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Details</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Editorial Service Rows */
              <div className="space-y-12">
                <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                  {SERVICES_CATALOG.map((srv) => (
                    <Link
                      key={srv.id}
                      href={`/contact?subject=${encodeURIComponent(srv.subject)}`}
                      className="py-10 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start hover:bg-[#F8F9FA] transition-colors duration-200 px-4 -mx-4 group block"
                    >
                      <div className="md:col-span-1 font-mono text-sm text-[#2C3480] font-bold">
                        {srv.code}
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <h2 className="font-display text-2xl sm:text-3xl text-[#000000] group-hover:text-[#2C3480] transition-colors">
                          {srv.title}
                        </h2>
                        <span className="font-mono text-xs text-[#777777] uppercase tracking-wider block">
                          {srv.engagement}
                        </span>
                      </div>
                      <div className="md:col-span-5 space-y-4">
                        <p className="font-sans text-sm text-[#555555] leading-relaxed">
                          {srv.summary}
                        </p>
                        <ul className="space-y-1.5 font-sans text-xs text-[#111111]">
                          {srv.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <span className="text-[#2C3480] font-bold select-none">—</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="md:col-span-2 flex justify-start md:justify-end">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#000000] group-hover:text-[#2C3480] transition-colors inline-flex items-center gap-1.5">
                          <span>Discuss Project</span>
                          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Status Note on Packaged Scopes */}
                <div className="p-8 border border-[#E5E5E5] bg-[#F8F9FA] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#2C3480] font-semibold block">
                      Custom Projects
                    </span>
                    <p className="font-sans text-xs sm:text-sm text-[#555555] max-w-2xl leading-relaxed">
                      I take on custom development projects and technical consulting directly. If you have a specific system or feature you need built, send me a message with details.
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-5 py-3 border border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transition-colors self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#000000]"
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
            <div className="pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[#555555]">
              <Link
                href="/"
                className="hover:text-[#000000] transition-colors inline-flex items-center gap-1"
              >
                <span>← Back to Home</span>
              </Link>
              <div className="flex items-center gap-4">
                <span>Store:</span>
                <Link
                  href="/store"
                  className="text-[#000000] hover:text-[#2C3480] transition-colors underline underline-offset-4"
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
