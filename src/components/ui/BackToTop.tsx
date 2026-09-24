"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Editorial Back-To-Top Control
 * Rendered selectively on long-form public pages.
 * Positioned on bottom-left to avoid colliding with the bottom-right AI Assistant.
 * Uses native smooth scroll with instant fallback for prefers-reduced-motion.
 */
export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > 500);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const scrollToTop = () => {
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: isReducedMotion ? "auto" : "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className={cn(
        "fixed bottom-5 left-5 sm:bottom-8 sm:left-8 z-40",
        "h-10 px-3.5 flex items-center gap-2",
        "bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)]",
        "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)]",
        "font-mono text-[11px] uppercase tracking-wider transition-all duration-150 active:scale-[0.98]",
        "shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]",
        "print:hidden"
      )}
    >
      <span className="font-semibold text-xs leading-none">↑</span>
      <span>Top</span>
    </button>
  );
}
