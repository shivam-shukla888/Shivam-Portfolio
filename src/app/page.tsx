import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buttonStyles } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { getProfileSettings } from "@/lib/profile";
import { getPublishedProjects } from "@/lib/projects";
import { getPublishedServices } from "@/lib/services";
import { PageBackground } from "@/components/ui/PageBackground";
import { HomeHeroMotion } from "@/components/home/HomeHeroMotion";
import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shivam Shukla — Backend Systems, Agentic AI & AI Security",
  description:
    "Personal website and portfolio of Shivam Shukla. I build backend systems, AI agents, and security-focused software, and sell digital tools via the store.",
  alternates: {
    canonical: "https://shivsastra.vercel.app",
  },
};

// Lazy-loaded signature visual with lightweight fallback
const HeroVisual = dynamic(
  () => import("@/components/home/HeroVisual").then((mod) => mod.HeroVisual),
  {
    ssr: true,
    loading: () => (
      <div className="w-full max-w-[440px] aspect-square border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center justify-center p-8" />
    ),
  }
);

export default async function HomePage() {
  const [profile, allProjects, allServices] = await Promise.all([
    getProfileSettings(),
    getPublishedProjects(),
    getPublishedServices({ limit: 3 }),
  ]);

  const featured = allProjects.filter((p) => p.isFeatured);
  const selectedProjects = (featured.length > 0 ? featured : allProjects).slice(0, 3);

  // Verified social profiles for Schema.org Person structured data
  const verifiedSameAs = [
    profile.contraUrl,
    profile.linkedinUrl,
    profile.githubUrl,
    profile.instagramUrl,
    profile.xUrl,
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://shivsastra.vercel.app/#person",
        name: profile.fullName || "Shivam Shukla",
        url: "https://shivsastra.vercel.app",
        description:
          "Building backend systems, AI agents, and security-focused software.",
        sameAs: verifiedSameAs,
      },
      {
        "@type": "WebSite",
        "@id": "https://shivsastra.vercel.app/#website",
        url: "https://shivsastra.vercel.app",
        name: "SHIVSASTRA",
        publisher: {
          "@id": "https://shivsastra.vercel.app/#person",
        },
        description:
          "Personal website, portfolio, and digital store of Shivam Shukla.",
      },
    ],
  };

  return (
    <div className="flex flex-col w-full">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =======================================================
          HERO
          ======================================================= */}
      <section className="relative w-full border-b border-[var(--color-hairline)] pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
        <PageBackground
          src="/images/backgrounds/homepage.webp"
          priority
          opacity={0.55}
          position="right"
          overlayVariant="hero-left-quiet"
        />
        <SectionContainer className="relative z-1">
          <HomeHeroMotion
            overview={
              <div className="flex flex-wrap items-baseline gap-4">
                <SectionLabel name="Overview" />
                {profile.availabilityStatus && (
                  <span className="font-mono text-xs text-[var(--color-accent)] border-l border-[var(--color-hairline)] pl-4">
                    {profile.availabilityStatus}
                  </span>
                )}
              </div>
            }
            title={
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.05]">
                Shivam Shukla
              </h1>
            }
            positioning={
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                Backend Systems · Agentic AI · AI Security
              </p>
            }
            narrative={
              <p className="font-sans text-base md:text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-[62ch]">
                I build backend systems, AI agents, and security-focused software — and create digital tools along the way.
              </p>
            }
            ctas={
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="#work"
                  className={buttonStyles({
                    variant: "primary",
                    size: "lg",
                    className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider group",
                  })}
                >
                  <span>See My Work</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/store"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "lg",
                    className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider border-[var(--color-ink-primary)] group",
                  })}
                >
                  <span>Visit Store</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                    →
                  </span>
                </Link>
              </div>
            }
            visual={<HeroVisual />}
          />
        </SectionContainer>
      </section>

      {/* =======================================================
          WHAT I BUILD (Technical Disciplines)
          ======================================================= */}
      <section className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="space-y-12">
            <div className="space-y-4 max-w-2xl">
              <SectionLabel name="What I Build" />
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                What I Build
              </h2>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                My work focuses on backend development, practical AI agents, and software security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Discipline 1: Backend Systems */}
              <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    Backend Development
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                    Backend Systems
                  </h3>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    I build APIs, backend services, database-backed applications, and the infrastructure around them.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  APIs · Databases · System Architecture
                </div>
              </div>

              {/* Discipline 2: Agentic AI */}
              <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    AI Agents
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                    Agentic AI
                  </h3>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    I build AI agents and LLM-based workflows that connect models with useful application logic and tools.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  AI Agents · LLM Workflows · Tool Integration
                </div>
              </div>

              {/* Discipline 3: AI Security */}
              <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    Software Security
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                    AI Security
                  </h3>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    I work on security for AI applications, including input validation, prompt-injection protection, access control, and safe system design.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  Access Control · Input Validation · System Safety
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          STORE
          ======================================================= */}
      <section id="store" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="space-y-12">
            {/* Header: Swiss Asymmetrical Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[var(--color-hairline)]">
              <div className="lg:col-span-5 space-y-3">
                <SectionLabel name="Store" />
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Store
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Digital products I make and sell.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
                  Digital products, templates, and tools built from my own projects and workflows. Available for developers, founders, and creators.
                </p>
              </div>
            </div>

            {/* Exactly Three Category Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category 1: Design Studio */}
              <Link
                href="/store/design"
                className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-8 space-y-4 hover:border-[var(--color-ink-primary)] hover:-translate-y-[2px] transition-[border-color,transform] duration-200 ease-out group flex flex-col justify-between motion-reduce:hover:translate-y-0"
              >
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    Templates
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Design & Templates
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Logos · Design · Templates
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]/80 leading-relaxed pt-1">
                    Interaction kits, typography systems, and web templates.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Browse Design</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                    →
                  </span>
                </div>
              </Link>

              {/* Category 2: AI Agents */}
              <Link
                href="/store/ai-agents"
                className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-8 space-y-4 hover:border-[var(--color-ink-primary)] hover:-translate-y-[2px] transition-[border-color,transform] duration-200 ease-out group flex flex-col justify-between motion-reduce:hover:translate-y-0"
              >
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    Agent Tools
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    AI Agents
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    AI agents · Tools · Workflows
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]/80 leading-relaxed pt-1">
                    Agent starter code, tool pipelines, and evaluation workflows.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Browse AI Agents</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                    →
                  </span>
                </div>
              </Link>

              {/* Category 3: Digital Products */}
              <Link
                href="/store/digital-products"
                className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-8 space-y-4 hover:border-[var(--color-ink-primary)] hover:-translate-y-[2px] transition-[border-color,transform] duration-200 ease-out group flex flex-col justify-between motion-reduce:hover:translate-y-0"
              >
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    Downloads
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Digital Products
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Code starters · Downloads · Tools
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]/80 leading-relaxed pt-1">
                    Code starter repos, developer templates, and technical downloads.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Browse Products</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                    →
                  </span>
                </div>
              </Link>
            </div>

            {/* Prominent Visit Store CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-hairline)]">
              <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                Browse all digital products, templates, and tools.
              </span>
              <Link
                href="/store"
                className={buttonStyles({
                  variant: "primary",
                  size: "lg",
                  className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider group",
                })}
              >
                <span>Visit Store</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>
        </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          SELECTED WORK (Projects)
          ======================================================= */}
      <section id="work" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[var(--color-hairline)]">
            <div className="space-y-4">
              <SectionLabel name="Selected Work" />
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Selected Work
              </h2>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Projects by {profile.fullName}
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <span>View all projects</span>
              <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="divide-y divide-[var(--color-hairline)]">
            {selectedProjects.length > 0 ? (
              selectedProjects.map((project) => (
                <div
                  key={project.id}
                  className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
                >
                  {/* Large Editorial Visual Frame */}
                  <div className="lg:col-span-7">
                    {project.coverImageUrl ? (
                      <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden group-hover:border-[var(--color-ink-primary)] transition-colors relative">
                        <Image
                          src={project.coverImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-[1.015] transition-transform duration-300 motion-reduce:group-hover:scale-100"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center justify-center p-6 md:p-8 group-hover:border-[var(--color-ink-primary)] transition-colors">
                        <span className="font-sans text-xs text-[var(--color-ink-secondary)]">
                          [Project visual pending]
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Narrative & Details */}
                  <div className="lg:col-span-5 space-y-4 lg:pl-4">
                    {project.editionCode && (
                      <span className="font-mono text-xs text-[var(--color-accent)]">
                        {project.editionCode}
                      </span>
                    )}
                    <h3 className="font-display text-2xl md:text-3xl font-normal tracking-tight text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                      {project.summary || "[Project description pending]"}
                    </p>
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="pt-3">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                      >
                        <span>View project</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Refined Empty State */
              <div className="py-16 md:py-20 text-center space-y-3">
                <p className="font-display text-2xl text-[var(--color-ink-primary)]">
                  Projects will be listed here as I publish them.
                </p>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-md mx-auto">
                  I&apos;m adding projects here as I finish and publish them.
                </p>
              </div>
            )}
          </div>
        </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          SERVICES
          ======================================================= */}
      <section id="services" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[var(--color-hairline)]">
            <div className="space-y-4">
              <SectionLabel name="Services" />
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Services
              </h2>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Work with me on custom software and AI systems.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                <span>View all services</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                  →
                </span>
              </Link>
            </div>
          </div>

          {allServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-hairline)] pt-8">
              {allServices.map((service) => (
                <div
                  key={service.id}
                  className="py-8 md:py-0 md:px-8 first:pl-0 last:pr-0 space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {service.programCode && (
                      <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider block">
                        {service.programCode}
                      </span>
                    )}
                    <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      {service.title}
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      {service.summary}
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                    >
                      <span>View details</span>
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Clear Practical Fallback Scopes */
            <div className="space-y-10 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-hairline)] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                {/* 1: Backend Systems */}
                <div className="p-8 space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      Backend Systems
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      Backend Systems
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      I build APIs, backend services, database-backed applications, and the systems around them.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-hairline)] space-y-3">
                    <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                      APIs & Databases
                    </span>
                    <Link
                      href="/contact?subject=Backend%20Systems%20Inquiry"
                      className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group/link"
                    >
                      <span>Discuss a Project</span>
                      <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transform-none">
                        →
                      </span>
                    </Link>
                  </div>
                </div>

                {/* 2: Agentic AI */}
                <div className="p-8 space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      Agentic AI
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      Agentic AI
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      I build AI agents and LLM-based workflows that connect models with useful application logic.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-hairline)] space-y-3">
                    <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                      Agents & Workflows
                    </span>
                    <Link
                      href="/contact?subject=Agentic%20AI%20Inquiry"
                      className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group/link"
                    >
                      <span>Discuss a Project</span>
                      <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transform-none">
                        →
                      </span>
                    </Link>
                  </div>
                </div>

                {/* 3: AI Security */}
                <div className="p-8 space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      AI Security
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      AI Security
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      I work on security for AI applications, including input validation, prompt-injection protection, and safe system design.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-hairline)] space-y-3">
                    <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                      Security & Validation
                    </span>
                    <Link
                      href="/contact?subject=AI%20Security%20Inquiry"
                      className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group/link"
                    >
                      <span>Discuss a Project</span>
                      <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transform-none">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Distinction Banner: Work With Shivam vs Buy From Shivam */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Custom Work vs Store Products
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-xl">
                    Services are for custom development where you work with me directly. For ready-to-use digital tools and templates, visit the Store.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/contact"
                    className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-[color,background-color,border-color,transform] duration-150 group motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                  >
                    <span>Get in Touch</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          ABOUT (About Preview)
          ======================================================= */}
      <section id="about" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <SectionLabel name="About" />
                <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  About Me
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  {profile.fullName}
                </p>
              </div>

              {/* Portrait */}
              <div className="space-y-2">
                <div className="relative aspect-[4/5] max-w-[280px] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden">
                  <Image
                    src="/images/shivam-shukla.jpg"
                    alt={`${profile.fullName} — Portrait`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 280px"
                    priority
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="p-8 md:p-12 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                <p className="font-display text-2xl md:text-3xl text-[var(--color-ink-primary)] leading-relaxed italic whitespace-pre-wrap">
                  {profile.aboutMarkdown && profile.aboutMarkdown !== "[ABOUT CONTENT PENDING]"
                    ? profile.aboutMarkdown
                    : "I build software focused on reliability, clear architecture, and practical use. I spend most of my time working on backend systems, AI agents, and software security."}
                </p>
              </div>

              <div className="pt-2 flex justify-start">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  <span>Read more about me</span>
                  <span className="transition-transform duration-150 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          CONTACT
          ======================================================= */}
      <section id="contact" className="w-full bg-[var(--color-surface-dark)] text-white py-20 md:py-32">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5 space-y-5">
              <SectionLabel name="Contact" dark />
              <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
                Get in Touch
              </h2>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Send a message to discuss a project or question.
              </p>
              <p className="font-sans text-sm text-[var(--color-dark-ink-secondary)] leading-relaxed max-w-md whitespace-pre-wrap">
                {profile.contactInstructions && profile.contactInstructions !== "[CONTACT DETAILS PENDING]"
                  ? profile.contactInstructions
                  : "Have a project in mind? Tell me what you're building, and I'll get back to you."}
              </p>
              <div className="pt-2 space-y-2 font-mono text-xs text-[var(--color-dark-ink-secondary)]">
                {profile.email && (
                  <div>
                    <span className="text-[var(--color-accent)] uppercase tracking-wider text-[10px]">Email: </span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="hover:text-white transition-colors underline break-all"
                    >
                      {profile.email}
                    </a>
                  </div>
                )}
                {profile.phone && (
                  <div>
                    <span className="text-[var(--color-accent)] uppercase tracking-wider text-[10px]">Phone: </span>
                    <a
                      href={`tel:${profile.phone}`}
                      className="hover:text-white transition-colors underline"
                    >
                      {profile.phone}
                    </a>
                  </div>
                )}
              </div>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className={buttonStyles({
                    variant: "dark-inverse",
                    size: "md",
                    className: "group",
                  })}
                >
                  <span>Go to Contact Page</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                    →
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm
                variant="dark"
                labels={{
                  name: "Your Name",
                  email: "Email Address",
                  brief: "Message or Project Details",
                  submit: "Send Message →",
                }}
              />
            </div>
          </div>
        </SectionContainer>
        </HomeSectionReveal>
      </section>
    </div>
  );
}
