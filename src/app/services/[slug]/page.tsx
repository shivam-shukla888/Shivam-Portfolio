import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonStyles } from "@/components/ui/Button";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getPublishedServiceBySlug } from "@/lib/services";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";

export const revalidate = 60;

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service || !service.isActive) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} — Services | Shivam Shukla`,
    description: service.summary || undefined,
    alternates: {
      canonical: `https://shivsastra.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} — Shivam Shukla`,
      description: service.summary || undefined,
      url: `https://shivsastra.com/services/${service.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} — Shivam Shukla`,
      description: service.summary || undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getPublishedServiceBySlug(slug);

  if (!service || !service.isActive) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://shivsastra.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://shivsastra.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `https://shivsastra.com/services/${service.slug}`,
      },
    ],
  };

  const contactUrl = `/contact?subject=${encodeURIComponent(`Service Inquiry: ${service.title}`)}`;

  const updatedDate = service.updatedAt
    ? new Date(service.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ScrollProgress />
      <BackToTop />
      <SectionContainer>
        <div className="space-y-16 max-w-4xl mx-auto">
          {/* Header Metadata Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-6 pb-10 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans">
                  <Link
                    href="/services"
                    className="text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                  >
                    Services
                  </Link>
                  <span className="text-[var(--color-hairline)] select-none">/</span>
                  <span className="text-[var(--color-accent)] font-medium truncate max-w-[240px]">
                    {service.title}
                  </span>
                </nav>
                {service.programCode && (
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider">
                    {service.programCode}
                  </span>
                )}
                {updatedDate && (
                  <span className="font-mono text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
                    Updated: {updatedDate}
                  </span>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
                {service.title}
              </h1>

              {service.summary && (
                <p className="font-sans text-lg md:text-xl text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                  {service.summary}
                </p>
              )}

              <div className="pt-2">
                <Link
                  href={contactUrl}
                  className={buttonStyles({
                    variant: "primary",
                    size: "lg",
                  })}
                >
                  Discuss a Project →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Main Content: Engagement Model, Deliverables & Methodology */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-16">
              {/* Engagement Model (Strictly Omitted if Empty) */}
              {service.engagementModel && (
                <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3">
                  <span className="font-sans text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] font-medium">
                    Engagement Model
                  </span>
                  <p className="font-sans text-base text-[var(--color-ink-primary)] leading-relaxed">
                    {service.engagementModel}
                  </p>
                </div>
              )}

              {/* Deliverables Section (Strictly Omitted if Empty) */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="space-y-6 py-8 border-y border-[var(--color-hairline)]">
                  <div className="space-y-1">
                    <span className="font-sans text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] font-medium">
                      Deliverables
                    </span>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                      Concrete technical outcomes and artifacts
                    </p>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pt-2">
                    {service.deliverables.map((item, index) => (
                      <li
                        key={index}
                        className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-start gap-3"
                      >
                        <span className="text-[var(--color-accent)] select-none">
                          —
                        </span>
                        <span className="font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description & Methodology (Strictly Omitted if Empty) */}
              {service.descriptionMarkdown && (
                <section className="space-y-6 pt-4">
                  <span className="font-sans text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] font-medium">
                    Overview & Methodology
                  </span>
                  <div className="font-sans text-base md:text-lg text-[var(--color-ink-primary)] leading-relaxed whitespace-pre-wrap">
                    {service.descriptionMarkdown}
                  </div>
                </section>
              )}
            </div>
          </InnerPageEntrance>

          {/* Supporting Content & Actions */}
          <InnerPageEntrance delayIndex={2}>
            <div className="space-y-16">
              {/* Concluding CTA Banner */}
              <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="font-display text-2xl font-normal text-[var(--color-ink-primary)]">
                    Interested in this service?
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-lg leading-relaxed">
                    We can discuss your requirements, tech stack, and timeline over a message or call.
                  </p>
                </div>
                <Link
                  href={contactUrl}
                  className={buttonStyles({
                    variant: "primary",
                    size: "md",
                    className: "shrink-0",
                  })}
                >
                  Discuss This Project →
                </Link>
              </div>

              {/* Navigation Footer */}
              <div className="pt-8 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  <span>← Back to Services</span>
                </Link>
                <div className="flex items-center gap-2">
                  <span>EXPLORE:</span>
                  <Link
                    href="/store"
                    className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                  >
                    Store →
                  </Link>
                </div>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </article>
  );
}
