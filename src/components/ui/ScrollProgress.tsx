"use client";

import React, { useEffect, useState } from "react";

/**
 * Editorial Scroll Progress Bar
 * Restrained 1.5px Terracotta Ember (#D45A2A) indicator anchored below sticky header.
 * Uses transform-based scaleX and passive RAF scroll listener.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
          const current = Math.min(
            1,
            Math.max(0, window.scrollY / totalHeight)
          );
          setProgress(current);
        } else {
          setProgress(0);
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
        className="h-full bg-[var(--color-accent)] transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
}
