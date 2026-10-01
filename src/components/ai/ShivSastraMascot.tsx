import React from "react";
import { cn } from "@/lib/utils";

interface ShivSastraMascotProps {
  isOpen: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * ShivSastra Companion Mascot (Astra-Cat)
 * Art-directed geometric design object for the portfolio.
 * Black, White, and Cobalt Blue Deep (#2C3480) aesthetic.
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
        {/* Hover / Ground Shadow */}
        <ellipse
          cx="50"
          cy="92"
          rx="22"
          ry="4"
          fill="#000000"
          opacity="0.15"
          className="transition-all duration-300"
        />

        {/* Back Ears / Sensor Fins */}
        <polygon
          points="24,36 12,12 36,22"
          fill="#000000"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="26,32 18,17 34,24"
          fill="#2C3480"
          opacity="0.9"
        />

        <polygon
          points="76,36 88,12 64,22"
          fill="#000000"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="74,32 82,17 66,24"
          fill="#2C3480"
          opacity="0.9"
        />

        {/* Robotic Head Structure - Deep Black */}
        <rect
          x="18"
          y="20"
          width="64"
          height="52"
          rx="24"
          fill="#000000"
          stroke="#000000"
          strokeWidth="2"
        />

        {/* Face Visor Plate - Crisp Pure White */}
        <rect
          x="26"
          y="29"
          width="48"
          height="36"
          rx="14"
          fill="#FFFFFF"
          stroke="#E5E5E5"
          strokeWidth="1.5"
        />

        {/* Expressive Digital Eyes / Sensor Bars */}
        {isOpen ? (
          // Active listening state (Cobalt Blue focus)
          <g>
            <path
              d="M34 44 Q39 40 44 44"
              stroke="#2C3480"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M56 44 Q61 40 66 44"
              stroke="#2C3480"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : (
          // Poised neutral state
          <g>
            <rect
              x="34"
              y="40"
              width="9"
              height="6"
              rx="3"
              fill="#000000"
            />
            <circle cx="36.5" cy="42" r="1.5" fill="#2C3480" />

            <rect
              x="57"
              y="40"
              width="9"
              height="6"
              rx="3"
              fill="#000000"
            />
            <circle cx="59.5" cy="42" r="1.5" fill="#2C3480" />
          </g>
        )}

        {/* Subtle Cyber Whisker Sensors (Geometric hairline lines) */}
        <line
          x1="28"
          y1="49"
          x2="20"
          y2="47"
          stroke="#888888"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="28"
          y1="53"
          x2="21"
          y2="55"
          stroke="#888888"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <line
          x1="72"
          y1="49"
          x2="80"
          y2="47"
          stroke="#888888"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="72"
          y1="53"
          x2="79"
          y2="55"
          stroke="#888888"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Nose & Mouth Line */}
        <circle cx="50" cy="48" r="2" fill="#2C3480" />
        <path
          d="M50 50 V55 M46 55 Q50 58 54 55"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Chassis Neck Joint */}
        <rect
          x="32"
          y="70"
          width="36"
          height="5"
          rx="2.5"
          fill="#000000"
        />

        {/* ShivSastra Hexagonal Cobalt Sensor Core */}
        <polygon
          points="50,71 55,74 55,80 50,83 45,80 45,74"
          fill="#2C3480"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <circle cx="50" cy="77" r="1.5" fill="#FFFFFF" />

        {/* Base Pods */}
        <rect
          x="30"
          y="76"
          width="40"
          height="14"
          rx="7"
          fill="#000000"
          stroke="#000000"
          strokeWidth="2"
        />
        {/* Core Indicator */}
        <rect
          x="38"
          y="81"
          width="24"
          height="4"
          rx="2"
          fill="#2C3480"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
