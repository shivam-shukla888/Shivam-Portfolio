"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { num: "01", label: "Work", href: "/projects" },
  { num: "02", label: "About", href: "/about" },
  { num: "03", label: "Experience", href: "/experience" },
  { num: "04", label: "Lab", href: "/lab" },
  { num: "05", label: "Services", href: "/services" },
  { num: "06", label: "Store", href: "/store" },
  { num: "07", label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

  // Synchronize menu close on route change without useEffect setState
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Close on Escape key and return focus to toggle button; prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
          toggleButtonRef.current?.focus();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-canvas-primary)]/95 backdrop-blur-sm border-b border-[var(--color-hairline)]">
      <div className="w-full max-w-[1360px] mx-auto px-5 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        {/* Brand Anchor with Editorial Subtitle */}
        <Link
          href="/"
          className="flex items-center gap-3 font-sans text-sm tracking-tight text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] group"
        >
          <span className="font-semibold tracking-[0.04em] text-sm">SHIVSASTRA</span>
          <span className="hidden sm:inline font-mono text-[10px] tracking-widest text-[var(--color-ink-secondary)] group-hover:text-[var(--color-accent)] transition-colors border-l border-[var(--color-hairline)] pl-3">
            DIGITAL HQ // 2026
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-sans tracking-normal" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const isStore = link.label === "Store";
            const isLab = link.label === "Lab";
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "relative group py-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] flex items-center gap-1.5",
                  isActive
                    ? "text-[var(--color-ink-primary)] font-medium"
                    : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
                )}
              >
                <span className="font-mono text-[9px] text-[var(--color-ink-secondary)] opacity-60 group-hover:text-[var(--color-accent)] group-hover:opacity-100 transition-opacity">
                  {link.num}
                </span>
                <span className="relative">
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-[1.5px] transition-[width] duration-200 ease-out",
                      isActive ? "w-full bg-[var(--color-accent)]" : "w-0 group-hover:w-full bg-[var(--color-ink-primary)]"
                    )}
                  />
                </span>
                {isStore && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] inline-block shrink-0 transition-transform duration-200 group-hover:scale-125"
                    aria-label="Store Available"
                  />
                )}
                {isLab && (
                  <span className="font-mono text-[9px] px-1 py-0.2 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors">
                    EXP
                  </span>
                )}
              </Link>
            );
          })}

          <Link
            href="/resume"
            className="font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 border border-[var(--color-ink-primary)] text-[var(--color-ink-primary)] hover:bg-[var(--color-ink-primary)] hover:text-[var(--color-canvas-primary)] transition-colors ml-2"
          >
            Resume ↓
          </Link>
        </nav>

        {/* Mobile / Tablet Menu Toggle Button */}
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
        >
          <span className="font-mono text-[11px] uppercase tracking-wider">
            {isOpen ? "Close" : "Menu"}
          </span>
          <span
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              isOpen ? "bg-[var(--color-accent)]" : "bg-[var(--color-ink-primary)]"
            )}
          />
        </button>
      </div>

      {/* Mobile Full-Screen Editorial Menu */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 top-16 z-50 lg:hidden bg-[var(--color-canvas-primary)] border-t border-[var(--color-hairline)] flex flex-col justify-between p-6 sm:p-10 overflow-y-auto"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-hairline)]">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
                Index / Navigation
              </span>
              <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                SHIVSASTRA 2026
              </span>
            </div>

            <nav className="flex flex-col divide-y divide-[var(--color-hairline)]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="py-4 flex items-baseline justify-between group text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[var(--color-ink-secondary)] group-hover:text-[var(--color-accent)]">
                      {link.num}
                    </span>
                    <span className="font-display text-3xl sm:text-4xl font-normal tracking-tight">
                      {link.label}
                    </span>
                  </div>
                  <span className="font-mono text-sm text-[var(--color-ink-secondary)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-8 border-t border-[var(--color-hairline)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[var(--color-ink-secondary)]">
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/shivam-shukla888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-ink-primary)] underline"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/shivam-shukla-186276374/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-ink-primary)] underline"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://contra.com/shivam_shukla_7duxsdr7/work"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-ink-primary)] underline"
                >
                  Contra ↗
                </a>
              </div>
              <Link
                href="/resume"
                onClick={() => setIsOpen(false)}
                className="text-[var(--color-accent)] font-semibold"
              >
                Download Resume ↓
              </Link>
            </div>
            <p className="font-mono text-[10px] text-[var(--color-ink-secondary)]/70">
              AI Agents · AI Security · Deterministic Systems · Bareilly, India
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
