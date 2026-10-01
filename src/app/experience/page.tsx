import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";

export const metadata: Metadata = {
  title: "Experience & Timeline — Shivam Shukla",
  description:
    "Publication-style career timeline, engineering internships, and verified academic record of Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/experience",
  },
  openGraph: {
    title: "Experience & Timeline — Shivam Shukla",
    description:
      "Publication-style career timeline, engineering internships, and verified academic record of Shivam Shukla.",
    url: "https://shivsastra.vercel.app/experience",
    type: "profile",
  },
};

const TIMELINE_ENTRIES = [
  {
    year: "2025",
    period: "2025",
    company: "SOFT PRO",
    role: "Java with Spring Boot Intern",
    location: "Software Engineering Internship",
    description:
      "Engineered RESTful API endpoints using Java and Spring Boot following clean MVC patterns. Configured MySQL persistence layers with Hibernate ORM, established entity relationship models, and participated in active Agile development sprints.",
    technology: ["Java", "Spring Boot", "MySQL", "Hibernate ORM", "REST APIs", "MVC"],
    verificationUrl: "https://drive.google.com/file/d/1KmW_xZv7xv9pjj2SH0k3hvzHvs_ZrNS9/view",
    verificationLabel: "View Completion Certificate ↗",
  },
  {
    year: "2022 — 2026",
    period: "2022 – 2026",
    company: "SRMS CET&R, BAREILLY (AFFILIATED TO AKTU)",
    role: "B.Tech in Computer Science & Engineering",
    location: "Undergraduate Degree",
    description:
      "Undergraduate engineering curriculum emphasizing backend systems, algorithmic complexity, relational database management, and operating system principles. Built and documented three complete systems (Yojna Setu, RealGuard, and QuickEats) coupling deterministic backend pipelines with modern language model tool-calling.",
    technology: ["Computer Science", "Algorithms", "Relational Databases", "Systems Design", "Python", "Java"],
    verificationUrl: null,
    verificationLabel: null,
  },
  {
    year: "2021",
    period: "2021",
    company: "NAV JEEVAN MISSION SCHOOL",
    role: "Senior Secondary Education (CBSE)",
    location: "Bareilly, Uttar Pradesh",
    description:
      "Completed Senior Secondary education under CBSE curriculum with academic foundation in science, physics, and advanced mathematics, preparing for higher university studies in computer science engineering.",
    technology: ["Mathematics", "Physics", "Computer Science"],
    verificationUrl: null,
    verificationLabel: null,
  },
];

export default function ExperiencePage() {
  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden">
      <ScrollProgress />
      <BackToTop />

      <SectionContainer>
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
                <Link href="/" className="hover:text-[var(--color-ink-primary)]">
                  Home
                </Link>
                <span>/</span>
                <span className="text-[var(--color-accent)] font-medium">Experience</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold block">
                    CHRONOLOGY // CAREER &amp; EDUCATION
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                    Experience
                  </h1>
                </div>
                <div className="font-mono text-xs text-[var(--color-ink-secondary)]">
                  <span className="text-[var(--color-accent)] font-semibold">2021 — 2026</span>
                  <span className="ml-2">· RECORD VERIFIED</span>
                </div>
              </div>
              <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-2xl pt-2">
                A verified chronological record of software internships, academic engineering degrees, and foundational education.
              </p>
            </div>
          </InnerPageEntrance>

          {/* Publication-Style Timeline */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-16">
              {TIMELINE_ENTRIES.map((entry, idx) => (
                <article
                  key={idx}
                  className="space-y-6 pb-12 border-b border-[var(--color-hairline)] last:border-b-0"
                >
                  {/* Top Bar: Large Year Typography & Role Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-normal text-[var(--color-ink-primary)] tracking-tight">
                      {entry.year}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                      {entry.company}
                    </span>
                  </div>

                  {/* Structural Divider */}
                  <div className="w-full h-px bg-[var(--color-hairline)]" />

                  {/* Role & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-4 space-y-1">
                      <h2 className="font-display text-2xl font-normal text-[var(--color-ink-primary)]">
                        {entry.role}
                      </h2>
                      <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                        {entry.location}
                      </p>
                    </div>

                    <div className="md:col-span-8 space-y-4">
                      <p className="font-sans text-sm sm:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                        {entry.description}
                      </p>

                      {/* Technology Chips */}
                      {entry.technology.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {entry.technology.map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-primary)]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Verification Link */}
                      {entry.verificationUrl && (
                        <div className="pt-2">
                          <a
                            href={entry.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            <span>{entry.verificationLabel}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </InnerPageEntrance>

          {/* Footer Navigation Bar */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/about"
                className="hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1"
              >
                <span>← Read About Philosophy</span>
              </Link>
              <div className="flex items-center gap-4">
                <span>View Full Resume:</span>
                <Link
                  href="/resume"
                  className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                >
                  Resume PDF →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
