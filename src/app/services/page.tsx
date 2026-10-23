import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { ContactForm } from "@/components/contact/ContactForm";
import { getPublishedServices } from "@/lib/services";
import {
  SERVICE_PACKAGES,
  SERVICE_PROCESS_STEPS,
  SERVICE_FAQS,
  TECHNICAL_CAPABILITIES,
  WEBSITE_ENGINEERING_SHOWCASE,
} from "@/data/services-data";
import {
  absoluteUrl,
  serializeJsonLd,
  VERIFIED_CONTACT_EMAIL,
} from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Web Development & AI Integration Services",
  description:
    "Professional web development, website bug fixing, Next.js landing pages, API integrations, and AI workflow automation by Shivam Shukla. Transparent pricing with clear scopes.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
  openGraph: {
    title: "Web Development & AI Integration Services — Shivam Shukla",
    description:
      "Professional web development, website bug fixing, Next.js landing pages, API integrations, and AI workflow automation by Shivam Shukla. Transparent pricing with clear scopes.",
    url: absoluteUrl("/services"),
    type: "website",
    siteName: "ShivSastra",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Web Development & AI Integration Services — Shivam Shukla",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development & AI Integration Services — Shivam Shukla",
    description:
      "Professional web development, website bug fixing, Next.js landing pages, API integrations, and AI workflow automation by Shivam Shukla.",
    images: ["/og-image.png"],
  },
};

