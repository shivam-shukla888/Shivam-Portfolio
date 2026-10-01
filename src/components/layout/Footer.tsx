import React from "react";
import Link from "next/link";
import { SectionContainer } from "./SectionContainer";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface-dark)] text-white border-t border-[var(--color-dark-hairline)] pt-20 pb-12 overflow-hidden">
      <SectionContainer as="div">
        {/* Editorial Colophon Header */}
        <div className="pb-16 border-b border-[var(--color-dark-hairline)]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold">
                COLOPHON // DIGITAL HEADQUARTERS
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-[1.08]">
                Building systems with structure, security &amp; intent.
              </h2>
            </div>
            <div className="font-mono text-xs text-[var(--color-dark-ink-secondary)] space-y-1 lg:text-right">
              <div>LOCATION: BAREILLY, INDIA [UTC+05:30]</div>
              <div>STACK: PYTHON · JAVA · SPRING BOOT · AI AGENTS</div>
              <div>DISCIPLINE: DETERMINISTIC CODE OVER AI DEMOS</div>
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 py-16 border-b border-[var(--color-dark-hairline)] text-xs font-sans">
          {/* Index Column */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
              <span>01</span>
              <span>INDEX</span>
            </div>
            <ul className="space-y-2.5 text-[var(--color-dark-ink-secondary)]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Selected Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Shivam
                </Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-white transition-colors">
                  Experience &amp; Timeline
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services &amp; Capabilities
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-white transition-colors">
                  Store &amp; Blueprints
                </Link>
              </li>
              <li>
                <Link href="/lab" className="hover:text-white transition-colors">
                  Lab / Research Archive
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Profiles */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
              <span>02</span>
              <span>VERIFIED PROFILES</span>
            </div>
            <ul className="space-y-2.5 text-[var(--color-dark-ink-secondary)]">
              <li>
                <a
                  href="https://github.com/shivam-shukla888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/shivam-shukla-186276374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>LinkedIn</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://contra.com/shivam_shukla_7duxsdr7/work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Contra Work</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/shastra2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>X (Twitter)</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/shastra2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <Link
                  href="/resume"
                  className="text-[var(--color-accent)] hover:text-white transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <span>Resume (Download)</span>
                  <span className="text-[10px]">↓</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Shipped Systems */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
              <span>03</span>
              <span>SYSTEMS ARCHIVE</span>
            </div>
            <ul className="space-y-2.5 text-[var(--color-dark-ink-secondary)]">
              <li>
                <Link href="/projects/yojna-setu" className="hover:text-white transition-colors">
                  Yojna Setu (Citizen Scheme AI)
                </Link>
              </li>
              <li>
                <Link href="/projects/realguard" className="hover:text-white transition-colors">
                  RealGuard (WhatsApp Real Estate)
                </Link>
              </li>
              <li>
                <Link href="/projects/quickeats" className="hover:text-white transition-colors">
                  QuickEats (Backend &amp; Security)
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-white transition-colors">
                  Store Blueprints &amp; Templates
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Philosophy */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-semibold flex items-center gap-2">
              <span>04</span>
              <span>STANDARDS</span>
            </div>
            <p className="text-xs text-[var(--color-dark-ink-secondary)] leading-relaxed">
              Every system presented is supported by working source code. Zero fabricated reviews, zero inflated metrics, and zero simulated revenue.
            </p>
            <div className="pt-2">
              <span className="font-mono text-[10px] px-2 py-1 border border-[var(--color-dark-hairline)] text-[var(--color-accent)] inline-block">
                AUTHENTIC EVIDENCE VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Oversized Typographic Masthead */}
        <div className="py-12 border-b border-[var(--color-dark-hairline)] overflow-hidden select-none">
          <div className="font-display text-[15vw] leading-[0.85] font-normal tracking-tighter text-white/[0.07] hover:text-white/[0.12] transition-colors whitespace-nowrap">
            SHIVSASTRA
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono tracking-[0.08em] text-[var(--color-dark-ink-secondary)]">
          <p>© {new Date().getFullYear()} SHIVAM SHUKLA. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Terms of Service
            </Link>
            <Link
              href="/refunds"
              className="hover:text-white transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
}
