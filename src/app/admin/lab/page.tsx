import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminLabEntries } from "@/lib/admin/lab";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Personal Lab Administration | Admin",
  description: "Experimental research artifacts, ideas, builds, stacks, and thoughts management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLabPage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const entries = await getAdminLabEntries({ userId: auth.user?.id });

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
        <Link
          href="/admin"
          className="hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
        >
          ← Dashboard
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink-primary)] uppercase tracking-[0.08em]">
          Lab
        </span>
      </div>

      {/* Header Block with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              RESEARCH ARTIFACTS
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
            Personal Lab Catalog
          </h1>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
            Curate research prototypes, ideas, builds, architectural stacks, and philosophical thoughts.
          </p>
        </div>

        <Link
          href="/admin/lab/new"
          className={buttonStyles({
            variant: "primary",
            size: "md",
            className: "self-start sm:self-auto",
          })}
        >
          + New Lab Artifact
        </Link>
      </div>

      {/* Entries Table / List */}
      {entries.length > 0 ? (
        <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Visibility</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)] font-sans text-xs text-[var(--color-ink-primary)]">
              {entries.map((entry) => {
                const isPublic = entry.is_public || entry.isPublic;
                const publishedAt = entry.published_at || entry.publishedAt;
                const isPubliclyVisible = isPublic && publishedAt !== null;

                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-[var(--color-canvas-primary)] transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                      {entry.category}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/lab/${entry.id}/edit`}
                          className="font-medium text-sm text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                        >
                          {entry.title}
                        </Link>
                        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                          /{entry.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)] uppercase">
                      {entry.status}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">
                      {isPubliclyVisible ? (
                        <span className="text-[var(--color-accent)] uppercase tracking-wider">
                          ✓ PUBLIC
                        </span>
                      ) : (
                        <span className="text-[var(--color-ink-secondary)] uppercase tracking-wider">
                          ○ PRIVATE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {entry.tags.length > 0
                        ? `${entry.tags.length} tag(s)`
                        : "None"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-mono text-xs">
                        <Link
                          href={`/admin/lab/${entry.id}/edit`}
                          className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
                        >
                          Edit →
                        </Link>
                        {isPubliclyVisible && (
                          <Link
                            href={`/lab/${entry.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors uppercase tracking-[0.08em]"
                          >
                            Live ↗
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 border border-dashed border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-center space-y-4">
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-secondary)]">
            [PERSONAL LAB ARTIFACTS PENDING]
          </div>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] max-w-md mx-auto">
            Zero personal research artifacts currently recorded. Create an idea, build, stack, or thought monograph to establish the sandbox archive.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/lab/new"
              className={buttonStyles({
                variant: "primary",
                size: "sm",
              })}
            >
              Create First Lab Artifact →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
