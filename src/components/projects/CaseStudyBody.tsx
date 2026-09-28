import React from "react";

interface CaseStudyBodyProps {
  markdown: string;
}

export function CaseStudyBody({ markdown }: CaseStudyBodyProps) {
  // Split into major sections starting with ###
  const rawSections = markdown.split(/(?=###\s+)/);

  return (
    <div className="space-y-12">
      {rawSections.map((section, sIndex) => {
        const lines = section.trim().split("\n");
        if (lines.length === 0 || !lines[0]) return null;

        const headingMatch = lines[0].match(/^###\s+(.+)$/);
        const heading = headingMatch ? headingMatch[1].trim() : null;
        const contentLines = headingMatch ? lines.slice(1) : lines;

        // Group lines into paragraphs and list blocks
        const blocks: { type: "p" | "ul" | "ol"; items: string[] }[] = [];
        let currentType: "p" | "ul" | "ol" | null = null;
        let currentItems: string[] = [];

        for (const line of contentLines) {
          const trimmed = line.trim();
          if (!trimmed) {
            if (currentType && currentItems.length > 0) {
              blocks.push({ type: currentType, items: [...currentItems] });
              currentType = null;
              currentItems = [];
            }
            continue;
          }

          const isNumbered = /^\d+\.\s+/.test(trimmed);
          const isBullet = /^[-*]\s+/.test(trimmed);

          if (isNumbered) {
            if (currentType !== "ol") {
              if (currentType && currentItems.length > 0) {
                blocks.push({ type: currentType, items: [...currentItems] });
              }
              currentType = "ol";
              currentItems = [trimmed.replace(/^\d+\.\s+/, "")];
            } else {
              currentItems.push(trimmed.replace(/^\d+\.\s+/, ""));
            }
          } else if (isBullet) {
            if (currentType !== "ul") {
              if (currentType && currentItems.length > 0) {
                blocks.push({ type: currentType, items: [...currentItems] });
              }
              currentType = "ul";
              currentItems = [trimmed.replace(/^[-*]\s+/, "")];
            } else {
              currentItems.push(trimmed.replace(/^[-*]\s+/, ""));
            }
          } else {
            if (currentType !== "p") {
              if (currentType && currentItems.length > 0) {
                blocks.push({ type: currentType, items: [...currentItems] });
              }
              currentType = "p";
              currentItems = [trimmed];
            } else {
              currentItems.push(trimmed);
            }
          }
        }

        if (currentType && currentItems.length > 0) {
          blocks.push({ type: currentType, items: [...currentItems] });
        }

        return (
          <div key={sIndex} className="space-y-4">
            {heading && (
              <h2 className="font-display text-2xl sm:text-3xl font-normal text-[var(--color-ink-primary)] pb-3 border-b border-[var(--color-hairline)]">
                {heading}
              </h2>
            )}

            <div className="space-y-4 font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed">
              {blocks.map((block, bIndex) => {
                if (block.type === "p") {
                  return (
                    <p key={bIndex} className="leading-relaxed">
                      {renderFormattedText(block.items.join(" "))}
                    </p>
                  );
                }

                if (block.type === "ol") {
                  return (
                    <ol key={bIndex} className="list-decimal pl-5 space-y-2.5 my-3">
                      {block.items.map((item, iIndex) => (
                        <li key={iIndex} className="pl-1">
                          {renderFormattedText(item)}
                        </li>
                      ))}
                    </ol>
                  );
                }

                if (block.type === "ul") {
                  return (
                    <ul key={bIndex} className="list-disc pl-5 space-y-2 my-3">
                      {block.items.map((item, iIndex) => (
                        <li key={iIndex} className="pl-1">
                          {renderFormattedText(item)}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderFormattedText(text: string): React.ReactNode[] {
  // Regex pattern for **bold** and `code`
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-[var(--color-ink-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="font-mono text-xs px-1.5 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-accent)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
