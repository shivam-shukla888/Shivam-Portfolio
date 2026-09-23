import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminProfileSettings } from "@/lib/admin/profile";
import { ProfileEditorForm } from "@/components/admin/ProfileEditorForm";

export const metadata: Metadata = {
  title: "Profile Editor | Admin",
  description: "Administrative configuration for studio identity and profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminProfilePage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const profile = await getAdminProfileSettings();

  return (
    <div className="max-w-3xl space-y-8">
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
          Profile Settings
        </span>
      </div>

      {/* Header Block */}
      <div className="space-y-2 pb-6 border-b border-[var(--color-hairline)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
            SINGLETON CONFIGURATION
          </span>
          <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
          Profile Settings
        </h1>
        <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
          Manage core identity, narrative statements, and contact instructions. All updates reflect immediately across the public site.
        </p>
      </div>

      {/* Editor Form Container */}
      <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <ProfileEditorForm initialData={profile} />
      </div>
    </div>
  );
}
