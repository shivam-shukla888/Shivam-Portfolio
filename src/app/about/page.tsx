import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getProfileSettings } from "@/lib/profile";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { CERTIFICATIONS } from "@/data/portfolio-data";
import { buttonStyles } from "@/components/ui/Button";

export const revalidate = 60;

export const metadata = {
  title: "About Shivam Shukla — Systems, Security & Engineering Profile | ShivSastra",
  description:
    "Editorial profile of Shivam Shukla. Building AI agents, deterministic welfare engines, and security-hardened backend systems.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/about",
  },
  openGraph: {
    title: "About Shivam Shukla — Systems, Security & Engineering Profile",
    description:
      "Editorial profile of Shivam Shukla. Building AI agents, deterministic welfare engines, and security-hardened backend systems.",
    url: "https://shivsastra.vercel.app/about",
    type: "profile",
    images: [{ url: "/images/shivam-shukla.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Shivam Shukla — Systems, Security & Engineering Profile",
    description:
      "Editorial profile of Shivam Shukla. Building AI agents, deterministic welfare engines, and security-hardened backend systems.",
  },
};

export default async function AboutPage() {
  const profile = await getProfileSettings();

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-[var(--color-canvas-primary)]">
      <ScrollProgress />
      <BackToTop />
      <PageBackground
        src="/images/backgrounds/about.webp"
        opacity={0.3}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-16">
          {/* Header Editorial Statement */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-10 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <span className="uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                  02 // EDITORIAL PROFILE
                </span>
                <span className="text-[var(--color-ink-secondary)]">
                  SHIVSASTRA ARCHIVE
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.05] max-w-4xl">
                I build systems at the edge of software &amp; deterministic intelligence.
              </h1>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold pt-1">
                AI AGENTS · DETERMINISTIC RULES · BACKEND SYSTEMS · APPLICATION SECURITY
              </p>
            </div>
          </InnerPageEntrance>

          {/* Main Spread: Portrait & Philosophical Foundations */}
          <InnerPageEntrance delayIndex={1}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Portrait & System Specifications */}
              <div className="lg:col-span-5 space-y-6">
                <div className="relative aspect-[4/5] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden">
                  <Image
                    src="/images/shivam-shukla.jpg"
                    alt={`${profile.fullName} — Shivam Shukla`}
                    fill
                    className="object-cover grayscale contrast-105"
                    sizes="(max-width: 1024px) 100vw, 440px"
                    priority
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-3 font-mono text-[10px] text-white/90 flex justify-between">
                    <span>SHIVAM SHUKLA</span>
                    <span>BAREILLY, UP, INDIA</span>
                  </div>
                </div>

                <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-2 text-[var(--color-accent)] font-semibold">
                    <span>SYSTEM IDENTIFICATION</span>
                    <span>VERIFIED</span>
                  </div>
                  <div className="space-y-1 text-[var(--color-ink-secondary)]">
                    <div className="flex justify-between">
                      <span>Graduation:</span>
                      <span className="text-[var(--color-ink-primary)] font-medium">B.Tech CSE (2026)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alma Mater:</span>
                      <span className="text-[var(--color-ink-primary)] font-medium">SRMS CET&amp;R (AKTU)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Langs:</span>
                      <span className="text-[var(--color-ink-primary)] font-medium">Python, Java, TypeScript</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Core Discipline:</span>
                      <span className="text-[var(--color-ink-primary)] font-medium">Deterministic Logic</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/resume"
                    className={buttonStyles({
                      variant: "primary",
                      size: "md",
                      className: "w-full font-mono text-xs uppercase tracking-wider justify-center",
                    })}
                  >
                    Download Complete Resume ↓
                  </Link>
                </div>
              </div>

              {/* In-depth Narrative & Pillars */}
              <div className="lg:col-span-7 space-y-8">
                <div className="p-8 md:p-10 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-6">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    ENGINEERING PHILOSOPHY
                  </span>
                  <blockquote className="font-display text-2xl sm:text-3xl text-[var(--color-ink-primary)] leading-snug">
                    &ldquo;Natural language is inherently ambiguous. Application infrastructure must be unmistakably deterministic.&rdquo;
                  </blockquote>
                  <div className="space-y-4 font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                    <p>
                      I am a Computer Science Engineering graduate (Class of 2026) at SRMS College of Engineering, Technology &amp; Research, Bareilly. My work bridges the gap between semantic AI models and hard software engineering.
                    </p>
                    <p>
                      Rather than treating LLMs as universal backends, I architect systems where models are strictly constrained to interpretation and entity extraction. Financial calculations, scheme qualification rules, database mutations, and security authorization remain firmly inside typed Java and Python backends.
                    </p>
                    <p>
                      I have built and shipped three distinct systems: <strong>Yojna Setu</strong> (a citizen welfare discovery engine integrating Groq with Spring Boot deterministic rule evaluation), <strong>RealGuard</strong> (a conversational real estate intake agent with RERA compliance verification), and <strong>QuickEats</strong> (a microservices food delivery backend rigorously audited against IDOR and price tampering vulnerabilities).
                    </p>
                  </div>
                </div>

                {/* 3 Rigorous Pillars */}
                <div className="space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    PRACTICE PILLARS
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                      <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold uppercase">
                        01 / SEPARATION
                      </span>
                      <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                        AI Extracts, Code Decides
                      </h3>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        LLMs parse messy human dialogue; deterministic logic enforces legal and computational correctness.
                      </p>
                    </div>

                    <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                      <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold uppercase">
                        02 / DEFENSE
                      </span>
                      <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                        Zero-Trust Boundaries
                      </h3>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        Prompt injection isolation, server-side payload recalculation, and strict tenant access barriers.
                      </p>
                    </div>

                    <div className="p-5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-2">
                      <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold uppercase">
                        03 / ARTIFACTS
                      </span>
                      <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                        Production Blueprints
                      </h3>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                        Every system is backed by working repositories, typed architectures, and openly accessible blueprints.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Education & Experience Summary */}
          <InnerPageEntrance delayIndex={2}>
            <div className="space-y-8 pt-6 border-t border-[var(--color-hairline)]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                    CAREER &amp; ACADEMIC RECORD
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-normal text-[var(--color-ink-primary)]">
                    Verified Trajectory
                  </h2>
                </div>
                <Link
                  href="/experience"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>View Dedicated Career Timeline</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Soft Pro */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[var(--color-accent)] font-semibold">INTERNSHIP</span>
                    <span className="text-[var(--color-ink-secondary)]">2025</span>
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                    Soft Pro
                  </h3>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Java with Spring Boot Intern
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Built REST APIs using MVC patterns, configured Hibernate ORM with MySQL, and contributed to Agile sprints.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://drive.google.com/file/d/1KmW_xZv7xv9pjj2SH0k3hvzHvs_ZrNS9/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] underline inline-flex items-center gap-1"
                    >
                      <span>Certificate</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                {/* SRMS CET&R */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[var(--color-accent)] font-semibold">UNDERGRADUATE</span>
                    <span className="text-[var(--color-ink-secondary)]">2022 – 2026</span>
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                    SRMS CET&amp;R
                  </h3>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    B.Tech Computer Science &amp; Engineering
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Four-year engineering degree covering data structures, database architecture, operating systems, and distributed backends.
                  </p>
                </div>

                {/* Nav Jeevan Mission */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[var(--color-accent)] font-semibold">SECONDARY</span>
                    <span className="text-[var(--color-ink-secondary)]">2021</span>
                  </div>
                  <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                    Nav Jeevan Mission School
                  </h3>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Senior Secondary (CBSE)
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                    Rigorous science and mathematics curriculum establishing foundations for algorithmic problem solving.
                  </p>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Certifications Block */}
          <InnerPageEntrance delayIndex={3}>
            <div className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  AUTHENTIC CREDENTIALS
                </span>
                <h2 className="font-display text-3xl font-normal text-[var(--color-ink-primary)]">
                  Coursework &amp; Simulations
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CERTIFICATIONS.map((cert) => (
                  <div
                    key={cert.id}
                    className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] text-[var(--color-accent)] uppercase tracking-wider font-semibold block">
                        VERIFIED
                      </span>
                      <h3 className="font-display text-lg text-[var(--color-ink-primary)]">
                        {cert.title}
                      </h3>
                      <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                        {cert.issuer}
                      </p>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed pt-1">
                        {cert.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[var(--color-hairline)]">
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Certificate</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </InnerPageEntrance>

          {/* Navigation & Closing */}
          <InnerPageEntrance delayIndex={4}>
            <div className="pt-8 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink-primary)] transition-colors"
              >
                <span>← Return to Headquarters</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/projects"
                  className="hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  Selected Work →
                </Link>
                <Link
                  href="/contact"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Initiate Inquiry →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
