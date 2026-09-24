import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BackToTop } from "@/components/ui/BackToTop";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Refund Policy — Shivam Shukla",
  description: "Refund and cancellation policy for digital products and custom engineering engagements on SHIVSASTRA.",
  alternates: {
    canonical: "https://shivsastra.vercel.app/refunds",
  },
  openGraph: {
    title: "Refund Policy — Shivam Shukla",
    description: "Refund and cancellation policy for digital products and custom engineering engagements on SHIVSASTRA.",
    url: "https://shivsastra.vercel.app/refunds",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy — Shivam Shukla",
    description: "Refund and cancellation policy for digital products and custom engineering engagements on SHIVSASTRA.",
  },
};

export default function RefundsPage() {
  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <ScrollProgress />
      <BackToTop />
      <PageBackground
        src="/images/backgrounds/privacy.webp"
        opacity={0.16}
        position="top"
      />
      <SectionContainer>
        <div className="max-w-3xl space-y-12">
          {/* Header */}
          <InnerPageEntrance delayIndex={0}>
            <div className="space-y-4 pb-8 border-b border-[var(--color-hairline)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-accent)] inline-block shrink-0" />
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-semibold">
                  Store & Services Policy
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Refund & Cancellation Policy
              </h1>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                Last updated: September 2026 · Operator: Shivam Shukla / SHIVSASTRA
              </p>
            </div>
          </InnerPageEntrance>

          {/* Body Sections */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-10 font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
              {/* 1. Nature of Digital Goods */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  1. Nature of Digital Products
                </h2>
                <p>
                  Products sold on the SHIVSASTRA Store are intangible, digital software assets (including code templates, agent workflows, monographs, and design files). Once payment is cryptographically verified by our payment gateway, access tokens and download links are delivered immediately.
                </p>
              </section>

              {/* 2. Refund Eligibility for Digital Goods */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  2. Refund Eligibility
                </h2>
                <p>
                  Because digital products cannot be physically returned once downloaded or accessed, purchases are generally final. However, we strive to be fair and transparent:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Defective or Corrupted Files:</strong> If a downloaded file is damaged, missing components specified in the product description, or technically unusable, please contact us. If we are unable to provide a functional replacement within 48 hours, a 100% refund will be issued.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Material Misrepresentation:</strong> If the product delivered materially differs from the verified features published on its store page, you are eligible for a full refund within 7 days of purchase.
                  </li>
                  <li>
                    <strong className="text-[var(--color-ink-primary)]">Accidental Duplicate Charges:</strong> If network latency or a gateway issue results in duplicate debits for the same order, the duplicate charge will be refunded promptly upon verification.
                  </li>
                </ul>
              </section>

              {/* 3. Non-Refundable Situations */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  3. Non-Refundable Scenarios
                </h2>
                <p>Refunds are not granted in cases such as:</p>
                <ul className="list-disc pl-5 space-y-1.5 font-sans">
                  <li>Change of mind after the files have been downloaded.</li>
                  <li>Incompatibility resulting from failure to review the stated system requirements on the product page.</li>
                  <li>Lack of the technical knowledge required to run standard development tools (e.g. Node.js, Python, or Git) where required by the product documentation.</li>
                </ul>
              </section>

              {/* 4. Custom Consulting and Client Engagements */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  4. Custom Services & Consulting
                </h2>
                <p>
                  For bespoke client contracts and technical consulting, payment schedules, milestones, and cancellation conditions are defined in the specific agreement or proposal. Fees for work completed and accepted according to milestone specifications are non-refundable.
                </p>
              </section>

              {/* 5. Requesting a Refund */}
              <section className="space-y-3">
                <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                  5. How to Request a Refund
                </h2>
                <p>
                  To request assistance or a refund, please send an email with your purchase details to:
                </p>
                <div className="p-4 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] font-mono text-xs text-[var(--color-ink-primary)] space-y-1">
                  <p>Email: theshivamshukla.4uu@gmail.com</p>
                  <p>Subject: Refund Request — [Your Order ID or Email]</p>
                  <p>Please include: Order reference, date of purchase, and a brief description of the issue.</p>
                </div>
                <p>
                  Valid refund requests are typically processed within 3 to 5 business days, and funds are credited back to the original payment method by the payment gateway.
                </p>
              </section>
            </div>
          </InnerPageEntrance>

          {/* Navigation Return */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-8 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-ink-primary)] transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                ← Back to Home
              </Link>
              <Link
                href="/store"
                className="text-[var(--color-accent)] hover:underline"
              >
                Visit Store →
              </Link>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
