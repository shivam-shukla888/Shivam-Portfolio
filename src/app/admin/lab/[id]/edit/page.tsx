import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminLabEntry } from "@/lib/admin/lab";
import { LabEntryForm } from "@/components/admin/LabEntryForm";

export const metadata: Metadata = {
  title: "Edit Lab Artifact | Admin",
  description: "Edit Personal Lab research artifact specification.",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditLabPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminLabPage({ params }: EditLabPageProps) {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const entry = await getAdminLabEntry(id, { userId: auth.user?.id });

  if (!entry) {
    notFound();
  }

  const isPubliclyVisible =
    Boolean(entry.is_public ?? entry.isPublic) &&
    (entry.published_at ?? entry.publishedAt) !== null;

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
          href="/admin/lab"
          className="hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
        >
          Lab
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink-primary)] uppercase tracking-[0.08em]">
          Edit Artifact
        </span>
      </div>

      {/* Header Block */}
      <div className="space-y-2 pb-6 border-b border-[var(--color-hairline)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              ARTIFACT EDITOR
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          {isPubliclyVisible && (
            <Link
              href={`/lab/${entry.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              View Live Artifact ↗
            </Link>
          )}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
          {entry.title}
        </h1>
        <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
          Artifact ID: <span className="font-mono text-xs">{entry.id}</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <LabEntryForm mode="edit" initialData={entry} />
      </div>
    </div>
  );
}
