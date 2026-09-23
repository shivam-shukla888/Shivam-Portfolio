import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { buttonStyles } from "@/components/ui/Button";
import { getPublishedProjectBySlug } from "@/lib/projects";

export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Projects & Case Studies`,
    description: project.summary || undefined,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} — Shivam Shukla`,
      description: project.summary || undefined,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <article className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      <SectionContainer>
        <div className="space-y-16 max-w-4xl mx-auto">
          {/* Header Metadata Block */}
          <div className="space-y-6 pb-10 border-b border-[var(--color-hairline)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans">
                <Link
                  href="/projects"
                  className="text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  Projects
                </Link>
                <span className="text-[var(--color-hairline)] select-none">/</span>
                <span className="text-[var(--color-accent)] font-medium truncate max-w-[240px]">
                  {project.title}
                </span>
              </nav>
              <div className="flex flex-wrap items-center gap-3">
                {project.editionCode && (
                  <span className="font-mono text-xs text-[var(--color-accent)] uppercase tracking-wider">
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
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
              {project.title}
            </h1>

            {project.summary && (
              <p className="font-sans text-lg md:text-xl text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                {project.summary}
              </p>
            )}

            {/* External Links Bar (Strictly Conditional) */}
            {(project.liveUrl || project.githubUrl) && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({
                      variant: "primary",
                      size: "md",
                    })}
                  >
                    Visit Live Site ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({
                      variant: "secondary",
                      size: "md",
                    })}
                  >
                    View Source Code ↗
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Visual Frame */}
          <div className="w-full">
            {project.coverImageUrl ? (
              <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden relative">
                <Image
                  src={project.coverImageUrl}
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            ) : (
              <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center justify-center p-8">
                <span className="font-sans text-xs text-[var(--color-ink-secondary)]">
                  [Project visual pending]
                </span>
              </div>
            )}
          </div>

          {/* Technical Stack (Strictly Conditional) */}
          {project.techStack.length > 0 && (
            <div className="space-y-4 py-8 border-y border-[var(--color-hairline)]">
              <span className="font-sans text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] font-medium">
                Technologies
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs uppercase tracking-wider px-3 py-1 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] bg-[var(--color-canvas-secondary)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Case Study Content (Strictly Conditional) */}
          {project.caseStudyMarkdown && (
            <section className="space-y-6 pt-4">
              <span className="font-sans text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] font-medium">
                Case Study & Architecture
              </span>
              <div className="font-sans text-base md:text-lg text-[var(--color-ink-primary)] leading-relaxed whitespace-pre-wrap">
                {project.caseStudyMarkdown}
              </div>
            </section>
          )}

          {/* Contact Inquiry CTA Banner */}
          <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-normal text-[var(--color-ink-primary)]">
                Have questions about this architecture?
              </h2>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-lg leading-relaxed">
                Reach out to discuss technical decisions, system design patterns, or bespoke implementation requirements.
              </p>
            </div>
            <Link
              href={`/contact?subject=${encodeURIComponent(`Project Inquiry: ${project.title}`)}`}
              className={buttonStyles({
                variant: "primary",
                size: "md",
                className: "shrink-0",
              })}
            >
              Discuss a Project →
            </Link>
          </div>

          {/* Navigation Footer */}
          <div className="pt-8 border-t border-[var(--color-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <span>← Back to Projects</span>
            </Link>
            <div className="flex items-center gap-2">
              <span>EXPLORE SERVICES:</span>
              <Link
                href="/services"
                className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors underline underline-offset-4"
              >
                Services & Advisory →
              </Link>
            </div>
          </div>
        </div>
      </SectionContainer>
    </article>
  );
}
