import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getPublishedLabEntries } from "@/lib/lab";

export const revalidate = 60;

export const metadata = {
  title: "Lab & Research Archive — ShivSastra | Shivam Shukla",
  description:
    "Experimental engineering laboratory, system prototypes, prompt injection research, and active sandboxes by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/lab",
  },
  openGraph: {
    title: "Lab & Research Archive — ShivSastra | Shivam Shukla",
    description:
      "Experimental engineering laboratory, system prototypes, prompt injection research, and active sandboxes by Shivam Shukla.",
    url: "https://shivsastra.vercel.app/lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab & Research Archive — ShivSastra | Shivam Shukla",
    description:
      "Experimental engineering laboratory, system prototypes, prompt injection research, and active sandboxes by Shivam Shukla.",
  },
};

export default async function LabPage() {
  const entries = await getPublishedLabEntries();

  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden bg-[var(--color-canvas-primary)]">
      <PageBackground
        src="/images/backgrounds/lab.webp"
        opacity={0.28}
        position="top"
      />
      <SectionContainer>
        <div className="space-y-16">
          {/* Header Block — Editorial Research Masthead */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <span className="uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                  /LAB // EXPERIMENTAL ARCHIVE
                </span>
                <span className="text-[var(--color-ink-secondary)]">
                  COORD: 28.3670°N, 79.4304°E [BAREILLY, UP]
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.05]">
                Engineering Laboratory &amp; Sandbox
              </h1>
              <p className="font-sans text-base md:text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
                A technical testing ground for prototype architectures, prompt-injection defense heuristics, and active agent experiments.
              </p>
            </div>
          </InnerPageEntrance>

          {/* Active Research Tracks (Bento Neo-Brutalist Layout) */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3 font-mono text-xs">
                <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                  ACTIVE RESEARCH TRACKS
                </span>
                <span className="text-[var(--color-ink-secondary)]">STATUS: IN PROGRESS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Track 01 */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-[var(--color-accent)] font-semibold">TRACK 01</span>
                      <span className="text-[var(--color-ink-secondary)]">SECURITY</span>
                    </div>
                    <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                      Prompt Injection Defense Heuristics
                    </h2>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Investigating multi-stage classification boundaries to sanitize unstructured user prompts before tool calling or database evaluation.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-hairline)] font-mono text-[10px] text-[var(--color-ink-secondary)]">
                    DISCIPLINE: AI SECURITY &amp; SANITIZATION
                  </div>
                </div>

                {/* Track 02 */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-[var(--color-accent)] font-semibold">TRACK 02</span>
                      <span className="text-[var(--color-ink-secondary)]">SYSTEMS</span>
                    </div>
                    <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                      WhatsApp Webhook Throughput &amp; State
                    </h2>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Benchmarking asynchronous FastAPI webhook receivers with session persistence for multi-turn citizen eligibility discovery.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-hairline)] font-mono text-[10px] text-[var(--color-ink-secondary)]">
                    DISCIPLINE: BACKEND &amp; AUTOMATION
                  </div>
                </div>

                {/* Track 03 */}
                <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-[var(--color-accent)] font-semibold">TRACK 03</span>
                      <span className="text-[var(--color-ink-secondary)]">COMPLIANCE</span>
                    </div>
                    <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                      Automated RERA Rule Verification
                    </h2>
                    <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                      Designing deterministic validation matrices for real estate compliance, checking regulatory registration numbers against local datasets.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[var(--color-hairline)] font-mono text-[10px] text-[var(--color-ink-secondary)]">
                    DISCIPLINE: DETERMINISTIC RULES ENGINE
                  </div>
                </div>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Published Catalog Entries */}
          <InnerPageEntrance delayIndex={2}>
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-3 font-mono text-xs">
                <span className="text-[var(--color-accent)] uppercase tracking-wider font-semibold">
                  PUBLISHED DOSSIERS &amp; ENTRIES
                </span>
                <span className="text-[var(--color-ink-secondary)]">COUNT: {entries.length}</span>
              </div>

              {entries.length === 0 ? (
                <div className="p-10 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-center space-y-2">
                  <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                    [NO ACTIVE DOSSIERS RELEASED PUBLICLY]
                  </div>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-md mx-auto leading-relaxed">
                    Prototypes and experiment writeups are released here as testing benchmarks achieve verifiable reproducibility.
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
                          className="inline-flex items-center gap-1.5 font-sans font-medium text-xs text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors"
                        >
                          <span>Inspect Entry</span>
                          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </InnerPageEntrance>

          {/* Navigation Return */}
          <InnerPageEntrance delayIndex={3}>
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
                  href="/store"
                  className="text-[var(--color-accent)] hover:underline"
                >
                  Explore Store Blueprints →
                </Link>
              </div>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
