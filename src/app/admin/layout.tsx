import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { SectionContainer } from "@/components/layout/SectionContainer";
import { logoutAdmin } from "@/app/actions/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-admin-pathname") || "";

  // The login route is public and must not be trapped by the protected admin guard
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Server-side auth & authorization guard for all protected admin routes
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-12 md:py-20 bg-[var(--color-canvas-primary)]">
      <SectionContainer>
        <div className="space-y-8">
          {/* Top Admin Shell Header */}
          <header className="pb-6 border-b border-[var(--color-hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
                  EDITORIAL CONTROL ROOM
                </span>
                <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
              </div>
              <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
                OPERATOR: {auth.user?.email || "SHIVSASTRA ADMIN"}
              </p>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="font-mono text-xs uppercase tracking-[0.1em] px-3 py-1.5 border border-[var(--color-hairline)] text-[var(--color-ink-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                Sign Out ⎋
              </button>
            </form>
          </header>

          {/* Protected Content */}
          <main>{children}</main>
        </div>
      </SectionContainer>
    </div>
  );
}
