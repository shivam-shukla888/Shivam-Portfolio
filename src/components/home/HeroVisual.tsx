"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  m,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "@/components/motion";

const MAX_DELTA_ROT = 3.5; // ±3.5° subtle architectural tilt
const MAX_DELTA_TRANS = 4; // ±4px subtle translation movement

/**
 * SHIVSASTRA — Homepage Interactive Hero Signature
 *
 * Architecture:
 * - Integrates the locally served isometric vector artwork: "The Cryptographic Lattice & Orchestration Monolith"
 * - Precision architectural annotations reflecting core positioning:
 *   1. Center Core: "SHIVAM SHUKLA" (protected system identity)
 *   2. Upper Tier: "AGENTIC AI" (orchestration conduit apex)
 *   3. Left Tier: "BACKEND SYSTEMS" (infrastructure and execution)
 *   4. Right Tier: "AI SECURITY" (perimeter and defensive boundary)
 *   5. Lower Flanks: "DIGITAL PRODUCTS" & "TEMPLATES" (modular creative output)
 *   6. Base Tier: "PROJECTS" (build and delivery module)
 *
 * Interaction & Performance:
 * - Pure CSS 3D perspective with unified kinetic layer (artwork + annotations move as one plate)
 * - Spring-damped pointer interaction on desktop (zero React re-renders, direct MotionValues)
 * - Tablet sensitivity halved; mobile (<768px) and touch devices locked to calm static architectural plate
 * - Full OS-level `prefers-reduced-motion` compliance
 * - Strict adherence to SHIVSASTRA design tokens and 0px radius architectural discipline
 */
export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const prefersReducedMotion = prefersReduced ?? false;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, poised spring configuration that settles with editorial restraint
  const springConfig = { stiffness: 120, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Pure optical depth rotation around rest (0°, 0°)
  const rotateX = useTransform(
    smoothY,
    [-1, 1],
    [MAX_DELTA_ROT, -MAX_DELTA_ROT]
  );
  const rotateY = useTransform(
    smoothX,
    [-1, 1],
    [-MAX_DELTA_ROT, MAX_DELTA_ROT]
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

  const handlePointerLeave = () => {
    // Smoothly spring return to neutral resting posture
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Architectural systems composition representing backend systems, agentic AI, AI security, digital products, templates, and projects."
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="w-full max-w-[440px] aspect-square border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-3 sm:p-5 flex items-center justify-center relative group hover:border-[var(--color-ink-primary)] transition-colors duration-300 select-none overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Kinetic 3D Architectural Scene (Artwork + Labels move together as one plate) */}
      <div aria-hidden="true" className="w-full h-full flex items-center justify-center">
        <m.div
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
            x: prefersReducedMotion ? 0 : translateX,
            y: prefersReducedMotion ? 0 : translateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* ========================================================
              PRIMARY VISUAL LAYER — VECTOR ARTWORK
              Locally hosted SVG isometric architectural monolith
              ======================================================== */}
          <div
            className="relative w-[78%] h-[78%] sm:w-[80%] sm:h-[80%] flex items-center justify-center pointer-events-none"
            style={{ transform: "translateZ(0px)" }}
          >
            <Image
              src="/images/an-isometric-architectural-3d-vector-artwork-depic.svg"
              alt=""
              width={2048}
              height={2048}
              priority
              unoptimized
              className="w-full h-full object-contain pointer-events-none select-none"
            />
          </div>

          {/* ========================================================
              EDITORIAL ANNOTATION LAYER
              Clean architectural annotations attached to the plate
              ======================================================== */}

          {/* 1. CENTER / CORE — SHIVAM SHUKLA (Dominant Central Identity) */}
          <div
            className="absolute left-1/2 top-[41%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-canvas-primary)]/95 border border-[var(--color-hairline)] transition-colors duration-300 group-hover:border-[var(--color-accent)] pointer-events-none shadow-xs"
            style={{ transform: "translateZ(18px)" }}
          >
            <span className="w-2 h-2 bg-[var(--color-accent)] block shrink-0" />
            <span className="text-[11px] sm:text-xs font-sans font-bold tracking-[0.1em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              SHIVAM SHUKLA
            </span>
          </div>

          {/* 2. TOP / ORCHESTRATION — AGENTIC AI */}
          <div
            className="absolute top-2 sm:top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
            style={{ transform: "translateZ(10px)" }}
          >
            <span className="text-[11px] sm:text-xs font-sans font-bold tracking-[0.08em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              AGENTIC AI
            </span>
            <span className="w-[1px] h-2.5 sm:h-3.5 bg-[var(--color-hairline)] mt-1 block" />
          </div>

          {/* 3. LEFT / INFRASTRUCTURE — BACKEND SYSTEMS */}
          <div
            className="absolute top-[35%] left-2 sm:left-3 hidden sm:flex items-center pointer-events-none z-10"
            style={{ transform: "translateZ(10px)" }}
          >
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.08em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              BACKEND SYSTEMS
            </span>
            <span className="h-[1px] w-2 sm:w-3 bg-[var(--color-hairline)] ml-1.5 block" />
          </div>

          {/* 4. RIGHT / DEFENSIVE — AI SECURITY (Desktop & Tablet) */}
          <div
            className="absolute top-[35%] right-2 sm:right-3 hidden sm:flex items-center pointer-events-none z-10"
            style={{ transform: "translateZ(10px)" }}
          >
            <span className="h-[1px] w-2 sm:w-3 bg-[var(--color-hairline)] mr-1.5 block" />
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.08em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              AI SECURITY
            </span>
          </div>

          {/* 4b. MOBILE BOTTOM ANCHOR — AI SECURITY (Mobile < 768px only) */}
          <div
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex sm:hidden flex-col items-center pointer-events-none z-10"
            style={{ transform: "translateZ(10px)" }}
          >
            <span className="w-[1px] h-2.5 bg-[var(--color-hairline)] mb-1 block" />
            <span className="text-[10px] font-sans font-bold tracking-[0.08em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              AI SECURITY
            </span>
          </div>

          {/* 5. LOWER LEFT — DIGITAL PRODUCTS */}
          <div
            className="absolute bottom-[20%] left-2 sm:left-3 hidden lg:flex items-center pointer-events-none z-10"
            style={{ transform: "translateZ(10px)" }}
          >
            <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.08em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              DIGITAL PRODUCTS
            </span>
            <span className="h-[1px] w-2 bg-[var(--color-hairline)] ml-1.5 block" />
          </div>

          {/* 6. LOWER RIGHT — TEMPLATES */}
          <div
            className="absolute bottom-[20%] right-2 sm:right-3 hidden lg:flex items-center pointer-events-none z-10"
            style={{ transform: "translateZ(10px)" }}
          >
            <span className="h-[1px] w-2 bg-[var(--color-hairline)] mr-1.5 block" />
            <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.08em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              TEMPLATES
            </span>
          </div>

          {/* 7. BOTTOM — PROJECTS (Tablet & Desktop) */}
          <div
            className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center pointer-events-none z-10"
            style={{ transform: "translateZ(10px)" }}
          >
            <span className="w-[1px] h-2.5 sm:h-3.5 bg-[var(--color-hairline)] mb-1 block" />
            <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-[0.08em] text-[var(--color-ink-primary)] uppercase whitespace-nowrap">
              PROJECTS
            </span>
          </div>
        </m.div>
      </div>
    </div>
  );
}

