"use client";

import React from "react";
import { m, useReducedMotion } from "@/components/motion";

/**
 * SHIVSASTRA Editorial Cubic-Bezier Easing
 * Starts with gentle poise, accelerates subtly, and settles with refined momentum.
 * Zero overshoot, zero bounce, purely architectural.
 */
const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

export interface InnerPageEntranceProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Editorial stagger index:
   * 0 -> 0s delay (Header / Title)
   * 1 -> 0.06s delay (Metadata / Main Content)
   * 2 -> 0.12s delay (Supporting / Secondary Content)
   * 3 -> 0.18s delay (Actions / Footer Navigation)
   * Default: 0
   */
  delayIndex?: number;
  /** Explicit delay in seconds override */
  delay?: number;
  /** Initial translateY in pixels (default: 12) */
  y?: number;
  /** Duration in seconds (default: 0.52s, within recommended 0.45–0.65s) */
  duration?: number;
  /** Semantic container tag (default: "div") */
  as?: "div" | "header" | "section" | "footer" | "nav" | "article";
}

/**
 * SHIVSASTRA — Step 6 Public Inner-Page Entrance Motion
 *
 * Restrained editorial entrance motion for public inner pages:
 * - Employs transform (translateY 12px -> 0) and opacity (0 -> 1) exclusively.
 * - Section/page-level grouping (Title -> Metadata -> Main Content -> Actions).
 * - Coherent single-group reveal for empty states.
 * - Respects OS-level prefers-reduced-motion via root MotionConfig and useReducedMotion.
 * - Zero CLS, zero layout animation, zero continuous loops.
 */
export function InnerPageEntrance({
  children,
  className = "",
  delayIndex = 0,
  delay,
  y = 12,
  duration = 0.52,
  as = "div",
}: InnerPageEntranceProps) {
  const shouldReduceMotion = useReducedMotion();

  const computedDelay = delay !== undefined ? delay : Math.max(0, delayIndex) * 0.06;

  const Component =
    as === "header"
      ? m.header
      : as === "section"
      ? m.section
      : as === "footer"
      ? m.footer
      : as === "nav"
      ? m.nav
      : as === "article"
      ? m.article
      : m.div;

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        ease: EASE_EDITORIAL,
        delay: computedDelay,
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
