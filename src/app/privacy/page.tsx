import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { PageBackground } from "@/components/ui/PageBackground";
import { InnerPageEntrance } from "@/components/layout/InnerPageEntrance";

export const metadata: Metadata = {
  title: "Privacy Policy — Shivam Shukla",
  description: "Privacy policy and security practices for the ShivSastra digital studio and contact channels.",
  alternates: {
    canonical: "https://shivsastra.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Shivam Shukla",
    description: "Privacy policy and security practices for the ShivSastra digital studio and contact channels.",
    url: "https://shivsastra.com/privacy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative w-full pt-16 md:pt-24 pb-20 md:pb-28 overflow-hidden">
      <PageBackground
        src="/images/backgrounds/privacy.webp"
        opacity={0.18}
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
                  LEGAL & SECURITY MEMORANDUM
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-[var(--color-ink-primary)]">
                Privacy Policy
              </h1>
              <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                Effective Date: September 2026 · Operational identity: Shivam Shukla / SHIVSASTRA
              </p>
            </div>
          </InnerPageEntrance>

          {/* Sections */}
          <InnerPageEntrance delayIndex={1}>
            <div className="space-y-10 font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
            {/* 1. Scope & Operator */}
            <section className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                1. Scope and Operator
              </h2>
              <p>
                This privacy policy describes the actual data processing practices of this website (
                <span className="font-mono text-xs text-[var(--color-ink-primary)]">shivsastra.com</span>
                ), operated by Shivam Shukla as a personal digital studio and engineering portfolio.
              </p>
              <p>
                For any privacy questions or requests regarding your submitted data, contact:{" "}
                <a
                  href="mailto:theshivamshukla.4uu@gmail.com"
                  className="font-mono text-xs text-[var(--color-accent)] underline hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  theshivamshukla.4uu@gmail.com
                </a>
                .
              </p>
            </section>

            {/* 2. Information Collected via Contact Form */}
            <section className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                2. Information Submitted via Contact Form
              </h2>
              <p>
                When you initiate an engagement or inquiry through the public contact form, the following details are submitted:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 font-sans">
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Name / Organization:</strong> To identify who is contacting the studio.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Direct Email:</strong> To respond to your inquiry directly.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Inquiry Brief:</strong> The project details, requirements, or message you provide.
                </li>
              </ul>
              <p>
                This information is persisted in a private, managed Supabase database instance with Row Level Security (RLS) enabled. Public anonymous access is revoked; only authenticated administrative Server Actions with service-role credentials can access contact submissions.
              </p>
            </section>

            {/* 3. Security, Abuse Prevention & Rate Limiting */}
            <section className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                3. Security, Abuse Prevention & Rate Limiting
              </h2>
              <p>
                To protect the website and server infrastructure from distributed denial of service and automated spam attacks, the following technical safeguards are deployed:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 font-sans">
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Anonymized Rate Limiting:</strong> Incoming requests extract the client IP address server-side from proxy headers. The IP address is immediately converted into a salted SHA-256 cryptographic hash. This anonymized hash is used as an ephemeral counter in Upstash Redis to enforce a limit of 5 requests per 10-minute window. Raw IP addresses are never logged or stored in database tables.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Cloudflare Turnstile:</strong> We use Cloudflare Turnstile to verify human interaction without intrusive puzzle CAPTCHAs. Verification tokens are checked server-side via Cloudflare Siteverify and are single-use; tokens are never permanently stored.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Honeypot Validation:</strong> Form fields include invisible honeypot elements to silently trap automated bot submissions.
                </li>
              </ul>
            </section>

            {/* 4. Infrastructure & Service Providers */}
            <section className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                4. Infrastructure & Hosting
              </h2>
              <p>The website utilizes the following infrastructure providers:</p>
              <ul className="list-disc pl-5 space-y-1.5 font-sans">
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Vercel:</strong> Application hosting, edge proxy, and production deployment with automated HTTPS/TLS encryption.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Supabase:</strong> Managed database storage for inquiries and published CMS content.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Upstash Redis:</strong> Ephemeral in-memory sliding-window counter storage.
                </li>
                <li>
                  <strong className="text-[var(--color-ink-primary)]">Cloudflare:</strong> Turnstile bot verification service.
                </li>
              </ul>
            </section>

            {/* 5. Zero Third-Party Advertising & Tracking */}
            <section className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                5. Cookies & Analytics
              </h2>
              <p>
                The public website does not use marketing cookies, tracking pixels, third-party advertising networks, or invasive analytics services. Essential cookies are utilized solely for authenticated administrative sessions in the private studio dashboard.
              </p>
            </section>

            {/* 6. Retention & User Rights */}
            <section className="space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-[var(--color-ink-primary)] font-normal tracking-tight">
                6. Data Retention & User Rights
              </h2>
              <p>
                Contact inquiries are retained only for as long as necessary to evaluate and communicate regarding the potential collaboration. Ephemeral rate-limiting counters in Redis automatically expire after 10 minutes.
              </p>
              <p>
                You may request that your past submitted contact information be deleted or modified at any time by emailing{" "}
                <a
                  href="mailto:theshivamshukla.4uu@gmail.com"
                  className="font-mono text-xs text-[var(--color-accent)] underline hover:text-[var(--color-ink-primary)] transition-colors"
                >
                  theshivamshukla.4uu@gmail.com
                </a>
                .
              </p>
            </section>
            </div>
          </InnerPageEntrance>

          {/* Footer Back Link */}
          <InnerPageEntrance delayIndex={2}>
            <div className="pt-8 border-t border-[var(--color-hairline)] flex items-center justify-between text-xs font-mono text-[var(--color-ink-secondary)]">
              <Link
                href="/"
                className="hover:text-[var(--color-ink-primary)] transition-colors underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-ink-primary)]"
              >
                ← Back to Home
              </Link>
              <Link
                href="/contact"
                className="text-[var(--color-accent)] hover:underline"
              >
                Initiate an Engagement →
              </Link>
            </div>
          </InnerPageEntrance>
        </div>
      </SectionContainer>
    </div>
  );
}
