import React from "react";
import Link from "next/link";
import { SectionContainer } from "@/components/layout/SectionContainer";
import {
  getPublishedStoreProducts,
  getStoreCategoryCounts,
} from "@/lib/products";
import { StoreCatalogView } from "@/components/store/StoreCatalogView";

export const revalidate = 60;

export const metadata = {
  title: "Design Studio — SHIVSASTRA Store",
  description:
    "Interaction systems, typography guidelines, and design architectures crafted by Shivam Shukla.",
  alternates: {
    canonical: "https://shivsastra.com/store/design",
  },
};

export default async function DesignStorePage() {
  const [products, categoryCounts] = await Promise.all([
    getPublishedStoreProducts({ category: "design" }),
    getStoreCategoryCounts(),
  ]);

  return (
    <div className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      <SectionContainer>
        <div className="space-y-12">
          {/* Header Metadata Block */}
          <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-ink-secondary)]">
              <Link href="/store" className="hover:text-[var(--color-ink-primary)]">
                Store
              </Link>
              <span>/</span>
              <span className="text-[var(--color-accent)] font-medium">Design Studio</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] block">
                  CATEGORY 01
                </span>
                <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                  Design Studio
                </h1>
                <p className="font-sans text-sm md:text-base text-[var(--color-ink-secondary)] leading-relaxed">
                  Precision digital interaction systems, bespoke component libraries, editorial typography specifications, and visual architectures.
                </p>
              </div>
              <div className="font-mono text-xs text-[var(--color-ink-secondary)] shrink-0">
                <span className="text-[var(--color-accent)] font-semibold">
                  {categoryCounts.design}
                </span>{" "}
                {categoryCounts.design === 1 ? "edition available" : "editions available"}
              </div>
            </div>
          </div>

          {/* Catalog View */}
          <StoreCatalogView
            initialProducts={products}
            categoryCounts={categoryCounts}
            activeCategory="design"
            showCategoryTabs={false}
          />

          {/* Navigation Links */}
          <div className="pt-6 border-t border-[var(--color-hairline)] flex items-center justify-between">
            <Link
              href="/store"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
            >
              <span>← All Store Categories</span>
            </Link>
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--color-ink-secondary)]">
              <Link href="/store/ai-agents" className="hover:text-[var(--color-ink-primary)]">
                AI Agents →
              </Link>
              <Link href="/store/digital-products" className="hover:text-[var(--color-ink-primary)]">
                Digital Products →
              </Link>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
