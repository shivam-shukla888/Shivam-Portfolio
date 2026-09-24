"use client";

import React from "react";
import Link from "next/link";

interface SafeMarkdownProps {
  content: string;
}

/**
 * Parses inline formatting (bold, italic, code, and safe links) into React elements.
 * Strictly prevents raw HTML evaluation and unsafe protocols (javascript:, data:).
 */
function renderInlineContent(text: string): React.ReactNode[] {
  // Regex to match: **bold**, `code`, [label](url), *italic*
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-[var(--color-ink-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Inline code: `code`
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="font-mono text-[11px] px-1.5 py-0.5 bg-[var(--color-canvas-secondary)] border border-[var(--color-hairline)] text-[var(--color-accent)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Safe Link: [label](url)
    if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, rawUrl] = match;
        const cleanUrl = rawUrl.trim();

        // Security check: Only allow strict relative internal paths (/...) or valid https://
        const isRelative =
          cleanUrl.startsWith("/") &&
          !cleanUrl.startsWith("//") &&
          !cleanUrl.includes("\\");
        const isHttps =
          cleanUrl.startsWith("https://") &&
          !cleanUrl.toLowerCase().includes("javascript:") &&
          !cleanUrl.toLowerCase().includes("data:");

        if (isRelative) {
          return (
            <Link
              key={index}
              href={cleanUrl}
              className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              {label}
            </Link>
          );
        } else if (isHttps) {
          return (
            <a
              key={index}
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              {label} ↗
            </a>
          );
        }

        // Untrusted/unsafe URL: render label as inert text
        return <span key={index}>{label}</span>;
      }
    }

    // Italic: *text*
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic text-[var(--color-ink-primary)]">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Safe, sanitized Markdown renderer for AI Assistant responses.
 * Never executes raw HTML or uses dangerouslySetInnerHTML.
 */
export function SafeMarkdown({ content }: SafeMarkdownProps) {
  // Normalize line endings
  const normalized = content.replace(/\r\n/g, "\n");
  const blocks = normalized.split(/\n{2,}/);

  return (
    <div className="space-y-2.5 text-xs font-sans leading-relaxed text-[var(--color-ink-primary)]">
      {blocks.map((block, bIndex) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Fenced code block
        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
          const lines = trimmed.split("\n");
          const codeBody = lines.slice(1, -1).join("\n");
          return (
            <pre
              key={bIndex}
              className="p-3 bg-[var(--color-surface-dark)] text-[var(--color-dark-ink-primary)] font-mono text-[11px] overflow-x-auto border border-[var(--color-dark-hairline)]"
            >
              <code>{codeBody}</code>
            </pre>
          );
        }

        // Bullet list block
        const lines = trimmed.split("\n");
        const isBulletList = lines.every(
          (line) => line.trim().startsWith("* ") || line.trim().startsWith("- ")
        );

        if (isBulletList) {
          return (
            <ul key={bIndex} className="list-disc pl-4 space-y-1 text-xs">
              {lines.map((line, lIndex) => {
                const itemText = line.trim().replace(/^[-*]\s+/, "");
                return <li key={lIndex}>{renderInlineContent(itemText)}</li>;
              })}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={bIndex} className="text-xs">
            {lines.map((line, lIndex) => (
              <React.Fragment key={lIndex}>
                {lIndex > 0 && <br />}
                {renderInlineContent(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
