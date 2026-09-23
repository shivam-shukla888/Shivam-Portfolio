"use client";

import React, { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createLabEntryAction,
  updateLabEntryAction,
  deleteLabEntryAction,
  publishLabEntryAction,
  unpublishLabEntryAction,
  type AdminLabActionState,
} from "@/app/actions/admin-lab";
import type { AdminLabEntryRecord } from "@/lib/admin/lab";
import { buttonStyles } from "@/components/ui/Button";

interface LabEntryFormProps {
  initialData?: AdminLabEntryRecord | null;
  mode: "create" | "edit";
}

const initialState: AdminLabActionState = {
  success: false,
};

const CATEGORY_OPTIONS = [
  { value: "idea", label: "Idea" },
  { value: "build", label: "Build" },
  { value: "stack", label: "Stack" },
  { value: "thought", label: "Thought" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "wip", label: "Work In Progress (wip)" },
  { value: "experimental", label: "Experimental" },
  { value: "archived", label: "Archived" },
  { value: "published", label: "Published" },
];

export function LabEntryForm({ initialData, mode }: LabEntryFormProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isTogglingPublish, setIsTogglingPublish] = useState(false);

  // Form input local states for real-time helpers
  const [contentLength, setContentLength] = useState<number>(
    initialData?.content_markdown?.length ??
      initialData?.contentMarkdown?.length ??
      0
  );
  const [tagsInput, setTagsInput] = useState<string>(
    initialData?.tags?.join(", ") ?? ""
  );

  const boundAction =
    mode === "edit" && initialData?.id
      ? updateLabEntryAction.bind(null, initialData.id)
      : createLabEntryAction;

  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  React.useEffect(() => {
    if (state.success && mode === "create" && state.data?.id) {
      router.push(`/admin/lab/${state.data.id}/edit`);
    }
  }, [state.success, mode, state.data?.id, router]);

  async function handleDelete() {
    if (!initialData?.id) return;
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteLabEntryAction(initialData.id);
    setIsDeleting(false);

    if (result.success) {
      router.push("/admin/lab");
    } else {
      setDeleteError(result.error || "Failed to delete lab artifact.");
    }
  }

  async function handleTogglePublish(publish: boolean) {
    if (!initialData?.id) return;
    setIsTogglingPublish(true);

    if (publish) {
      await publishLabEntryAction(initialData.id);
    } else {
      await unpublishLabEntryAction(initialData.id);
    }

    setIsTogglingPublish(false);
    router.refresh();
  }

  const isPublic = Boolean(
    initialData?.is_public ?? initialData?.isPublic ?? false
  );
  const publishedAt =
    initialData?.published_at ?? initialData?.publishedAt ?? null;
  const isCurrentlyPublic = isPublic && publishedAt !== null;

  const parsedTagChips = React.useMemo(() => {
    return tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [tagsInput]);

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
          <p>{state.message || "Personal Lab artifact saved successfully."}</p>
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
            01 LAB IDENTITY
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              01
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Lab Entry Identity
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Title, URL slug, and research category (Idea, Build, Stack, Thought).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="title"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Artifact Title *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  2–200 chars
                </span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength={200}
                defaultValue={initialData?.title ?? ""}
                placeholder="e.g. Distributed Consensus Engine Prototype"
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
              />
              {state.fieldErrors?.title && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.title[0]}
                </p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Slug *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  lowercase kebab-case
                </span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                maxLength={100}
                defaultValue={initialData?.slug ?? ""}
                placeholder="e.g. distributed-consensus-engine-prototype"
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
              />
              {state.fieldErrors?.slug ? (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.slug[0]}
                </p>
              ) : (
                <p className="font-mono text-[10px] text-[var(--color-ink-secondary)]">
                  Public URL path: /lab/[slug]
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Research Category *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Select Category
                </span>
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={initialData?.category ?? "idea"}
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({cat.value})
                  </option>
                ))}
              </select>
              {state.fieldErrors?.category && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.category[0]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            02 ARTIFACT
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              02
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Narrative & Content
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Technical notes, architectural thoughts, code snippets, or prototype descriptions. Executable scripts and raw HTML injection are prohibited.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="content_markdown"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
            >
              <span>Markdown Content</span>
              <span className="text-[10px] text-[var(--color-ink-secondary)]">
                {contentLength} / 20,000 chars
              </span>
            </label>
            <textarea
              id="content_markdown"
              name="content_markdown"
              rows={10}
              maxLength={20000}
              defaultValue={
                initialData?.content_markdown ??
                initialData?.contentMarkdown ??
                ""
              }
              onChange={(e) => setContentLength(e.target.value.length)}
              placeholder="Record the research monograph, architecture breakdown, or prototype documentation..."
              className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50 leading-relaxed font-normal"
            />
            {state.fieldErrors?.content_markdown && (
              <p className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.content_markdown[0]}
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            03 TAGS
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              03
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Tags
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Comma-separated taxonomy descriptors. Deduplicated and sanitized automatically.
            </p>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="tags"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
            >
              <span>Tags (Comma-Separated)</span>
              <span className="text-[10px] text-[var(--color-ink-secondary)]">
                Up to 20 items (max 50 chars each)
              </span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Distributed Systems, Rust, WebAssembly, Networking"
              className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
            />
            {state.fieldErrors?.tags && (
              <p className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.tags[0]}
              </p>
            )}

            {parsedTagChips.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {parsedTagChips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-secondary)]"
                  >
                    #{chip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =======================================================
            04 STATE & VISIBILITY
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              04
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Status & Visibility
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Workflow status and public visibility control. Status alone does NOT make an entry public.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Workflow Status *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Controlled Lifecycle
                </span>
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue={initialData?.status ?? "draft"}
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label} ({st.value})
                  </option>
                ))}
              </select>
              {state.fieldErrors?.status && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.status[0]}
                </p>
              )}
            </div>

            {/* Public Visibility Checkbox */}
            <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-start gap-4">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                defaultChecked={isPublic}
                className="mt-1 w-4 h-4 rounded-none border border-[var(--color-hairline)] accent-[var(--color-accent)]"
              />
              <div className="space-y-1">
                <label
                  htmlFor="is_public"
                  className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] font-semibold cursor-pointer block"
                >
                  Public Flag (is_public)
                </label>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                  Both conditions required for public exposure: <span className="font-mono text-[11px]">is_public = true</span> AND <span className="font-mono text-[11px]">published_at IS NOT NULL</span>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            05 // PUBLICATION
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              05
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Publication Timestamp
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Current visibility status based on database query constraint: is_public = true AND published_at IS NOT NULL.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-secondary)] block">
                  EFFECTIVE PUBLIC STATUS
                </span>
                <span className="font-display text-lg text-[var(--color-ink-primary)]">
                  {isCurrentlyPublic ? (
                    <span className="text-[var(--color-accent)]">● Publicly Visible</span>
                  ) : (
                    <span className="text-[var(--color-ink-secondary)]">○ Private / Unpublished</span>
                  )}
                </span>
              </div>
              <div className="text-right font-mono text-xs text-[var(--color-ink-secondary)]">
                <span>Published At: </span>
                <span className="text-[var(--color-ink-primary)] font-medium">
                  {publishedAt ? new Date(publishedAt).toUTCString() : "NULL (Unpublished)"}
                </span>
              </div>
            </div>

            <input
              type="hidden"
              name="published_at"
              value={publishedAt ?? ""}
            />
          </div>
        </section>

        {/* =======================================================
            ACTIONS BAR
            ======================================================= */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className={buttonStyles({
                variant: "primary",
                size: "md",
                className: "font-mono uppercase tracking-wider text-xs",
              })}
            >
              {isPending
                ? "Processing..."
                : mode === "create"
                ? "Save Lab Entry"
                : "Save Lab Entry"}
            </button>

            {mode === "edit" && (
              <>
                <button
                  type="submit"
                  name="publish_intent"
                  value={isCurrentlyPublic ? "unpublish" : "publish"}
                  disabled={isPending || isTogglingPublish}
                  className={buttonStyles({
                    variant: "secondary",
                    size: "md",
                    className: "font-mono uppercase tracking-wider text-xs",
                  })}
                >
                  {isCurrentlyPublic
                    ? "Save & Unpublish"
                    : "Save & Publish"}
                </button>

                <button
                  type="button"
                  onClick={() => handleTogglePublish(!isCurrentlyPublic)}
                  disabled={isTogglingPublish || isPending}
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] underline underline-offset-4 transition-colors px-2 py-1"
                >
                  {isCurrentlyPublic ? "Quick: Unpublish" : "Quick: Publish"}
                </button>
              </>
            )}
          </div>

          <Link
            href="/admin/lab"
            className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
          >
            ← Return to Lab Catalog
          </Link>
        </div>
      </form>

      {/* =======================================================
          06 // DANGER ZONE (Edit Mode Only)
          ======================================================= */}
      {mode === "edit" && initialData?.id && (
        <section className="pt-12 border-t border-[var(--color-hairline)] space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              06
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Delete Entry
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Permanently delete this Personal Lab entry from the database.
            </p>
          </div>

          <div className="p-6 border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] font-semibold">
                Purge Lab Artifact
              </h3>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                Permanent deletion. This action cannot be reversed.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 border border-[var(--color-accent)] text-[var(--color-accent)] font-mono text-xs uppercase tracking-wider hover:bg-[var(--color-accent)] hover:text-white transition-colors self-start sm:self-center"
            >
              Delete Entry Permanently
            </button>
          </div>
        </section>
      )}

      {/* Accessible Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
        >
          <div className="max-w-md w-full border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-6 space-y-6 shadow-xl">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)] block">
                CONFIRM IRREVERSIBLE PURGE
              </span>
              <h2
                id="delete-dialog-title"
                className="font-display text-xl text-[var(--color-ink-primary)]"
              >
                Delete this Lab entry permanently?
              </h2>
              <p
                id="delete-dialog-description"
                className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed"
              >
                This operation permanently deletes &ldquo;{initialData?.title}&rdquo; (
                <span className="font-mono text-[11px]">{initialData?.slug}</span>) from the research laboratory.
                Public access will be immediately terminated.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-[var(--color-accent)] font-mono text-xs uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
              >
                {isDeleting ? "Purging..." : "Delete Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
