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
  title: "About — Shivam Shukla",
  description:
    "Background, education, career experience, and technical approach of Shivam Shukla — backend systems, AI agents, and software security.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/about",
  },
  openGraph: {
    title: "About — Shivam Shukla",
    description:
      "Background, education, career experience, and technical approach of Shivam Shukla — backend systems, AI agents, and software security.",
    url: "https://shivsastra.vercel.app/about",
    type: "profile",
    images: [{ url: "/images/shivam-shukla.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Shivam Shukla",
    description:
      "Background, education, career experience, and technical approach of Shivam Shukla — backend systems, AI agents, and software security.",
  },
};

export default async function AboutPage() {
  const profile = await getProfileSettings();

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <ScrollProgress />
      <BackToTop />
      <PageBackground
        src="/images/backgrounds/about.webp"
        opacity={0.25}
        position="top"
      />
      <SectionContainer>
        <div className="max-w-4xl space-y-16">
          {/* Header Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-3 pb-6 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                <Link href="/" className="hover:text-[var(--color-ink-primary)]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[var(--color-accent)] font-medium">About</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                About Me
              </h1>
              <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                Engineering Background, Career Journey &amp; Core Principles
              </p>
            </div>
          </InnerPageEntrance>

          {/* Main Content: Portrait & Narrative */}
          <InnerPageEntrance delayIndex={1}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
              {/* Portrait */}
              <div className="md:col-span-5 space-y-4">
                <div className="relative aspect-[4/5] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden">
                  <Image
                    src="/images/shivam-shukla.jpg"
                    alt={`${profile.fullName} — Portrait`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 360px"
                    priority
                  />
                </div>
                <div className="pt-2">
                  <a
                    href="/Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({
                      variant: "primary",
                      size: "md",
                      className: "w-full font-mono text-xs uppercase tracking-wider justify-center",
                    })}
                  >
                    Download Resume (PDF) ↓
                  </a>
                </div>
              </div>

              {/* Narrative Content */}
              <div className="md:col-span-7 space-y-6">
                <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
                  <p className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] leading-relaxed italic">
                    &ldquo;I build backend systems and practical AI workflows — combining natural language understanding with deterministic logic.&rdquo;
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    I&apos;m a Backend &amp; AI Developer and 2026 Computer Science Engineering graduate. I specialize in Java, Spring Boot, and LLM integrations (Groq API, prompt engineering) to build reliable applications with clear separation of concerns.
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    My projects focus on solving real challenges for citizens, home buyers, and vendors through accessible WhatsApp messaging and structured backend services.
                  </p>
                </div>

                <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-3 font-sans text-xs text-[var(--color-ink-secondary)]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    HOW I WORK
                  </span>
                  <p className="leading-relaxed">
                    1. <strong className="text-[var(--color-ink-primary)]">AI Extracts. Code Decides:</strong> LLMs are useful for parsing unstructured human intent, but business logic, compliance rules, and financial calculations belong strictly in deterministic code.
                  </p>
                  <p className="leading-relaxed">
                    2. <strong className="text-[var(--color-ink-primary)]">Defensive Engineering:</strong> From server-side price recalculation to IDOR ownership checks, applications should validate data authority on the server rather than trusting client state.
                  </p>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Education & Experience Timeline */}
          <InnerPageEntrance delayIndex={2}>
            <div className="space-y-8 pt-4">
              <div className="space-y-2 pb-4 border-b border-[var(--color-hairline)]">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  CAREER &amp; EDUCATION
                </span>
                <h2 className="font-display text-3xl font-normal text-[var(--color-ink-primary)]">
                  Timeline
                </h2>
              </div>

              <div className="space-y-6">
                {/* 2025: Soft Pro */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      Java with Spring Boot Intern
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      2025
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Soft Pro · Software Engineering Internship
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Developed RESTful APIs using Java and Spring Boot following MVC architecture. Configured MySQL with Hibernate ORM, implemented entity mappings, and participated in Agile development cycles.
                  </p>
                  <div className="pt-2">
                    <a
                      href="https://drive.google.com/file/d/1KmW_xZv7xv9pjj2SH0k3hvzHvs_ZrNS9/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                    >
                      <span>View Completion Certificate</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                {/* 2022 - 2026: B.Tech CSE */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      B.Tech in Computer Science &amp; Engineering
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      2022 – 2026
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    SRMS College of Engineering, Technology &amp; Research, Bareilly (AKTU)
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Completed Computer Science Engineering (2026) with focus on backend development, systems design, and AI integrations. Built three full applications (Yojna Setu, RealGuard, and QuickEats) during undergraduate studies using Java, Spring Boot, relational databases, and LLM APIs.
                  </p>
                </div>

                {/* 2021: Senior Secondary */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      Senior Secondary (CBSE)
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      2021
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Nav Jeevan Mission School
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Completed Senior Secondary education with a strong foundation in science and mathematics, preparing for higher education in engineering.
                  </p>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Certifications Block */}
          <InnerPageEntrance delayIndex={3}>
            <div className="space-y-6 pt-4">
              <div className="space-y-2 pb-4 border-b border-[var(--color-hairline)]">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                  VERIFIED CREDENTIALS
                </span>
                <h2 className="font-display text-3xl font-normal text-[var(--color-ink-primary)]">
                  Certifications
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

          {/* Contextual Contact CTA */}
          <InnerPageEntrance delayIndex={4}>
            <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Get in Touch
                </span>
                <p className="font-display text-xl text-[var(--color-ink-primary)]">
                  Have an engineering opportunity or want to talk?
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] transition-colors"
                >
                  Resume ↓
                </a>
                <Link
                  href="/contact"
                  className={buttonStyles({
                    variant: "primary",
                    size: "md",
                    className: "font-mono text-xs uppercase tracking-wider",
                  })}
                >
                  Send a Message →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Navigation Action */}
          <InnerPageEntrance delayIndex={5}>
            <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink-primary)] transition-colors"
              >
                <span>← Back to Home</span>
              </Link>
              <Link
                href="/projects"
                className="hover:text-[var(--color-ink-primary)] transition-colors"
              >
                View Selected Work →
              </Link>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
