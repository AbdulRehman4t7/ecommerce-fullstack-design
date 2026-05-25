"use client";

import PageShell from "@/components/layout/PageShell";

export default function OrdersPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-xl font-semibold">My Orders</h1>
        <p className="mt-2 text-grey-text">No orders yet. Start shopping!</p>
        <a href="/products" className="mt-4 inline-block text-primary hover:underline">
          Browse products
        </a>
      </div>
    </PageShell>
  );
}
