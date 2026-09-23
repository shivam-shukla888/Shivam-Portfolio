import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Authorization",
  description: "Private administrative authorization.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage() {
  const auth = await getAuthenticatedAdmin();

  // If already authenticated and authorized as admin, redirect to admin root
  if (auth.isAuthorized) {
    redirect("/admin");
  }

  return (
    <div className="w-full min-h-[calc(100vh-160px)] flex items-center justify-center py-20">
      <SectionContainer>
        <div className="max-w-md mx-auto space-y-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
                RESTRICTED ACCESS
              </span>
              <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
              Admin Access
            </h1>

            <p className="font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
              Authenticate via verified administrative credentials to access system controls.
            </p>
          </div>

          <div className="p-8 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)]">
            <LoginForm />
          </div>

          <div className="pt-2 text-center sm:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink-primary)] transition-colors"
            >
              <span>← Return to Public Site</span>
            </Link>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
