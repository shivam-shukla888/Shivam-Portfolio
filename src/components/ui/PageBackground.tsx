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
  overlayVariant?: "none" | "subtle" | "hero-left-quiet";
}

/**
 * Editorial Page Background Component
 *
 * Renders an optimized, responsive page-specific editorial background
 * layer behind page content.
 *
 * ACCESSIBILITY & PERFORMANCE SPECIFICATION:
 * - aria-hidden="true" (decorative backgrounds are hidden from assistive technology)
 * - role="presentation"
 * - pointer-events-none (never intercepts user clicks or selection)
 * - z-0 with content sitting at relative z-1
 * - Optimized WebP asset delivery via Next.js Image
 * - Responsive: On desktop/tablet, displays verified full artwork.
 *   On mobile (<768px), applies a subtle attenuation (approx 0.6x desktop intensity)
 *   and shifts horizontal positioning to ensure headlines and paragraphs are
 *   never obstructed by high-contrast linework while keeping the tactile paper texture.
 */
export function PageBackground({
  src,
  alt = "",
  priority = false,
  opacity = 0.55,
  className,
  position = "right",
  overlayVariant = "subtle",
}: PageBackgroundProps) {
  // Desktop/Tablet position vs Mobile position
  // On mobile, 'right' pushes the right-anchored vertical lines away from central text
  const positionClasses = {
    top: "object-top md:object-top",
    center: "object-[center_top] md:object-center",
    right: "object-[85%_center] md:object-[right_center]",
    bottom: "object-bottom md:object-bottom",
  }[position];

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn(
        "pointer-events-none select-none absolute inset-0 z-0 overflow-hidden",
        className
      )}
    >
      {/* Background Graphic Asset with responsive mobile attenuation */}
      <div
        className="absolute inset-0 opacity-60 md:opacity-100"
        style={{ opacity: undefined }}
      >
        <div
          className="absolute inset-0"
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
      </div>

      {/* Editorial Tonal Balance Overlays */}
      {overlayVariant === "hero-left-quiet" && (
        <>
          {/* Subtle horizontal gradient to keep left typography area quiet on wide screens while letting right artwork shine */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[var(--color-canvas-primary)]/80 via-[var(--color-canvas-primary)]/40 to-transparent" />
          {/* Mobile soft wash to protect stacked SHIVAM headline and body */}
          <div className="block lg:hidden absolute inset-0 bg-gradient-to-b from-[var(--color-canvas-primary)]/60 via-transparent to-[var(--color-canvas-primary)]/80" />
          {/* Soft vertical fade at bottom to harmonize with the section hairline border */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--color-canvas-primary)]/60 to-transparent" />
        </>
      )}

      {overlayVariant === "subtle" && (
        <>
          {/* Mobile subtle scrim to ensure stacked text on small screens has zero collision with dense linework */}
          <div className="block md:hidden absolute inset-0 bg-[var(--color-canvas-primary)]/20" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--color-canvas-primary)]/50 to-transparent" />
        </>
      )}
    </div>
  );
}
