"use client";

import React, { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  publishProjectAction,
  unpublishProjectAction,
  type AdminProjectActionState,
} from "@/app/actions/admin-projects";
import type { AdminProjectRecord } from "@/lib/admin/projects";
import { buttonStyles } from "@/components/ui/Button";

interface ProjectFormProps {
  initialData?: AdminProjectRecord | null;
  mode: "create" | "edit";
}

const initialState: AdminProjectActionState = {
  success: false,
};

export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  const boundAction =
    mode === "edit" && initialData?.id
      ? updateProjectAction.bind(null, initialData.id)
      : createProjectAction;

  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  // Handle redirect after successful creation
  React.useEffect(() => {
    if (state.success && mode === "create" && state.data?.id) {
      router.push(`/admin/projects/${state.data.id}/edit`);
    }
  }, [state.success, mode, state.data?.id, router]);

  async function handleDelete() {
    if (!initialData?.id) return;
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteProjectAction(initialData.id);
    setIsDeleting(false);

    if (result.success) {
      router.push("/admin/projects");
    } else {
      setDeleteError(result.error || "Failed to delete project.");
    }
  }

  async function handleTogglePublish(publish: boolean) {
    if (!initialData?.id) return;
    setIsTogglingPublish(true);

    if (publish) {
      await publishProjectAction(initialData.id);
    } else {
      await unpublishProjectAction(initialData.id);
    }

    setIsTogglingPublish(false);
    router.refresh();
  }

  const isCurrentlyPublished = Boolean(
    initialData?.published_at || initialData?.publishedAt
  );

  return (
    <div className="space-y-8">
      {/* Top Notification Banners */}
      {state.success && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 border border-[var(--color-ink-primary)] bg-[var(--color-canvas-secondary)] font-mono text-xs text-[var(--color-ink-primary)] space-y-1"
        >
          <span className="font-semibold uppercase tracking-wider text-[var(--color-accent)] block">
            ✓ SUCCESS
          </span>
          <p>{state.message || "Project saved successfully."}</p>
        </div>
      )}

      {state.error && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 border border-[var(--color-accent)] bg-[var(--color-accent)]/5 font-mono text-xs text-[var(--color-accent)] space-y-1"
        >
          <span className="font-semibold uppercase tracking-wider block">
            MUTATION REJECTED
          </span>
          <p>{state.error}</p>
        </div>
      )}

      {deleteError && (
        <div
          role="alert"
          className="p-4 border border-[var(--color-accent)] bg-[var(--color-accent)]/5 font-mono text-xs text-[var(--color-accent)] space-y-1"
        >
          <span className="font-semibold uppercase tracking-wider block">
            DELETION FAILED
          </span>
          <p>{deleteError}</p>
        </div>
      )}

      <form action={formAction} className="space-y-12">
        {/* =======================================================
            01 PROJECT IDENTITY
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              01
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Project Identity
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Core naming, URL slug, and primary classification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="project-title"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Project Title <span className="text-[var(--color-accent)]">*</span>
              </label>
              <input
                id="project-title"
                name="title"
                type="text"
                defaultValue={initialData?.title ?? ""}
                required
                minLength={2}
                maxLength={160}
                disabled={isPending}
                placeholder="Project title..."
                aria-describedby={state.fieldErrors?.title ? "error-title" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.title && (
                <p id="error-title" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.title.join(", ")}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label
                htmlFor="project-slug"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                URL Slug <span className="text-[var(--color-accent)]">*</span>
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                URL-safe identifier (e.g. yojna-setu, realguard, quickeats).
              </p>
              <input
                id="project-slug"
                name="slug"
                type="text"
                defaultValue={initialData?.slug ?? ""}
                required
                minLength={2}
                maxLength={100}
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                disabled={isPending}
                placeholder="yojna-setu"
                aria-describedby={state.fieldErrors?.slug ? "error-slug" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-mono text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.slug && (
                <p id="error-slug" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.slug.join(", ")}
                </p>
              )}
            </div>

            {/* Edition Code */}
            <div className="space-y-2">
              <label
                htmlFor="project-edition_code"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Edition Code
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                Archival monograph serial (e.g. ED-001, MONO-04).
              </p>
              <input
                id="project-edition_code"
                name="edition_code"
                type="text"
                defaultValue={initialData?.edition_code ?? initialData?.editionCode ?? ""}
                maxLength={50}
                disabled={isPending}
                placeholder="ED-001"
                aria-describedby={state.fieldErrors?.edition_code ? "error-edition_code" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-mono text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.edition_code && (
                <p id="error-edition_code" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.edition_code.join(", ")}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="project-category"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Disciplinary Category
              </label>
              <input
                id="project-category"
                name="category"
                type="text"
                defaultValue={initialData?.category ?? ""}
                maxLength={80}
                disabled={isPending}
                placeholder="Category name (optional)..."
                aria-describedby={state.fieldErrors?.category ? "error-category" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.category && (
                <p id="error-category" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.category.join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            02 PROJECT INTRO
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              02
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Summary
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Concise narrative statement displayed on project cards and lead paragraph.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-summary"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Summary <span className="text-[var(--color-accent)]">*</span>
            </label>
            <textarea
              id="project-summary"
              name="summary"
              rows={4}
              defaultValue={initialData?.summary ?? ""}
              required
              minLength={5}
              maxLength={1000}
              disabled={isPending}
              placeholder="High-level engineering monograph thesis and architectural scope..."
              aria-describedby={state.fieldErrors?.summary ? "error-summary" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] p-4 font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50 resize-y"
            />
            {state.fieldErrors?.summary && (
              <p id="error-summary" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.summary.join(", ")}
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            03 CASE STUDY
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              03
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Case Study & Architecture
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Long-form case study. Recommended structure: Problem → Approach → Architecture → Engineering Decisions → Security Considerations → Verified Outcomes.
            </p>
            <p className="font-mono text-[11px] text-[var(--color-accent)]">
              Factual engineering only: never invent performance metrics or enterprise certifications. Never expose private API keys, credentials, or internal endpoints.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-case_study_markdown"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Case Study Markdown
            </label>
            <textarea
              id="project-case_study_markdown"
              name="case_study_markdown"
              rows={10}
              defaultValue={
                initialData?.case_study_markdown ??
                initialData?.caseStudyMarkdown ??
                ""
              }
              maxLength={20000}
              disabled={isPending}
              placeholder="Comprehensive architectural study, design specifications, and implementation decisions..."
              aria-describedby={
                state.fieldErrors?.case_study_markdown
                  ? "error-case_study_markdown"
                  : undefined
              }
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] p-4 font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50 resize-y font-mono"
            />
            {state.fieldErrors?.case_study_markdown && (
              <p
                id="error-case_study_markdown"
                className="font-mono text-xs text-[var(--color-accent)]"
              >
                {state.fieldErrors.case_study_markdown.join(", ")}
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            04 TECHNICAL DETAILS
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              04
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Technical Details
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Technology stack and execution year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Stack */}
            <div className="space-y-2">
              <label
                htmlFor="project-tech_stack"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Technology Stack
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                Comma-separated tags (e.g. Next.js, TypeScript, PostgreSQL, Supabase).
              </p>
              <input
                id="project-tech_stack"
                name="tech_stack"
                type="text"
                defaultValue={
                  Array.isArray(initialData?.tech_stack ?? initialData?.techStack)
                    ? (initialData?.tech_stack ?? initialData?.techStack ?? []).join(", ")
                    : ""
                }
                disabled={isPending}
                placeholder="TypeScript, Next.js, Postgres, Docker"
                aria-describedby={state.fieldErrors?.tech_stack ? "error-tech_stack" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.tech_stack && (
                <p id="error-tech_stack" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.tech_stack.join(", ")}
                </p>
              )}
            </div>

            {/* Project Year */}
            <div className="space-y-2">
              <label
                htmlFor="project-project_year"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Project Year
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                Execution calendar year (1990–2100).
              </p>
              <input
                id="project-project_year"
                name="project_year"
                type="number"
                min={1990}
                max={2100}
                defaultValue={initialData?.project_year ?? initialData?.projectYear ?? new Date().getFullYear()}
                disabled={isPending}
                placeholder="2026"
                aria-describedby={state.fieldErrors?.project_year ? "error-project_year" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-mono text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.project_year && (
                <p id="error-project_year" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.project_year.join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            05 VISUAL
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              05
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Cover Image
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Primary project preview visual. Must be a valid absolute HTTPS URL.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="project-cover_image_url"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Cover Image URL (HTTPS)
            </label>
            <input
              id="project-cover_image_url"
              name="cover_image_url"
              type="url"
              defaultValue={initialData?.cover_image_url ?? initialData?.coverImageUrl ?? ""}
              maxLength={500}
              disabled={isPending}
              placeholder="https://example.com/cover-image.jpg"
              aria-describedby={state.fieldErrors?.cover_image_url ? "error-cover_image_url" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.cover_image_url && (
              <p id="error-cover_image_url" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.cover_image_url.join(", ")}
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            06 EXTERNAL REFERENCES
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              06
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              External Links
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Direct links to live systems and repository.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live URL */}
            <div className="space-y-2">
              <label
                htmlFor="project-live_url"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Live System URL
              </label>
              <input
                id="project-live_url"
                name="live_url"
                type="url"
                defaultValue={initialData?.live_url ?? initialData?.liveUrl ?? ""}
                maxLength={500}
                disabled={isPending}
                placeholder="https://alpha.example.com"
                aria-describedby={state.fieldErrors?.live_url ? "error-live_url" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.live_url && (
                <p id="error-live_url" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.live_url.join(", ")}
                </p>
              )}
            </div>

            {/* GitHub URL */}
            <div className="space-y-2">
              <label
                htmlFor="project-github_url"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Repository URL
              </label>
              <input
                id="project-github_url"
                name="github_url"
                type="url"
                defaultValue={initialData?.github_url ?? initialData?.githubUrl ?? ""}
                maxLength={500}
                disabled={isPending}
                placeholder="https://github.com/shivam-shukla888/project"
                aria-describedby={state.fieldErrors?.github_url ? "error-github_url" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.github_url && (
                <p id="error-github_url" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.github_url.join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            07 PUBLICATION
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              07
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Publication & Visibility
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Sort order, featured status, and public visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Sort Order */}
            <div className="space-y-2">
              <label
                htmlFor="project-sort_order"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Sort Order (Numeric)
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                Lower numbers appear first in the catalog (e.g. 0, 1, 2).
              </p>
              <input
                id="project-sort_order"
                name="sort_order"
                type="number"
                min={-10000}
                max={10000}
                defaultValue={initialData?.sort_order ?? initialData?.sortOrder ?? 0}
                disabled={isPending}
                aria-describedby={state.fieldErrors?.sort_order ? "error-sort_order" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-mono text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.sort_order && (
                <p id="error-sort_order" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.sort_order.join(", ")}
                </p>
              )}
            </div>

            {/* Featured Checkbox */}
            <div className="pt-6">
              <label
                htmlFor="project-is_featured"
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  id="project-is_featured"
                  name="is_featured"
                  type="checkbox"
                  defaultChecked={Boolean(
                    initialData?.is_featured ?? initialData?.isFeatured
                  )}
                  disabled={isPending}
                  className="w-4 h-4 border border-[var(--color-hairline)] rounded-none accent-[var(--color-accent)] cursor-pointer"
                />
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)]">
                  Feature in Homepage Selected Index
                </span>
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] pl-7 pt-1">
                Featured projects are spotlighted in the hero showcase.
              </p>
            </div>
          </div>

          {/* Current Publication State */}
          <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-secondary)] block">
                CURRENT VISIBILITY STATUS
              </span>
              <span
                className={`font-mono text-xs uppercase font-medium ${
                  isCurrentlyPublished
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink-secondary)]"
                }`}
              >
                {isCurrentlyPublished
                  ? `✓ PUBLISHED (${new Date(
                      initialData?.published_at || initialData?.publishedAt || ""
                    ).toLocaleDateString()})`
                  : "○ DRAFT (PRIVATE)"}
              </span>
            </div>

            {mode === "edit" && initialData?.id && (
              <button
                type="button"
                onClick={() => handleTogglePublish(!isCurrentlyPublished)}
                disabled={isTogglingPublish || isPending}
                className="font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-50"
              >
                {isTogglingPublish
                  ? "Updating..."
                  : isCurrentlyPublished
                  ? "Unpublish to Draft"
                  : "Publish Now"}
              </button>
            )}
          </div>
        </section>

        {/* =======================================================
            SUBMISSION & ACTIONS BAR
            ======================================================= */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/projects"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
            >
              ← Cancel
            </Link>

            {mode === "edit" && initialData?.id && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isPending || isDeleting}
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-accent)] hover:underline transition-colors"
              >
                Delete Project
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Save as Draft or normal save */}
            <button
              type="submit"
              name="publish_intent"
              value="draft"
              disabled={isPending}
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
              })}
            >
              {isPending ? "Saving..." : "Save Project"}
            </button>

            {/* Save & Publish */}
            <button
              type="submit"
              name="publish_intent"
              value="publish"
              disabled={isPending}
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
              })}
            >
              {isPending ? "Persisting..." : "Save & Publish →"}
            </button>
          </div>
        </div>
      </form>

      {/* Explicit Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] max-w-md w-full p-6 space-y-6">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                CONFIRM DELETION
              </span>
              <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
                Delete this project permanently?
              </h3>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                This action is destructive and cannot be undone. The monograph record
                for &apos;{initialData?.title}&apos; will be purged from the archive.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-hairline)]">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="font-mono text-xs uppercase tracking-[0.08em] px-4 py-2 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="font-mono text-xs uppercase tracking-[0.08em] px-4 py-2 bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
