import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getPublishedProjects } from "@/lib/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects — Shivam Shukla",
  description:
    "Software projects, systems, and engineering builds by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.com/projects",
  },
  openGraph: {
    title: "Projects — Shivam Shukla",
    description:
      "Software projects, systems, and engineering builds by Shivam Shukla.",
    url: "https://shivsastra.com/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Shivam Shukla",
    description:
      "Software projects, systems, and engineering builds by Shivam Shukla.",
  },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/projects.webp"
        opacity={0.25}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-12">
          {/* Header Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-3 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Work Archive
                </span>
                <Link
                  href="/services"
                  className="font-mono text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1"
                >
                  <span>Looking to work together? View Services</span>
                  <span>→</span>
                </Link>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Projects
              </h1>
              <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                Selected software builds and projects across backend systems, AI agents, and security.
              </p>
            </div>
          </InnerPageEntrance>

          {/* Projects List or Refined Editorial Empty State */}
          <InnerPageEntrance delayIndex={1}>
            <div className="divide-y divide-[var(--color-hairline)]">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-6">
                    {project.coverImageUrl ? (
                      <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden relative">
                        <Image
                          src={project.coverImageUrl}
                          alt={project.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center justify-center p-6">
                        <span className="font-sans text-xs text-[var(--color-ink-secondary)]">
                          [Project visual pending]
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {project.editionCode && (
                        <span className="font-mono text-xs text-[var(--color-accent)]">
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
                    <h2 className="font-display text-2xl md:text-3xl font-normal text-[var(--color-ink-primary)]">
                      {project.title}
                    </h2>
                    <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                      {project.summary}
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
                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                      >
                        <span>View Case Study</span>
                        <span className="transition-transform duration-150 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                        >
                          Live site ↗
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                        >
                          Source code ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Refined Editorial Empty State (Zero Fake Cards) */
              <div className="py-20 md:py-28 text-center space-y-6">
                <div className="space-y-3 max-w-xl mx-auto">
                  <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                    I&apos;m adding projects here as I finish and publish them.
                  </h2>
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    Code, case studies, and writeups for my current and past builds will be posted here.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/store"
                    className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] transition-colors"
                  >
                    Visit the Store →
                  </Link>
                  <Link
                    href="/contact"
                    className="font-mono text-xs uppercase tracking-wider px-5 py-2.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-primary)] hover:text-[var(--color-ink-primary)] transition-colors"
                  >
                    Get in Touch →
                  </Link>
                </div>
              </div>
            )}
            </div>
          </InnerPageEntrance>

          {/* Navigation Footer */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-6 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="inline-flex items-center gap-1 hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                <span>← Back to Home</span>
              </Link>
              <div className="flex items-center gap-4">
                <span>EXPLORE:</span>
                <Link
                  href="/services"
                  className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
                >
                  View Services →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
