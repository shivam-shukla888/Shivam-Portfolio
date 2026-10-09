"use client";

import React, { useEffect, useRef } from "react";

/**
 * Editorial Scroll Progress Bar
 * Restrained 1.5px Terracotta Ember (#B8481D) indicator anchored below sticky header.
 * Uses direct DOM transform-based scaleX without React component re-renders.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const current =
          totalHeight > 0
            ? Math.min(1, Math.max(0, window.scrollY / totalHeight))
            : 0;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${current})`;
        }
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

  return (
    <div
      aria-hidden="true"
      className="fixed top-16 left-0 right-0 h-[1.5px] z-40 pointer-events-none motion-reduce:hidden print:hidden"
    >
      <div
        ref={barRef}
        className="h-full bg-[var(--color-accent)] will-change-transform"
        style={{
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}
