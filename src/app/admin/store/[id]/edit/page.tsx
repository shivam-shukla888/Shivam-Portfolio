import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAdminProduct } from "@/lib/admin/products";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Edit Product Edition | Admin",
  description: "Edit studio store release specification and commercial parameters.",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditAdminProductPage({ params }: EditProductPageProps) {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const product = await getAdminProduct(id, { userId: auth.user?.id });

  if (!product) {
    notFound();
  }

  const isAvailable = Boolean(product.is_available ?? product.isAvailable);

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
          href="/admin/store"
          className="hover:text-[var(--color-accent)] transition-colors uppercase tracking-[0.08em]"
        >
          Store
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink-primary)] uppercase tracking-[0.08em]">
          Edit Edition
        </span>
      </div>

      {/* Header Block */}
      <div className="space-y-2 pb-6 border-b border-[var(--color-hairline)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              EDITION EDITOR
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          {isAvailable && (
            <Link
              href={`/store/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] hover:text-[var(--color-accent)] transition-colors"
            >
              View Live Store Page ↗
            </Link>
          )}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
          {product.title}
        </h1>
        <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
          Product ID: <span className="font-mono text-xs">{product.id}</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
        <ProductForm mode="edit" initialData={product} />
      </div>
    </div>
  );
}
