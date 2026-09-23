"use client";

import React, { useRef, useState } from "react";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "@/components/motion";

const BASE_ROT_X = 15;
const BASE_ROT_Y = -25;
const MAX_DELTA_ROT = 3.0; // 3.0° maximum subtle interactive deviation
const MAX_DELTA_TRANS = 4; // 4px subtle translation movement

export function HeroVisual() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const prefersReducedMotion = prefersReduced ?? false;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, poised spring configuration that settles with editorial restraint
  const springConfig = { stiffness: 120, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map normalized [-1, 1] cursor offsets to subtle angle deviations around base isometric pose
  const rotateX = useTransform(
    smoothY,
    [-1, 1],
    [BASE_ROT_X + MAX_DELTA_ROT, BASE_ROT_X - MAX_DELTA_ROT]
  );
  const rotateY = useTransform(
    smoothX,
    [-1, 1],
    [BASE_ROT_Y - MAX_DELTA_ROT, BASE_ROT_Y + MAX_DELTA_ROT]
  );
  const translateX = useTransform(
    smoothX,
    [-1, 1],
    [-MAX_DELTA_TRANS, MAX_DELTA_TRANS]
  );
  const translateY = useTransform(
    smoothY,
    [-1, 1],
    [-MAX_DELTA_TRANS, MAX_DELTA_TRANS]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;
    // On touch devices, keep static to preserve native page scrolling
    if (e.pointerType === "touch") return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Halve interaction intensity on tablet screens
    const factor =
      typeof window !== "undefined" && window.innerWidth < 1024 ? 0.5 : 1.0;
    const nx =
      ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * factor;
    const ny =
      ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * factor;

    // Direct motion value update: zero React component re-renders
    mouseX.set(Math.max(-1, Math.min(1, nx)));
    mouseY.set(Math.max(-1, Math.min(1, ny)));
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    // Smoothly spring return to neutral posture
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Interactive geometric visual"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="w-full max-w-[440px] aspect-square border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-8 flex items-center justify-center relative group hover:border-[var(--color-ink-primary)] transition-colors select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Kinetic Sculptural Composition */}
      <div aria-hidden="true" className="flex items-center justify-center">
        <m.div
          className="relative w-48 h-48 flex items-center justify-center"
          style={{
            rotateX: prefersReducedMotion ? BASE_ROT_X : rotateX,
            rotateY: prefersReducedMotion ? BASE_ROT_Y : rotateY,
            x: prefersReducedMotion ? 0 : translateX,
            y: prefersReducedMotion ? 0 : translateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Subtle Isometric Axis Lines */}
          <div
            className="absolute w-44 h-[1px] bg-[var(--color-hairline)] pointer-events-none"
            style={{ transform: "rotate(45deg) translateZ(0px)" }}
          />
          <div
            className="absolute h-44 w-[1px] bg-[var(--color-hairline)] pointer-events-none"
            style={{ transform: "rotate(45deg) translateZ(0px)" }}
          />

          {/* Primary Outer Basalt Rhombus Frame */}
          <div
            className={`absolute w-36 h-36 border border-[var(--color-ink-primary)] transition-transform duration-700 ease-out ${
              !prefersReducedMotion && isHovered ? "scale-105" : ""
            }`}
            style={{
              transform: "rotate(45deg) translateZ(8px)",
            }}
          />

          {/* Secondary Nested Ivory Plane */}
          <div
            className="absolute w-28 h-28 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)]/80 transition-transform duration-500 ease-out"
            style={{
              transform: "rotate(22.5deg) translateZ(16px)",
            }}
          />

          {/* Core Terracotta Ember Vector Core */}
          <div
            className={`absolute w-16 h-16 border border-[var(--color-accent)] transition-all duration-700 ease-out ${
              !prefersReducedMotion && isHovered ? "rotate-90 scale-110" : "rotate-0"
            }`}
            style={{
              transform: "translateZ(26px)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] block" />
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}
