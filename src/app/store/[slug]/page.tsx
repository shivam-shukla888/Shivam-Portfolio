import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import {
  getPublishedStoreProductBySlug,
  getPublishedStoreProducts,
  getPublishedProductReviews,
  getProductStructuredData,
  StoreCategory,
} from "@/lib/products";
import { absoluteUrl, serializeJsonLd } from "@/lib/site";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";
import { ProductFaqAccordion } from "@/components/store/ProductFaqAccordion";
import { ProductCheckoutAction } from "@/components/store/ProductCheckoutAction";
import { isLivePaymentTestProduct, isTestCheckoutProduct } from "@/lib/payments/test-checkout";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getPublishedStoreProducts();
  return products.map((p) => ({ slug: p.slug }));
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CATEGORY_NAMES: Record<StoreCategory, string> = {
  design: "Design & Templates",
  ai_agents: "AI Agents",
  digital_products: "Digital Products",
};

const CATEGORY_HREFS: Record<StoreCategory, string> = {
  design: "/store/design",
  ai_agents: "/store/ai-agents",
  digital_products: "/store/digital-products",
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedStoreProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — Store",
    };
  }

  const socialImage =
    product.previewImageUrl && !product.previewImageUrl.endsWith(".svg")
      ? absoluteUrl(product.previewImageUrl)
      : absoluteUrl("/og-image.png");

  return {
    title: `${product.title} — Store`,
    description:
      product.shortDescription ||
      product.description ||
      "Digital product by Shivam Shukla.",
    alternates: {
      canonical: absoluteUrl(`/store/${slug}`),
    },
    openGraph: {
      title: `${product.title} — Store | Shivam Shukla`,
      description:
        product.shortDescription ||
        product.description ||
        "Digital product by Shivam Shukla.",
      url: absoluteUrl(`/store/${slug}`),
      type: "website",
      siteName: "ShivSastra",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: `${product.title} — ShivSastra Store`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} — Store | Shivam Shukla`,
      description:
        product.shortDescription ||
        product.description ||
        "Digital product by Shivam Shukla.",
      images: [socialImage],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublishedStoreProductBySlug(slug);

  if (!product || !product.isAvailable) {
    notFound();
  }

  const categoryName = CATEGORY_NAMES[product.category] || "Studio Release";
  const categoryHref = CATEGORY_HREFS[product.category] || "/store";

  const [reviews, relatedProducts] = await Promise.all([
    getPublishedProductReviews(product.id),
    getPublishedStoreProducts({ category: product.category, limit: 4 }),
  ]);

  const filteredRelated = relatedProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  const updatedDate = product.updatedAt
    ? new Date(product.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const productJsonLd = getProductStructuredData(product, categoryName, reviews);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Store",
        item: absoluteUrl("/store"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: absoluteUrl(categoryHref),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.title,
        item: absoluteUrl(`/store/${product.slug}`),
      },
    ],
  };

  return (
    <article className="w-full pt-16 md:pt-24 pb-20 md:pb-28">
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <ScrollProgress />
      <BackToTop />
      <SectionContainer>
        <div className="space-y-16 max-w-4xl mx-auto">
          {/* Header Metadata Block */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-6">
              {/* Breadcrumb Navigation */}
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-xs font-mono text-[var(--color-ink-secondary)]"
              >
                <Link
                  href="/store"
                  className="hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  Store
                </Link>
                <span className="text-[var(--color-hairline)] select-none">/</span>
                <Link
                  href={categoryHref}
                  className="hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  {categoryName}
                </Link>
                <span className="text-[var(--color-hairline)] select-none">/</span>
                <span className="text-[var(--color-accent)] font-medium truncate max-w-[240px]">
                  {product.title}
                </span>
              </nav>

              <div className="space-y-6 pb-10 border-b border-[var(--color-hairline)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-wider px-2 py-0.5 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-[var(--color-ink-secondary)]">
                      {categoryName}
                    </span>
                    {product.releaseCode && (
                      <span className="font-mono text-xs text-[var(--color-accent)] font-medium">
                        {product.releaseCode}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[var(--color-ink-secondary)] uppercase tracking-wider">
                      {(product.productType || "digital_download").replace(/_/g, " ")}
                    </span>
                    {updatedDate && (
                      <span className="font-mono text-xs text-[var(--color-ink-secondary)] border-l border-[var(--color-hairline)] pl-3">
                        Updated: {updatedDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[var(--color-ink-primary)] leading-[1.08]">
                    {product.title}
                  </h1>
                  <div className="font-mono text-2xl md:text-3xl text-[var(--color-accent)] font-medium shrink-0">
                    {product.formattedPrice}
                  </div>
                </div>

                {product.shortDescription && (
                  <p className="font-sans text-lg md:text-xl text-[var(--color-ink-primary)] leading-relaxed max-w-3xl">
                    {product.shortDescription}
                  </p>
                )}

                {product.slug === "yojna-setu" && (
                  <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                        Engineering Case Study Available
                      </span>
                      <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                        Full architectural monograph with test suite, rules engine details, and WhatsApp evidence.
                      </p>
                    </div>
                    <Link
                      href="/projects/yojna-setu"
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-primary)] hover:text-[var(--color-accent)] shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Case Study</span>
                      <span>→</span>
                    </Link>
                  </div>
                )}

                {/* Commercial Action Bar */}
                <ProductCheckoutAction
                  productId={product.id}
                  productSlug={product.slug}
                  productTitle={product.title}
                  productType={product.productType}
                  formattedPrice={product.formattedPrice}
                  isAvailable={product.isAvailable}
                  priceInCents={product.priceInCents}
                  currency={product.currency}
                  testCheckoutEnabled={isTestCheckoutProduct(product)}
                  livePaymentTestEnabled={isLivePaymentTestProduct(product)}
                />
              </div>
            </div>
          </InnerPageEntrance>

          {/* Main Content: Visuals, Specs, Architecture & Reviews */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-16">
              {/* Visual Frame */}
              {product.previewImageUrl && (
                <div className="w-full aspect-[16/10] border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-hidden relative">
              <Image
                src={product.previewImageUrl}
                alt={product.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          {/* Overview & Description */}
          {product.description && (
            <section className="space-y-4">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  Overview
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  Overview
                </h2>
              </div>
              <div className="font-sans text-base text-[var(--color-ink-secondary)] leading-relaxed space-y-4 whitespace-pre-line">
                {product.description}
              </div>
            </section>
          )}

          {/* What is Included (Features) */}
          {product.features && product.features.length > 0 && (
            <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  Features
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  What is Included
                </h2>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-start gap-3"
                  >
                    <span className="text-[var(--color-accent)] font-mono text-sm leading-none mt-0.5">
                      ✓
                    </span>
                    <span className="font-sans text-sm text-[var(--color-ink-primary)] leading-normal">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* System Requirements */}
          {product.requirements && (
            <section className="space-y-4 pt-6 border-t border-[var(--color-hairline)]">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  Requirements
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  System Requirements
                </h2>
              </div>
              <div className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] font-mono text-xs text-[var(--color-ink-secondary)] whitespace-pre-line leading-relaxed">
                {product.requirements}
              </div>
            </section>
          )}

          {/* Expandable FAQ Section */}
          <ProductFaqAccordion faq={product.faq} />

          {/* Attestations & Product Reviews (only for purchasable products or when reviews exist) */}
          {(reviews.length > 0 || product.priceInCents !== null) && (
            <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  Feedback
                </span>
                <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                  Reviews
                </h2>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-[var(--color-ink-primary)] font-semibold">
                            {rev.authorName}
                          </span>
                          {rev.authorTitle && (
                            <span className="text-[var(--color-ink-secondary)] ml-2">
                              — {rev.authorTitle}
                            </span>
                          )}
                        </div>
                        <span className="text-[var(--color-accent)]">
                          {"★".repeat(rev.rating)}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                        &ldquo;{rev.content}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-center space-y-2">
                  <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                    No reviews yet for this product.
                  </p>
                  <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
                    Feedback from verified buyers will appear here as reviews are submitted.
                  </p>
                </div>
              )}
            </section>
          )}
            </div>
          </InnerPageEntrance>

          {/* Related Category Products & Navigation Footer */}
          <InnerPageEntrance delayIndex={2}>
            <div className="space-y-16">
              {/* Related Category Products */}
              {filteredRelated.length > 0 && (
                <section className="space-y-6 pt-6 border-t border-[var(--color-hairline)]">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Related Products
                      </span>
                      <h2 className="font-display text-2xl text-[var(--color-ink-primary)]">
                        More from {categoryName}
                      </h2>
                    </div>
                    <Link
                      href={categoryHref}
                      className="font-mono text-xs text-[var(--color-accent)] hover:underline underline-offset-4"
                    >
                      View all in {categoryName} →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredRelated.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/store/${rel.slug}`}
                        className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] p-6 space-y-3 hover:border-[var(--color-ink-primary)] transition-colors group flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-ink-secondary)]">
                            <span>{rel.releaseCode || "PRODUCT"}</span>
                            <span className="text-[var(--color-accent)] font-semibold">
                              {rel.formattedPrice}
                            </span>
                          </div>
                          <h3 className="font-display text-lg text-[var(--color-ink-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            {rel.title}
                          </h3>
                          <p className="font-sans text-xs text-[var(--color-ink-secondary)] line-clamp-2 leading-relaxed">
                            {rel.shortDescription || rel.description}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-[var(--color-hairline)] …4770 tokens truncated…ilInputRef}
                id="checkout-email"
                type="email"
                autoComplete="email"
                required
                aria-required="true"
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "checkout-email-error" : "checkout-email-help"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => {
                  if (email.trim()) validateEmail(email);
                }}
                placeholder="name@organization.com"
                className={`w-full px-3 py-2.5 bg-[var(--color-canvas-primary)] border font-mono text-xs text-[var(--color-ink-primary)] focus:outline-none focus:border-[var(--color-accent)] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] transition-colors min-h-[44px] ${
                  emailError ? "border-red-500" : "border-[var(--color-hairline)]"
                }`}
              />
              <p id="checkout-email-help" className="sr-only">
                Enter your valid email to receive digital fulfillment keys and receipts.
              </p>
            </div>

            {emailError && (
              <p
                id="checkout-email-error"
                role="alert"
                className="font-mono text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2.5 border border-red-200 dark:border-red-900/50"
              >
                {emailError}
              </p>
            )}

            {errorMessage && (
              <p
                role="alert"
                className="font-mono text-xs text-red-600 bg-red-50 dark:bg-red-950/30 p-2.5 border border-red-200 dark:border-red-900/50"
              >
                {errorMessage}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
                className="font-mono text-xs uppercase tracking-wider min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none disabled:opacity-50"
              >
                {isSubmitting ? "Initiating Session..." : "Continue to Payment →"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={isSubmitting}
                onClick={() => {
                  setStep("IDLE");
                  setErrorMessage(null);
                  setEmailError(null);
                }}
                className="font-mono text-xs uppercase tracking-wider min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Creating Order State */}
      {step === "CREATING_ORDER" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] flex items-center gap-4"
        >
          <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Preparing checkout...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Connecting to payment gateway...
            </p>
          </div>
        </div>
      )}

      {/* 4. Checkout Open in Gateway Modal */}
      {step === "CHECKOUT_OPEN" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)] font-semibold">
              PAYMENT IN PROGRESS
            </span>
          </div>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
            Please complete your payment in the checkout window. If it closed, click below to restart.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => razorpayInstanceRef.current?.close()}
              className="font-mono text-xs uppercase min-h-[44px]"
            >
              Close payment window
            </Button>
          </div>
        </div>
      )}

      {/* 5. Payment Processing / Callback Received */}
      {step === "PAYMENT_PROCESSING" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-accent)] bg-[var(--color-canvas-secondary)] flex items-center gap-4"
        >
          <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Payment received...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Confirming with server...
            </p>
          </div>
        </div>
      )}

      {/* 6. Verifying Cryptographic Signature */}
      {step === "VERIFYING_PAYMENT" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-[var(--color-accent)] bg-[var(--color-canvas-secondary)] flex items-center gap-4"
        >
          <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent animate-spin shrink-0" />
          <div className="space-y-0.5">
            <p className="font-mono text-xs font-medium text-[var(--color-ink-primary)]">
              Verifying payment...
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              Confirming order details...
            </p>
          </div>
        </div>
      )}

      {/* 7. Success State (PAID & DELIVERY_READY) */}
      {(step === "PAID" || step === "DELIVERY_READY") && (
        <div
          role="region"
          aria-label="Payment Verified"
          className="p-5 sm:p-6 border-2 border-emerald-600 bg-[var(--color-canvas-secondary)] space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
              PAYMENT SUCCESSFUL
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
              {productTitle}
            </h3>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Your payment has been verified. Order reference:{" "}
              <span className="font-mono text-[var(--color-ink-primary)] font-medium">
                {completedOrder?.orderId ? completedOrder.orderId.slice(0, 8) + "…" : "Confirmed"}
              </span>
            </p>
          </div>

          {paymentOnlyTestEnabled ? (
            <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
              {livePaymentTestEnabled
                ? "Your real ₹1 payment was verified. No email, download, or product access is issued in this payment test."
                : "Sandbox payment verified. No email, download, or product access is issued in this test."}
            </p>
          ) : (
            <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
              A confirmation email has also been sent to your purchase email:{" "}
              <span className="text-[var(--color-accent)]">{email}</span>.
            </p>
          )}

          {paymentOnlyTestEnabled && (
            <div className="space-y-3 border-t border-[var(--color-hairline)] pt-4">
              {refundStatus === "processed" ? (
                <p role="status" className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                  {livePaymentTestEnabled ? "LIVE ₹1 PAYMENT REFUNDED" : "TEST REFUND COMPLETED — No real money moved."}
                </p>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  disabled={isRefunding}
                  onClick={handleTestRefund}
                  className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
                >
                  {isRefunding
                    ? "Checking refund..."
                    : refundStatus === "pending"
                      ? livePaymentTestEnabled ? "Check refund status" : "Check test refund status"
                      : livePaymentTestEnabled ? "Refund this ₹1 payment" : "Refund this test payment"}
                </Button>
              )}
              {refundStatus === "pending" && (
                <p role="status" className="font-sans text-xs text-[var(--color-ink-secondary)]">
                  Refund requested. Razorpay will update its status shortly; use the button to check again.
                </p>
              )}
              {refundStatus === "failed" && errorMessage && (
                <p role="alert" className="font-sans text-xs text-red-600">{errorMessage}</p>
              )}
            </div>
          )}

          {completedOrder?.deliveryToken && (
            <div className="pt-2">
              <a
                href={`/api/store/download/${completedOrder.orderId}?token=${completedOrder.deliveryToken}`}
                className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-6 py-3 bg-[var(--color-accent)] text-white hover:bg-[var(--color-ink-primary)] transition-colors min-h-[44px] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none"
                download
              >
                Download Files ↓
              </a>
            </div>
          )}
        </div>
      )}

      {/* 8. Delivery Failed State (Paid remains intact, email delayed) */}
      {step === "DELIVERY_FAILED" && (
        <div
          role="region"
          aria-label="Payment Verified With Delivery Notice"
          className="p-5 sm:p-6 border-2 border-amber-600 bg-[var(--color-canvas-secondary)] space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 font-semibold">
              PAYMENT SUCCESSFUL
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl text-[var(--color-ink-primary)]">
              {productTitle}
            </h3>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)]">
              Your payment has been verified. Order reference:{" "}
              <span className="font-mono text-[var(--color-ink-primary)] font-medium">
                {completedOrder?.orderId ? completedOrder.orderId.slice(0, 8) + "…" : "Confirmed"}
              </span>
            </p>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-600/30 text-xs font-sans text-amber-800 dark:text-amber-300">
            Note: Email confirmation dispatch encountered a temporary delay and is queued for automated retry. You may safely download your files below.
          </div>

          {completedOrder?.deliveryToken && (
            <div className="pt-2">
              <a
                href={`/api/store/download/${completedOrder.orderId}?token=${completedOrder.deliveryToken}`}
                className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-6 py-3 bg-[var(--color-accent)] text-white hover:bg-[var(--color-ink-primary)] transition-colors min-h-[44px]"
                download
              >
                Download Files ↓
              </a>
            </div>
          )}
        </div>
      )}

      {/* 9. Payment Failed State */}
      {step === "FAILED" && (
        <div
          role="alert"
          className="p-5 sm:p-6 border border-red-400 bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-semibold">
              PAYMENT INCOMPLETE
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-primary)] leading-relaxed">
              {errorMessage || "Payment was rejected or could not be completed at this time."}
            </p>
          </div>
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("COLLECTING_EMAIL");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 10. Verification Failed State */}
      {step === "VERIFICATION_FAILED" && (
        <div
          role="alert"
          className="p-5 sm:p-6 border border-red-500 bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-red-600 font-semibold">
              VERIFICATION FAILED
            </span>
            <p className="font-sans text-xs text-[var(--color-ink-primary)] leading-relaxed">
              Payment could not be verified. No download has been issued.
            </p>
            <p className="font-mono text-[11px] text-[var(--color-ink-secondary)]">
              If funds were debited from your account, I will review order reference{" "}
              <span className="text-[var(--color-ink-primary)] font-medium">
                {currentOrderId ? currentOrderId.slice(0, 8) + "…" : "recorded"}
              </span>{" "}
              promptly.
            </p>
          </div>
          <div className="pt-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 11. Verification Timeout / Network Failure State */}
      {step === "VERIFICATION_TIMEOUT" && (
        <div
          role="status"
          aria-live="polite"
          className="p-5 sm:p-6 border border-amber-500 bg-[var(--color-canvas-secondary)] space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
              CONFIRMING STATUS
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-base text-[var(--color-ink-primary)]">
              Payment status is being confirmed. Please don&apos;t pay again yet.
            </h4>
            <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
              A network interruption occurred while confirming your transaction with the server. Your payment is safe. Click below to re-verify status without recharging.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleRetryVerification}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Check Verification Status ↻
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* 12. Cancelled State */}
      {step === "CANCELLED" && (
        <div className="p-5 sm:p-6 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] space-y-3">
          <p className="font-sans text-xs text-[var(--color-ink-secondary)] leading-relaxed">
            {livePaymentTestEnabled
              ? "Checkout closed before payment confirmation. If your bank shows a debit, do not retry yet; check the Razorpay dashboard or contact support. No product was delivered."
              : testCheckoutEnabled
                ? "Checkout closed. Test Mode does not move real money; no product was delivered."
                : "Checkout closed before we received confirmation. If your bank shows a debit, check the payment status before trying again."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("COLLECTING_EMAIL");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Resume Checkout
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setErrorMessage(null);
                setStep("IDLE");
              }}
              className="font-mono text-xs uppercase tracking-wider min-h-[44px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
