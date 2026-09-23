import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  index?: string;
  name: string;
  className?: string;
  dark?: boolean;
}

/**
 * Unified Section Heading Label
 * 
 * Hierarchy:
 * [small optional index in JetBrains Mono]
 * [Section Name in Inter]
 * 
 * Quiet, restrained, editorial Swiss typography.
 */
export function SectionLabel({
  index,
  name,
  className,
  dark = false,
}: SectionLabelProps) {
  return (
    <div className={cn("space-y-1 select-none", className)}>
      {index && (
        <span
          className={cn(
            "block font-mono text-xs",
            dark ? "text-[var(--color-accent)]" : "text-[var(--color-accent)]"
          )}
        >
          {index}
        </span>
      )}
      <span
        className={cn(
          "block font-sans text-xs tracking-[0.02em] font-medium",
          dark
            ? "text-[var(--color-dark-ink-secondary)]"
            : "text-[var(--color-ink-secondary)]"
        )}
      >
        {name}
      </span>
    </div>
  );
}
