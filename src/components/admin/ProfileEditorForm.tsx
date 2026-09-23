"use client";

import React, { useActionState } from "react";
import {
  updateProfileSettingsAction,
  type AdminProfileActionState,
} from "@/app/actions/admin-profile";
import type { AdminProfileRecord } from "@/lib/admin/profile";
import { buttonStyles } from "@/components/ui/Button";

interface ProfileEditorFormProps {
  initialData: AdminProfileRecord | null;
}

const initialState: AdminProfileActionState = {
  success: false,
};

export function ProfileEditorForm({ initialData }: ProfileEditorFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileSettingsAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-12">
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
          <p>{state.message || "Profile settings successfully updated and published."}</p>
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

      {/* =======================================================
          01 IDENTITY
          ======================================================= */}
      <section className="space-y-6 pt-2 pb-8 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              01 IDENTITY
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
              Public: Site-wide
            </span>
          </div>
          <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
            Identity & Contact
          </h2>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Core studio operator identification displayed across headers, hero, and direct dispatch channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="profile-full_name"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Full Name <span className="text-[var(--color-accent)]">*</span>
            </label>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Primary operator name displayed in display serif across the entire site.
            </p>
            <input
              id="profile-full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              defaultValue={initialData?.full_name ?? initialData?.fullName ?? "Shivam Shukla"}
              required
              minLength={2}
              maxLength={120}
              disabled={isPending}
              aria-describedby={state.fieldErrors?.full_name ? "error-full_name" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.full_name && (
              <p id="error-full_name" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.full_name.join(", ")}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="profile-email"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Email Address <span className="text-[var(--color-accent)]">*</span>
            </label>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Direct administrative contact email for inquiries and studio communications.
            </p>
            <input
              id="profile-email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={initialData?.email ?? "theshivamshukla.4uu@gmail.com"}
              required
              maxLength={255}
              disabled={isPending}
              aria-describedby={state.fieldErrors?.email ? "error-email" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.email && (
              <p id="error-email" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.email.join(", ")}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label
              htmlFor="profile-phone"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Phone Number
            </label>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Direct voice/telephony channel displayed on contact views.
            </p>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={initialData?.phone ?? "8887780625"}
              maxLength={35}
              disabled={isPending}
              aria-describedby={state.fieldErrors?.phone ? "error-phone" : undefined}
              placeholder="+91 8887780625"
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.phone && (
              <p id="error-phone" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.phone.join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =======================================================
          02 HERO & POSITIONING
          ======================================================= */}
      <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              02 HERO & POSITIONING
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
              Public: Homepage Overview
            </span>
          </div>
          <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
            Hero & Positioning
          </h2>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Homepage lead typography, disciplinary tagline, and advisory status banner.
          </p>
        </div>

        {/* Positioning Statement */}
        <div className="space-y-2">
          <label
            htmlFor="profile-positioning_statement"
            className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
          >
            Positioning Statement
          </label>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Short disciplinary tagline beneath the hero title. Leave empty to render canonical placeholder.
          </p>
          <input
            id="profile-positioning_statement"
            name="positioning_statement"
            type="text"
            defaultValue={initialData?.positioning_statement ?? initialData?.positioningStatement ?? ""}
            maxLength={300}
            disabled={isPending}
            placeholder="Concise disciplinary positioning statement..."
            aria-describedby={state.fieldErrors?.positioning_statement ? "error-positioning_statement" : undefined}
            className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
          />
          {state.fieldErrors?.positioning_statement && (
            <p id="error-positioning_statement" className="font-mono text-xs text-[var(--color-accent)]">
              {state.fieldErrors.positioning_statement.join(", ")}
            </p>
          )}
        </div>

        {/* Hero Supporting Text */}
        <div className="space-y-2">
          <label
            htmlFor="profile-hero_supporting_text"
            className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
          >
            Hero Supporting Text
          </label>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Introductory narrative paragraph on the homepage hero. Leave empty to render canonical placeholder.
          </p>
          <textarea
            id="profile-hero_supporting_text"
            name="hero_supporting_text"
            rows={3}
            defaultValue={initialData?.hero_supporting_text ?? initialData?.heroSupportingText ?? ""}
            maxLength={600}
            disabled={isPending}
            aria-describedby={state.fieldErrors?.hero_supporting_text ? "error-hero_supporting_text" : undefined}
            className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] p-4 font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50 resize-y"
          />
          {state.fieldErrors?.hero_supporting_text && (
            <p id="error-hero_supporting_text" className="font-mono text-xs text-[var(--color-accent)]">
              {state.fieldErrors.hero_supporting_text.join(", ")}
            </p>
          )}
        </div>

        {/* Availability Status */}
        <div className="space-y-2">
          <label
            htmlFor="profile-availability_status"
            className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
          >
            Availability Status
          </label>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Monospace badge status on hero. Leave empty to omit badge.
          </p>
          <input
            id="profile-availability_status"
            name="availability_status"
            type="text"
            defaultValue={initialData?.availability_status ?? initialData?.availabilityStatus ?? ""}
            maxLength={100}
            disabled={isPending}
            placeholder="Availability statement (optional)..."
            aria-describedby={state.fieldErrors?.availability_status ? "error-availability_status" : undefined}
            className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
          />
          {state.fieldErrors?.availability_status && (
            <p id="error-availability_status" className="font-mono text-xs text-[var(--color-accent)]">
              {state.fieldErrors.availability_status.join(", ")}
            </p>
          )}
        </div>
      </section>

      {/* =======================================================
          03 ABOUT
          ======================================================= */}
      <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              03 ABOUT
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
              Public: /about & Homepage Section 02
            </span>
          </div>
          <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
            About Content & Ethos
          </h2>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Full biographical ethos displayed on /about and Section 02. Leave empty to render canonical placeholder.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-about_markdown"
            className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
          >
            About Markdown
          </label>
          <textarea
            id="profile-about_markdown"
            name="about_markdown"
            rows={7}
            defaultValue={initialData?.about_markdown ?? initialData?.aboutMarkdown ?? ""}
            maxLength={5000}
            disabled={isPending}
            aria-describedby={state.fieldErrors?.about_markdown ? "error-about_markdown" : undefined}
            placeholder="Studio ethos and architectural philosophy..."
            className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] p-4 font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50 resize-y"
          />
          {state.fieldErrors?.about_markdown && (
            <p id="error-about_markdown" className="font-mono text-xs text-[var(--color-accent)]">
              {state.fieldErrors.about_markdown.join(", ")}
            </p>
          )}
        </div>
      </section>

      {/* =======================================================
          04 CONTACT
          ======================================================= */}
      <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              04 CONTACT
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
              Public: /contact & Homepage Section 06
            </span>
          </div>
          <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
            Contact Instructions
          </h2>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            Inquiry parameters, engagement expectations, and dispatch instructions displayed above inquiry forms.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="profile-contact_instructions"
            className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
          >
            Dispatch Instructions
          </label>
          <textarea
            id="profile-contact_instructions"
            name="contact_instructions"
            rows={4}
            defaultValue={initialData?.contact_instructions ?? initialData?.contactInstructions ?? ""}
            maxLength={1000}
            disabled={isPending}
            aria-describedby={state.fieldErrors?.contact_instructions ? "error-contact_instructions" : undefined}
            placeholder="Guidelines for advisory inquiries..."
            className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] p-4 font-sans text-sm text-[var(--color-ink-primary)] leading-relaxed focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50 resize-y"
          />
          {state.fieldErrors?.contact_instructions && (
            <p id="error-contact_instructions" className="font-mono text-xs text-[var(--color-accent)]">
              {state.fieldErrors.contact_instructions.join(", ")}
            </p>
          )}
        </div>
      </section>

      {/* =======================================================
          05 VERIFIED PROFILES
          ======================================================= */}
      <section className="space-y-6 pb-8 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
              05 VERIFIED PROFILES
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
              Public: /contact & Site Footer
            </span>
          </div>
          <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
            Social & External Channels
          </h2>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            External platform channels. Must be valid absolute HTTPS URLs (e.g. https://...).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contra */}
          <div className="space-y-2">
            <label
              htmlFor="profile-contra_url"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Contra URL
            </label>
            <input
              id="profile-contra_url"
              name="contra_url"
              type="url"
              defaultValue={initialData?.contra_url ?? initialData?.contraUrl ?? ""}
              maxLength={500}
              disabled={isPending}
              placeholder="https://contra.com/..."
              aria-describedby={state.fieldErrors?.contra_url ? "error-contra_url" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.contra_url && (
              <p id="error-contra_url" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.contra_url.join(", ")}
              </p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <label
              htmlFor="profile-linkedin_url"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              LinkedIn URL
            </label>
            <input
              id="profile-linkedin_url"
              name="linkedin_url"
              type="url"
              defaultValue={initialData?.linkedin_url ?? initialData?.linkedinUrl ?? ""}
              maxLength={500}
              disabled={isPending}
              placeholder="https://www.linkedin.com/in/..."
              aria-describedby={state.fieldErrors?.linkedin_url ? "error-linkedin_url" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.linkedin_url && (
              <p id="error-linkedin_url" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.linkedin_url.join(", ")}
              </p>
            )}
          </div>

          {/* GitHub */}
          <div className="space-y-2">
            <label
              htmlFor="profile-github_url"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              GitHub URL
            </label>
            <input
              id="profile-github_url"
              name="github_url"
              type="url"
              defaultValue={initialData?.github_url ?? initialData?.githubUrl ?? ""}
              maxLength={500}
              disabled={isPending}
              placeholder="https://github.com/..."
              aria-describedby={state.fieldErrors?.github_url ? "error-github_url" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.github_url && (
              <p id="error-github_url" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.github_url.join(", ")}
              </p>
            )}
          </div>

          {/* Instagram */}
          <div className="space-y-2">
            <label
              htmlFor="profile-instagram_url"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              Instagram URL
            </label>
            <input
              id="profile-instagram_url"
              name="instagram_url"
              type="url"
              defaultValue={initialData?.instagram_url ?? initialData?.instagramUrl ?? ""}
              maxLength={500}
              disabled={isPending}
              placeholder="https://www.instagram.com/..."
              aria-describedby={state.fieldErrors?.instagram_url ? "error-instagram_url" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.instagram_url && (
              <p id="error-instagram_url" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.instagram_url.join(", ")}
              </p>
            )}
          </div>

          {/* X */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="profile-x_url"
              className="block font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink-primary)]"
            >
              X / Twitter URL
            </label>
            <input
              id="profile-x_url"
              name="x_url"
              type="url"
              defaultValue={initialData?.x_url ?? initialData?.xUrl ?? ""}
              maxLength={500}
              disabled={isPending}
              placeholder="https://x.com/..."
              aria-describedby={state.fieldErrors?.x_url ? "error-x_url" : undefined}
              className="w-full bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] px-4 py-3 font-sans text-sm text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-ink-primary)] transition-colors disabled:opacity-50"
            />
            {state.fieldErrors?.x_url && (
              <p id="error-x_url" className="font-mono text-xs text-[var(--color-accent)]">
                {state.fieldErrors.x_url.join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =======================================================
          SUBMISSION BAR
          ======================================================= */}
      <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
          {initialData?.updated_at || initialData?.updatedAt
            ? `RECORD UPDATED: ${new Date(initialData.updated_at || initialData.updatedAt).toLocaleString()}`
            : "INITIAL SINGLETON RECORD"}
        </span>

        <button
          type="submit"
          disabled={isPending}
          className={buttonStyles({
            variant: "primary",
            size: "lg",
            className: "disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed",
          })}
        >
          {isPending ? "Persisting Profile..." : "Save Profile Settings →"}
        </button>
      </div>
    </form>
  );
}
