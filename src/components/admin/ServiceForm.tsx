"use client";

import React, { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
  activateServiceAction,
  deactivateServiceAction,
  type AdminServiceActionState,
} from "@/app/actions/admin-services";
import type { AdminServiceRecord } from "@/lib/admin/services";
import { buttonStyles } from "@/components/ui/Button";

interface ServiceFormProps {
  initialData?: AdminServiceRecord | null;
  mode: "create" | "edit";
}

const initialState: AdminServiceActionState = {
  success: false,
};

export function ServiceForm({ initialData, mode }: ServiceFormProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  const boundAction =
    mode === "edit" && initialData?.id
      ? updateServiceAction.bind(null, initialData.id)
      : createServiceAction;

  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  React.useEffect(() => {
    if (state.success && mode === "create" && state.data?.id) {
      router.push(`/admin/services/${state.data.id}/edit`);
    }
  }, [state.success, mode, state.data?.id, router]);

  async function handleDelete() {
    if (!initialData?.id) return;
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteServiceAction(initialData.id);
    setIsDeleting(false);

    if (result.success) {
      router.push("/admin/services");
    } else {
      setDeleteError(result.error || "Failed to delete service.");
    }
  }

  async function handleToggleActive(activate: boolean) {
    if (!initialData?.id) return;
    setIsTogglingActive(true);

    if (activate) {
      await activateServiceAction(initialData.id);
    } else {
      await deactivateServiceAction(initialData.id);
    }

    setIsTogglingActive(false);
    router.refresh();
  }

  const isCurrentlyActive = Boolean(
    initialData?.is_active ?? initialData?.isActive ?? true
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
          <p>{state.message || "Service program saved successfully."}</p>
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
            01 SERVICE IDENTITY
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              01
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Service Identity
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Primary offering title and URL slug.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="service-title"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Service Title <span className="text-[var(--color-accent)]">*</span>
              </label>
              <input
                id="service-title"
                name="title"
                type="text"
                defaultValue={initialData?.title ?? ""}
                required
                minLength={2}
                maxLength={160}
                disabled={isPending}
                placeholder="e.g. TECHNICAL ARCHITECTURE ADVISORY"
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
                htmlFor="service-slug"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                URL Slug <span className="text-[var(--color-accent)]">*</span>
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                URL-safe identifier (e.g. fractional-cto, architecture-review).
              </p>
              <input
                id="service-slug"
                name="slug"
                type="text"
                defaultValue={initialData?.slug ?? ""}
                required
                minLength={2}
                maxLength={100}
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                disabled={isPending}
                placeholder="architecture-advisory"
                aria-describedby={state.fieldErrors?.slug ? "error-slug" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-mono text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.slug && (
                <p id="error-slug" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.slug.join(", ")}
                </p>
              )}
            </div>

            {/* Program Code */}
            <div className="space-y-2">
              <label
                htmlFor="service-program_code"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Program Code
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                Archival serial code (e.g. PRG-001, ADV-02).
              </p>
              <input
                id="service-program_code"
                name="program_code"
                type="text"
                defaultValue={initialData?.program_code ?? initialData?.programCode ?? ""}
                maxLength={50}
                disabled={isPending}
                placeholder="PRG-001"
                aria-describedby={state.fieldErrors?.program_code ? "error-program_code" : undefined}
                className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-mono text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
              />
              {state.fieldErrors?.program_code && (
                <p id="error-program_code" className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.program_code.join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            02 SERVICE INTRO
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
              Concise narrative statement displayed on service cards and lead paragraph.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="service-summary"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Summary <span className="text-[var(--color-accent)]">*</span>
            </label>
            <textarea
              id="service-summary"
              name="summary"
              rows={4}
              defaultValue={initialData?.summary ?? ""}
              required
              minLength={5}
              maxLength={1000}
              disabled={isPending}
              placeholder="High-level advisory scope and disciplinary focus..."
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
            03 SERVICE DESCRIPTION
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              03
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Description & Methodology
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Long-form service methodology rendered safely with structured paragraphs. Factual capabilities only — do not claim unverified certifications or compliance credentials.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="service-description_markdown"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Description & Methodology
            </label>
            <textarea
              id="service-description_markdown"
              name="description_markdown"
              rows={10}
              defaultValue={
                initialData?.description_markdown ??
                initialData?.descriptionMarkdown ??
                ""
              }
              maxLength={20000}
              disabled={isPending}
              placeholder="Comprehensive architectural study, design specifications, and implementation decisions..."
              aria-describedby={
                state.fieldErrors?.description_markdown
                  ? "error-description_markdown"
                  : undefined
              }
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] p-4 font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50 resize-y font-mono"
            />
            {state.fieldErrors?.description_markdown && (
              <p
                id="error-description_markdown"
                className="font-mono text-xs text-[var(--color-accent)]"
              >
                {state.fieldErrors.description_markdown.join(", ")}
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            04 ENGAGEMENT
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              04
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Engagement Structure
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Supported models: Fixed Scope, Project-Based, Consulting, Custom Engagement. Leave blank if not yet determined.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="service-engagement_model"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Engagement Model
            </label>
            <input
              id="service-engagement_model"
              name="engagement_model"
              type="text"
              defaultValue={
                initialData?.engagement_model ??
                initialData?.engagementModel ??
                ""
              }
              maxLength={500}
              disabled={isPending}
              placeholder="e.g. Fixed Scope · Project-Based · Consulting · Custom Engagement"
              aria-describedby={
                state.fieldErrors?.engagement_model
                  ? "error-engagement_model"
                  : undefined
              }
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.engagement_model && (
              <p
                id="error-engagement_model"
                className="font-mono text-xs text-[var(--color-accent)]"
              >
                {state.fieldErrors.engagement_model.join(", ")}
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            05 DELIVERABLES
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              05
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Deliverables
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Concrete operational and technical artifacts. List only real, factual deliverables (no fake metrics or unverified certifications).
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="service-deliverables"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Deliverables List
            </label>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Comma-separated items (e.g. Architecture Blueprint, API Specification, Threat Surface Audit).
            </p>
            <input
              id="service-deliverables"
              name="deliverables"
              type="text"
              defaultValue={
                Array.isArray(initialData?.deliverables)
                  ? initialData.deliverables.join(", ")
                  : ""
              }
              disabled={isPending}
              placeholder="Architecture Blueprint, Infrastructure as Code, CI/CD Pipeline"
              aria-describedby={
                state.fieldErrors?.deliverables
                  ? "error-deliverables"
                  : undefined
              }
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.deliverables && (
              <p
                id="error-deliverables"
                className="font-mono text-xs text-[var(--color-accent)]"
              >
                {state.fieldErrors.deliverables.join(", ")}
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            06 PUBLICATION & CURATION
            ======================================================= */}
        <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              06
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Publication & Visibility
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Active status determines visibility across the public website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Sort Order */}
            <div className="space-y-2">
              <label
                htmlFor="service-sort_order"
                className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
              >
                Sort Order (Numeric)
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                Lower numbers appear first in the catalog (e.g. 0, 1, 2).
              </p>
              <input
                id="service-sort_order"
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

            {/* Active Checkbox */}
            <div className="pt-6">
              <label
                htmlFor="service-is_active"
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <input
                  id="service-is_active"
                  name="is_active"
                  type="checkbox"
                  defaultChecked={isCurrentlyActive}
                  disabled={isPending}
                  className="w-4 h-4 border border-[var(--color-hairline)] rounded-none accent-[var(--color-accent)] cursor-pointer"
                />
                <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)]">
                  Active (Publicly Visible)
                </span>
              </label>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] pl-7 pt-1">
                Inactive services are hidden from public listings and direct slug views.
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
                  isCurrentlyActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-ink-secondary)]"
                }`}
              >
                {isCurrentlyActive ? "✓ ACTIVE (PUBLIC)" : "○ INACTIVE (PRIVATE DRAFT)"}
              </span>
            </div>

            {mode === "edit" && initialData?.id && (
              <button
                type="button"
                onClick={() => handleToggleActive(!isCurrentlyActive)}
                disabled={isTogglingActive || isPending}
                className="font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors disabled:opacity-50"
              >
                {isTogglingActive
                  ? "Updating..."
                  : isCurrentlyActive
                  ? "Deactivate Service"
                  : "Activate Service"}
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
              href="/admin/services"
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
                Delete Service
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Save as Inactive/Draft or standard save */}
            <button
              type="submit"
              name="activation_intent"
              value="deactivate"
              disabled={isPending}
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
              })}
            >
              {isPending ? "Saving..." : "Save Inactive"}
            </button>

            {/* Save & Activate */}
            <button
              type="submit"
              name="activation_intent"
              value="activate"
              disabled={isPending}
              className={buttonStyles({
                variant: "primary",
                size: "lg",
                className: "disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
              })}
            >
              {isPending ? "Persisting..." : "Save & Activate →"}
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
                Delete this service permanently?
              </h3>
              <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                This action is destructive and cannot be undone. The service offering record
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
