import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminProjects } from "@/lib/admin/projects";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Projects Administration | Admin",
  description: "Curated work monographs management and publishing controls.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProjectsPage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const projects = await getAdminProjects({ userId: auth.user?.id });

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
          Projects
        </span>
      </div>

      {/* Header Block with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              CURATED MONOGRAPHS
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
            Projects Archive
          </h1>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
            Manage case studies, publication status, featured status, and ordering.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className={buttonStyles({
            variant: "primary",
            size: "md",
            className: "self-start sm:self-auto",
          })}
        >
          + New Project
        </Link>
      </div>

      {/* Projects Table / List */}
      {projects.length > 0 ? (
        <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)] font-sans text-xs text-[var(--color-ink-primary)]">
              {projects.map((project) => {
                const isPublished = Boolean(
                  project.published_at || project.publishedAt
                );
                return (
                  <tr
                    key={project.id}
                    className="hover:bg-[var(--color-canvas-primary)] transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {project.sort_order ?? project.sortOrder ?? 0}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="font-medium text-sm text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                        >
                          {project.title}
                        </Link>
                        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                          /{project.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[var(--color-ink-secondary)]">
                      {project.category || "—"}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {project.project_year ?? project.projectYear ?? "—"}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">
                      {project.is_featured || project.isFeatured ? (
                        <span className="text-[var(--color-accent)] font-medium uppercase tracking-wider">
                          ★ YES
                        </span>
                      ) : (
                        <span className="text-[var(--color-ink-secondary)]">NO</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">
                      {isPublished ? (
                        <span className="text-[var(--color-accent)] uppercase tracking-wider">
                          ✓ PUBLISHED
                        </span>
                      ) : (
                        <span className="text-[var(--color-ink-secondary)] uppercase tracking-wider">
                          ○ DRAFT
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-mono text-xs">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
                        >
                          Edit →
                        </Link>
                        {isPublished && (
                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
                          >
                            View ↗
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
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] block">
              CATALOG VOID
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              [NO PROJECTS CONFIGURED]
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-md mx-auto leading-relaxed">
              The project monograph archive is currently empty. Create your first project record to populate the database.
            </p>
          </div>
          <div>
            <Link
              href="/admin/projects/new"
              className={buttonStyles({
                variant: "primary",
                size: "md",
              })}
            >
              + Create First Project
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
