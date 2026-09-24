"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

/**
 * Editorial Copy Button for technical code snippets.
 * Features clipboard API with fallback, accessible status, and auto-reset.
 */
export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (!text) return;

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        return;
      }
    } catch {
      // Fallback below
    }

    // Fallback for older browsers or non-secure contexts
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    } catch {
      // Silently handle if clipboard permission is completely blocked
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied code snippet to clipboard" : "Copy code snippet"}
      className={cn(
        "px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors duration-150",
        "border border-[var(--color-dark-hairline)] bg-[var(--color-surface-dark)] text-[var(--color-dark-ink-secondary)]",
        "hover:text-[var(--color-dark-ink-primary)] hover:border-[var(--color-dark-ink-secondary)]",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-dark-ink-primary)]",
        "active:scale-[0.98] print:hidden",
        copied && "text-[var(--color-accent)] border-[var(--color-accent)]",
        className
      )}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
