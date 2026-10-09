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
import { PageBackground } from "@/components/ui/PageBackground";
import { HomeHeroMotion } from "@/components/home/HomeHeroMotion";
import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";
import {
  CERTIFICATIONS,
  SKILL_CATEGORIES,
  SERVICES_CATALOG,
  FOCUS_AREAS,
  DIGITAL_PRODUCTS_PREVIEWS,
} from "@/data/portfolio-data";
import { SITE_URL, serializeJsonLd } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shivam Shukla — AI Agents, AI Security & Developer Products",
  description:
    "Personal website of Shivam Shukla. I build AI agents, automation systems, and developer products with Python, backend architectures, and AI security.",
  keywords: [
    "Shivam Shukla",
    "AI Agents",
    "AI Security",
    "AI Automation",
    "Developer Products",
    "Python",
    "Prompt Injection Defense",
    "Backend Systems",
    "Software Engineer",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Shivam Shukla — AI Agents, AI Security & Developer Products",
    description:
      "I build AI agents, automation systems, and developer products. From conversational workflows and backend systems to AI security and practical digital resources.",
    url: SITE_URL,
    type: "website",
    images: [{ url: "/images/shivam-shukla.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Shukla — AI Agents, AI Security & Developer Products",
    description:
      "I build AI agents, automation systems, and developer products. From conversational workflows and backend systems to AI security and practical digital resources.",
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
  const [profile, allProjects] = await Promise.all([
    getProfileSettings(),
    getPublishedProjects(),
  ]);

  // Featured 3 projects: Yojna Setu, RealGuard, QuickEats
  const selectedProjects = allProjects.slice(0, 3);

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
        "@id": `${SITE_URL}/#person`,
        name: profile.fullName || "Shivam Shukla",
        url: SITE_URL,
        jobTitle: "AI Agent & Security Builder",
        alumniOf: "SRMS College of Engineering, Technology & Research",
        knowsAbout: [
          "AI Agents",
          "AI Security",
          "AI Automation",
          "Python",
          "Prompt Injection Defense",
          "Java",
          "Spring Boot",
          "PostgreSQL",
          "REST APIs",
          "Digital Products",
        ],
        description:
          "Building AI agents, automation systems, and security-focused developer products.",
        sameAs: verifiedSameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "SHIVSASTRA",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
        description:
          "Personal portfolio, engineering archive, and digital resources of Shivam Shukla.",
      },
    ],
  };

  return (
    <div className="flex flex-col w-full">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* =======================================================
          1. HERO
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
                {profile.fullName}
              </h1>
            }
            positioning={
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                AI Agents · AI Security · Automation · Digital Products
              </p>
            }
            narrative={
              <p className="font-sans text-base md:text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-[62ch]">
                {profile.heroSupportingText}
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
                  href="/resume"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "lg",
                    className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider border-[var(--color-ink-primary)] group",
                  })}
                >
                  <span>Resume</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none ml-1.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/store"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors text-center"
                >
                  Visit Store →
                </Link>
              </div>
            }
            visual={<HeroVisual />}
          />
        </SectionContainer>
      </section>

      {/* =======================================================
          2. ABOUT (Authentic Developer Introduction)
          ======================================================= */}
      <section id="about" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left Column: Portrait & Key Details */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <SectionLabel name="About" />
                  <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    About Me
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                    AI Agent &amp; Security Builder · Digital Products
                  </p>
                </div>

                <div className="relative aspect-[4/5] max-w-[320px] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden">
                  <Image
                    src="/images/shivam-shukla.jpg"
                    alt="Shivam Shukla — Portrait"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                  />
                </div>

                <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3 font-mono text-xs text-[var(--color-ink-secondary)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--color-accent)] font-semibold">EDUCATION</span>
                    <span>2022 – 2026</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--color-ink-primary)]">
                    B.Tech in Computer Science Engineering
                    <br />
                    <span className="text-[var(--color-ink-secondary)] text-[11px]">
                      SRMS CET&R, Bareilly (Affiliated to AKTU)
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Column: Authentic Story & Highlights */}
              <div className="lg:col-span-7 space-y-8">
                <div className="p-8 md:p-10 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    PHILOSOPHY &amp; FOCUS
                  </span>
                  <p className="font-sans text-base sm:text-lg text-[var(--color-ink-primary)] leading-relaxed">
                    I build software products, practical AI agents, and automation systems with a focus on AI security. I care about building practical systems rather than AI demos — separating language extraction from deterministic backend logic.
                  </p>
                  <p className="font-sans text-sm sm:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                    While Java and Spring Boot remain a solid engineering foundation of my work, Python is my primary language for AI agent orchestration, tool calling, and automation. Along the way, I turn repeatable engineering patterns into open developer templates and digital resources.
                  </p>
                </div>

                {/* Practical Milestone Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                    <span className="font-mono text-[11px] text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      Engineering Foundation
                    </span>
                    <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                      Backend &amp; Systems
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Engineering background in Python, Java, and Spring Boot, combining relational data modeling with modern LLM tool integrations.
                    </p>
                  </div>

                  <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                    <span className="font-mono text-[11px] text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                      Shipped Systems
                    </span>
                    <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                      3 Working Systems
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Built Yojna Setu (AI + deterministic rules), RealGuard (AI automation), and QuickEats (AI-assisted product engineering &amp; security).
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group"
                  >
                    <span>Read complete background</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/resume"
                    className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors underline underline-offset-4"
                  >
                    View Resume →
                  </Link>
                </div>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          3. SELECTED WORK (Yojna Setu + RealGuard + QuickEats)
          ======================================================= */}
      <section id="work" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[var(--color-hairline)]">
              <div className="space-y-4">
                <SectionLabel name="Selected Work" />
                <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Selected Work
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Practical systems built with AI agents, deterministic rules engines, and application security.
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
              {selectedProjects.map((project) => (
                <article
                  key={project.id}
                  className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
                >
                  {/* Large Editorial Visual Frame */}
                  <div className="lg:col-span-7">
                    {project.coverImageUrl ? (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] overflow-hidden group-hover:border-[var(--color-ink-primary)] transition-colors relative block"
                      >
                        <Image
                          src={project.coverImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-[1.015] transition-transform duration-300 motion-reduce:group-hover:scale-100"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                      </Link>
                    ) : (
                      <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex items-center justify-center p-6 md:p-8">
                        <span className="font-sans text-xs text-[var(--color-ink-secondary)]">
                          [Project visual]
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Narrative & Details */}
                  <div className="lg:col-span-5 space-y-4 lg:pl-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {project.editionCode && (
                        <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                          {project.editionCode}
                        </span>
                      )}
                      {project.projectYear && (
                        <span className="font-mono text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
                          {project.projectYear}
                        </span>
                      )}
                      {project.category && (
                        <span className="font-sans text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl md:text-3xl font-normal tracking-tight text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>

                    <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                      {project.summary}
                    </p>

                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/projects/${project.slug}`}
                        className={buttonStyles({
                          variant: "primary",
                          size: "sm",
                          className: "font-mono uppercase tracking-wider text-xs group/btn",
                        })}
                      >
                        <span>View Case Study</span>
                        <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transform-none ml-1">
                          →
                        </span>
                      </Link>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors flex items-center gap-1"
                        >
                          <span>GitHub</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          4. SKILLS / TECHNOLOGY (Intelligently Categorized)
          ======================================================= */}
      <section id="skills" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="space-y-4 max-w-2xl">
                <SectionLabel name="Skills & Tech Stack" />
                <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Technical Stack
                </h2>
                <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                  Demonstrated technologies categorized by practical implementation evidence:
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    <strong className="text-[var(--color-ink-primary)]">Core:</strong> Primary stack in shipped repositories
                  </span>
                  <span className="text-[var(--color-hairline)] select-none">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink-secondary)]" />
                    <strong className="text-[var(--color-ink-primary)]">Working:</strong> Integrated in project features
                  </span>
                  <span className="text-[var(--color-hairline)] select-none">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full border border-[var(--color-hairline)]" />
                    <strong className="text-[var(--color-ink-primary)]">Exposure:</strong> Course simulation or exploratory
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                          {cat.title}
                        </h3>
                        <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-hairline)] flex flex-wrap gap-2">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)]"
                        >
                          {skill.icon && (
                            <Image
                              src={skill.icon}
                              alt=""
                              width={12}
                              height={12}
                              className="w-3 h-3 object-contain shrink-0"
                            />
                          )}
                          <span>{skill.name}</span>
                          <span
                            className={`text-[9px] uppercase tracking-wider px-1 py-0.2 font-sans rounded-none ${
                              skill.tier === "Core"
                                ? "text-[var(--color-accent)] font-semibold"
                                : skill.tier === "Working"
                                ? "text-[var(--color-ink-secondary)]"
                                : "text-[var(--color-ink-secondary)] opacity-60"
                            }`}
                          >
                            [{skill.tier}]
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          5. WHAT I DO (Services & Engineering Disciplines)
          ======================================================= */}
      <section id="services" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
                <div className="space-y-3">
                  <SectionLabel name="What I Do" />
                  <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Services &amp; Capabilities
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                    End-to-end engineering demonstrated through working code.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                >
                  <span>View Services Overview</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {SERVICES_CATALOG.map((srv) => (
                  <div
                    key={srv.id}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-8 space-y-6 flex flex-col justify-between group hover:border-[var(--color-ink-primary)] transition-colors"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-[var(--color-accent)] font-semibold tracking-wider">
                          {srv.code}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
                          {srv.engagement}
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                        {srv.title}
                      </h3>
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

                    <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between">
                      <Link
                        href={`/contact?subject=${encodeURIComponent(srv.subject)}`}
                        className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Discuss a Project</span>
                        <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Distinction Banner: Custom Work vs Store Products */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Custom Engineering vs Digital Resources
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-xl leading-relaxed">
                    Services are for custom development where you work with me directly. For downloadable architecture blueprints and developer resources, explore the Store.
                  </p>
                </div>
                <Link
                  href="/store"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] transition-colors shrink-0"
                >
                  Explore Store →
                </Link>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          6. CERTIFICATIONS (Verified Credentials)
          ======================================================= */}
      <section id="certifications" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="space-y-3 max-w-2xl">
                <SectionLabel name="Certifications" />
                <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Certifications &amp; Credentials
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Verified coursework, cloud credentials, and engineering job simulations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CERTIFICATIONS.map((cert) => (
                  <div
                    key={cert.id}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-5 flex flex-col justify-between hover:border-[var(--color-ink-primary)] transition-colors group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                          VERIFIED
                        </span>
                        <span className="text-[var(--color-ink-secondary)]">✓ Certificate</span>
                      </div>
                      <h3 className="font-display text-xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                        {cert.title}
                      </h3>
                      <p className="font-mono text-xs text-[var(--color-ink-secondary)] font-medium">
                        {cert.issuer}
                      </p>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed pt-1">
                        {cert.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-hairline)]">
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>View Certificate</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          7. DIGITAL PRODUCTS & TEMPLATES (Legitimate Resources)
          ======================================================= */}
      <section id="store" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[var(--color-hairline)]">
                <div className="lg:col-span-5 space-y-3">
                  <SectionLabel name="Store & Templates" />
                  <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Digital Products
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                    Architectural blueprints, developer boilerplates, and templates.
                  </p>
                </div>
                <div className="lg:col-span-7 space-y-2">
                  <p className="font-sans text-sm sm:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
                    Resources distilled from my own working systems. Strictly zero fabricated sales or fake reviews — published openly as they are finalized.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DIGITAL_PRODUCTS_PREVIEWS.map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-6 md:p-8 space-y-5 flex flex-col justify-between hover:border-[var(--color-ink-primary)] transition-colors group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                          {prod.category.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono border ${
                            prod.status === "Case Study"
                              ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                              : "border-[var(--color-hairline)] text-[var(--color-ink-secondary)]"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </div>

                      <h3 className="font-display text-xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                        {prod.title}
                      </h3>

                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        {prod.summary}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {prod.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-secondary)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between">
                      {prod.link ? (
                        <Link
                          href={prod.link}
                          className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>Explore Blueprint</span>
                          <span>→</span>
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                          Release Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-hairline)]">
                <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                  Looking for custom templates or backend integrations?
                </span>
                <Link
                  href="/store"
                  className={buttonStyles({
                    variant: "primary",
                    size: "md",
                    className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider",
                  })}
                >
                  Visit Full Store Catalog →
                </Link>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          8. ENGINEERING COMMAND CENTER / CURRENT FOCUS
          ======================================================= */}
      <section id="focus" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="space-y-3 max-w-2xl">
                <SectionLabel name="Command Center" />
                <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Current Focus &amp; Activity
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  What I&apos;m building, exploring, and shipping right now.
                </p>
              </div>

              {/* 4 Focus Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FOCUS_AREAS.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-3"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                      {item.category}
                    </span>
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* GitHub Activity & Mission Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8">
                <div className="md:col-span-5 space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    OPEN SOURCE ACTIVITY
                  </span>
                  <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                    GitHub Engineering Hub
                  </h3>
                  <div className="space-y-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                    <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]">
                      <span>GitHub:</span>
                      <span className="font-semibold text-[var(--color-ink-primary)]">@shivam-shukla888</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]">
                      <span>Primary Stack:</span>
                      <span className="font-semibold text-[var(--color-ink-primary)]">Python, AI Agents, Java, SQL</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]">
                      <span>Featured Work:</span>
                      <span className="font-semibold text-[var(--color-ink-primary)]">Yojna Setu, RealGuard, QuickEats</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://github.com/shivam-shukla888"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Explore GitHub Profile</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4 md:border-l md:border-[var(--color-hairline)] md:pl-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                      MISSION
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                      Practical Systems Over AI Demos
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      I believe language models must be coupled with deterministic application logic. Conversational LLMs interpret unstructured user intent, while deterministic code and relational models enforce validation, compliance, and authoritative calculations.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-[var(--color-hairline)]">
                    <Link
                      href="/resume"
                      className={buttonStyles({
                        variant: "primary",
                        size: "md",
                        className: "font-mono text-xs uppercase tracking-wider",
                      })}
                    >
                      Resume →
                    </Link>
                    <Link
                      href="/contact"
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
                    >
                      Get in Touch →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          9. CONTACT
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
                  Direct inquiry for software engineering roles &amp; select projects.
                </p>
                <p className="font-sans text-sm text-[var(--color-dark-ink-secondary)] leading-relaxed max-w-md">
                  {profile.contactInstructions}
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

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/resume"
                    className={buttonStyles({
                      variant: "dark-inverse",
                      size: "md",
                      className: "group",
                    })}
                  >
                    <span>Resume</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none ml-1.5">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-dark-hairline)] text-[var(--color-dark-ink-secondary)] hover:text-white hover:border-white transition-colors"
                  >
                    Full Contact Page →
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
