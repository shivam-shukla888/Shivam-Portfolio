import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { getPublishedLabEntries } from "@/lib/lab";

export const revalidate = 60;

export const metadata = {
  title: "Lab — Shivam Shukla",
  description: "Personal sandbox for experimental ideas, software builds, and technical notes.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/lab",
  },
  openGraph: {
    title: "Lab — Shivam Shukla",
    description: "Personal sandbox for experimental ideas, software builds, and technical notes.",
    url: "https://shivsastra.vercel.app/lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lab — Shivam Shukla",
    description: "Personal sandbox for experimental ideas, software builds, and technical notes.",
  },
};

export default async function LabPage() {
  const entries = await getPublishedLabEntries();

  return (
    <div className="relative w-full min-h-screen bg-[#000000] text-white pt-16 md:pt-24 pb-20 md:pb-32 overflow-hidden border-b border-[#1F1F1F]">
      {/* Subtle Technical Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(to right, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <SectionContainer>
        <div className="max-w-4xl space-y-12 relative z-10">
          {/* Header Block with Technical Markers */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-6 pb-8 border-b border-[#1F1F1F]">
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 bg-[#2C3480] inline-block animate-pulse" />
                  <span className="text-[#8E9BFF] font-semibold tracking-wider">
                    /LAB — EXPERIMENTAL SANDBOX
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[#888888]">
                  <span>EXPERIMENTS</span>
                  <span>·</span>
                  <span>SYSTEMS</span>
                  <span>·</span>
                  <span>SECURITY</span>
                </div>
              </div>

              <h1 className="font-display text-5xl sm:text-6xl font-normal tracking-tight text-white leading-tight">
                Laboratory
              </h1>

              <div className="p-6 md:p-8 border border-[#1F1F1F] bg-[#0A0A0A] space-y-3 relative">
                <div className="w-1 h-8 bg-[#2C3480] absolute left-0 top-6" />
                <span className="font-mono text-xs uppercase tracking-wider text-[#8E9BFF] font-semibold block">
                  TECHNICAL SCOPE
                </span>
                <p className="font-sans text-sm md:text-base text-[#CCCCCC] leading-relaxed">
                  A personal laboratory for experimental ideas, exploratory software builds, and technical notes spanning AI tool-calling, security guardrails, and deterministic backend pipelines.
                </p>
              </div>
            </div>
          </InnerPageEntrance>

          {/* Catalog Entries or Editorial State */}
          <InnerPageEntrance delayIndex={1}>
            <div>
              {entries.length === 0 ? (
                <div className="p-12 border border-[#1F1F1F] bg-[#0A0A0A] text-center space-y-3">
                  <div className="flex justify-center">
                    <span className="w-2 h-2 bg-[#2C3480] inline-block" />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#8E9BFF]">
                    ACTIVE REPOSITORIES IN INCUBATION
                  </p>
                  <p className="font-sans text-xs text-[#888888] max-w-md mx-auto leading-relaxed">
                    Live research notes, architecture evaluations, and agent prototypes will be indexed here as they reach public documentation milestones.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1F1F1F] border-y border-[#1F1F1F]">
                  {entries.map((entry) => (
                    <article key={entry.id} className="py-10 space-y-5 group">
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-[#8E9BFF] uppercase tracking-wider font-semibold">
                            {entry.category}
                          </span>
                          <span className="text-[#333333]">/</span>
                          <span className="text-[#888888] uppercase tracking-wider">
                            {entry.status}
                          </span>
                        </div>
                        {entry.publishedAt && (
                          <time
                            dateTime={entry.publishedAt}
                            className="text-[#666666]"
                          >
                            {new Date(entry.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        )}
                      </div>

                      <h2 className="font-display text-2xl sm:text-3xl text-white group-hover:text-[#8E9BFF] transition-colors">
                        <Link href={`/lab/${entry.slug}`} className="block">
                          {entry.title}
                        </Link>
                      </h2>

                      {entry.contentMarkdown && (
                        <p className="font-sans text-sm text-[#888888] line-clamp-3 leading-relaxed">
                          {entry.contentMarkdown.split("\n\n")[0].replace(/^#+\s*/, "")}
                        </p>
                      )}

                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-[#1F1F1F] text-[#888888] bg-[#0A0A0A]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="pt-2">
                        <Link
                          href={`/lab/${entry.slug}`}
                          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-white group-hover:text-[#8E9BFF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                        >
                          <span>Read Entry</span>
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
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-4 border-t border-[#1F1F1F]">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#888888] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                <span>← Back to Home</span>
              </Link>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
