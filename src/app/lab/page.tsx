import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { getPublishedLabEntries } from "@/lib/lab";

export const revalidate = 60;

export const metadata = {
  title: "Personal Lab",
  description: "Isolated creative technology and experimental laboratory.",
  alternates: {
    canonical: "https://shivsastra.com/lab",
  },
  openGraph: {
    title: "Personal Lab — Shivam Shukla",
    description: "Isolated creative technology and experimental laboratory.",
    url: "https://shivsastra.com/lab",
    type: "website",
  },
};

export default async function LabPage() {
  const entries = await getPublishedLabEntries();

  return (
    <div className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      <SectionContainer>
        <div className="max-w-3xl space-y-10">
          {/* Header Block */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
              Personal Lab
            </h1>

            <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-2">
              <p className="font-sans text-sm text-[var(--color-ink-primary)] font-medium">
                Independent explorations & prototypes
              </p>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                A personal sandbox for experimental ideas, software builds, and technical thoughts authored by Shivam Shukla. Operates separately from client engagements.
              </p>
            </div>
          </div>

          {/* Catalog Entries or Editorial Placeholder */}
          {entries.length === 0 ? (
            <div className="p-8 border border-dashed border-[var(--color-hairline)] text-center space-y-1">
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                [Personal lab artifacts pending]
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)]">
              {entries.map((entry) => (
                <article key={entry.id} className="py-8 space-y-4 group">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-accent)] uppercase tracking-[0.12em] font-semibold">
                        {entry.category}
                      </span>
                      <span className="text-[var(--color-hairline)]">•</span>
                      <span className="text-[var(--color-ink-secondary)] uppercase tracking-[0.08em]">
                        {entry.status}
                      </span>
                    </div>
                    {entry.publishedAt && (
                      <time
                        dateTime={entry.publishedAt}
                        className="text-[var(--color-ink-secondary)]"
                      >
                        {new Date(entry.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                    <Link href={`/lab/${entry.slug}`} className="block">
                      {entry.title}
                    </Link>
                  </h2>

                  {entry.contentMarkdown && (
                    <p className="font-sans text-sm text-[var(--color-ink-secondary)] line-clamp-3 leading-relaxed">
                      {entry.contentMarkdown.split("\n\n")[0].replace(/^#+\s*/, "")}
                    </p>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <Link
                      href={`/lab/${entry.slug}`}
                      className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                    >
                      <span>Read Entry</span>
                      <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Navigation Return */}
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <span>← Back to Home</span>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
