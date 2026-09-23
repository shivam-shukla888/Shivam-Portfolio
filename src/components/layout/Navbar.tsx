"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-canvas-primary)]/90 backdrop-blur-md border-b border-[var(--color-hairline)]">
      <div className="w-full max-w-[1360px] mx-auto px-5 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        {/* Brand Anchor */}
        <Link
          href="/"
          className="flex items-center gap-3 font-sans text-sm tracking-tight text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
        >
          <span className="font-semibold tracking-[0.02em]">SHIVSASTRA</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-sans tracking-normal">
          {NAV_LINKS.map((link) => {
            const isStore = link.label === "Store";
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "transition-colors duration-150 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] flex items-center gap-1.5",
                  isStore
                    ? "text-[var(--color-ink-primary)] font-medium hover:text-[var(--color-accent)]"
                    : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
                )}
              >
                <span>{link.label}</span>
                {isStore && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] inline-block shrink-0"
                    aria-label="Studio Store"
                  />
                )}
              </Link>
            );
          })}

          {/* Discrete Secondary Lab Link */}
          <Link
            href="/lab"
            className="text-xs font-sans px-2.5 py-1 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-primary)] hover:text-[var(--color-ink-primary)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            title="Personal Lab"
          >
            Lab
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-menu"
          aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
        >
          <span
            className={cn(
              "w-5 h-[1.5px] bg-[var(--color-ink-primary)] transition-transform duration-150",
              isOpen && "rotate-45 translate-y-[3px]"
            )}
          />
          <span
            className={cn(
              "w-5 h-[1.5px] bg-[var(--color-ink-primary)] mt-1.5 transition-transform duration-150",
              isOpen && "-rotate-45 -translate-y-[4px]"
            )}
          />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Mobile Navigation"
          className="md:hidden border-t border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] px-5 py-6 flex flex-col gap-4"
        >
          {NAV_LINKS.map((link) => {
            const isStore = link.label === "Store";
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-sm font-sans font-medium transition-colors py-2 border-b border-[var(--color-hairline)] flex items-center justify-between",
                  isStore
                    ? "text-[var(--color-ink-primary)] font-semibold"
                    : "text-[var(--color-ink-primary)] hover:text-[var(--color-accent)]"
                )}
              >
                <span>{link.label}</span>
                {isStore && (
                  <span className="text-[10px] font-mono text-[var(--color-accent)] uppercase tracking-wider">
                    Digital Studio
                  </span>
                )}
              </Link>
            );
          })}
          <Link
            href="/lab"
            onClick={() => setIsOpen(false)}
            className="text-xs font-sans text-[var(--color-accent)] font-medium py-2"
          >
            Personal Lab →
          </Link>
        </nav>
      )}
    </header>
  );
}
