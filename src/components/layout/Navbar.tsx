"use client";

import React, { useState, useEffect } from "react";
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
  const toggleButtonRef = React.useRef<HTMLButtonElement>(null);

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
                  "relative group py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] flex items-center gap-1.5",
                  isStore
                    ? "text-[var(--color-ink-primary)] font-medium hover:text-[var(--color-accent)]"
                    : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
                )}
              >
                <span className="relative">
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 w-0 h-[1px] transition-[width] duration-200 ease-out group-hover:w-full motion-reduce:transition-none",
                      isStore
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-ink-primary)]"
                    )}
                  />
                </span>
                {isStore && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] inline-block shrink-0 transition-transform duration-200 group-hover:scale-125 motion-reduce:group-hover:scale-100"
                    aria-label="Store"
                  />
                )}
              </Link>
            );
          })}

          {/* Discrete Secondary Lab Link */}
          <Link
            href="/lab"
            className="text-xs font-sans px-2.5 py-1 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-primary)] hover:text-[var(--color-ink-primary)] transition-[border-color,color,transform] duration-150 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            title="Lab"
          >
            Lab
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          ref={toggleButtonRef}
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

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/20 z-40 md:hidden"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          <nav
            id="mobile-navigation-menu"
            aria-label="Mobile Navigation"
            className="relative z-50 md:hidden border-t border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] px-5 py-6 flex flex-col gap-4 shadow-sm"
        >
          {NAV_LINKS.map((link) => {
            const isStore = link.label === "Store";
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-sm font-sans font-medium transition-colors py-2 min-h-[44px] border-b border-[var(--color-hairline)] flex items-center justify-between",
                  isStore
                    ? "text-[var(--color-ink-primary)] font-semibold"
                    : "text-[var(--color-ink-primary)] hover:text-[var(--color-accent)]"
                )}
              >
                <span>{link.label}</span>
              </Link>
            );
          })}
          <Link
            href="/lab"
            onClick={() => setIsOpen(false)}
            className="text-xs font-sans text-[var(--color-accent)] font-medium py-2 min-h-[44px] flex items-center"
          >
            Lab →
          </Link>
        </nav>
        </>
      )}
    </header>
  );
}
