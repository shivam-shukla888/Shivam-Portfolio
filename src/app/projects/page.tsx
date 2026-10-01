import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getPublishedProjects } from "@/lib/projects";
import { buttonStyles } from "@/components/ui/Button";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Systems Archive & Case Studies — ShivSastra | Shivam Shukla",
  description:
    "Verified software systems, AI agents, deterministic welfare engines, and security audits by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/projects",
  },
  openGraph: {
    title: "Systems Archive & Case Studies — ShivSastra | Shivam Shukla",
    description:
      "Verified software systems, AI agents, deterministic welfare engines, and security audits by Shivam Shukla.",
    url: "https://shivsastra.vercel.app/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Systems Archive & Case Studies — ShivSastra | Shivam Shukla",
    description:
      "Verified software systems, AI agents, deterministic welfare engines, and security audits by Shivam Shukla.",
  },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-[var(--color-canvas-primary)]">
      <PageBackground
        src="/images/backgrounds/projects.webp"
        opacity={0.3}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-16">
          {/* Editorial Header Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-10 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <span className="uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                  01 // SYSTEMS ARCHIVE
                </span>
                <span className="text-[var(--color-ink-secondary)]">
                  TOTAL DOCUMENTED: {projects.length} CASE STUDIES
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.05]">
                Engineering Case Studies
              </h1>
              <p className="font-sans text-base md:text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                Each project represents a production-grade problem: separating semantic intent from deterministic backend rules, mitigating security vulnerabilities, or orchestrating multi-channel automation.
              </p>
            </div>
          </InnerPageEntrance>

          {/* Alternating Rhythmic Editorial Case Studies */}
          <InnerPageEntrance delayIndex={1}>
            <div className="divide-y divide-[var(--color-hairline)]">
              {projects.length > 0 ? (
                projects.map((project, idx) => {
                  const num = String(idx + 1).padStart(2, "0");
                  const isEven = idx % 2 === 1;

                  return (
                    <article
                      key={project.id}
                      className="py-16 md:py-24 space-y-8"
                    >
                      {/* Project Masthead Meta */}
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-[var(--color-hairline)]/60 pb-6">
                        <div className="flex items-baseline gap-5">
                          <span className="font-mono text-4xl sm:text-5xl text-[var(--color-accent)] font-bold">
                            {num}
                          </span>
                          <div>
                            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-ink-secondary)] block">
                              {project.category || "SYSTEM ARCHITECTURE"}
                            </span>
                            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors">
                              <Link href={`/projects/${project.slug}`}>
                                {project.title}
                              </Link>
                            </h2>
                          </div>
                        </div>

                        <div className="font-mono text-xs text-[var(--color-ink-secondary)] flex items-center gap-3">
                          {project.projectYear && <span>{project.projectYear}</span>}
                          {project.editionCode && (
                            <>
                              <span>·</span>
                              <span className="text-[var(--color-accent)] font-semibold">
                                {project.editionCode}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Asymmetric Alternating Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                        {/* Visual Column */}
                        <div className={`lg:col-span-7 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                          <Link
                            href={`/projects/${project.slug}`}
                            className="relative block w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden group"
                          >
                            {project.coverImageUrl ? (
                              <Image
                                src={project.coverImageUrl}
                                alt={project.title}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-[1.015] transition-transform duration-300"
                                sizes="(max-width: 1024px) 100vw, 58vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center p-8 font-mono text-xs text-[var(--color-ink-secondary)]">
                                [VISUAL ARCHIVE PENDING]
                              </div>
                            )}
                          </Link>
                        </div>

                        {/* Narrative & Specification Column */}
                        <div
                          className={`lg:col-span-5 flex flex-col justify-between border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-6 ${
                            isEven ? "lg:order-1" : "lg:order-2"
                          }`}
                        >
                          <div className="space-y-4">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                              SYSTEM ABSTRACT
                            </span>
                            <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                              {project.summary}
                            </p>

                            {project.techStack.length > 0 && (
                              <div className="space-y-2 pt-3 border-t border-[var(--color-hairline)]">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] font-semibold block">
                                  Technology Stack
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {project.techStack.map((tech) => (
                                    <span
                                      key={tech}
                                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)]"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-4 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-4">
                            <Link
                              href={`/projects/${project.slug}`}
                              className={buttonStyles({
                                variant: "primary",
                                size: "sm",
                                className: "font-mono uppercase tracking-wider text-xs",
                              })}
                            >
                              Explore Case Study →
                            </Link>

                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors inline-flex items-center gap-1"
                              >
                                <span>Source</span>
                                <span>↗</span>
                              </a>
                            )}

                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
                              >
                                <span>Live Demo</span>
                                <span>↗</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="py-24 text-center space-y-4">
                  <h2 className="font-display text-3xl text-[var(--color-ink-primary)]">
                    Case studies are being compiled.
                  </h2>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
                    Verified implementations will appear here as documentation is finalized.
                  </p>
                </div>
              )}
            </div>
          </InnerPageEntrance>

          {/* Navigation Footer */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-8 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink-primary)] transition-colors"
              >
                <span>← Return to Headquarters</span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/services"
                  className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  Services &amp; Engagements →
                </Link>
                <Link
                  href="/lab"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Open Research Lab →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
