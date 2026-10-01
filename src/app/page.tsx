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
    canonical: "https://shivsastra.vercel.app",
  },
  openGraph: {
    title: "Shivam Shukla — AI Agents, AI Security & Developer Products",
    description:
      "I build AI agents, automation systems, and developer products. From conversational workflows and backend systems to AI security and practical digital resources.",
    url: "https://shivsastra.vercel.app",
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
          1. HERO (Editorial Typography-First Composition)
          ======================================================= */}
      <section className="relative w-full border-b border-[var(--color-hairline)] pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden bg-white">
        <PageBackground
          src="/images/backgrounds/homepage.webp"
          priority
          opacity={0.35}
          position="right"
          overlayVariant="hero-left-quiet"
        />
        <SectionContainer className="relative z-1">
          <HomeHeroMotion
            overview={
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#2C3480] font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#2C3480] inline-block shrink-0" aria-hidden="true" />
                  SHIVSASTRA / DIGITAL HEADQUARTERS
                </span>
                {profile.availabilityStatus && (
                  <span className="font-mono text-[11px] text-[#555555] border-l border-[#E5E5E5] pl-3">
                    {profile.availabilityStatus}
                  </span>
                )}
              </div>
            }
            title={
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-normal tracking-tight text-[#000000] leading-[1.04]">
                Technology,<br />
                security &amp;<br />
                ideas — built<br />
                with intent.
              </h1>
            }
            positioning={
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.14em] text-[#2C3480] font-semibold">
                AI Agents · AI Security · Automation · Digital Products
              </p>
            }
            narrative={
              <p className="font-sans text-base md:text-lg text-[#555555] leading-relaxed max-w-[58ch]">
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
                  <span>View Work</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none ml-1.5">
                    →
                  </span>
                </Link>
                <Link
                  href="#about"
                  className={buttonStyles({
                    variant: "secondary",
                    size: "lg",
                    className: "w-full sm:w-auto font-mono text-xs uppercase tracking-wider group",
                  })}
                >
                  <span>About</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none ml-1.5">
                    →
                  </span>
                </Link>
                <Link
                  href="/store"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-3 text-[#555555] hover:text-[#2C3480] transition-colors text-center"
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
          2. ABOUT (Editorial Split Layout)
          ======================================================= */}
      <section id="about" className="w-full border-b border-[var(--color-hairline)] py-20 md:py-28 bg-white">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left Column: Editorial Statement, B&W Portrait & Education */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                    <SectionLabel name="About" index="01 / ABOUT" />
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#000000] leading-[1.12]">
                    I build software<br />
                    where intelligence<br />
                    meets structure.
                  </h2>
                  <p className="font-mono text-xs text-[#2C3480] font-semibold uppercase tracking-wider">
                    AI Agent &amp; Security Builder · Digital Products
                  </p>
                </div>

                <div className="relative aspect-[4/5] max-w-[320px] border border-[#E5E5E5] bg-[#F8F9FA] overflow-hidden group">
                  <Image
                    src="/images/shivam-shukla.jpg"
                    alt="Shivam Shukla — Portrait"
                    fill
                    className="object-cover grayscale contrast-[1.05] group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                  />
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#2C3480] transition-colors pointer-events-none" />
                </div>

                <div className="p-5 border border-[#E5E5E5] bg-[#F8F9FA] space-y-2 font-mono text-xs text-[#555555]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#2C3480] font-semibold">EDUCATION</span>
                    <span>2022 – 2026</span>
                  </div>
                  <p className="font-sans text-xs text-[#000000]">
                    B.Tech in Computer Science Engineering
                    <br />
                    <span className="text-[#555555] text-[11px]">
                      SRMS CET&amp;R, Bareilly (Affiliated to AKTU)
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Column: Authentic Story & Highlights */}
              <div className="lg:col-span-7 space-y-8 lg:pt-8">
                <div className="p-8 md:p-10 border border-[#E5E5E5] bg-[#F8F9FA] space-y-4 relative">
                  <div className="w-1 h-8 bg-[#2C3480] absolute left-0 top-10" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#2C3480] font-semibold block">
                    PHILOSOPHY &amp; FOCUS
                  </span>
                  <p className="font-sans text-base sm:text-lg text-[#000000] leading-relaxed">
                    I build software products, practical AI agents, and automation systems with a focus on AI security. I care about building practical systems rather than AI demos — separating language extraction from deterministic backend logic.
                  </p>
                  <p className="font-sans text-sm sm:text-base text-[#555555] leading-relaxed">
                    While Java and Spring Boot remain a solid engineering foundation of my work, Python is my primary language for AI agent orchestration, tool calling, and automation. Along the way, I turn repeatable engineering patterns into open developer templates and digital resources.
                  </p>
                </div>

                {/* Practical Milestone Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 border border-[#E5E5E5] bg-white space-y-2 group hover:border-[#2C3480] transition-colors">
                    <span className="font-mono text-[11px] text-[#2C3480] font-semibold uppercase tracking-wider">
                      Engineering Foundation
                    </span>
                    <h3 className="font-display text-lg text-[#000000]">
                      Backend &amp; Systems
                    </h3>
                    <p className="font-sans text-xs text-[#555555] leading-relaxed">
                      Engineering background in Python, Java, and Spring Boot, combining relational data modeling with modern LLM tool integrations.
                    </p>
                  </div>

                  <div className="p-6 border border-[#E5E5E5] bg-white space-y-2 group hover:border-[#2C3480] transition-colors">
                    <span className="font-mono text-[11px] text-[#2C3480] font-semibold uppercase tracking-wider">
                      Shipped Systems
                    </span>
                    <h3 className="font-display text-lg text-[#000000]">
                      3 Working Systems
                    </h3>
                    <p className="font-sans text-xs text-[#555555] leading-relaxed">
                      Built Yojna Setu (AI + deterministic rules), RealGuard (AI automation), and QuickEats (AI-assisted product engineering &amp; security).
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[#000000] hover:text-[#2C3480] transition-colors group"
                  >
                    <span>Read complete background</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/resume"
                    className="font-mono text-xs uppercase tracking-wider text-[#555555] hover:text-[#000000] transition-colors underline underline-offset-4"
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
          3. SELECTED WORK (Strategic Dramatic Black Feature Section)
          ======================================================= */}
      <section id="work" className="w-full border-b border-[#1F1F1F] py-20 md:py-32 bg-[#000000] text-white">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-12 border-b border-[#1F1F1F]">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                  <SectionLabel name="Selected Work" index="02 / SELECTED WORK" dark />
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white">
                  Selected Work
                </h2>
                <p className="font-sans text-xs text-[#8E9BFF] font-medium">
                  Practical systems built with AI agents, deterministic rules engines, and application security.
                </p>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-white/80 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                <span>View all projects</span>
                <span className="transition-transform duration-150 group-hover:translate-x-1 text-[#8E9BFF]">→</span>
              </Link>
            </div>

            <div className="divide-y divide-[#1F1F1F]">
              {selectedProjects.map((project, idx) => (
                <article
                  key={project.id}
                  className="py-14 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center group"
                >
                  {/* High Contrast Editorial Visual Frame */}
                  <div className="lg:col-span-7">
                    {project.coverImageUrl ? (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="w-full aspect-[16/10] border border-[#1F1F1F] bg-[#0A0A0A] overflow-hidden group-hover:border-[#2C3480] transition-colors relative block"
                      >
                        <Image
                          src={project.coverImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover grayscale contrast-[1.08] group-hover:scale-[1.025] transition-all duration-500 motion-reduce:group-hover:scale-100"
                          sizes="(max-width: 1024px) 100vw, 58vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                      </Link>
                    ) : (
                      <div className="w-full aspect-[16/10] border border-[#1F1F1F] bg-[#0A0A0A] flex items-center justify-center p-6 md:p-8">
                        <span className="font-mono text-xs text-[#666666]">
                          [Project visual]
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Details & Metadata */}
                  <div className="lg:col-span-5 space-y-5 lg:pl-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-[#8E9BFF] font-bold">
                        0{idx + 1}
                      </span>
                      {project.editionCode && (
                        <span className="font-mono text-xs text-[#8E9BFF] border-l border-[#222222] pl-3">
                          {project.editionCode}
                        </span>
                      )}
                      {project.category && (
                        <span className="font-mono text-xs uppercase tracking-wider text-[#888888] border-l border-[#222222] pl-3">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-white group-hover:text-[#8E9BFF] transition-colors duration-200">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>

                    <p className="font-sans text-sm md:text-base text-[#888888] leading-relaxed">
                      {project.summary}
                    </p>

                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border border-[#222222] text-[#AAAAAA] bg-[#0D0D0D]"
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
                        <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transform-none ml-1.5">
                          →
                        </span>
                      </Link>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-wider text-[#888888] hover:text-white transition-colors flex items-center gap-1"
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
      <section id="skills" className="w-full border-b border-[#E5E5E5] py-20 md:py-28 bg-white">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                  <SectionLabel name="Skills & Tech Stack" index="03 / TECHNICAL STACK" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#000000]">
                  Technical Stack
                </h2>
                <p className="font-sans text-sm text-[#555555] leading-relaxed">
                  Demonstrated technologies categorized by practical implementation evidence:
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 font-mono text-xs text-[#555555]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#2C3480] inline-block" />
                    <strong className="text-[#000000]">Core:</strong> Primary stack in shipped repositories
                  </span>
                  <span className="text-[#CCCCCC] select-none">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-[#555555] inline-block" />
                    <strong className="text-[#000000]">Working:</strong> Integrated in project features
                  </span>
                  <span className="text-[#CCCCCC] select-none">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 border border-[#888888] inline-block" />
                    <strong className="text-[#000000]">Exposure:</strong> Course simulation or exploratory
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <div
                    key={idx}
                    className="border border-[#E5E5E5] bg-white p-7 space-y-5 flex flex-col justify-between hover:border-[#2C3480] transition-colors"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-xl text-[#000000]">
                          {cat.title}
                        </h3>
                        <span className="font-mono text-xs text-[#2C3480] font-bold">
                          0{idx + 1}
                        </span>
                      </div>
                      <p className="font-sans text-xs text-[#555555] leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5E5E5] flex flex-wrap gap-2">
                      {cat.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 border border-[#E5E5E5] bg-[#F8F9FA] text-[#111111]"
                        >
                          {skill.icon && (
                            <Image
                              src={skill.icon}
                              alt=""
                              width={12}
                              height={12}
                              className="w-3 h-3 object-contain shrink-0 grayscale"
                            />
                          )}
                          <span>{skill.name}</span>
                          <span
                            className={`text-[9px] uppercase tracking-wider px-1 font-sans ${
                              skill.tier === "Core"
                                ? "text-[#2C3480] font-semibold"
                                : "text-[#777777]"
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
          5. WHAT I DO (Editorial Service Rows)
          ======================================================= */}
      <section id="services" className="w-full border-b border-[#E5E5E5] py-20 md:py-32 bg-white">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[#E5E5E5]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                    <SectionLabel name="Services & Disciplines" index="04 / SERVICES" />
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#000000]">
                    Services &amp; Capabilities
                  </h2>
                  <p className="font-mono text-xs text-[#2C3480] font-semibold uppercase tracking-wider">
                    Editorial engineering disciplines demonstrated through working code.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="font-mono text-xs uppercase tracking-wider text-[#000000] hover:text-[#2C3480] transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span>All Services</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* EDITORIAL SERVICE ROWS */}
              <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
                {SERVICES_CATALOG.map((srv) => (
                  <Link
                    key={srv.id}
                    href={`/contact?subject=${encodeURIComponent(srv.subject)}`}
                    className="group py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start md:items-center hover:bg-[#F8F9FA] transition-colors duration-200 px-4 -mx-4 block"
                  >
                    <div className="md:col-span-1 font-mono text-sm text-[#2C3480] font-bold">
                      {srv.code}
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#000000] group-hover:text-[#2C3480] transition-colors duration-200">
                        {srv.title}
                      </h3>
                      <span className="font-mono text-[11px] text-[#777777] uppercase tracking-wider block mt-1">
                        {srv.engagement}
                      </span>
                    </div>
                    <div className="md:col-span-6">
                      <p className="font-sans text-sm text-[#555555] leading-relaxed">
                        {srv.summary}
                      </p>
                    </div>
                    <div className="md:col-span-1 flex justify-start md:justify-end">
                      <span className="font-mono text-xl text-[#000000] group-hover:text-[#2C3480] group-hover:translate-x-2 transition-all duration-200 inline-block">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Distinction Banner: Custom Work vs Store Products */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 border border-[#E5E5E5] bg-[#F8F9FA]">
                <div className="space-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#2C3480] font-semibold block">
                    Custom Engineering vs Digital Resources
                  </span>
                  <p className="font-sans text-xs sm:text-sm text-[#555555] max-w-xl leading-relaxed">
                    Services are for custom development where you work with me directly. For downloadable architecture blueprints and developer resources, explore the Store.
                  </p>
                </div>
                <Link
                  href="/store"
                  className="font-mono text-xs uppercase tracking-wider px-5 py-3 border border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white transition-colors shrink-0 text-center"
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
      <section id="certifications" className="w-full border-b border-[#E5E5E5] py-20 md:py-28 bg-[#F8F9FA]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                  <SectionLabel name="Certifications" index="05 / CREDENTIALS" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#000000]">
                  Certifications &amp; Credentials
                </h2>
                <p className="font-mono text-xs text-[#2C3480] font-semibold uppercase tracking-wider">
                  Verified coursework, cloud credentials, and engineering job simulations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CERTIFICATIONS.map((cert) => (
                  <div
                    key={cert.id}
                    className="border border-[#E5E5E5] bg-white p-7 space-y-5 flex flex-col justify-between hover:border-[#2C3480] transition-colors group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#2C3480] font-bold uppercase tracking-wider">
                          VERIFIED
                        </span>
                        <span className="text-[#777777]">✓ Certificate</span>
                      </div>
                      <h3 className="font-display text-xl text-[#000000] group-hover:text-[#2C3480] transition-colors">
                        {cert.title}
                      </h3>
                      <p className="font-mono text-xs text-[#555555] font-medium">
                        {cert.issuer}
                      </p>
                      <p className="font-sans text-xs text-[#555555] leading-relaxed pt-1">
                        {cert.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E5E5E5]">
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs uppercase tracking-wider text-[#000000] hover:text-[#2C3480] transition-colors inline-flex items-center gap-1.5"
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
      <section id="store" className="w-full border-b border-[#E5E5E5] py-20 md:py-28 bg-white">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[#E5E5E5]">
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                    <SectionLabel name="Store & Templates" index="06 / STORE" />
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#000000]">
                    Digital Products
                  </h2>
                  <p className="font-mono text-xs text-[#2C3480] font-semibold uppercase tracking-wider">
                    Architectural blueprints, developer boilerplates, and templates.
                  </p>
                </div>
                <div className="lg:col-span-7 space-y-2">
                  <p className="font-sans text-sm sm:text-base text-[#555555] leading-relaxed max-w-xl">
                    Resources distilled from my own working systems. Strictly zero fabricated sales or fake reviews — published openly as they are finalized.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {DIGITAL_PRODUCTS_PREVIEWS.map((prod) => (
                  <div
                    key={prod.id}
                    className="border border-[#E5E5E5] bg-[#F8F9FA] p-7 space-y-5 flex flex-col justify-between hover:border-[#2C3480] transition-colors group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#2C3480] uppercase tracking-wider font-bold">
                          {prod.category.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono border ${
                            prod.status === "Case Study"
                              ? "border-[#2C3480] text-[#2C3480] bg-[#2C3480]/5"
                              : "border-[#E5E5E5] text-[#555555]"
                          }`}
                        >
                          {prod.status}
                        </span>
                      </div>

                      <h3 className="font-display text-xl text-[#000000] group-hover:text-[#2C3480] transition-colors">
                        {prod.title}
                      </h3>

                      <p className="font-sans text-xs text-[#555555] leading-relaxed">
                        {prod.summary}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {prod.tech.map((t, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] px-2 py-0.5 border border-[#E5E5E5] bg-white text-[#555555]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                      {prod.link ? (
                        <Link
                          href={prod.link}
                          className="font-mono text-xs uppercase tracking-wider text-[#000000] hover:text-[#2C3480] transition-colors inline-flex items-center gap-1.5"
                        >
                          <span>Explore Blueprint</span>
                          <span>→</span>
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-[#777777]">
                          Release Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E5E5]">
                <span className="font-mono text-xs text-[#555555]">
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
      <section id="focus" className="w-full border-b border-[#E5E5E5] py-20 md:py-28 bg-[#F8F9FA]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="space-y-12">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                  <SectionLabel name="Command Center" index="07 / FOCUS" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#000000]">
                  Current Focus &amp; Activity
                </h2>
                <p className="font-mono text-xs text-[#2C3480] font-semibold uppercase tracking-wider">
                  What I&apos;m building, exploring, and shipping right now.
                </p>
              </div>

              {/* 4 Focus Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {FOCUS_AREAS.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#E5E5E5] bg-white p-6 space-y-3 hover:border-[#2C3480] transition-colors"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#2C3480] font-bold block">
                      {item.category}
                    </span>
                    <h3 className="font-display text-xl text-[#000000]">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-[#555555] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* GitHub Activity & Mission Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border border-[#E5E5E5] bg-white p-8 md:p-10">
                <div className="md:col-span-5 space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#2C3480] font-bold block">
                    OPEN SOURCE ACTIVITY
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#000000]">
                    GitHub Engineering Hub
                  </h3>
                  <div className="space-y-2.5 font-mono text-xs text-[#555555]">
                    <div className="flex justify-between py-1.5 border-b border-[#E5E5E5]">
                      <span>GitHub:</span>
                      <span className="font-semibold text-[#000000]">@shivam-shukla888</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#E5E5E5]">
                      <span>Primary Stack:</span>
                      <span className="font-semibold text-[#000000]">Python, AI Agents, Java, SQL</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-[#E5E5E5]">
                      <span>Featured Work:</span>
                      <span className="font-semibold text-[#000000]">Yojna Setu, RealGuard, QuickEats</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a
                      href="https://github.com/shivam-shukla888"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider text-[#000000] hover:text-[#2C3480] transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>Explore GitHub Profile</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>

                <div className="md:col-span-7 space-y-4 md:border-l md:border-[#E5E5E5] md:pl-8 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#2C3480] font-bold block">
                      MISSION
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl text-[#000000]">
                      Practical Systems Over AI Demos
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-[#555555] leading-relaxed">
                      I believe language models must be coupled with deterministic application logic. Conversational LLMs interpret unstructured user intent, while deterministic code and relational models enforce validation, compliance, and authoritative calculations.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-[#E5E5E5]">
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
                      className="font-mono text-xs uppercase tracking-wider text-[#555555] hover:text-[#000000] transition-colors"
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
          9. CONTACT (Strategic Pure Black Section)
          ======================================================= */}
      <section id="contact" className="w-full bg-[#000000] text-white py-20 md:py-32 border-b border-[#1F1F1F]">
        <HomeSectionReveal>
          <SectionContainer>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#2C3480] inline-block" />
                  <SectionLabel name="Contact" index="08 / CONTACT" dark />
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
                  Get in Touch
                </h2>
                <p className="font-mono text-xs text-[#8E9BFF] font-semibold uppercase tracking-wider">
                  Direct inquiry for software engineering roles &amp; select projects.
                </p>
                <p className="font-sans text-sm text-[#888888] leading-relaxed max-w-md">
                  {profile.contactInstructions}
                </p>
                <div className="pt-2 space-y-3 font-mono text-xs text-[#888888]">
                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#8E9BFF] uppercase tracking-wider text-[11px] font-semibold">Email:</span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-white hover:text-[#8E9BFF] transition-colors underline underline-offset-4 break-all"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#8E9BFF] uppercase tracking-wider text-[11px] font-semibold">Phone:</span>
                      <a
                        href={`tel:${profile.phone}`}
                        className="text-white hover:text-[#8E9BFF] transition-colors underline underline-offset-4"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/resume"
                    className={buttonStyles({
                      variant: "dark-inverse",
                      size: "md",
                      className: "font-mono uppercase tracking-wider text-xs group",
                    })}
                  >
                    <span>Resume</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none ml-1.5">
                      →
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="font-mono text-xs uppercase tracking-wider px-4 py-2.5 border border-[#222222] text-[#888888] hover:text-white hover:border-[#444444] transition-colors"
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
