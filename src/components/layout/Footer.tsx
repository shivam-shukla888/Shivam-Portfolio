import React from "react";
import Link from "next/link";
import { SectionContainer } from "./SectionContainer";

export function Footer() {
  return (
    <footer className="w-full bg-[#000000] text-white border-t border-[#1F1F1F] pt-20 pb-12">
      <SectionContainer as="div">
        {/* Editorial Statement Block */}
        <div className="pb-16 border-b border-[#1F1F1F]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#8E9BFF] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-[#2C3480] inline-block shrink-0" />
                SHIVSASTRA / DIGITAL HEADQUARTERS
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.05]">
                Let&apos;s build<br />
                something<br />
                meaningful.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right space-y-3">
              <p className="font-sans text-sm text-[#888888] leading-relaxed max-w-sm lg:ml-auto">
                AI agents, AI security, deterministic systems, and digital products. Built with structure and intent.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C3480] text-white font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
              >
                <span>Initiate Inquiry</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Directory & Verified Profiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 py-16 border-b border-[#1F1F1F]">
          {/* Identity Colophon */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-display text-2xl font-normal text-white">
              SHIVAM SHUKLA
            </h3>
            <p className="font-mono text-xs uppercase tracking-wider text-[#888888]">
              AI Agent &amp; Security Builder
            </p>
            <p className="font-sans text-xs text-[#777777] max-w-xs leading-relaxed pt-1">
              Personal portfolio, engineering archive, and digital headquarters.
            </p>
          </div>

          {/* Navigation Directory */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-white font-semibold">
              Index
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#888888]">
              <li>
                <Link href="/" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Projects / Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/store" className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white">
                  Store &amp; Blueprints
                </Link>
              </li>
              <li>
                <Link href="/lab" className="hover:text-[#8E9BFF] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white flex items-center gap-1">
                  <span>Lab / Experiments</span>
                  <span className="text-[10px] text-[#8E9BFF]">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified External Profiles */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-white font-semibold">
              Verified Profiles
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#888888]">
              <li>
                <a
                  href="https://github.com/shivam-shukla888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>GitHub</span>
                  <span className="text-[10px] text-[#8E9BFF]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/shivam-shukla-186276374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>LinkedIn</span>
                  <span className="text-[10px] text-[#8E9BFF]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://contra.com/shivam_shukla_7duxsdr7/work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>Contra</span>
                  <span className="text-[10px] text-[#8E9BFF]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/shastra2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>X</span>
                  <span className="text-[10px] text-[#8E9BFF]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/shastra2003"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>Instagram</span>
                  <span className="text-[10px] text-[#8E9BFF]">↗</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Contact & Resume */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-white font-semibold">
              Direct
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#888888]">
              <li>
                <Link
                  href="/resume"
                  className="text-white hover:text-[#8E9BFF] transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <span>Resume</span>
                  <span className="text-[10px]">→</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  Contact Form
                </Link>
              </li>
              <li>
                <span className="font-mono text-[11px] text-[#666666] block pt-2">
                  Bareilly, UP, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono tracking-[0.06em] text-[#666666]">
          <p>© {new Date().getFullYear()} SHIVAM SHUKLA. SHIVSASTRA. All rights reserved.</p>
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
