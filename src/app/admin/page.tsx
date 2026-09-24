import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Private administrative management dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};



export default async function AdminDashboardPage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
          System Administration
        </h1>
        <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
          Authenticated operator:{" "}
          <span className="font-mono text-xs text-[var(--color-ink-primary)]">
            {auth.user?.email || "SHIVSASTRA ADMIN"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 01 Profile */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">
              01
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Profile Settings
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Singleton identity, positioning statements, bio copy, and contact instructions.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/profile"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              Configure Profile →
            </Link>
          </div>
        </div>

        {/* 02 Projects */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">
              02
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Projects & Case Studies
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Curated monograph archive, technical specifications, and publishing states.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              Manage Projects →
            </Link>
          </div>
        </div>

        {/* 03 Services */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">
              03
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Services & Capabilities
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Bespoke advisory programs, deliverables specifications, and activation controls.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/services"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              Manage Services →
            </Link>
          </div>
        </div>

        {/* 04 Store */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">
              04
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Studio Editions
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Curated studio releases, release identifiers, pricing specifications, and availability.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/store"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              Manage Store →
            </Link>
          </div>
        </div>

        {/* 05 Lab */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">
              05
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Personal Lab
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Experimental prototypes, ideas, builds, architectural stacks, and thoughts archive.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/lab"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              Manage Lab →
            </Link>
          </div>
        </div>

        {/* 06 Contact */}
        <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-accent)]">
              06
            </span>
            <h2 className="font-display text-xl text-[var(--color-ink-primary)]">
              Contact Inquiries
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              Transmission dispatches, client requests, read/unread states, and response archival.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/admin/contact"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors"
            >
              View Inquiries →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
