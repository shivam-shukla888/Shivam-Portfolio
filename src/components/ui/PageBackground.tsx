import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PageBackgroundProps {
  src: string;
  alt?: string;
  priority?: boolean;
  opacity?: number;
  className?: string;
  position?: "top" | "center" | "right" | "bottom";
}

/**
 * Editorial Page Background Component
 *
 * Renders an optimized, responsive page-specific editorial background
 * layer behind page content with an ivory/canvas tonal balance overlay.
 *
 * ACCESSIBILITY & PERFORMANCE SPECIFICATION:
 * - aria-hidden="true" (decorative backgrounds are hidden from assistive technology)
 * - role="presentation"
 * - pointer-events-none (never intercepts user clicks or selection)
 * - Optimized WebP asset delivery via Next.js Image
 * - Restrained opacity + tonal gradient overlay guarantees WCAG text contrast
 */
export function PageBackground({
  src,
  alt = "",
  priority = false,
  opacity = 0.28,
  className,
  position = "top",
}: PageBackgroundProps) {
  const positionClasses = {
    top: "object-top",
    center: "object-center",
    right: "object-right-top",
    bottom: "object-bottom",
  }[position];

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn(
        "pointer-events-none select-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {/* Background Graphic Asset */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1920px"
          className={cn("object-cover", positionClasses)}
        />
      </div>

      {/* Editorial Tonal Balance: Warm Ivory Radial & Linear Gradients */}
      {/* Top/Center subtle wash to ensure razor-sharp typography readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-canvas-primary)]/40 via-transparent to-[var(--color-canvas-primary)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-canvas-primary)_0%,_transparent_75%)] opacity-60" />
    </div>
  );
}
