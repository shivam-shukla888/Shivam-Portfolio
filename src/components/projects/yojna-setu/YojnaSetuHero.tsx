import React from "react";
import Link from "next/link";
import { YOJNA_SETU_DATA } from "@/data/projects/yojna-setu-data";
import { buttonStyles } from "@/components/ui/Button";

export function YojnaSetuHero() {
  const data = YOJNA_SETU_DATA;

  return (
    <header className="space-y-8 pb-12 border-b border-[var(--color-hairline)]">
      {/* Top Editorial Eyebrow Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans">
          <Link
            href="/projects"
            className="text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
          >
            Projects
          </Link>
          <span className="text-[var(--color-hairline)] select-none">/</span>
          <span className="text-[var(--color-accent)] font-medium">
            {data.title}
          </span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
            {data.editionCode}
          </span>
          <span className="font-mono text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
            {data.projectYear}
          </span>
          <span className="font-sans text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
            {data.category}
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.05]">
          Government Scheme Discovery with Deterministic Eligibility.
        </h1>
        <p className="font-sans text-lg md:text-xl text-[var(--color-ink-secondary)] leading-relaxed max-w-3xl">
          {data.summary}
        </p>
      </div>

      {/* Metadata Specification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-[var(--color-hairline)]">
        <div>
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
            ROLE
          </span>
          <p className="font-sans text-xs text-[var(--color-ink-primary)] leading-normal">
            {data.role}
          </p>
        </div>

        <div>
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
            STACK
          </span>
          <p className="font-mono text-xs text-[var(--color-ink-primary)] leading-normal">
            Java · Spring Boot · PostgreSQL · Groq
          </p>
        </div>

        <div>
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
            STATUS
          </span>
          <p className="font-mono text-xs text-[var(--color-accent)] font-medium leading-normal">
            Release Ready (Documented Conditions)
          </p>
        </div>

        <div>
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
            CHANNEL
          </span>
          <p className="font-sans text-xs text-[var(--color-ink-primary)] leading-normal">
            WhatsApp + Portfolio Demo
          </p>
        </div>
      </div>

      {/* Action Anchors */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <a
          href="#interactive-demo"
          className={buttonStyles({
            variant: "primary",
            size: "md",
            className: "font-mono text-xs uppercase tracking-wider",
          })}
        >
          Try Portfolio Demo ↓
        </a>
        <a
          href="#product-evidence"
          className={buttonStyles({
            variant: "secondary",
            size: "md",
            className: "font-mono text-xs uppercase tracking-wider",
          })}
        >
          View Real Evidence ↓
        </a>
        <a
          href={data.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] px-2 py-1"
        >
          <span>GitHub Source</span>
          <span className="text-[10px]">↗</span>
          <span className="font-mono text-[10px] text-[var(--color-ink-secondary)]/80">
            ({data.repoNote})
          </span>
        </a>
      </div>
    </header>
  );
}
