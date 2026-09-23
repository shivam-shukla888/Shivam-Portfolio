"use client";

import React from "react";
import { m } from "@/components/motion";

interface HomeHeroMotionProps {
  overview: React.ReactNode;
  title: React.ReactNode;
  positioning: React.ReactNode;
  narrative: React.ReactNode;
  ctas: React.ReactNode;
  visual: React.ReactNode;
}

/**
 * Editorial cubic-bezier easing curve:
 * Starts with gentle poise, accelerates subtly, and settles with refined momentum.
 * Zero overshoot, zero spring bounce, purely typographical/architectural.
 */
const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;

/**
 * SHIVSASTRA — Step 2 Homepage Entrance Motion
 *
 * Restrained first-load editorial reveal strictly scoped to the homepage hero:
 * 1. Overview meta & availability status
 * 2. SHIVAM dominant visual identity
 * 3. Primary technical positioning statement
 * 4. Supporting narrative
 * 5. Primary and secondary CTA group
 * 6. HeroVisual 3D composition framing
 *
 * Employs transform (translateY) and opacity exclusively.
 * Automatically respects OS-level `prefers-reduced-motion: reduce` via MotionConfig.
 */
export function HomeHeroMotion({
  overview,
  title,
  positioning,
  narrative,
  ctas,
  visual,
}: HomeHeroMotionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Left Narrative Block */}
      <div className="lg:col-span-7 space-y-6">
        {/* 0. Overview & Availability Meta */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE_EDITORIAL, delay: 0.04 }}
        >
          {overview}
        </m.div>

        {/* 1. SHIVAM Dominant Headline */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EDITORIAL, delay: 0.10 }}
        >
          {title}
        </m.div>

        {/* 2. Primary Positioning Statement */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EDITORIAL, delay: 0.18 }}
        >
          {positioning}
        </m.div>

        {/* 3. Supporting Narrative */}
        <m.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EDITORIAL, delay: 0.26 }}
        >
          {narrative}
        </m.div>

        {/* 4. Action Group / CTAs */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE_EDITORIAL, delay: 0.34 }}
        >
          {ctas}
        </m.div>
      </div>

      {/* 5. Right Signature Visual (HeroVisual) */}
      <m.div
        className="lg:col-span-5 flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: EASE_EDITORIAL, delay: 0.42 }}
      >
        {visual}
      </m.div>
    </div>
  );
}
