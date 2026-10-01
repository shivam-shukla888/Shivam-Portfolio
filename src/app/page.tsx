import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonStyles } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";
import { getProfileSettings } from "@/lib/profile";
import { getPublishedProjects } from "@/lib/projects";
import { PageBackground } from "@/components/ui/PageBackground";
import { HomeHeroMotion } from "@/components/home/HomeHeroMotion";
import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";
import { EditorialServices } from "@/components/home/EditorialServices";
import {
  CERTIFICATIONS,
  SKILL_CATEGORIES,
  FOCUS_AREAS,
  DIGITAL_PRODUCTS_PREVIEWS,
} from "@/data/portfolio-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ShivSastra — Engineering, AI Agents & Security Architecture | Shivam Shukla",
  description:
    "Digital headquarters and engineering archive of Shivam Shukla. Building AI agents, deterministic welfare engines, and security-hardened backend systems.",
  keywords: [
    "Shivam Shukla",
    "ShivSastra",
    "AI Agents",
    "AI Security",
    "AI Automation",
    "Developer Products",
    "Python",
    "Java",
    "Spring Boot",
    "Prompt Injection Defense",
    "Backend Systems",
  ],
  alternates: {
    canonical: "https://shivsastra.vercel.app",
  },
  openGraph: {
    title: "ShivSastra — Engineering, AI Agents & Security Architecture",
    description:
      "Digital headquarters of Shivam Shukla. Practical AI agents, deterministic backend logic, and application security.",
    url: "https://shivsastra.vercel.app",
    type: "website",
    images: [{ url: "/images/shivam-shukla.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShivSastra — Engineering, AI Agents & Security Architecture",
    description:
      "Digital headquarters of Shivam Shukla. Practical AI agents, deterministic backend logic, and application security.",
  },
};

// Lazy-loaded signature visual with lightweight fallback
const HeroVisual = dynamic(
  () => import("@/components/home/HeroVisual").then((mod) => mod.HeroVisual),
  {
    ssr: true,
    loading: () => (
      <div className="w-full max-w-[440px] aspect-square border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center justify-center p-8">
        <span className="font-mono text-xs text-[var(--color-ink-secondary)]">[SYSTEM VISUAL]</span>
      </div>
    ),
  }
);

export default async function HomePage() {
  const [profile, allProjects] = await Promise.all([
    getProfileSettings(),
    getPublishedProjects(),
  ]);

  const yojnaSetu = allProjects.find((p) => p.slug === "yojna-setu") || allProjects[0];
  const realGuard = allProjects.find((p) => p.slug === "realguard") || allProjects[1];
  const quickEats = allProjects.find((p) => p.slug === "quickeats") || allProjects[2];

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
        "@id": "https://shivsastra.vercel.app/#website",
        url: "https://shivsastra.vercel.app",
        name: "SHIVSASTRA",
        publisher: {
          "@id": "https://shivsastra.vercel.app/#person",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =======================================================
          1. HERO — TYPOGRAPHY AS ARCHITECTURE
          ======================================================= */}
      <section className="relative w-full border-b border-[var(--color-hairline)] pt-14 md:pt-20 pb-20 md:pb-28 overflow-hidden bg-[var(--color-canvas-primary)]">
        <PageBackground
          src="/images/backgrounds/homepage.webp"
          priority
          opacity={0.4}
          position="right"
          overlayVariant="hero-left-quiet"
        />
        <SectionContainer className="relative z-1">
          <HomeHeroMotion
            overview={
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="text-[var(--color-accent)] font-semibold tracking-widest uppercase">
                  SHIVSASTRA // DIGITAL HEADQUARTERS
                </span>
                <span className="text-[var(--color-hairline)] select-none">·</span>
                <span className="text-[var(--color-ink-secondary)]">2026 EDITION</span>
                {profile.availabilityStatus && (
                  <>
                    <span className="text-[var(--color-hairline)] select-none">·</span>
                    <span className="text-[var(--color-ink-primary)] font-medium">
                      {profile.availabilityStatus}
                    </span>
                  </>
                )}
              </div>
            }
            title={
              <div className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-ink-secondary)]">
                  {profile.fullName || "SHIVAM SHUKLA"}
                </div>
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.02]">
                  Building systems with structure, security &amp; intent.
                </h1>
              </div>
            }
            positioning={
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] font-semibold pt-1">
                <span>[ AI AGENTS ]</span>
                <span className="text-[var(--color-hairline)] select-none">·</span>
                <span>[ AI SECURITY ]</span>
                <span className="text-[var(--color-hairline)] select-none">·</span>
                <span>[ DETERMINISTIC SYSTEMS ]</span>
                <span className="text-[var(--color-hairline)] select-none">·</span>
                <span>[ DIGITAL PRODUCTS ]</span>
              </div>
            }
            narrative={
              <p className="font-sans text-base md:text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-[62ch]">
                {profile.heroSupportingText ||
                  "Separating natural language interpretation from deterministic execution. Building resilient agent orchestration, citizen welfare discovery engines, and security-hardened backend architectures."}
              </p>
            }
            ctas={
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="#work"
                  className={buttonStyles({
                    variant: "primary",
                    size: "md",
                    className: "font-mono text-xs uppercase tracking-wider group",
                  })}
                >
                  <span>Explore Selected Work</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-y-0.5 ml-1.5">
                    ↓
                  </span>
                </Link>
                <Link
                  href="/about"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "md",
                    className: "font-mono text-xs uppercase tracking-wider border-[var(--color-ink-primary)] group",
                  })}
                >
                  <span>Editorial Profile</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 ml-1.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/resume"
                  className="font-mono text-xs uppercase tracking-wider px-3 py-2 text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors border border-[var(--color-hairline)]"
                >
                  Resume ↓
                </Link>
              </div>
            }
            visual={<HeroVisual />}
          />
        </SectionContainer>
      </section>

      {/* =======================================================
          2. ABOUT — EDITORIAL PROFILE
          ======================================================= */}
      <section id="about" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left Column: Portrait & Verified Education */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
                    <span>01</span>
                    <span>EDITORIAL PROFILE</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Shivam Shukla
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    AI Agent &amp; Security Builder · Backend Systems
                  </p>
                </div>

                <div className="relative aspect-[4/5] max-w-[340px] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden">
                  <Image
                    src="/images/shivam-shukla.jpg"
                    alt="Shivam Shukla — Creative Technologist & Backend Engineer"
                    fill
                    className="object-cover grayscale contrast-105"
                    sizes="(max-width: 768px) 100vw, 340px"
                    priority
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs p-3 font-mono text-[10px] text-white/90 flex justify-between">
                    <span>BAREILLY, UP, INDIA</span>
                    <span>SRMS CET&amp;R // 2026</span>
                  </div>
                </div>

                <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[var(--color-accent)] font-semibold">
                    <span>ACADEMIC FOUNDATION</span>
                    <span>2022 – 2026</span>
                  </div>
                  <p className="font-sans text-xs text-[var(--color-ink-primary)]">
                    B.Tech in Computer Science &amp; Engineering
                  </p>
                  <p className="font-sans text-[11px] text-[var(--color-ink-secondary)]">
                    SRMS College of Engineering, Technology &amp; Research (Affiliated to AKTU)
                  </p>
                </div>
              </div>

              {/* Right Column: Statement & Philosophical Breakdown */}
              <div className="lg:col-span-7 space-y-8">
                <div className="p-8 md:p-10 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    PHILOSOPHICAL MANIFESTO
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-normal text-[var(--color-ink-primary)] leading-tight">
                    &ldquo;AI extracts unstructured intent. Deterministic code enforces rules, security, and truth.&rdquo;
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                    I reject the paradigm of treating language models as universal application backends. In mission-critical workflows, language models belong at the edge as semantic interpreters, while deterministic code, typed schemas, and relational engines handle transactions, validation, and security boundaries.
                  </p>
                </div>

                {/* 3 Structured Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                    <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold uppercase">
                      PILLAR 01
                    </span>
                    <h4 className="font-display text-base font-normal text-[var(--color-ink-primary)]">
                      Backend Rigor
                    </h4>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Java 17, Spring Boot, PostgreSQL, and Python forming fault-tolerant relational foundations.
                    </p>
                  </div>

                  <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                    <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold uppercase">
                      PILLAR 02
                    </span>
                    <h4 className="font-display text-base font-normal text-[var(--color-ink-primary)]">
                      AI Security
                    </h4>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Prompt injection isolation, IDOR defense, and server-side authorization guardrails.
                    </p>
                  </div>

                  <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                    <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold uppercase">
                      PILLAR 03
                    </span>
                    <h4 className="font-display text-base font-normal text-[var(--color-ink-primary)]">
                      Working Artifacts
                    </h4>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Open-sourced architectures, developer blueprints, and verifiable production repos.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-5">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group"
                  >
                    <span>Read complete background &amp; philosophy</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/experience"
                    className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors underline underline-offset-4"
                  >
                    Career Timeline →
                  </Link>
                </div>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          3. SELECTED WORK — MASTERCLASS EDITORIAL CASE STUDIES
          ======================================================= */}
      <section id="work" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[var(--color-hairline)]">
              <div className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
                  <span>02</span>
                  <span>SELECTED WORK</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Architectural Case Studies
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Verified systems built with AI agent orchestration, deterministic rule engines, and security-first engineering.
                </p>
              </div>
              <Link
                href="/projects"
                className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5 border border-[var(--color-hairline)] px-3 py-1.5 bg-[var(--color-canvas-primary)]"
              >
                <span>Full Systems Archive</span>
                <span>→</span>
              </Link>
            </div>

            {/* CASE STUDY 01: YOJNA SETU (Flagship Horizontal Magazine Spread) */}
            {yojnaSetu && (
              <article className="py-16 border-b border-[var(--color-hairline)] space-y-8">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-3xl sm:text-4xl text-[var(--color-accent)] font-semibold">
                      01
                    </span>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-secondary)]">
                        AI AGENT // DETERMINISTIC WELFARE ENGINE
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors">
                        <Link href={`/projects/${yojnaSetu.slug}`}>
                          {yojnaSetu.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[var(--color-ink-secondary)] flex items-center gap-3">
                    <span>2026 EDITION</span>
                    <span>·</span>
                    <span>GROQ + SPRING BOOT</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Visual Left Frame */}
                  <div className="lg:col-span-7">
                    <Link
                      href={`/projects/${yojnaSetu.slug}`}
                      className="relative block w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] overflow-hidden group"
                    >
                      {yojnaSetu.coverImageUrl ? (
                        <Image
                          src={yojnaSetu.coverImageUrl}
                          alt={yojnaSetu.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-[1.015] transition-transform duration-300"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8 font-mono text-xs text-[var(--color-ink-secondary)]">
                          [YOJNA SETU ARCHITECTURE]
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Architecture Table Right */}
                  <div className="lg:col-span-5 flex flex-col justify-between border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-6 md:p-8 space-y-6">
                    <div className="space-y-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                        SYSTEM ARCHITECTURE &amp; GOAL
                      </span>
                      <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                        {yojnaSetu.summary}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-[var(--color-hairline)] font-mono text-xs">
                        <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]/60">
                          <span className="text-[var(--color-ink-secondary)]">Intent Engine:</span>
                          <span className="text-[var(--color-ink-primary)]">Groq Llama 3 (Entity Extraction)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]/60">
                          <span className="text-[var(--color-ink-secondary)]">Rule Engine:</span>
                          <span className="text-[var(--color-ink-primary)]">Spring Boot 3 (Deterministic)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]/60">
                          <span className="text-[var(--color-ink-secondary)]">Database:</span>
                          <span className="text-[var(--color-ink-primary)]">PostgreSQL (Indexed Criteria)</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]/60">
                          <span className="text-[var(--color-ink-secondary)]">Channel:</span>
                          <span className="text-[var(--color-ink-primary)]">Twilio WhatsApp Messaging Bus</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        href={`/projects/${yojnaSetu.slug}`}
                        className={buttonStyles({
                          variant: "primary",
                          size: "sm",
                          className: "font-mono uppercase tracking-wider text-xs",
                        })}
                      >
                        Read Full Case Study →
                      </Link>
                      {yojnaSetu.githubUrl && (
                        <a
                          href={yojnaSetu.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Repository</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* CASE STUDY 02: REALGUARD (Asymmetric Split: Text Left, Visual Right) */}
            {realGuard && (
              <article className="py-16 border-b border-[var(--color-hairline)] space-y-8">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-3xl sm:text-4xl text-[var(--color-accent)] font-semibold">
                      02
                    </span>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-secondary)]">
                        AI AUTOMATION // COMPLIANCE WORKFLOW
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors">
                        <Link href={`/projects/${realGuard.slug}`}>
                          {realGuard.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[var(--color-ink-secondary)] flex items-center gap-3">
                    <span>2026 EDITION</span>
                    <span>·</span>
                    <span>PYTHON + FASTAPI + WHATSAPP</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Narrative Left */}
                  <div className="lg:col-span-5 flex flex-col justify-between border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-6 md:p-8 space-y-6">
                    <div className="space-y-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                        AUTOMATED REAL ESTATE INTAKE
                      </span>
                      <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                        {realGuard.summary}
                      </p>

                      <div className="space-y-2 pt-2 border-t border-[var(--color-hairline)] font-mono text-xs">
                        <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]/60">
                          <span className="text-[var(--color-ink-secondary)]">Intake Bus:</span>
                          <span className="text-[var(--color-ink-primary)]">FastAPI Webhook Listener</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]/60">
                          <span className="text-[var(--color-ink-secondary)]">Verification:</span>
                          <span className="text-[var(--color-ink-primary)]">UP RERA Validation Rules</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-[var(--color-hairline)]/60">
                          <span className="text-[var(--color-ink-secondary)]">Financial Engine:</span>
                          <span className="text-[var(--color-ink-primary)]">Deterministic EMI Calculation</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        href={`/projects/${realGuard.slug}`}
                        className={buttonStyles({
                          variant: "primary",
                          size: "sm",
                          className: "font-mono uppercase tracking-wider text-xs",
                        })}
                      >
                        Read Full Case Study →
                      </Link>
                      {realGuard.githubUrl && (
                        <a
                          href={realGuard.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Repository</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Visual Right Frame */}
                  <div className="lg:col-span-7">
                    <Link
                      href={`/projects/${realGuard.slug}`}
                      className="relative block w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] overflow-hidden group"
                    >
                      {realGuard.coverImageUrl ? (
                        <Image
                          src={realGuard.coverImageUrl}
                          alt={realGuard.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-[1.015] transition-transform duration-300"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8 font-mono text-xs text-[var(--color-ink-secondary)]">
                          [REALGUARD COMPLIANCE WORKFLOW]
                        </div>
                      )}
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* CASE STUDY 03: QUICKEATS (Backend Bento & Security Snapshot) */}
            {quickEats && (
              <article className="pt-16 space-y-8">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-3xl sm:text-4xl text-[var(--color-accent)] font-semibold">
                      03
                    </span>
                    <div>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-secondary)]">
                        BACKEND ENGINEERING // APPLICATION SECURITY AUDIT
                      </span>
                      <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors">
                        <Link href={`/projects/${quickEats.slug}`}>
                          {quickEats.title}
                        </Link>
                      </h3>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-[var(--color-ink-secondary)] flex items-center gap-3">
                    <span>2026 EDITION</span>
                    <span>·</span>
                    <span>SPRING BOOT + JWT + IDOR DEFENSE</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  {/* Visual Left */}
                  <div className="lg:col-span-6">
                    <Link
                      href={`/projects/${quickEats.slug}`}
                      className="relative block w-full aspect-[16/11] border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] overflow-hidden group"
                    >
                      {quickEats.coverImageUrl ? (
                        <Image
                          src={quickEats.coverImageUrl}
                          alt={quickEats.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-[1.015] transition-transform duration-300"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8 font-mono text-xs text-[var(--color-ink-secondary)]">
                          [QUICKEATS SYSTEM BLUEPRINT]
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Security Defense Bento Right */}
                  <div className="lg:col-span-6 flex flex-col justify-between border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-6 md:p-8 space-y-6">
                    <div className="space-y-4">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                        SECURITY THREAT MODELS MITIGATED
                      </span>
                      <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                        {quickEats.summary}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-1">
                          <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold block">
                            DEFENSE 01
                          </span>
                          <div className="font-sans text-xs font-medium text-[var(--color-ink-primary)]">
                            Server-Side Price Calculation
                          </div>
                          <p className="font-sans text-[11px] text-[var(--color-ink-secondary)]">
                            Prevents client-side price payload tampering before charging.
                          </p>
                        </div>

                        <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-1">
                          <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold block">
                            DEFENSE 02
                          </span>
                          <div className="font-sans text-xs font-medium text-[var(--color-ink-primary)]">
                            IDOR Access Prevention
                          </div>
                          <p className="font-sans text-[11px] text-[var(--color-ink-secondary)]">
                            Multi-tenant order scoping prevents cross-account data leakage.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link
                        href={`/projects/${quickEats.slug}`}
                        className={buttonStyles({
                          variant: "primary",
                          size: "sm",
                          className: "font-mono uppercase tracking-wider text-xs",
                        })}
                      >
                        Read Full Case Study →
                      </Link>
                      {quickEats.githubUrl && (
                        <a
                          href={quickEats.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Repository</span>
                          <span>↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )}
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          4. TECHNICAL STACK — TIERED MATRIX
          ======================================================= */}
      <section id="skills" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--color-hairline)]">
                <div className="space-y-3 max-w-2xl">
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
                    <span>03</span>
                    <span>ENGINEERING STACK</span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Technical Architecture Matrix
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    Categorized by verified production deployment and implementation depth.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[var(--color-ink-secondary)]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-none bg-[var(--color-accent)]" />
                    <strong className="text-[var(--color-ink-primary)]">Core:</strong> Shipped Repos
                  </span>
                  <span className="text-[var(--color-hairline)]">/</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-none bg-[var(--color-ink-secondary)]" />
                    <strong className="text-[var(--color-ink-primary)]">Working:</strong> Integrated
                  </span>
                  <span className="text-[var(--color-hairline)]">/</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-none border border-[var(--color-hairline)]" />
                    <strong className="text-[var(--color-ink-primary)]">Exposure:</strong> Simulation
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3">
                        <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                          {cat.title}
                        </h3>
                        <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 flex flex-wrap gap-1.5">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)]"
                        >
                          <span>{skill.name}</span>
                          <span
                            className={`text-[9px] uppercase tracking-wider font-mono ${
                              skill.tier === "Core"
                                ? "text-[var(--color-accent)] font-bold"
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
          5. SERVICES & CAPABILITIES — EDITORIAL ROWS
          ======================================================= */}
      <section id="services" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
                <div className="space-y-3">
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
                    <span>04</span>
                    <span>CAPABILITIES</span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Services &amp; Architecture Practice
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                    Direct engineering engagements for client systems, security audits, and agent workflows.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5 border border-[var(--color-hairline)] px-3 py-1.5 bg-[var(--color-canvas-primary)]"
                >
                  <span>Services Overview</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Interactive Editorial Capability Rows */}
              <EditorialServices />
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          6. CERTIFICATIONS — VERIFIED CREDENTIALS
          ======================================================= */}
      <section id="certifications" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-primary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="space-y-3 max-w-2xl">
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
                  <span>05</span>
                  <span>CREDENTIALS</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Verified Certifications
                </h2>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                  Cloud architecture, software engineering job simulations, and verified algorithmic problem solving.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CERTIFICATIONS.map((cert) => (
                  <div
                    key={cert.id}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-5 flex flex-col justify-between hover:border-[var(--color-ink-primary)] transition-colors group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--color-hairline)] pb-3">
                        <span className="text-[var(--color-accent)] font-semibold uppercase tracking-wider">
                          OFFICIAL RECORD
                        </span>
                        <span className="text-[var(--color-ink-secondary)]">✓ VERIFIED</span>
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
                        <span>Inspect Certificate</span>
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
          7. DIGITAL PRODUCTS & TEMPLATES
          ======================================================= */}
      <section id="store" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-[var(--color-canvas-secondary)]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[var(--color-hairline)]">
                <div className="lg:col-span-6 space-y-3">
                  <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
                    <span>06</span>
                    <span>DIGITAL BLUEPRINTS</span>
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Developer Templates &amp; Blueprints
                  </h2>
                  <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                    Architectural boilerplates distilled directly from working production code.
                  </p>
                </div>
                <div className="lg:col-span-6 space-y-2">
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Zero fake reviews, zero manufactured metrics. Clean, typed, and structured blueprints for engineers building deterministic agents and secure backends.
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
                      <div className="flex items-center justify-between text-xs font-mono border-b border-[var(--color-hairline)] pb-3">
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

                    <div className="pt-4 border-t border-[var(--color-hairline)]">
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
                  Ready to deploy these architectures in your own stack?
                </span>
                <Link
                  href="/store"
                  className={buttonStyles({
                    variant: "primary",
                    size: "md",
                    className: "font-mono text-xs uppercase tracking-wider",
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
                <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
                  <span>07</span>
                  <span>COMMAND CENTER</span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Current Focus &amp; GitHub Hub
                </h2>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Active engineering domains, research topics, and public repositories.
                </p>
              </div>

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

              {/* GitHub Hub Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 md:p-10">
                <div className="md:col-span-5 space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    OPEN REPOSITORIES
                  </span>
                  <h3 className="font-display text-3xl text-[var(--color-ink-primary)]">
                    GitHub Engineering Archive
                  </h3>
                  <div className="space-y-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                    <div className="flex justify-between py-1.5 border-b border-[var(--color-hairline)]">
                      <span>Account:</span>
                      <span className="font-semibold text-[var(--color-ink-primary)]">@shivam-shukla888</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--color-hairline)]">
                      <span>Primary Langs:</span>
                      <span className="font-semibold text-[var(--color-ink-primary)]">Python, Java, TypeScript</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[var(--color-hairline)]">
                      <span>Featured Repos:</span>
                      <span className="font-semibold text-[var(--color-ink-primary)]">Yojna Setu, RealGuard, QuickEats</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://github.com/shivam-shukla888"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5 border border-[var(--color-hairline)] px-3 py-1.5 bg-[var(--color-canvas-primary)]"
                    >
                      <span>Open GitHub Profile</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4 md:border-l md:border-[var(--color-hairline)] md:pl-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                      CORE OPERATING STANDARD
                    </span>
                    <h3 className="font-display text-2xl text-[var(--color-ink-primary)]">
                      Deterministic Execution Over Probabilistic Guesses
                    </h3>
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                      AI is exceptionally effective at parsing freeform human dialogue, classifying intents, and converting conversational prose into schema-bound payloads. But business calculations, permission checks, and transactional state must remain strictly in typed code.
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
                      Download Resume ↓
                    </Link>
                    <Link
                      href="/contact"
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
                    >
                      Initiate Direct Inquiry →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SectionContainer>
        </HomeSectionReveal>
      </section>

      {/* =======================================================
          9. CONTACT — ARCHITECTURAL DARK BLOCK
          ======================================================= */}
      <section id="contact" className="w-full bg-[var(--color-surface-dark)] text-white py-20 md:py-32">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                    08 // INQUIRIES
                  </span>
                  <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
                    Initiate Direct Inquiry
                  </h2>
                </div>
                <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                  Direct communication channel for engineering roles, AI security audits, and system architecture.
                </p>
                <p className="font-sans text-sm text-[var(--color-dark-ink-secondary)] leading-relaxed max-w-md">
                  {profile.contactInstructions ||
                    "I respond to serious engineering inquiries within 24 to 48 hours. Please detail project requirements, expected timeline, and technical stack."}
                </p>

                <div className="pt-2 space-y-3 font-mono text-xs text-[var(--color-dark-ink-secondary)] border-t border-[var(--color-dark-hairline)]">
                  {profile.email && (
                    <div className="flex justify-between py-1 border-b border-[var(--color-dark-hairline)]/60">
                      <span className="text-[var(--color-accent)] uppercase tracking-wider text-[10px]">Email:</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-white transition-colors underline break-all text-white/90"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex justify-between py-1 border-b border-[var(--color-dark-hairline)]/60">
                      <span className="text-[var(--color-accent)] uppercase tracking-wider text-[10px]">Phone:</span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="hover:text-white transition-colors underline text-white/90"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--color-accent)] uppercase tracking-wider text-[10px]">Location:</span>
                    <span className="text-white/90">Bareilly, UP, India [UTC+05:30]</span>
                  </div>
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
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 ml-1.5">
                      ↓
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[var(--color-dark-hairline)] text-[var(--color-dark-ink-secondary)] hover:text-white hover:border-white transition-colors"
                  >
                    Dedicated Contact Page →
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7">
                <ContactForm
                  variant="dark"
                  labels={{
                    name: "Your Name / Organization",
                    email: "Email Address",
                    brief: "Brief technical specification or inquiry details",
                    submit: "Dispatch Transmission →",
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
