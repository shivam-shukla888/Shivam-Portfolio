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
    "Personal digital headquarters of Shivam Shukla. Engineering backend systems, agentic AI workflows, and AI security software — with curated digital releases via SHIVSASTRA Store.",
  alternates: {
    canonical: "https://shivsastra.com",
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
        "@id": "https://shivsastra.com/#person",
        name: profile.fullName || "Shivam Shukla",
        url: "https://shivsastra.com",
        description:
          "Building intelligent systems, AI agents, and security-focused software.",
        sameAs: verifiedSameAs,
      },
      {
        "@type": "WebSite",
        "@id": "https://shivsastra.com/#website",
        url: "https://shivsastra.com",
        name: "SHIVSASTRA",
        publisher: {
          "@id": "https://shivsastra.com/#person",
        },
        description:
          "Personal digital headquarters and studio store of Shivam Shukla.",
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
          01 // HERO
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
                <SectionLabel index="01" name="Overview" />
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
                Building intelligent systems, AI agents, and security-focused software — and creating useful digital work along the way.
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
                  <span>Explore My Work</span>
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
          02 // WHAT I BUILD (Technical Disciplines)
          ======================================================= */}
      <section className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="space-y-12">
            <div className="space-y-4 max-w-2xl">
              <SectionLabel index="02" name="Disciplines" />
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                What I Build
              </h2>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                Core areas of technical focus spanning resilient backend infrastructure, autonomous cognitive systems, and defensive security engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Discipline 01: Backend Systems */}
              <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    01 // Infrastructure
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                    Backend Systems
                  </h3>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Resilient software architectures, distributed data layers, deterministic APIs, and high-integrity transactional backends engineered for stability.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  Architectures · APIs · Data Layers
                </div>
              </div>

              {/* Discipline 02: Agentic AI */}
              <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    02 // Intelligence
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                    Agentic AI
                  </h3>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Autonomous cognitive agents, multi-agent orchestrations, tool-calling pipelines, and structured evaluation harnesses designed for production reliability.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  Autonomous Agents · Orchestration · Tool Interfaces
                </div>
              </div>

              {/* Discipline 03: AI Security */}
              <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                    03 // Defense
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                    AI Security
                  </h3>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Vulnerability surface analysis, agentic permission boundaries, runtime defenses, defense-in-depth isolation, and secure sandbox execution.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  Boundary Hardening · Sandboxes · Defense-in-Depth
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          03 // THE STORE (Commercial Discovery)
          ======================================================= */}
      <section id="store" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="space-y-12">
            {/* Header: Swiss Asymmetrical Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[var(--color-hairline)]">
              <div className="lg:col-span-5 space-y-3">
                <SectionLabel index="03" name="Commercial" />
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  THE STORE
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Digital work, tools, and resources.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <p className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
                  An authentic extension of technical building. Digital artifacts, design systems, and agent frameworks created during real engineering cycles and made available for developers, founders, and studios.
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
                    Category 01
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Design Studio
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Logos · Design · Templates
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]/80 leading-relaxed pt-1">
                    Interaction guidelines, typography systems, and architectural design kits.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Explore Design</span>
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
                    Category 02
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    AI Agents
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    AI agents · Agent resources · Workflows
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]/80 leading-relaxed pt-1">
                    Autonomous agent architectures, tool pipelines, and evaluation harnesses.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Explore AI Agents</span>
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
                    Category 03
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    Digital Products
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Digital downloads · Templates · Technical resources
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]/80 leading-relaxed pt-1">
                    Technical monographs, code starter repositories, and developer licenses.
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)]">
                  <span>Explore Products</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                    →
                  </span>
                </div>
              </Link>
            </div>

            {/* Prominent Visit Store CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-hairline)]">
              <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                Browse catalog releases, detailed specifications, and digital licenses.
              </span>
              <Link
                href="/store"
                className={buttonStyles({
                  variant: "primary",
                  size: "lg",
                  className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider group",
                })}
              >
                <span>VISIT STORE</span>
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
          04 // SELECTED WORK (Projects)
          ======================================================= */}
      <section id="work" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[var(--color-hairline)]">
            <div className="space-y-4">
              <SectionLabel index="04" name="Selected work" />
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Projects & Monographs
              </h2>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Authored by {profile.fullName}
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <span>Explore Archive</span>
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
                        <span>View Case Study</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Refined Editorial Empty State (Zero Fake Cards) */
              <div className="py-16 md:py-20 text-center space-y-3">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] block">
                  ARCHIVE NOTICE
                </span>
                <p className="font-display text-2xl text-[var(--color-ink-primary)]">
                  Selected projects and technical monographs will appear here once published.
                </p>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-md mx-auto">
                  Architectural case studies, open-source repositories, and system monographs are currently under editorial review.
                </p>
              </div>
            )}
          </div>
        </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          05 // SERVICES (Services & Advisory)
          ======================================================= */}
      <section id="services" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[var(--color-hairline)]">
            <div className="space-y-4">
              <SectionLabel index="05" name="Services" />
              <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Services & Advisory
              </h2>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Work with Shivam Shukla · Bespoke Scopes & Advisory
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                <span>View Services Directory</span>
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
            /* Refined Editorial Positioning (Answering: What can someone engage Shivam for?) */
            <div className="space-y-10 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--color-hairline)] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
                {/* 01: Backend Systems */}
                <div className="p-8 space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      01 — Infrastructure
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      Backend Systems
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      Resilient backend architectures, distributed data layers, deterministic APIs, and high-integrity transactional infrastructure.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-hairline)] space-y-3">
                    <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                      Bespoke Architecture · Scoped upon Inquiry
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

                {/* 02: Agentic AI */}
                <div className="p-8 space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      02 — Intelligence
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      Agentic AI
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      Autonomous cognitive agents, multi-agent workflows, tool execution interfaces, and deterministic evaluation harnesses.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-hairline)] space-y-3">
                    <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                      Workflow Design · Scoped upon Inquiry
                    </span>
                    <Link
                      href="/contact?subject=Agentic%20AI%20Inquiry"
                      className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group/link"
                    >
                      <span>Start a Conversation</span>
                      <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 motion-reduce:transform-none">
                        →
                      </span>
                    </Link>
                  </div>
                </div>

                {/* 03: AI Security */}
                <div className="p-8 space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      03 — Defense
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      AI Security
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      Vulnerability surface analysis, agentic permission boundaries, runtime defenses, defense-in-depth isolation, and sandbox execution.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[var(--color-hairline)] space-y-3">
                    <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                      Boundary Hardening · Scoped upon Inquiry
                    </span>
                    <Link
                      href="/contact?subject=AI%20Security%20Inquiry"
                      className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group/link"
                    >
                      <span>Get in Touch</span>
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
                    ENGAGEMENT ARCHITECTURE
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-xl">
                    Services represent bespoke scopes where you work directly WITH Shivam. For purchasing ready-to-use digital tools, visit the Store.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/contact"
                    className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] transition-[color,background-color,border-color,transform] duration-150 group motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                  >
                    <span>Start a Conversation</span>
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
          06 // PROFILE & ETHOS (About Preview)
          ======================================================= */}
      <section id="about" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <SectionLabel index="06" name="Profile" />
                <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Discipline & Ethos
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
                    : "Focused on deterministic engineering, intelligent agent workflows, and digital craft. Building software with precision architecture and editorial care."}
                </p>
              </div>

              <div className="pt-2 flex justify-start">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  <span>Read Full Profile & Ethos</span>
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
          07 // CONTACT
          ======================================================= */}
      <section id="contact" className="w-full bg-[var(--color-surface-dark)] text-white py-20 md:py-32">
        <HomeSectionReveal>
          <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5 space-y-5">
              <SectionLabel index="07" name="Contact" dark />
              <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
                Initiate an Engagement
              </h2>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Direct inquiry for {profile.fullName}
              </p>
              <p className="font-sans text-sm text-[var(--color-dark-ink-secondary)] leading-relaxed max-w-md whitespace-pre-wrap">
                {profile.contactInstructions && profile.contactInstructions !== "[CONTACT DETAILS PENDING]"
                  ? profile.contactInstructions
                  : "Direct inquiries regarding software engineering, AI agent architectures, or custom digital systems."}
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
                  <span>Open Contact Form</span>
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
                  name: "Name / Organization",
                  email: "Direct Email",
                  brief: "Project Brief & Intent",
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
