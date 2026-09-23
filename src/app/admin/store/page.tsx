import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminProducts } from "@/lib/admin/products";
import { buttonStyles } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Store Administration | Admin",
  description: "Curated digital tools, frameworks, and studio releases catalog management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminStorePage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const products = await getAdminProducts({ userId: auth.user?.id });

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
          Store
        </span>
      </div>

      {/* Header Block with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              STUDIO EDITIONS
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
            Store Catalog
          </h1>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
            Manage studio releases, release identifiers, pricing specifications, and availability controls.
          </p>
        </div>

        <Link
          href="/admin/store/new"
          className={buttonStyles({
            variant: "primary",
            size: "md",
            className: "self-start sm:self-auto",
          })}
        >
          + New Product Edition
        </Link>
      </div>

      {/* Products Table / List */}
      {products.length > 0 ? (
        <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Release Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)] font-sans text-xs text-[var(--color-ink-primary)]">
              {products.map((product) => {
                const isAvailable = product.is_available || product.isAvailable;
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-[var(--color-canvas-primary)] transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {product.sort_order ?? product.sortOrder ?? 0}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <Link
                          href={`/admin/store/${product.id}/edit`}
                          className="font-medium text-sm text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors line-clamp-1"
                        >
                          {product.title}
                        </Link>
                        <span className="font-mono text-[11px] text-[var(--color-ink-secondary)] block">
                          /{product.slug}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {product.category === "design"
                        ? "Design Studio"
                        : product.category === "ai_agents"
                        ? "AI Agents"
                        : "Digital Products"}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {product.release_code ?? product.releaseCode ?? "—"}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-ink-secondary)]">
                      {(product.product_type ?? product.productType).replace("_", " ")}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-[var(--color-accent)] font-medium">
                      {product.formattedPrice}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">
                      {isAvailable ? (
                        <span className="text-[var(--color-accent)] uppercase tracking-wider">
                          ✓ AVAILABLE
                        </span>
                      ) : (
                        <span className="text-[var(--color-ink-secondary)] uppercase tracking-wider">
                          ○ UNAVAILABLE
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 font-mono text-xs">
                        <Link
                          href={`/admin/store/${product.id}/edit`}
                          className="text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
                        >
                          Edit →
                        </Link>
                        {isAvailable && (
                          <Link
                            href={`/store/${product.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors uppercase tracking-[0.08em]"
                          >
                            Live ↗
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
          <div className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink-secondary)]">
            [PRODUCTS PENDING]
          </div>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)] max-w-md mx-auto">
            Zero product editions currently configured. Create a new edition monograph to publish digital releases to the studio store.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/store/new"
              className={buttonStyles({
                variant: "primary",
                size: "sm",
              })}
            >
              Create First Product Edition →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
