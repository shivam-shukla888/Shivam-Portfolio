import React from "react";
import Link from "next/link";
import { SectionContainer } from "./SectionContainer";

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-surface-dark)] text-white border-t border-[var(--color-dark-hairline)] pt-16 pb-12">
      <SectionContainer as="div">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[var(--color-dark-hairline)]">
          {/* Brand & Colophon Statement */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="font-display text-3xl font-normal tracking-tight text-white">
              SHIVAM SHUKLA
            </h2>
            <p className="font-sans text-xs tracking-[0.04em] text-[var(--color-dark-ink-secondary)]">
              Developer & Creator
            </p>
            <p className="text-sm text-[var(--color-dark-ink-secondary)] max-w-sm leading-relaxed font-sans pt-2">
              Backend systems, AI agents, and software security. Building projects and digital tools in public.
            </p>
          </div>

          {/* Navigation Directory */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-[0.08em] text-white/90 font-medium">
              Index
            </h3>
            <ul className="space-y-2 text-xs font-sans text-[var(--color-dark-ink-secondary)]">
              <li>
                <Link href="/" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Store
                </Link>
                <ul className="pl-2 pt-1 space-y-1 text-[11px] text-[var(--color-dark-ink-secondary)]/80">
                  <li>
                    <Link href="/store/design" className="hover:text-white transition-colors">
                      Design & Templates
                    </Link>
                  </li>
                  <li>
                    <Link href="/store/ai-agents" className="hover:text-white transition-colors">
                      AI Agents
                    </Link>
                  </li>
                  <li>
                    <Link href="/store/digital-products" className="hover:text-white transition-colors">
                      Digital Products
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified Profiles */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-[0.08em] text-white/90 font-medium">
              Profiles
            </h3>
            <ul className="space-y-2 text-xs font-sans text-[var(--color-dark-ink-secondary)]">
              <li>
                <a
                  href="https://contra.com/shivam_shukla_7duxsdr7/work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>Contra</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/shivam-shukla-186276374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>LinkedIn</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/shivam-shukla888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>GitHub</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/shastra2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>Instagram</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/shastra2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>X</span>
                  <span className="text-[10px] text-[var(--color-accent)]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Explorations & Sandbox */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-[0.08em] text-white/90 font-medium">
              Lab
            </h3>
            <ul className="space-y-2 text-xs font-sans text-[var(--color-dark-ink-secondary)]">
              <li>
                <Link
                  href="/lab"
                  className="text-[var(--color-accent)] hover:underline flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>Lab</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <span className="text-xs text-[var(--color-dark-ink-secondary)]/70">
                  Experiments & prototypes
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono tracking-[0.08em] text-[var(--color-dark-ink-secondary)]">
          <p>© {new Date().getFullYear()} SHIVAM SHUKLA. All rights reserved.</p>
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
