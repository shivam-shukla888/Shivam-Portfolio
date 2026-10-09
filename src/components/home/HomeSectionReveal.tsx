"use client";

import React from "react";
import { m } from "@/components/motion";

interface HomeSectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

/**
 * SHIVSASTRA — Step 4 Homepage Section Scroll Reveal
 *
 * Restrained viewport-based editorial entrance for homepage sections:
 * - Triggers once per page visit (`viewport: { once: true, amount: 0.12 }`).
 * - Employs transform (translateY 14px -> 0) and opacity (0 -> 1) exclusively.
 * - Automatically respects OS-level `prefers-reduced-motion` via MotionConfig.
 * - Leaves layout geometry and SectionContainer intact with 0 CLS.
 */
const emptySubscribe = () => () => {};

export function HomeSectionReveal({
  children,
  className = "",
  delay = 0,
}: HomeSectionRevealProps) {
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <m.div
      initial={isMounted ? { opacity: 0, y: 14 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.6,
        ease: EASE_EDITORIAL,
        delay,
      }}
      className={className}
    >
      {children}
    </m.div>
  );
}
