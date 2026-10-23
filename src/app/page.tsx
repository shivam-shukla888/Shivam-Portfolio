import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { buttonStyles } from "@/components/ui/Button";
import { getProfileSettings } from "@/lib/profile";
import { getPublishedProjects } from "@/lib/projects";
import { PageBackground } from "@/components/ui/PageBackground";
import { HomeHeroMotion } from "@/components/home/HomeHeroMotion";
import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";
import { HOMEPAGE_SERVICES_PREVIEW } from "@/data/services-data";
import { SITE_URL, serializeJsonLd } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shivam Shukla — Web Development, Backend Systems & AI Automation",
  description:
    "Freelance web development, Next.js landing pages, API integrations, and practical AI automation by Shivam Shukla. Upfront starting rates with verified code.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Shivam Shukla — Web Development, Backend Systems & AI Automation",
    description:
      "Freelance web development, Next.js landing pages, API integrations, and practical AI automation by Shivam Shukla. Upfront starting rates with verified code.",
    url: SITE_URL,
    type: "website",
    siteName: "ShivSastra",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ShivSastra — Shivam Shukla | Web Development, Backend & AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Shukla — Web Development, Backend Systems & AI Automation",
    description:
      "Freelance web development, Next.js landing pages, API integrations, and practical AI automation by Shivam Shukla.",
    images: ["/og-image.png"],
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

  // Primary 4 verified featured projects
  const selectedProjects = allProjects.slice(0, 4);

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
        jobTitle: "Software Engineer & AI Integration Builder",
        alumniOf: "SRMS College of Engineering, Technology & Research",
        knowsAbout: [
          "Web Development",
          "Next.js",
          "React",
          "API Integration",
          "AI Automation",
          "Python",
          "Java",
          "Spring Boot",
          "PostgreSQL",
          "Application Security",
        ],
        description:
          "Building websites, backend integrations, and practical AI automations with transparent starting rates.",
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
          "Portfolio, services, and engineering case studies of Shivam Shukla.",
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
          1. HERO (10-Second Clarity: Who, What, Price, Next Step)
          ======================================================= */}
      <section className="relative w-full border-b border-[var(--color-hairline)] pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
        <PageBackground
          src="/images/backgrounds/homepage.webp"
          alt="ShivSastra architectural blueprint background texture"
          priority
          opacity={0.45}
          position="right"
          overlayVariant="hero-left-quiet"
        />
        <SectionContainer className="relative z-1">
          <HomeHeroMotion
            overview={
              <div className="flex flex-wrap items-baseline gap-4">
                <SectionLabel name="Web &amp; AI Engineering" />
                <span className="font-mono text-xs text-[var(--color-accent)] border-l border-[var(--color-hairline)] pl-4 font-semibold">
                  Available for Select Client Projects
                </span>
              </div>
            }
            title={
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.06]">
                I build fast websites, reliable APIs, and practical AI automations.
              </h1>
            }
            positioning={
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                Bug Fixes from ₹999 · Landing Pages from ₹2,999 · APIs &amp; AI from ₹3,000
              </p>
            }
            narrative={
              <p className="font-sans text-base md:text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-[62ch]">
                Practical engineering for founders, creators, and growing businesses.
                Upfront starting rates, clear written scopes, fast turnaround, and zero agency overhead.
              </p>
            }
            ctas={
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href="#services"
                    className={buttonStyles({
                      variant: "primary",
                      size: "lg",
                      className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider group",
                    })}
                  >
                    <span>Explore Services &amp; Pricing</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                      ↓
                    </span>
                  </a>
                  <a
                    href="#work"
                    className={buttonStyles({
                      variant: "secondary",
                      size: "lg",
                      className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider border-[var(--color-ink-primary)] group",
                    })}
                  >
                    <span>See Verified Work</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none ml-1.5">
                      ↓
                    </span>
                  </a>
                  <Link
                    href="/contact"
                    className="font-mono text-xs uppercase tracking-wider px-4 py-3 text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors text-center"
                  >
                    Request a Quote →
                  </Link>
                </div>

                {/* 4 Value Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--color-hairline)] font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  <div>
                    <strong className="text-[var(--color-ink-primary)] block font-sans text-xs">
                      Fast Delivery
                    </strong>
                    <span>1–2d fixes, 3–5d pages</span>
                  </div>
                  <div>
                    <strong className="text-[var(--color-ink-primary)] block font-sans text-xs">
                      Modern Stack
                    </strong>
                    <span>Next.js, Python, Java</span>
                  </div>
                  <div>
                    <strong className="text-[var(--color-ink-primary)] block font-sans text-xs">
                      Upfront Rates
                    </strong>
                    <span>Scope agreed before work</span>
                  </div>
                  <div>
                    <strong className="text-[var(--color-ink-primary)] block font-sans text-xs">
                      Full Ownership
                    </strong>
                    <span>100% code handed over</span>
                  </div>
                </div>
              </div>
            }
            visual={<HeroVisual />}
          />
        </SectionContainer>
      </section>

      {/* =======================================================
          2. SELECTED WORK (4 Verified Production Case Studies)
          ======================================================= */}
      <section id="work" className="w-full border-b border-[var(--color-hairline)] py-16 md:py-24 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10 border-b border-[var(--color-hairline)]">
              <div className="space-y-3">
                <SectionLabel name="Selected Work" />
                <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Verified Production Work
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Real systems built with modern web architecture, deterministic rules, and application security.
                </p>
              </div>
              <Link
                href="/projects"
                className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 self-start md:self-auto"
              >
                <span>View All Projects</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
              {selectedProjects.map((project) => (
                <article
                  key={project.id}
                  className="border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-6 sm:p-8 space-y-4 hover:border-[var(--color-ink-primary)] transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Visual Preview */}
                    {project.coverImageUrl && (
                      <div className="relative aspect-[16/9] w-full border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden">
                        <Image
                          src={project.coverImageUrl}
                          alt={`${project.title} — Preview`}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:group-hover:scale-100"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
                      <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                        {project.category}
                      </span>
                      {project.projectYear && <span>{project.projectYear}</span>}
                    </div>

                    <h3 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </h3>

                    <p className="font-sans text-xs sm:text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      {project.summary}
                    </p>

                    {/* Tech Stack Pills */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-secondary)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Read Case Study</span>
                      <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <span className="text-[10px]">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          3. SERVICES & STARTING RATES PREVIEW
          ======================================================= */}
      <section id="services" className="w-full border-b border-[var(--color-hairline)] py-16 md:py-24 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[var(--color-hairline)]">
                <div className="space-y-3">
                  <SectionLabel name="Services &amp; Pricing" />
                  <h2 className="font-display text-3xl md:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Services &amp; Upfront Starting Rates
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                    Web development, backend APIs, and AI integrations with transparent scopes.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-5 py-2.5 bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] hover:bg-[var(--color-accent)] transition-colors self-start md:self-auto"
                >
                  <span>Explore All Services &amp; Pricing</span>
                  <span>→</span>
                </Link>
              </div>

              {/* 4 Primary Offers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {HOMEPAGE_SERVICES_PREVIEW.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-4 flex flex-col justify-between group hover:border-[var(--color-ink-primary)] transition-colors"
                  >
                    <div className="space-y-2.5">
                      <div className="font-mono text-xs font-semibold text-[var(--color-accent)]">
                        {item.startingPrice}
                      </div>
                      <h3 className="font-display text-xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        {item.customerOutcome}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-hairline)]">
                      <Link
                        href={item.targetHref}
                        className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                      >
                        <span>View package</span>
                        <span className="inline-block transition-transform duration-150 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Quote Banner for Security, SEO & Performance */}
              <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Security, Technical SEO &amp; Performance Review
                  </span>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-2xl leading-relaxed">
                    Need a baseline HTTP security header check, search engine crawlability inspection, or Core Web Vitals audit? Custom quotes tailored to your website.
                  </p>
                </div>
                <Link
                  href="/services#security-seo-performance-review"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] transition-colors shrink-0 self-start sm:self-auto"
                >
                  Get a Custom Quote →
                </Link>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          4. CREDIBILITY STRIP (Background, Education & Verified Skills)
          ======================================================= */}
      <section id="credibility" className="w-full border-b border-[var(--color-hairline)] py-16 md:py-20 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-8">
              <div className="space-y-2 max-w-2xl">
                <SectionLabel name="Credibility &amp; Experience" />
                <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Engineering Background
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Verified education, industry internships, and open-source software.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Education */}
                <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Education
                  </span>
                  <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                    B.Tech in Computer Science
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    SRMS College of Engineering, Technology &amp; Research (2022–2026). Specialized in backend systems, REST APIs, and application security.
                  </p>
                </div>

                {/* 2. Experience */}
                <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    Experience
                  </span>
                  <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                    Engineering Internships
                  </h3>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    AI/ML Intern at Nexvia Technologies (Oct 2026–Present); Software Engineer Intern at Soft Pro (Java 17, Spring Boot 3, REST APIs, MySQL).
                  </p>
                </div>

                {/* 3. Open Source Hub */}
                <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                      Source Code
                    </span>
                    <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                      Public Repositories
                    </h3>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Clean architecture, test suites, and documentation available on GitHub (@shivam-shukla888).
                    </p>
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://github.com/shivam-shukla888"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Explore GitHub</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                >
                  Read Complete Background &amp; Philosophy →
                </Link>
                <Link
                  href="/resume"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  View Resume PDF →
                </Link>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          5. CONVERSION DECISION BANNER (Single Primary Next Step)
          ======================================================= */}
      <section id="contact-cta" className="w-full bg-[var(--color-surface-dark)] text-white py-16 md:py-24">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="max-w-3xl space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold block">
                Next Steps
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white leading-tight">
                Have a bug to fix, a landing page to launch, or an API to build?
              </h2>
              <p className="font-sans text-sm sm:text-base text-[var(--color-dark-ink-secondary)] leading-relaxed">
                Direct reply within 24 hours. Every engagement begins with a confirmed written scope, agreed deliverables, and exact turnaround before work starts.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/contact"
                  className={buttonStyles({
                    variant: "accent",
                    size: "lg",
                    className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider group text-center",
                  })}
                >
                  <span>Request a Free Quote</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-5 py-3 border border-[var(--color-dark-hairline)] text-[var(--color-dark-ink-secondary)] hover:text-white hover:border-white transition-colors text-center"
                >
                  View All Packages &amp; Deliverables →
                </Link>
              </div>

              {profile.email && (
                <p className="font-mono text-xs text-[var(--color-dark-ink-secondary)] pt-2">
                  Prefer direct email?{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-white underline hover:text-[var(--color-accent)] transition-colors"
                  >
                    {profile.email}
                  </a>
                </p>
              )}
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>
    </div>
  );
}
