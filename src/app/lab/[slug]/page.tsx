import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { getPublishedLabEntryBySlug } from "@/lib/lab";

export const revalidate = 60;

interface LabDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: LabDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublishedLabEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Entry Not Found | Personal Lab",
    };
  }

  const snippet = entry.contentMarkdown
    ? entry.contentMarkdown.split("\n\n")[0].replace(/^#+\s*/, "").slice(0, 160)
    : undefined;

  return {
    title: `${entry.title} | Personal Lab — SHIVSASTRA`,
    description: snippet,
  };
}

/**
 * Safely renders markdown text with native React text-node escaping.
 * Splits on paragraph breaks and preserves line-breaks and semantic blocks.
 */
function SafeMarkdownRenderer({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        if (block.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="font-display text-xl font-normal text-[var(--color-ink-primary)] pt-4"
            >
              {block.replace(/^###\s+/, "")}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="font-display text-2xl font-normal text-[var(--color-ink-primary)] pt-6"
            >
              {block.replace(/^##\s+/, "")}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2
              key={idx}
              className="font-display text-3xl font-normal text-[var(--color-ink-primary)] pt-6"
            >
              {block.replace(/^#\s+/, "")}
            </h2>
          );
        }
        if (block.startsWith("- ") || block.startsWith("* ")) {
          const items = block
            .split("\n")
            .map((item) => item.replace(/^[-*]\s+/, "").trim())
            .filter(Boolean);
          return (
            <ul
              key={idx}
              className="list-disc list-inside space-y-2 text-[var(--color-ink-secondary)] font-sans text-base leading-relaxed pl-2"
            >
              {items.map((item, itemIdx) => (
                <li key={itemIdx}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p
            key={idx}
            className="font-sans text-base md:text-lg text-[var(--color-ink-secondary)] leading-relaxed whitespace-pre-wrap"
          >
            {block}
          </p>
        );
      })}
    </div>
  );
}

export default async function LabDetailPage({ params }: LabDetailPageProps) {
  const { slug } = await params;
  const entry = await getPublishedLabEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  return (
    <article className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      <SectionContainer>
        <div className="space-y-12 max-w-3xl mx-auto">
          {/* Header Metadata Block */}
          <div className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans">
                <Link
                  href="/lab"
                  className="text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
                >
                  Personal Lab
                </Link>
                <span className="text-[var(--color-hairline)] select-none">/</span>
                <span className="text-[var(--color-accent)] font-medium capitalize">
                  {entry.category}
                </span>
              </nav>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs uppercase text-[var(--color-ink-secondary)]">
                  {entry.status}
                </span>
                {entry.publishedAt && (
                  <span className="font-mono text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
                    {new Date(entry.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
              {entry.title}
            </h1>

            {/* Tags Badges */}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs uppercase tracking-wider px-3 py-1 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] bg-[var(--color-canvas-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Entry Content */}
          {entry.contentMarkdown ? (
            <section className="space-y-6 pt-2">
              <SafeMarkdownRenderer content={entry.contentMarkdown} />
            </section>
          ) : (
            <div className="p-8 border border-dashed border-[var(--color-hairline)] text-center space-y-1">
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                [Content pending]
              </p>
            </div>
          )}

          {/* Navigation Return */}
          <div className="pt-8 border-t border-[var(--color-hairline)] flex justify-between items-center">
            <Link
              href="/lab"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              <span>← Back to Personal Lab</span>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </article>
  );
}
