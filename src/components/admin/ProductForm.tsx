"use client";

import React, { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  makeProductAvailableAction,
  makeProductUnavailableAction,
  type AdminProductActionState,
} from "@/app/actions/admin-products";
import type { AdminProductRecord } from "@/lib/admin/products";
import { buttonStyles } from "@/components/ui/Button";

interface ProductFormProps {
  initialData?: AdminProductRecord | null;
  mode: "create" | "edit";
}

const initialState: AdminProductActionState = {
  success: false,
};

const PRODUCT_TYPE_OPTIONS = [
  { value: "digital_download", label: "Digital Download" },
  { value: "code_license", label: "Code License" },
  { value: "template", label: "Template" },
  { value: "monograph", label: "Monograph" },
];

const STORE_CATEGORY_OPTIONS = [
  { value: "design", label: "Design Studio" },
  { value: "ai_agents", label: "AI Agents" },
  { value: "digital_products", label: "Digital Products" },
];

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  // Form input local states for real-time helpers
  const [priceInCents, setPriceInCents] = useState<string>(
    initialData?.price_in_cents?.toString() ??
      initialData?.priceInCents?.toString() ??
      "0"
  );
  const [descLength, setDescLength] = useState<number>(
    initialData?.description?.length ?? 0
  );
  const [shortDescLength, setShortDescLength] = useState<number>(
    initialData?.short_description?.length ??
      initialData?.shortDescription?.length ??
      0
  );

  const boundAction =
    mode === "edit" && initialData?.id
      ? updateProductAction.bind(null, initialData.id)
      : createProductAction;

  const [state, formAction, isPending] = useActionState(boundAction, initialState);

  React.useEffect(() => {
    if (state.success && mode === "create" && state.data?.id) {
      router.push(`/admin/store/${state.data.id}/edit`);
    }
  }, [state.success, mode, state.data?.id, router]);

  async function handleDelete() {
    if (!initialData?.id) return;
    setIsDeleting(true);
    setDeleteError(null);

    const result = await deleteProductAction(initialData.id);
    setIsDeleting(false);

    if (result.success) {
      router.push("/admin/store");
    } else {
      setDeleteError(result.error || "Failed to delete product.");
    }
  }

  async function handleToggleAvailability(available: boolean) {
    if (!initialData?.id) return;
    setIsTogglingAvailability(true);

    if (available) {
      await makeProductAvailableAction(initialData.id);
    } else {
      await makeProductUnavailableAction(initialData.id);
    }

    setIsTogglingAvailability(false);
    router.refresh();
  }

  const isCurrentlyAvailable = Boolean(
    initialData?.is_available ?? initialData?.isAvailable ?? true
  );
  const isCurrentlyFeatured = Boolean(
    initialData?.is_featured ?? initialData?.isFeatured ?? false
  );

  const initialFeaturesString = Array.isArray(initialData?.features)
    ? initialData.features.join("\n")
    : "";

  const initialFaqString =
    Array.isArray(initialData?.faq) && initialData.faq.length > 0
      ? JSON.stringify(initialData.faq, null, 2)
      : "";

  const calculatedRupees = React.useMemo(() => {
    const num = Number(priceInCents);
    if (isNaN(num) || num < 0) return "[INVALID]";
    return `₹${(num / 100).toFixed(2)}`;
  }, [priceInCents]);

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
          <p>{state.message || "Product edition saved successfully."}</p>
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
            01 // PRODUCT IDENTITY & CATEGORIZATION
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              01
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Product Identity & Categorization
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Primary product title, URL slug, studio category, and release type.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="title"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Product Title *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  2–160 chars
                </span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                maxLength={160}
                defaultValue={initialData?.title ?? ""}
                placeholder="e.g. Autonomous Research Analyst Agent"
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
                placeholder="e.g. autonomous-research-analyst"
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
              />
              {state.fieldErrors?.slug ? (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.slug[0]}
                </p>
              ) : (
                <p className="font-mono text-[10px] text-[var(--color-ink-secondary)]">
                  Public URL path: /store/[slug]
                </p>
              )}
            </div>

            {/* Release Code */}
            <div className="space-y-2">
              <label
                htmlFor="release_code"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Release Code</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Optional (e.g. AGENT-01)
                </span>
              </label>
              <input
                type="text"
                id="release_code"
                name="release_code"
                maxLength={50}
                defaultValue={initialData?.release_code ?? initialData?.releaseCode ?? ""}
                placeholder="e.g. AG-2026-01"
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
              />
              {state.fieldErrors?.release_code && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.release_code[0]}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Store Category *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Hub Classification
                </span>
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue={initialData?.category ?? "digital_products"}
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                {STORE_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.value})
                  </option>
                ))}
              </select>
              {state.fieldErrors?.category && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.category[0]}
                </p>
              )}
            </div>

            {/* Product Type */}
            <div className="space-y-2">
              <label
                htmlFor="product_type"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Product Type *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Controlled Schema Enum
                </span>
              </label>
              <select
                id="product_type"
                name="product_type"
                required
                defaultValue={initialData?.product_type ?? initialData?.productType ?? "digital_download"}
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                {PRODUCT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.value})
                  </option>
                ))}
              </select>
              {state.fieldErrors?.product_type && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.product_type[0]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            02 // EDITORIAL CONTENT & SPECIFICATIONS
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              02
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Editorial Content & Specifications
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Executive summary, comprehensive description, included features, and system requirements.
            </p>
          </div>

          <div className="space-y-6">
            {/* Short Description */}
            <div className="space-y-2">
              <label
                htmlFor="short_description"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Short Summary (Card Synopsis)</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  {shortDescLength} / 300 chars
                </span>
              </label>
              <textarea
                id="short_description"
                name="short_description"
                rows={2}
                maxLength={300}
                defaultValue={initialData?.short_description ?? initialData?.shortDescription ?? ""}
                onChange={(e) => setShortDescLength(e.target.value.length)}
                placeholder="A concise, high-impact overview displayed on index cards and category views..."
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50 leading-relaxed"
              />
              {state.fieldErrors?.short_description && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.short_description[0]}
                </p>
              )}
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Comprehensive Description</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  {descLength} / 5000 chars
                </span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                maxLength={5000}
                defaultValue={initialData?.description ?? ""}
                onChange={(e) => setDescLength(e.target.value.length)}
                placeholder="Provide a comprehensive specification and overview of this studio release..."
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50 leading-relaxed"
              />
              {state.fieldErrors?.description && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.description[0]}
                </p>
              )}
            </div>

            {/* Features list */}
            <div className="space-y-2">
              <label
                htmlFor="features"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Features / What is Included</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  One feature per line (or JSON array)
                </span>
              </label>
              <textarea
                id="features"
                name="features"
                rows={4}
                defaultValue={initialFeaturesString}
                placeholder={"Full source code & documentation\nProduction-ready orchestration pipeline\nAutomated eval harness"}
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50 leading-relaxed"
              />
              {state.fieldErrors?.features && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.features[0]}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <label
                htmlFor="requirements"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>System / Usage Requirements</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Max 2000 chars (Optional)
                </span>
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={3}
                maxLength={2000}
                defaultValue={initialData?.requirements ?? ""}
                placeholder="e.g. Node.js 20+, OpenAI API key, Postgres database..."
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50 leading-relaxed"
              />
              {state.fieldErrors?.requirements && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.requirements[0]}
                </p>
              )}
            </div>

            {/* FAQ (JSON) */}
            <div className="space-y-2">
              <label
                htmlFor="faq"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Frequently Asked Questions (JSON format)</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Array of {`{"question": "...", "answer": "..."}`}
                </span>
              </label>
              <textarea
                id="faq"
                name="faq"
                rows={4}
                defaultValue={initialFaqString}
                placeholder={'[\n  {\n    "question": "Can I use this commercially?",\n    "answer": "Yes, included with the commercial license."\n  }\n]'}
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50 leading-relaxed"
              />
              {state.fieldErrors?.faq && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.faq[0]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            03 // COMMERCIAL METADATA
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              03
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Pricing
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Prices are stored deterministically as integers in minor currency units (paise/cents).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price In Cents */}
            <div className="space-y-2">
              <label
                htmlFor="price_in_cents"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Price (in Cents / Paise) *</span>
                <span className="text-[10px] text-[var(--color-accent)] font-semibold">
                  Live Preview: {calculatedRupees}
                </span>
              </label>
              <input
                type="number"
                id="price_in_cents"
                name="price_in_cents"
                required
                min={0}
                max={100000000}
                step={1}
                value={priceInCents}
                onChange={(e) => setPriceInCents(e.target.value)}
                placeholder="e.g. 50000 for ₹500.00"
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-sm text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              />
              {state.fieldErrors?.price_in_cents ? (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.price_in_cents[0]}
                </p>
              ) : (
                <p className="font-mono text-[10px] text-[var(--color-ink-secondary)]">
                  Example: Enter 49900 for ₹499.00. Enter 0 for complimentary access.
                </p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <label
                htmlFor="currency"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Currency *</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Locked Standard
                </span>
              </label>
              <input
                type="text"
                id="currency"
                name="currency"
                readOnly
                defaultValue="INR"
                className="w-full px-4 py-3 bg-[var(--color-canvas-secondary)] border border-[var(--color-hairline)] rounded-none font-mono text-sm text-[var(--color-ink-secondary)] cursor-not-allowed"
              />
              <p className="font-mono text-[10px] text-[var(--color-ink-secondary)]">
                INR standard format: ₹[Amount]. Zero multi-currency speculation.
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================
            04 // PREVIEW IMAGE
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              04
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Preview Image
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Optional external secure HTTPS preview image asset.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="preview_image_url"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
            >
              <span>Preview Image URL</span>
              <span className="text-[10px] text-[var(--color-ink-secondary)]">
                HTTPS Only
              </span>
            </label>
            <input
              type="url"
              id="preview_image_url"
              name="preview_image_url"
              maxLength={1000}
              defaultValue={initialData?.preview_image_url ?? initialData?.previewImageUrl ?? ""}
              placeholder="https://example.com/assets/edition-preview.jpg"
              className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
            />
            {state.fieldErrors?.preview_image_url ? (
              <p className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.preview_image_url[0]}
              </p>
            ) : (
              <p className="font-mono text-[10px] text-[var(--color-ink-secondary)]">
                Insecure protocols (http:, javascript:, data:, blob:) are strictly rejected.
              </p>
            )}
          </div>
        </section>

        {/* =======================================================
            05 // SYSTEM AVAILABILITY & CURATION
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              05
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Availability & Curation
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Control public visibility, featured catalog spotlighting, and catalog sequence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Availability Checkbox */}
            <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-start gap-4">
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                defaultChecked={isCurrentlyAvailable}
                className="mt-1 w-4 h-4 rounded-none border border-[var(--color-hairline)] accent-[var(--color-accent)]"
              />
              <div className="space-y-1">
                <label
                  htmlFor="is_available"
                  className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] font-semibold cursor-pointer block"
                >
                  Public Availability
                </label>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                  When enabled, this edition is displayed on /store and viewable on /store/[slug].
                </p>
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-start gap-4">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                defaultChecked={isCurrentlyFeatured}
                className="mt-1 w-4 h-4 rounded-none border border-[var(--color-hairline)] accent-[var(--color-accent)]"
              />
              <div className="space-y-1">
                <label
                  htmlFor="is_featured"
                  className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] font-semibold cursor-pointer block"
                >
                  Featured Release
                </label>
                <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                  Pins this product to featured sections and catalog spotlight spots.
                </p>
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label
                htmlFor="sort_order"
                className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
              >
                <span>Sort Order Index</span>
                <span className="text-[10px] text-[var(--color-ink-secondary)]">
                  Ascending (0 = Highest)
                </span>
              </label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                min={-10000}
                max={10000}
                defaultValue={initialData?.sort_order ?? initialData?.sortOrder ?? 0}
                className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              />
              {state.fieldErrors?.sort_order && (
                <p className="font-mono text-xs text-[var(--color-accent)]">
                  {state.fieldErrors.sort_order[0]}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* =======================================================
            06 // PRIVATE ASSET SPECIFICATION
            ======================================================= */}
        <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                06
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5">
                Restricted
              </span>
            </div>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              Digital Asset Fulfillment
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Internal storage reference for digital fulfillment. Strictly managed server-side and never exposed through public queries or browser HTML.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="storage_asset_path"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] flex items-center justify-between"
            >
              <span>Storage Asset Path</span>
              <span className="text-[10px] text-[var(--color-ink-secondary)]">
                Max 500 chars (Internal only)
              </span>
            </label>
            <input
              type="text"
              id="storage_asset_path"
              name="storage_asset_path"
              maxLength={500}
              defaultValue={initialData?.storage_asset_path ?? initialData?.storageAssetPath ?? ""}
              placeholder="e.g. releases/digital-monograph-2026.pdf"
              className="w-full px-4 py-3 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
            />
            {state.fieldErrors?.storage_asset_path && (
              <p className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.storage_asset_path[0]}
              </p>
            )}
            <div className="p-3 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] font-mono text-[10px] text-[var(--color-ink-secondary)] leading-relaxed">
              SECURITY GUARANTEE: public_products view and public queries explicitly omit this field. Client components and public store visitors never receive this path.
            </div>
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
                ? "Save Product Edition"
                : "Save Product Edition"}
            </button>

            {mode === "edit" && (
              <>
                <button
                  type="submit"
                  name="availability_intent"
                  value={isCurrentlyAvailable ? "unavailable" : "available"}
                  disabled={isPending || isTogglingAvailability}
                  className={buttonStyles({
                    variant: "secondary",
                    size: "md",
                    className: "font-mono uppercase tracking-wider text-xs",
                  })}
                >
                  {isCurrentlyAvailable
                    ? "Save & Make Unavailable"
                    : "Save & Make Available"}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleAvailability(!isCurrentlyAvailable)}
                  disabled={isTogglingAvailability || isPending}
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] underline underline-offset-4 transition-colors px-2 py-1"
                >
                  {isCurrentlyAvailable
                    ? "Quick: Make Unavailable"
                    : "Quick: Make Available"}
                </button>
              </>
            )}
          </div>

          <Link
            href="/admin/store"
            className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
          >
            ← Return to Store Catalog
          </Link>
        </div>
      </form>

      {/* =======================================================
          07 // DANGER ZONE (Edit Mode Only)
          ======================================================= */}
      {mode === "edit" && initialData?.id && (
        <section className="pt-12 border-t border-[var(--color-hairline)] space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              07
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Delete Product
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Permanently delete this product edition record from the database.
            </p>
          </div>

          <div className="p-6 border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] font-semibold">
                Purge Product Edition
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
              Delete Product Permanently
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
                Delete this product permanently?
              </h2>
              <p
                id="delete-dialog-description"
                className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed"
              >
                This operation permanently deletes &ldquo;{initialData?.title}&rdquo; (
                <span className="font-mono text-[11px]">{initialData?.slug}</span>) from the catalog.
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
                {isDeleting ? "Purging..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
