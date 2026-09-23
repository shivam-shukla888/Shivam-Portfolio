import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminServices } from "@/lib/admin/services";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services Administration | Admin",
  description: "Bespoke advisory and creative technology programs management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminServicesPage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const services = await getAdminServices({ userId: auth.user?.id });

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
          Services
        </span>
      </div>

      {/* Header Block with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              ADVISORY PROGRAMS
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
            Services Catalog
          </h1>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
            Manage bespoke advisory offerings, deliverables specifications, and activation states.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className={buttonStyles({
            variant: "primary",
            size: "md",
            className: "self-start sm:self-auto",
          })}
        >
          + New Service
        </Link>
      </div>

      {/* Services Table / List */}
      {services.length > 0 ? (
        <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Program Code</th>
                <th className="py-3 px-4">Deliverables</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)] font-sans text-xs text-[var(--color-ink-primary)]">
              {services.map((service) => {
                const isActive = service.is_active || service.isActive;
                return (
                  <tr
                    key={service.id}
                    className="hover:bg-[var(--color-canvas-primary)] transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {service.sort_order ?? service.sortOrder ?? 0}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="font-medium text-sm text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                        >
                          {service.title}
                        </Link>
                        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                          /{service.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {service.program_code ?? service.programCode ?? "—"}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {service.deliverables.length > 0
                        ? `${service.deliverables.length} item(s)`
                        : "None"}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">
                      {isActive ? (
                        <span className="text-[var(--color-accent)] uppercase tracking-wider">
                          ✓ ACTIVE
                        </span>
                      ) : (
                        <span className="text-[var(--color-ink-secondary)] uppercase tracking-wider">
                          ○ INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-mono text-xs">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
                        >
                          Edit →
                        </Link>
                        {isActive && (
                          <Link
                            href={`/services/${service.slug}`}
                            target="_blank"
                            className="text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
                          >
                            View ↗
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 border border-dashed border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-center space-y-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] block">
              ADVISORY VOID
            </span>
            <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
              [NO SERVICES CONFIGURED]
            </h2>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-md mx-auto leading-relaxed">
              The advisory programs catalog is currently empty. Create your first service program to populate the database.
            </p>
          </div>
          <div>
            <Link
              href="/admin/services/new"
              className={buttonStyles({
                variant: "primary",
                size: "md",
              })}
            >
              + Create First Service
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