export default async function ServicesPage() {
  const dynamicServices = await getPublishedServices();

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/services#webpage"),
        url: absoluteUrl("/services"),
        name: "Web Development & AI Integration Services — Shivam Shukla",
        description:
          "Professional web development, bug fixing, Next.js landing pages, API integrations, and AI automation.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: absoluteUrl("/"),
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: absoluteUrl("/services"),
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": absoluteUrl("/services#packages"),
        name: "Service Packages",
        itemListElement: SERVICE_PACKAGES.map((pkg, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: pkg.title,
            description: pkg.summary,
            provider: {
              "@type": "Person",
              name: "Shivam Shukla",
              url: absoluteUrl("/"),
            },
            offers: {
              "@type": "Offer",
              priceSpecification: {
                "@type": "PriceSpecification",
                description: pkg.startingPrice,
              },
            },
          },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl("/services#faq"),
        mainEntity: SERVICE_FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(servicesJsonLd) }}
      />
      <PageBackground
        src="/images/backgrounds/services.webp"
        opacity={0.25}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-20 md:space-y-28">
          {/* 1. Header & Outcome-Focused Positioning */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-6 pb-12 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[var(--color-accent)] inline-block" />
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                    Freelance Web &amp; AI Engineering
                  </span>
                </div>
                <Link
                  href="/store"
                  className="font-mono text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  <span>Prefer a ready-made solution? Browse the Store</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="space-y-4 max-w-4xl">
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
                  Web Development &amp; AI Integration Services
                </h1>
                <p className="font-sans text-base sm:text-lg md:text-xl text-[var(--color-ink-secondary)] leading-relaxed">
                  Practical engineering for founders, creators, and growing teams.
                  From rapid bug fixes and high-performance landing pages to custom backend integrations
                  and practical AI automations—built with clean architecture, verifiable code, and transparent pricing.
                </p>
              </div>

              {/* Outcome Pillars Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[var(--color-hairline)]">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Fast Turnaround
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    Bug fixes in 1–2 days, landing pages in 3–5 days.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Clean Tech Stack
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    Next.js 16, React 19, TypeScript, Tailwind, Python &amp; Java.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Honest Pricing
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    Clear starting rates, zero hidden fees, defined scope upfront.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Direct Handoff
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    100% code ownership, clean git history, concise docs.
                  </p>
                </div>
              </div>

              {/* Fast Action Links */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-5 py-3 bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] hover:bg-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  Request a Quote ↓
                </a>
                <a
                  href="#packages"
                  className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-5 py-3 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] hover:bg-[var(--color-canvas-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  View Packages &amp; Starting Rates ↓
                </a>
                <a
                  href="#capabilities"
                  className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-5 py-3 border border-transparent text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  Inspect Capabilities ↓
                </a>
              </div>
            </div>
          </InnerPageEntrance>

          {/* 2. Verified Technical Capabilities Section */}
          <InnerPageEntrance delayIndex={1}>
            <section id="capabilities" className="space-y-10 scroll-mt-20">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                    Technical Capabilities
                  </span>
                  <span className="text-xs font-mono text-[var(--color-ink-secondary)]">
                    (Verified Against Code)
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  What I Genuinely Build
                </h2>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  Every capability listed below is backed by source code, automated test suites, or working architecture prototypes.
                  I do not advertise popular buzzwords without hands-on implementation experience.
                </p>
              </div>

              {/* Capabilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {TECHNICAL_CAPABILITIES.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Badge & Category */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-3">
                        <span className="font-display text-xl font-normal text-[var(--color-ink-primary)]">
                          {cap.category}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-accent)] font-semibold">
                          {cap.verificationBadge}
                        </span>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cap.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono text-[11px] px-2 py-0.5 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] text-[var(--color-ink-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Summary */}
                      <p className="font-sans text-xs sm:text-sm text-[var(--color-ink-primary)] leading-relaxed">
                        {cap.summary}
                      </p>

                      {/* Capabilities List */}
                      <div className="space-y-2 pt-2 border-t border-[var(--color-hairline)]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                          Verified Skills
                        </span>
                        <ul className="space-y-1.5 list-none">
                          {cap.capabilities.map((item, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2 font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                              <span className="text-[var(--color-accent)] select-none shrink-0">—</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Evidence Link */}
                    <div className="pt-4 border-t border-[var(--color-hairline)]">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-primary)] font-semibold block mb-1">
                        Demonstrated In
                      </span>
                      {cap.evidence.slug ? (
                        <Link
                          href={`/projects/${cap.evidence.slug}`}
                          className="font-sans text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 group"
                        >
                          <span className="underline underline-offset-2 font-medium">
                            {cap.evidence.title}
                          </span>
                          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                        </Link>
                      ) : (
                        <span className="font-sans text-xs text-[var(--color-ink-primary)] font-medium">
                          {cap.evidence.title}
                        </span>
                      )}
                      <p className="font-sans text-[11px] text-[var(--color-ink-secondary)] mt-0.5">
                        {cap.evidence.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </InnerPageEntrance>

          {/* 3. Website Engineering Case in Point */}
          <InnerPageEntrance delayIndex={2}>
            <section id="engineering" className="space-y-10 scroll-mt-20">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                    Case in Point
                  </span>
                  <span className="text-xs font-mono text-[var(--color-ink-secondary)]">
                    (How This Site Is Built)
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Live Proof: Website Engineering &amp; Hygiene
                </h2>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  Rather than making unsubstantiated claims, this website itself demonstrates the technical standards,
                  defensive security, and SEO hygiene delivered to clients.
                </p>
              </div>

              {/* Engineering Showcase Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {WEBSITE_ENGINEERING_SHOWCASE.map((showcase) => (
                  <div
                    key={showcase.id}
                    className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                          {showcase.badge}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-normal text-[var(--color-ink-primary)]">
                        {showcase.title}
                      </h3>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        {showcase.summary}
                      </p>

                      <ul className="space-y-2 pt-2 border-t border-[var(--color-hairline)] list-none">
                        {showcase.highlights.map((highlight, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2 font-sans text-xs text-[var(--color-ink-primary)] leading-relaxed">
                            <span className="text-[var(--color-accent)] font-bold select-none shrink-0">✓</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-3 -mx-2 -mb-2 border">
                      <p className="font-sans text-[11px] text-[var(--color-ink-secondary)] leading-relaxed italic">
                        {showcase.transparencyNote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </InnerPageEntrance>

          {/* 4. Service Packages Section */}
          <InnerPageEntrance delayIndex={3}>
            <section id="packages" className="space-y-10 scroll-mt-20">
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                    Freelance Packages
                  </span>
                  <span className="text-xs font-mono text-[var(--color-ink-secondary)]">
                    (5 Scoped Tiers)
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Defined Deliverables, Honest Starting Rates
                </h2>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  These packages are structured to solve real client problems without agency bloat.
                  Rates are proposed introductory prices; final quotes are confirmed after reviewing your exact scope.
                </p>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {SERVICE_PACKAGES.map((pkg) => (
                  <article
                    key={pkg.id}
                    className="p-6 sm:p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-col justify-between space-y-6 hover:border-[var(--color-ink-primary)] transition-all"
                  >
                    <div className="space-y-5">
                      {/* Top Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-hairline)] pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                            {pkg.code}
                          </span>
                          <span className="text-[var(--color-hairline)] select-none">|</span>
                          <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                            {pkg.category}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)] px-2 py-0.5 border border-[var(--color-hairline)]">
                          {pkg.turnaround}
                        </span>
                      </div>

                      {/* Title & Price */}
                      <div className="space-y-2">
                        <h3 className="font-display text-2xl sm:text-3xl font-normal text-[var(--color-ink-primary)] leading-tight">
                          {pkg.title}
                        </h3>
                        <div className="pt-1">
                          <div className="font-mono text-lg sm:text-xl font-semibold text-[var(--color-accent)]">
                            {pkg.startingPrice}
                          </div>
                          <p className="font-sans text-xs text-[var(--color-ink-secondary)] pt-1 italic">
                            {pkg.pricingNote}
                          </p>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed">
                        {pkg.summary}
                      </p>

                      {/* Ideal For */}
                      <div className="p-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] space-y-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                          Ideal For
                        </span>
                        <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                          {pkg.idealFor}
                        </p>
                      </div>

                      {/* Deliverables Checklist */}
                      <div className="space-y-2.5 pt-2 border-t border-[var(--color-hairline)]">
                        <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] font-semibold block">
                          What&apos;s Included
                        </span>
                        <ul className="space-y-2 list-none">
                          {pkg.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2.5 font-sans text-xs text-[var(--color-ink-primary)] leading-relaxed">
                              <span className="text-[var(--color-accent)] font-bold select-none shrink-0">
                                ✓
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Exclusions & Scope Boundaries */}
                      <div className="space-y-2 pt-2 border-t border-[var(--color-hairline)]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-secondary)] font-semibold block">
                          Scope Boundaries &amp; Exclusions
                        </span>
                        <ul className="space-y-1.5 list-none">
                          {pkg.exclusions.map((item, eIdx) => (
                            <li key={eIdx} className="flex items-start gap-2 font-sans text-[11px] text-[var(--color-ink-secondary)] leading-relaxed">
                              <span className="text-[var(--color-ink-secondary)] select-none shrink-0">
                                ✕
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Proof Project Link */}
                      {pkg.proofProject && (
                        <div className="pt-2 border-t border-[var(--color-hairline)]">
                          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block mb-1">
                            Relevant Portfolio Proof
                          </span>
                          <Link
                            href={`/projects/${pkg.proofProject.slug}`}
                            className="font-sans text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 group"
                          >
                            <span className="underline underline-offset-2 font-medium">
                              {pkg.proofProject.title}
                            </span>
                            <span className="transition-transform duration-150 group-hover:translate-x-1">
                              →
                            </span>
                          </Link>
                          <p className="font-sans text-[11px] text-[var(--color-ink-secondary)] mt-0.5">
                            {pkg.proofProject.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Card Action */}
                    <div className="pt-4 border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                        {pkg.revisions}
                      </span>
                      <a
                        href={`/contact?subject=${encodeURIComponent(pkg.contactSubject)}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                      >
                        <span>Discuss This Scope</span>
                        <span>→</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              {/* Dynamic Database Services (if present) */}
              {dynamicServices.length > 0 && (
                <div className="pt-8 border-t border-[var(--color-hairline)] space-y-6">
                  <div className="space-y-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                      Advisory &amp; Retainer Engagements
                    </span>
                    <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)]">
                      Extended Consulting Services
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-hairline)] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                    {dynamicServices.map((service) => (
                      <div key={service.id} className="p-6 space-y-4 flex flex-col justify-between">
                        <div className="space-y-2">
                          {service.programCode && (
                            <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block">
                              {service.programCode}
                            </span>
                          )}
                          <h4 className="font-display text-xl font-normal text-[var(--color-ink-primary)]">
                            {service.title}
                          </h4>
                          <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                            {service.summary}
                          </p>
                        </div>
                        <Link
                          href={`/services/${service.slug}`}
                          className="font-mono text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                        >
                          <span>View engagement details</span>
                          <span>→</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </InnerPageEntrance>

          {/* 5. Process Section */}
          <InnerPageEntrance delayIndex={4}>
            <section id="process" className="space-y-8 scroll-mt-20">
              <div className="space-y-3 max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Transparent Process
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  How We Work: From Scope to Delivery
                </h2>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  Every engagement follows a predictable, five-step workflow designed to eliminate surprises,
                  ensure honest pricing, and hand over production-ready code.
                </p>
              </div>

              {/* 5-Step Process Timeline Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {SERVICE_PROCESS_STEPS.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="font-mono text-xs font-bold text-[var(--color-accent)]">
                        {step.step}
                      </span>
                      <h3 className="font-display text-lg font-normal text-[var(--color-ink-primary)]">
                        {step.title}
                      </h3>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[var(--color-hairline)]">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] block">
                        Deliverable
                      </span>
                      <span className="font-sans text-[11px] text-[var(--color-ink-primary)] font-medium">
                        {step.deliverable}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </InnerPageEntrance>

          {/* 6. Verified Portfolio Proof Section */}
          <InnerPageEntrance delayIndex={5}>
            <section id="proof" className="space-y-8 scroll-mt-20">
              <div className="space-y-3 max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Verified Proof
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Real Projects Built &amp; Deployed
                </h2>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  Real code in production. Inspect actual architecture case studies, repositories, and live systems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Proof 1: Yojna Setu */}
                <Link
                  href="/projects/yojna-setu"
                  className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--color-ink-secondary)]">
                      <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                        AI Chatbot &amp; NLP Rules Engine
                      </span>
                      <span>Case Study</span>
                    </div>
                    <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      Yojna Setu
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Multilingual welfare scheme discovery platform combining Groq LLM profile extraction with a deterministic Java eligibility engine.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                    <span>View Architecture Proof</span>
                    <span>→</span>
                  </div>
                </Link>

                {/* Proof 2: QuickEats */}
                <Link
                  href="/projects/quickeats"
                  className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--color-ink-secondary)]">
                      <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                        Full-Stack Web App
                      </span>
                      <span>Production Build</span>
                    </div>
                    <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      QuickEats
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Full-stack food ordering platform built on Next.js 14, Tailwind CSS, STOMP WebSockets, and strict server-side cart calculation.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                    <span>View Project Proof</span>
                    <span>→</span>
                  </div>
                </Link>

                {/* Proof 3: RealGuard */}
                <Link
                  href="/projects/realguard"
                  className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--color-ink-secondary)]">
                      <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                        Security &amp; Input Defense
                      </span>
                      <span>Extension</span>
                    </div>
                    <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      RealGuard
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Zero-trust browser security extension implementing prompt-injection defense, deterministic verification, and client/server data isolation.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                    <span>View Security Proof</span>
                    <span>→</span>
                  </div>
                </Link>

                {/* Proof 4: ShivSastra Platform */}
                <Link
                  href="/projects/shivsastra"
                  className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 hover:border-[var(--color-ink-primary)] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs text-[var(--color-ink-secondary)]">
                      <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                        Next.js 16 &amp; React 19
                      </span>
                      <span>Live Site</span>
                    </div>
                    <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      ShivSastra Platform
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Production Next.js 16 App Router application with Turbopack, Razorpay payment verification, Supabase Row-Level Security, and rigorous technical SEO.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                    <span>View Platform Case Study</span>
                    <span>→</span>
                  </div>
                </Link>
              </div>
            </section>
          </InnerPageEntrance>

          {/* 7. Clear FAQ Section */}
          <InnerPageEntrance delayIndex={6}>
            <section id="faq" className="space-y-8 scroll-mt-20">
              <div className="space-y-3 max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Frequently Asked Questions
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Everything You Need to Know Before Reaching Out
                </h2>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  Honest, upfront clarity on pricing, delivery timelines, revisions, hosting accounts, and scope expectations.
                </p>
              </div>

              {/* Accessible Native Accordion */}
              <div className="divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
                {SERVICE_FAQS.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group py-5 focus-within:outline-none"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none text-left select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]">
                      <span className="font-display text-lg sm:text-xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors pr-4">
                        {faq.question}
                      </span>
                      <span className="font-mono text-base text-[var(--color-accent)] transition-transform duration-200 group-open:rotate-45 select-none shrink-0">
                        +
                      </span>
                    </summary>
                    <div className="pt-4 pb-2 pr-6">
                      <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          </InnerPageEntrance>

          {/* 8. Conversion CTA & Direct Quote Form */}
          <InnerPageEntrance delayIndex={7}>
            <section
              id="quote"
              className="p-8 sm:p-12 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-8 scroll-mt-20"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Contact Intro & Channels */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold block">
                      Get in Touch
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                      Request a Quote
                    </h2>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      Have a bug to fix, a landing page to launch, or an API to integrate?
                      Send me a brief outline of what you need. I&apos;ll review the scope and reply within 24 hours with a transparent estimate.
                    </p>
                  </div>

                  {/* Verified Contact Details */}
                  <div className="space-y-3 pt-4 border-t border-[var(--color-hairline)]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-primary)] font-semibold block">
                      Direct Contact Channels
                    </span>
                    <div className="space-y-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                      <div>
                        <span className="text-[var(--color-ink-primary)] font-medium">Email: </span>
                        <a
                          href={`mailto:${VERIFIED_CONTACT_EMAIL}`}
                          className="hover:text-[var(--color-accent)] underline underline-offset-2 transition-colors"
                        >
                          {VERIFIED_CONTACT_EMAIL}
                        </a>
                      </div>
                      <div>
                        <span className="text-[var(--color-ink-primary)] font-medium">Contra: </span>
                        <a
                          href="https://contra.com/shivam_shukla_7duxsdr7/work"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--color-accent)] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                        >
                          <span>contra.com/shivam_shukla_7duxsdr7</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      </div>
                      <div>
                        <span className="text-[var(--color-ink-primary)] font-medium">LinkedIn: </span>
                        <a
                          href="https://www.linkedin.com/in/shivam-shukla-186276374/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--color-accent)] underline underline-offset-2 transition-colors inline-flex items-center gap-0.5"
                        >
                          <span>shivam-shukla-186276374</span>
                          <span className="text-[10px]">↗</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Service SLA Commitment */}
                  <div className="p-4 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                      Service Guarantee
                    </span>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                      No surprise invoices. Every project has a written scope, agreed deliverables, and confirmed turnaround before work begins.
                    </p>
                  </div>
                </div>

                {/* Direct Enquiry Form (Client Component) */}
                <div className="lg:col-span-7 bg-[var(--color-canvas-primary)] p-6 sm:p-8 border border-[var(--color-hairline)]">
                  <div className="mb-6 space-y-1">
                    <h3 className="font-display text-xl font-normal text-[var(--color-ink-primary)]">
                      Project Scope &amp; Details
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                      Fill out the form below for an itemized estimate.
                    </p>
                  </div>

                  <ContactForm
                    variant="light"
                    labels={{
                      name: "Your Name or Company",
                      email: "Your Work Email",
                      brief: "Project details, website URL, bug description, or target deadline...",
                      submit: "Send Quote Request →",
                    }}
                  />
                </div>
              </div>
            </section>
          </InnerPageEntrance>

          {/* 9. Store Distinction & Cross-Links */}
          <InnerPageEntrance delayIndex={8}>
            <div className="pt-8 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                <span>← Back to Home</span>
              </Link>
              <div className="flex items-center gap-4">
                <span>Looking for instant digital downloads?</span>
                <Link
                  href="/store"
                  className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                >
                  Browse Store →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
