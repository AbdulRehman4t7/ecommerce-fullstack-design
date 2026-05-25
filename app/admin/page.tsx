"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import StatsCard from "@/components/admin/StatsCard";
import type { Product } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, users: 0, categories: 0, orders: 0 });
  const [recent, setRecent] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
    fetch("/api/products?limit=5&sort=newest")
      .then((r) => r.json())
      .then((j) => setRecent(j.data ?? []));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Products" value={stats.products} hint="+ active catalog" icon="📦" accent="border-l-primary" />
        <StatsCard title="Users" value={stats.users} hint="+ registered" icon="👥" accent="border-l-success" />
        <StatsCard title="Categories" value={stats.categories} hint="active" icon="📁" accent="border-l-accent" />
        <StatsCard title="Orders" value={stats.orders} hint="placeholder" icon="🛒" accent="border-l-grey-text" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/products" className="rounded bg-primary px-4 py-2 text-sm text-white">
          + Add Product
        </Link>
        <Link href="/admin/categories" className="rounded border border-border bg-white px-4 py-2 text-sm">
          + Add Category
        </Link>
        <Link href="/" className="rounded border border-border bg-white px-4 py-2 text-sm">
          View Store
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <h2 className="border-b border-border px-4 py-3 font-medium">Recent Products</h2>
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-page-bg text-xs text-grey-text">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <div className="relative h-10 w-10 bg-page-bg">
                    {p.image && (
                      <Image src={p.image} alt="" fill className="object-cover" sizes="40px" />
                    )}
                  </div>
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
