import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { getAllOrdersForAdmin } from "@/lib/orders";
import { formatPrice } from "@/lib/products";

export const metadata: Metadata = {
  title: "Orders Administration | Admin",
  description: "Administrative store orders ledger, payment verification, and delivery audit.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminOrdersPage() {
  const auth = await getAuthenticatedAdmin();

  if (!auth.isAuthorized) {
    redirect("/admin/login");
  }

  const orders = await getAllOrdersForAdmin({ limit: 100 });

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
          Orders Ledger
        </span>
      </div>

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-hairline)]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-accent)] font-medium">
              TRANSACTION AUDIT
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] inline-block" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[var(--color-ink-primary)]">
            Store Orders Ledger
          </h1>
          <p className="font-sans text-sm text-[var(--color-ink-secondary)]">
            Verified acquisition orders, Razorpay transaction references, and digital delivery status.
          </p>
        </div>

        <div className="font-mono text-xs text-[var(--color-ink-secondary)] border border-[var(--color-hairline)] px-3 py-1.5 bg-[var(--color-canvas-secondary)]">
          Total Records: {orders.length}
        </div>
      </div>

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-hairline)] font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-secondary)] bg-[var(--color-canvas-primary)]">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Product Edition</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Gateway IDs</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-hairline)] font-sans text-xs text-[var(--color-ink-primary)]">
              {orders.map((order) => {
                const formatted = formatPrice(order.amount_cents, order.currency);
                const isPaid = order.status === "paid";
                const isSent = order.delivery_status === "sent";

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--color-canvas-primary)] transition-colors"
                  >
                    <td className="py-4 px-4 font-mono text-xs">
                      <span className="text-[var(--color-accent)] font-medium">
                        {order.id.slice(0, 8)}…
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="font-medium text-[var(--color-ink-primary)] block">
                          {order.product_title_snapshot}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--color-ink-secondary)]">
                          {order.product_slug_snapshot}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">
                      {order.customer_email}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs font-medium">
                      {formatted}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                          isPaid
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/30"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-600/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[10px] text-[var(--color-ink-secondary)] space-y-0.5">
                      <div>Order: {order.razorpay_order_id || "—"}</div>
                      <div>Payment: {order.razorpay_payment_id || "—"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                          isSent
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/30"
                            : order.delivery_status === "failed"
                            ? "bg-red-500/10 text-red-700 dark:text-red-400 border-red-600/30"
                            : "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-600/30"
                        }`}
                      >
                        {order.delivery_status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-xs text-[var(--color-ink-secondary)]">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-12 border border-[var(--color-hairline)] bg-[var(--color-canvas-secondary)] text-center space-y-3">
          <p className="font-mono text-xs text-[var(--color-ink-secondary)]">
            No orders recorded in ledger yet.
          </p>
          <p className="font-sans text-xs text-[var(--color-ink-secondary)] max-w-md mx-auto">
            Transactions will automatically populate here upon customer acquisition initiation.
            (Note: Live order storage requires applying migration 20260924000001_store_orders_and_delivery.sql to Supabase).
          </p>
        </div>
      )}
    </div>
  );
}
