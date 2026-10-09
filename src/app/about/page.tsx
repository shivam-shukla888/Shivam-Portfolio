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
import { absoluteUrl } from "@/lib/site";

export const revalidate = 60;

export const metadata = {
  title: "About — Shivam Shukla",
  description:
    "Background, technical approach, and direction of Shivam Shukla — AI agents, AI security, automation, and digital products.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About — Shivam Shukla",
    description:
      "Background, technical approach, and direction of Shivam Shukla — AI agents, AI security, automation, and digital products.",
    url: absoluteUrl("/about"),
    type: "profile",
    images: [{ url: "/images/shivam-shukla.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Shivam Shukla",
    description:
      "Background, technical approach, and direction of Shivam Shukla — AI agents, AI security, automation, and digital products.",
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
                AI Agents · AI Security · Automation · Digital Products
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
                  <Link
                    href="/resume"
                    className={buttonStyles({
                      variant: "primary",
                      size: "md",
                      className: "w-full font-mono text-xs uppercase tracking-wider justify-center",
                    })}
                  >
                    View Resume →
                  </Link>
                </div>
              </div>

              {/* Narrative Content */}
              <div className="md:col-span-7 space-y-6">
                <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4">
                  <p className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] leading-relaxed italic">
                    &ldquo;I build software products, AI agents, and automation systems — prioritizing AI security and deterministic application logic over flashy demos.&rdquo;
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    I&apos;m an AI Engineer and Backend Developer (2026 Computer Science Engineering graduate). I specialize in AI agents, LLM workflows, RAG, Machine Learning, and backend systems with hands-on experience in Python, Java, Spring Boot, REST APIs, PostgreSQL, Docker, AWS, and Supabase. I care deeply about building production-oriented AI applications by separating language model processing from deterministic application logic.
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Backend engineering forms the core foundation of everything I build. Java, Spring Boot, REST APIs, and relational databases provide the structural reliability, while Python powers my work with AI agent orchestration, tool calling pipelines, and machine learning workflows. Along the way, I turn repeatable engineering patterns into open developer templates and digital resources.
                  </p>
                </div>

                <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] space-y-3 font-sans text-xs text-[var(--color-ink-secondary)]">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                    HOW I WORK
                  </span>
                  <p className="leading-relaxed">
                    1. <strong className="text-[var(--color-ink-primary)]">AI Extracts. Code Decides:</strong> LLMs are valuable for interpreting messy, natural-language human intent, but business logic, compliance rules, and financial calculations belong strictly in deterministic code.
                  </p>
                  <p className="leading-relaxed">
                    2. <strong className="text-[var(--color-ink-primary)]">AI Security &amp; Defensive Boundaries:</strong> From prompt-injection defense and schema validation to server-side price recalculation and IDOR checks, applications must enforce server-side authority rather than trusting client or prompt state.
                  </p>
                  <p className="leading-relaxed">
                    3. <strong className="text-[var(--color-ink-primary)]">Practical Products Over AI Demos:</strong> I focus on building systems that solve concrete problems — from citizens discovering welfare schemes via WhatsApp to brokers qualifying leads.
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
                {/* Oct 2026 - Present: Nexvia Technologies */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      AI/ML Intern
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      Oct 2026 – Present
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Nexvia Technologies · Remote
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Working on real-world AI and Machine Learning projects with exposure to engineering workflows, tools, collaboration, documentation, and professional software practices.
                  </p>
                </div>

                {/* Sep 2026 - Oct 2026: Auspify Technologies */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      Full Stack Development Intern
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      Sep 2026 – Oct 2026
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Auspify Technologies · Remote
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Contributed to real-time software projects involving feature development, technical research, documentation, and project support with the development team.
                  </p>
                </div>

                {/* Jul 2025 - Sep 2025: Soft Pro */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      Software Engineer Intern
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      Jul 2025 – Sep 2025
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Soft Pro · Noida, India
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Developed backend REST APIs using Java 17, Spring Boot 3, MVC, OOP, MySQL, and Hibernate ORM; optimized API workflows contributing to approximately 20% lower response time. Implemented global exception handling, tested APIs with Postman, and resolved 15+ backend defects.
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
                      B.Tech in Computer Science &amp; Engineering (70%)
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      2022 – 2026
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Shri Ram Murti Smarak College of Engineering, Technology &amp; Research, Bareilly, India
                  </p>
                  <p className="font-sans text-xs text-[var(--color-accent)] font-medium">
                    Affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Completed Computer Science Engineering (2026) with 70% aggregate. Specialized in backend engineering, agentic AI, LLM pipelines, and application security. Built three production-grade systems (Yojna Setu, ShivSastra, and QuickEats) during undergraduate studies.
                  </p>
                </div>

                {/* 2021: Senior Secondary */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                      Senior Secondary, CBSE (70%)
                    </h3>
                    <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                      2021
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    Nav Jeevan Mission School, Kushinagar, India
                  </p>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Completed Senior Secondary education with a 70% score, establishing strong analytical foundations in science and mathematics.
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
                <Link
                  href="/resume"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] transition-colors"
                >
                  Resume →
                </Link>
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
