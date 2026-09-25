"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type {
  ProductDisplayData,
  CategoryCounts,
  StoreCategory,
} from "@/lib/products";
import { buttonStyles } from "@/components/ui/Button";

interface StoreCatalogViewProps {
  initialProducts: ProductDisplayData[];
  categoryCounts: CategoryCounts;
  activeCategory?: StoreCategory | "all";
  showCategoryTabs?: boolean;
}

const CATEGORY_LABELS: Record<StoreCategory, string> = {
  design: "Design & Templates",
  ai_agents: "AI Agents",
  digital_products: "Digital Products",
};

const CATEGORY_HREFS: Record<StoreCategory, string> = {
  design: "/store/design",
  ai_agents: "/store/ai-agents",
  digital_products: "/store/digital-products",
};

export function StoreCatalogView({
  initialProducts,
  categoryCounts,
  activeCategory = "all",
  showCategoryTabs = true,
}: StoreCatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState<
    "newest" | "price_asc" | "price_desc" | "featured"
  >("newest");
  const [selectedCategory, setSelectedCategory] = useState<
    StoreCategory | "all"
  >(activeCategory);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter by category if "all" is not selected
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q) ?? false;
        const shortDescMatch =
          p.shortDescription?.toLowerCase().includes(q) ?? false;
        const codeMatch = p.releaseCode?.toLowerCase().includes(q) ?? false;
        return titleMatch || descMatch || shortDescMatch || codeMatch;
      });
    }

    // Sort list
    switch (selectedSort) {
      case "price_asc":
        list.sort((a, b) => (a.priceInCents ?? 0) - (b.priceInCents ?? 0));
        break;
      case "price_desc":
        list.sort((a, b) => (b.priceInCents ?? 0) - (a.priceInCents ?? 0));
        break;
      case "featured":
        list.sort((a, b) => {
          if (a.isFeatured === b.isFeatured) {
            return a.sortOrder - b.sortOrder;
          }
          return a.isFeatured ? -1 : 1;
        });
        break;
      case "newest":
      default:
        list.sort((a, b) => {
          if (a.sortOrder !== b.sortOrder) {
            return a.sortOrder - b.sortOrder;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, selectedSort]);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Category Filter Pills + Search + Sort */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
        {showCategoryTabs && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedCategory === "all"
                  ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] font-semibold"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-primary)]"
              }`}
            >
              All ({categoryCounts.total})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("design")}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedCategory === "design"
                  ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] font-semibold"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-primary)]"
              }`}
            >
              Design & Templates ({categoryCounts.design})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("ai_agents")}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedCategory === "ai_agents"
                  ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] font-semibold"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-primary)]"
              }`}
            >
              AI Agents ({categoryCounts.ai_agents})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("digital_products")}
              className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors border ${
                selectedCategory === "digital_products"
                  ? "border-[var(--color-ink-primary)] bg-[var(--color-ink-primary)] text-[var(--color-canvas-primary)] font-semibold"
                  : "border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] text-[var(--color-ink-secondary)] hover:border-[var(--color-ink-primary)]"
              }`}
            >
              Digital Products ({categoryCounts.digital_products})
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full px-3 py-1.5 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)] placeholder:text-[var(--color-ink-secondary)]/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <select
            value={selectedSort}
            onChange={(e) =>
              setSelectedSort(
                e.target.value as "newest" | "price_asc" | "price_desc" | "featured"
              )
            }
            aria-label="Sort products"
            className="px-3 py-1.5 bg-[var(--color-canvas-primary)] border border-[var(--color-hairline)] rounded-none font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="featured">Sort: Featured Products</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid or Editorial Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const categoryLabel =
              CATEGORY_LABELS[product.category] || "Studio Release";
            const categoryHref =
              CATEGORY_HREFS[product.category] || "/store";

            const itemHref =
              product.slug === "yojna-setu"
                ? "/projects/yojna-setu"
                : `/store/${product.slug}`;

            return (
              <article
                key={product.id}
                className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 md:p-8 flex flex-col justify-between hover:border-[var(--color-ink-primary)] hover:-translate-y-[2px] transition-[border-color,transform] duration-200 ease-out group motion-reduce:hover:translate-y-0"
              >
                <div className="space-y-4">
                  {/* Preview Image or Graphic Frame */}
                  {product.previewImageUrl ? (
                    <Link
                      href={itemHref}
                      className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] overflow-hidden relative block"
                    >
                      <Image
                        src={product.previewImageUrl}
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300 motion-reduce:group-hover:scale-100"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </Link>
                  ) : (
                    <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-primary)] p-4 flex flex-col justify-between relative">
                      <span className="font-mono text-[10px] text-[var(--color-ink-secondary)] uppercase tracking-wider">
                        {product.releaseCode || "EDITION"}
                      </span>
                      <span className="font-mono text-xs text-[var(--color-accent)] font-medium">
                        {categoryLabel}
                      </span>
                    </div>
                  )}

                  {/* Badges / Header Info */}
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
                    <Link
                      href={categoryHref}
                      className="hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-[11px]"
                    >
                      {categoryLabel}
                    </Link>
                    <span className="text-[var(--color-accent)] font-semibold">
                      {product.formattedPrice}
                    </span>
                  </div>

                  {/* Title & Badges */}
                  <div className="space-y-1">
                    {product.isFeatured && (
                      <span className="inline-block font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent)]/5 mb-1">
                        {product.priceInCents === null ? "Featured Agent" : "Featured Product"}
                      </span>
                    )}
                    <h2 className="font-display text-2xl font-normal text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      <Link href={itemHref}>{product.title}</Link>
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    {product.shortDescription ||
                      product.description ||
                      "Digital product by Shivam Shukla."}
                  </p>

                  {/* Features snippets if available */}
                  {product.features && product.features.length > 0 && (
                    <ul className="pt-2 space-y-1 border-t border-[var(--color-hairline)]">
                      {product.features.slice(0, 2).map((feat, idx) => (
                        <li
                          key={idx}
                          className="font-sans text-xs text-[var(--color-ink-secondary)] flex items-center gap-1.5"
                        >
                          <span className="text-[var(--color-accent)]">✓</span>
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-[var(--color-hairline)] mt-6 flex items-center justify-between gap-4">
                  <span className="font-mono text-[10px] text-[var(--color-ink-secondary)] uppercase tracking-wider">
                    {product.productType.replace("_", " ")}
                  </span>
                  <Link
                    href={itemHref}
                    className={buttonStyles({
                      variant: "secondary",
                      size: "sm",
                      className: "font-mono uppercase tracking-wider text-xs group/btn",
                    })}
                  >
                    <span>{product.slug === "yojna-setu" ? "View Case Study" : "View Details"}</span>
                    <span className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transform-none ml-1">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Refined Editorial Empty State (Zero Fake Content) */
        <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-12 md:p-16 text-center space-y-6 max-w-2xl mx-auto">
          <div className="space-y-2">
            <h3 className="font-display text-2xl md:text-3xl text-[var(--color-ink-primary)]">
              {searchQuery || selectedCategory !== "all"
                ? "No matching products found."
                : "New products are on the way."}
            </h3>
            <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "No products match your current search or filter. Try clearing filters to see everything."
                : "I'm adding new templates, tools, and digital products here as they're ready."}
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            {searchQuery || selectedCategory !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className={buttonStyles({
                  variant: "secondary",
                  size: "md",
                  className: "font-mono text-xs uppercase tracking-wider",
                })}
              >
                Reset Filters
              </button>
            ) : null}

            <Link
              href="/contact"
              className={buttonStyles({
                variant: "primary",
                size: "md",
                className: "font-mono text-xs uppercase tracking-wider",
              })}
            >
              Ask About Custom Work →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
