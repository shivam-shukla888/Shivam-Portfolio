import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata: Metadata = {
  title: "New Service | Admin",
  description: "Create a new advisory program offering.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewAdminServicePage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
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
          href="/admin/services"
          className="hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
        >
          Services
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink-primary)] uppercase tracking-[0.08em]">
          New Offering
        </span>
      </div>

      {/* Header Block */}
      <div className="space-y-2 pb-6 border-b border-[var(--color-hairline)]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
            NEW SERVICE
          </span>
          <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
          Create Service Program
        </h1>
        <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
          Configure advisory program parameters, methodology monograph, and concrete deliverables.
        </p>
      </div>

      {/* Form Container */}
      <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <ServiceForm mode="create" />
      </div>
    </div>
  );
}
