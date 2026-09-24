import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminContactSubmissions } from "@/lib/admin/contact";
import {
  toggleSubmissionReadAction,
  toggleSubmissionArchiveAction,
} from "@/app/actions/admin-contact";

export const metadata: Metadata = {
  title: "Contact Inquiries | Admin",
  description: "Private transmission dispatch and contact submissions inbox.",
  robots: {
    index: false,
    follow: false,
  },
};

interface AdminContactPageProps {
  searchParams?: Promise<{ filter?: string }>;
}

export default async function AdminContactPage({
  searchParams,
}: AdminContactPageProps) {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const filter =
    resolvedParams.filter === "unread"
      ? "unread"
      : resolvedParams.filter === "archived"
      ? "archived"
      : "all";

  const submissions = await getAdminContactSubmissions({
    userId: auth.user?.id,
    filter,
  });

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
          Contact Inquiries
        </span>
      </div>

      {/* Header Block with Summary & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              TRANSMISSION LOGS
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
            Contact Submissions
          </h1>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
            Visitor inquiries received via the production contact form.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1 border border-[var(--color-hairline)] p-1 bg-[var(--color-canvas-secondary)]">
          <Link
            href="/admin/contact"
            className={`font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 transition-colors ${
              filter === "all"
                ? "bg-[var(--color-ink-primary)] text-white"
                : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            Active
          </Link>
          <Link
            href="/admin/contact?filter=unread"
            className={`font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 transition-colors ${
              filter === "unread"
                ? "bg-[var(--color-ink-primary)] text-white"
                : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            Unread
          </Link>
          <Link
            href="/admin/contact?filter=archived"
            className={`font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 transition-colors ${
              filter === "archived"
                ? "bg-[var(--color-ink-primary)] text-white"
                : "text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
            }`}
          >
            Archived
          </Link>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="p-12 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-center space-y-2">
          <p className="font-display text-lg text-[var(--color-ink-primary)]">
            No submissions in this category.
          </p>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
            {filter === "unread"
              ? "All active inquiries have been reviewed."
              : filter === "archived"
              ? "No inquiries have been archived yet."
              : "Inquiries submitted through the contact form will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => {
            const dateStr = new Date(sub.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            });

            return (
              <article
                key={sub.id}
                className={`p-6 border transition-all ${
                  !sub.isRead && !sub.isArchived
                    ? "border-[var(--color-accent)] bg-white shadow-sm"
                    : "border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]"
                }`}
              >
                {/* Entry Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-hairline)]">
                  <div className="flex items-center gap-3">
                    {!sub.isRead && !sub.isArchived ? (
                      <span className="inline-block px-2 py-0.5 bg-[var(--color-accent)] text-white font-mono text-[10px] uppercase tracking-wider font-semibold">
                        Unread
                      </span>
                    ) : sub.isArchived ? (
                      <span className="inline-block px-2 py-0.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] font-mono text-[10px] uppercase tracking-wider">
                        Archived
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-primary)] font-mono text-[10px] uppercase tracking-wider">
                        Read
                      </span>
                    )}

                    <span className="font-mono text-xs text-[var(--color-ink-secondary)]">
                      {dateStr}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-[var(--color-ink-secondary)] truncate max-w-[200px]">
                    ID: {sub.id}
                  </span>
                </div>

                {/* Sender & Contact */}
                <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
                      Sender Name / Org
                    </span>
                    <span className="font-sans font-medium text-sm text-[var(--color-ink-primary)]">
                      {sub.name}
                    </span>
                  </div>

                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${sub.email}`}
                      className="font-mono text-xs text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
                    >
                      {sub.email} ↗
                    </a>
                  </div>
                </div>

                {/* Message Brief */}
                <div className="py-2">
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-secondary)] mb-2">
                    Project Brief &amp; Intent
                  </span>
                  <div className="p-4 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] font-sans text-xs leading-relaxed text-[var(--color-ink-primary)] whitespace-pre-wrap">
                    {sub.brief}
                  </div>
                </div>

                {/* Operational Actions */}
                <div className="pt-4 mt-4 border-t border-[var(--color-hairline)] flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`mailto:${encodeURIComponent(sub.email)}?subject=${encodeURIComponent("Re: ShivSastra Inquiry")}`}
                    className="font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                  >
                    Reply via Email ↗
                  </a>

                  <div className="flex items-center gap-2">
                    {/* Mark Read/Unread Action */}
                    <form action={toggleSubmissionReadAction}>
                      <input type="hidden" name="id" value={sub.id} />
                      <input
                        type="hidden"
                        name="isRead"
                        value={sub.isRead ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 border border-[var(--color-hairline)] hover:border-[var(--color-ink-primary)] transition-colors"
                      >
                        {sub.isRead ? "Mark Unread" : "Mark Read"}
                      </button>
                    </form>

                    {/* Archive/Unarchive Action */}
                    <form action={toggleSubmissionArchiveAction}>
                      <input type="hidden" name="id" value={sub.id} />
                      <input
                        type="hidden"
                        name="isArchived"
                        value={sub.isArchived ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="font-mono text-xs uppercase tracking-[0.08em] px-3 py-1.5 border border-[var(--color-hairline)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] hover:border-[var(--color-ink-primary)] transition-colors"
                      >
                        {sub.isArchived ? "Unarchive" : "Archive"}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
