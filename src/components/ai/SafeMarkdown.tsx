"use client";

import React from "react";
import Link from "next/link";
import { normalizeHref, isValidPublicRoute } from "@/lib/ai/navigation";
import { CopyButton } from "@/components/ui/CopyButton";

interface SafeMarkdownProps {
  content: string;
  validRoutes?: string[];
}

// Allowlisted external domains for verified public profiles (Contra, GitHub, LinkedIn, X)
const VERIFIED_EXTERNAL_DOMAINS = [
  "github.com",
  "linkedin.com",
  "contra.com",
  "x.com",
  "twitter.com",
];

function isVerifiedExternalUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname.toLowerCase();
    return VERIFIED_EXTERNAL_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Parses inline formatting (bold, code, links, italic) into React elements.
 * Strictly checks internal links against the verified public route allowlist.
 */
function renderInlineContent(
  text: string,
  validRoutes?: string[]
): React.ReactNode[] {
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
        const normalizedUrl = normalizeHref(rawUrl);

        // 1. Internal Link: Must pass strict public route allowlist
        if (isValidPublicRoute(normalizedUrl, validRoutes)) {
          return (
            <Link
              key={index}
              href={normalizedUrl}
              className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              {label}
            </Link>
          );
        }

        // 2. Verified External Profile (HTTPS only, strictly allowlisted domains)
        if (rawUrl.startsWith("https://") && isVerifiedExternalUrl(rawUrl)) {
          return (
            <a
              key={index}
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
            >
              {label} ↗
            </a>
          );
        }

        // 3. Untrusted, malformed, or private route: render label as inert text
        return (
          <span key={index} className="text-[var(--color-ink-primary)]">
            {label}
          </span>
        );
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
 * Checks if a plain-text line represents a navigation destination
 * such as "Home: /", "About: /about", or "Contact: /contact".
 * If valid, returns a clickable Next.js Link element.
 */
function tryRenderPlainRouteItem(
  itemText: string,
  key: React.Key,
  validRoutes?: string[]
): React.ReactNode | null {
  // Matches "Label: /route" or "**Label**: /route" or "Label - /route"
  const match = itemText.match(
    /^(?:\*\*)?([A-Za-z0-9\s&—–/]+?)(?:\*\*)?[:–—\-]\s*(?:`|\[)?(\/[a-zA-Z0-9_\-\/.]*)(?:`|\])?(?:\([^)]*\))?$/
  );

  if (match) {
    const label = match[1].trim();
    const rawPath = match[2].trim();
    const normalized = normalizeHref(rawPath);

    if (isValidPublicRoute(normalized, validRoutes)) {
      return (
        <Link
          key={key}
          href={normalized}
          className="text-[var(--color-accent)] underline underline-offset-2 hover:text-[var(--color-accent-hover)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] font-sans"
        >
          <span className="font-semibold text-[var(--color-ink-primary)]">{label}:</span>{" "}
          <span className="font-mono text-[11px]">{normalized}</span>
        </Link>
      );
    }
  }

  return null;
}

/**
 * Safe, sanitized Markdown renderer for AI Assistant responses.
 * Never executes raw HTML or uses dangerouslySetInnerHTML.
 * Validates all internal links against the verified public route allowlist.
 */
export function SafeMarkdown({ content, validRoutes }: SafeMarkdownProps) {
  // Normalize line endings and ensure headings have block separation
  const normalized = content
    .replace(/\r\n/g, "\n")
    .replace(/^(#{1,3}\s+[^\n]+)\n(?=[^\n#])/gm, "$1\n\n");

  const blocks = normalized.split(/\n{2,}/);

  return (
    <div className="space-y-2.5 text-xs font-sans leading-relaxed text-[var(--color-ink-primary)]">
      {blocks.map((block, bIndex) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Fenced code block with copy action
        if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
          const lines = trimmed.split("\n");
          const codeBody = lines.slice(1, -1).join("\n");
          return (
            <div key={bIndex} className="relative group my-2">
              <pre className="p-3 bg-[var(--color-surface-dark)] text-[var(--color-dark-ink-primary)] font-mono text-[11px] overflow-x-auto border border-[var(--color-dark-hairline)] pr-16">
                <code>{codeBody}</code>
              </pre>
              <div className="absolute top-2 right-2">
                <CopyButton text={codeBody} />
              </div>
            </div>
          );
        }

        // Semantic heading blocks (###, ##, #)
        const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const headingText = headingMatch[2];
          if (level === 1) {
            return (
              <h1
                key={bIndex}
                className="font-display text-sm font-semibold text-[var(--color-ink-primary)] pt-1"
              >
                {renderInlineContent(headingText, validRoutes)}
              </h1>
            );
          }
          if (level === 2) {
            return (
              <h2
                key={bIndex}
                className="font-display text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-primary)] pt-1"
              >
                {renderInlineContent(headingText, validRoutes)}
              </h2>
            );
          }
          return (
            <h3
              key={bIndex}
              className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)] pt-1"
            >
              {renderInlineContent(headingText, validRoutes)}
            </h3>
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
                const plainRoute = tryRenderPlainRouteItem(itemText, lIndex, validRoutes);

                return (
                  <li key={lIndex}>
                    {plainRoute || renderInlineContent(itemText, validRoutes)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Standard paragraph
        return (
          <p key={bIndex} className="text-xs">
            {lines.map((line, lIndex) => {
              const plainRoute = tryRenderPlainRouteItem(line.trim(), lIndex, validRoutes);
              return (
                <React.Fragment key={lIndex}>
                  {lIndex > 0 && <br />}
                  {plainRoute || renderInlineContent(line, validRoutes)}
                </React.Fragment>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}
