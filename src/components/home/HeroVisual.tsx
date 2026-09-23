"use client";

import React, { useState, useRef, useSyncExternalStore } from "react";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

export function HeroVisual() {
  const [rotate, setRotate] = useState({ x: 15, y: -25 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: 15 - (y / rect.height) * 20,
      y: -25 + (x / rect.width) * 30,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 15, y: -25 });
  };

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Interactive geometric visual"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[440px] aspect-square border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 flex items-center justify-center relative group hover:border-[var(--color-ink-primary)] transition-colors select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Kinetic Sculptural Composition */}
      <div aria-hidden="true" className="flex items-center justify-center">
        <div
          className="relative w-48 h-48 flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: prefersReducedMotion
              ? "none"
              : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Primary Outer Basalt Rhombus Frame */}
          <div
            className={`absolute w-36 h-36 border border-[var(--color-ink-primary)] transition-transform duration-700 ease-out ${
              !prefersReducedMotion && isHovered ? "scale-105" : ""
            }`}
            style={{
              transform: "rotate(45deg)",
            }}
          />

          {/* Secondary Nested Ivory Plane */}
          <div
            className="absolute w-28 h-28 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]/80 transition-transform duration-500 ease-out"
            style={{
              transform: "rotate(22.5deg)",
            }}
          />

          {/* Core Terracotta Ember Vector Core */}
          <div
            className={`absolute w-16 h-16 border border-[var(--color-accent)] transition-all duration-700 ease-out ${
              !prefersReducedMotion && isHovered ? "rotate-90 scale-110" : "rotate-0"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] block" />
            </div>
          </div>

          {/* Subtle Isometric Axis Lines */}
          <div
            className="absolute w-44 h-[1px] bg-[var(--color-hairline)] pointer-events-none"
            style={{ transform: "rotate(45deg)" }}
          />
          <div
            className="absolute h-44 w-[1px] bg-[var(--color-hairline)] pointer-events-none"
            style={{ transform: "rotate(45deg)" }}
          />
        </div>
      </div>
    </div>
  );
}
