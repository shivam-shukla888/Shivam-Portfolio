import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminProject } from "@/lib/admin/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata: Metadata = {
  title: "Edit Project | Admin",
  description: "Edit project monograph and curatorial parameters.",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminProjectPage({ params }: EditProjectPageProps) {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const project = await getAdminProject(id, { userId: auth.user?.id });

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
        <Link
          href="/admin"
          className="hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
        >
          ← Dashboard
        </Link>
        <span>/</span>
        <Link
          href="/admin/projects"
          className="hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
        >
          Projects
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink-primary)] uppercase tracking-[0.08em]">
          Edit Monograph
        </span>
      </div>

      {/* Header Block */}
      <div className="space-y-2 pb-6 border-b border-[var(--color-hairline)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              CURATORIAL EDITOR
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          {Boolean(project.published_at || project.publishedAt) && (
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              View Live Page ↗
            </Link>
          )}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
          {project.title}
        </h1>
        <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
          Monograph ID: <span className="font-mono text-xs">{project.id}</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <ProjectForm mode="edit" initialData={project} />
      </div>
    </div>
  );
}
