"use client";

import * as React from "react";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

export interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * SHIVSASTRA — Step 1 Motion Foundation Provider
 *
 * Establishes a lightweight LazyMotion architecture with:
 * 1. Synchronously bound `domAnimation` subset (renderer, animation, exit, inView, tap, focus, hover),
 *    omitting layout projections, drag, and complex SVG morphing.
 * 2. Strict mode to ensure components use the lightweight `m` proxy.
 * 3. MotionConfig `reducedMotion="user"` to guarantee that OS-level reduced motion preferences
 *    (`prefers-reduced-motion: reduce`) automatically disable or make instant all future transitions.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
