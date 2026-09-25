import React from "react";
import { cn } from "@/lib/utils";

interface ShivSastraMascotProps {
  isOpen: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * ShivSastra Companion Mascot (Astra-Cat)
 * Original SHIVSASTRA mascot, created specifically for the portfolio.
 * Features:
 * - Angular/geometric robotic feline ears with cybernetic sensor fins
 * - Curved hexagonal faceplate visor with soft cyan data-eyes
 * - Titanium and deep lapis-blue casing (#1E3A8A / #2563EB)
 * - Minimalist copper power core (ShivSastra hexagon prism)
 * - Floating thruster pods
 */
export function ShivSastraMascot({
  isOpen,
  className,
  size = "md",
}: ShivSastraMascotProps) {
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  }[size];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center select-none pointer-events-none",
        dimensions,
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300 motion-reduce:transform-none"
      >
        {/* Hover / Glow Base */}
        <ellipse
          cx="50"
          cy="92"
          rx="22"
          ry="4"
          fill="var(--color-ink-primary)"
          opacity="0.12"
          className="transition-all duration-300"
        />

        {/* Back Ears / Sensor Fins */}
        <polygon
          points="24,36 12,12 36,22"
          fill="#1E40AF"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="26,32 18,17 34,24"
          fill="#D45A2A"
          opacity="0.85"
        />

        <polygon
          points="76,36 88,12 64,22"
          fill="#1E40AF"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="74,32 82,17 66,24"
          fill="#D45A2A"
          opacity="0.85"
        />

        {/* Robotic Head Structure */}
        <rect
          x="18"
          y="20"
          width="64"
          height="52"
          rx="24"
          fill="#2563EB"
          stroke="#0F172A"
          strokeWidth="2.5"
        />

        {/* Face Visor Plate */}
        <rect
          x="26"
          y="29"
          width="48"
          height="36"
          rx="14"
          fill="#FAF9F6"
          stroke="#0F172A"
          strokeWidth="2"
        />

        {/* Expressive Digital Eyes / Sensor Bars */}
        {isOpen ? (
          // Alert / Active listening eyes (focus state)
          <g>
            <path
              d="M34 44 Q39 40 44 44"
              stroke="#D45A2A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M56 44 Q61 40 66 44"
              stroke="#D45A2A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          // Friendly neutral digital visor eyes
          <g>
            <rect
              x="34"
              y="40"
              width="9"
              height="6"
              rx="3"
              fill="#0F172A"
            />
            <circle cx="36.5" cy="42" r="1.5" fill="#38BDF8" />

            <rect
              x="57"
              y="40"
              width="9"
              height="6"
              rx="3"
              fill="#0F172A"
            />
            <circle cx="59.5" cy="42" r="1.5" fill="#38BDF8" />
          </g>
        )}

        {/* Subtle Cyber Whisker Sensors (Geometric lines) */}
        <line
          x1="28"
          y1="49"
          x2="20"
          y2="47"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="28"
          y1="53"
          x2="21"
          y2="55"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <line
          x1="72"
          y1="49"
          x2="80"
          y2="47"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="72"
          y1="53"
          x2="79"
          y2="55"
          stroke="#64748B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Robotic Nose & Mouth Line */}
        <circle cx="50" cy="48" r="2" fill="#D45A2A" />
        <path
          d="M50 50 V55 M46 55 Q50 58 54 55"
          stroke="#0F172A"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cyber Collar / Chassis Neck Joint */}
        <rect
          x="32"
          y="70"
          width="36"
          height="5"
          rx="2.5"
          fill="#0F172A"
        />

        {/* ShivSastra Hexagonal Sensor Core (NOT a bell) */}
        <polygon
          points="50,71 55,74 55,80 50,83 45,80 45,74"
          fill="#D45A2A"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <circle cx="50" cy="77" r="1.5" fill="#FAF9F6" />

        {/* Compact Torso / Hover Pods */}
        <rect
          x="30"
          y="76"
          width="40"
          height="14"
          rx="7"
          fill="#1E40AF"
          stroke="#0F172A"
          strokeWidth="2"
        />
        {/* Soft Core Indicator */}
        <rect
          x="38"
          y="81"
          width="24"
          height="4"
          rx="2"
          fill="#38BDF8"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
