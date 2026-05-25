"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import type { Category } from "@/types";
import ProductFormModal from "./ProductFormModal";

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);

    const [pRes, cRes] = await Promise.all([
      fetch(`/api/products?${params}`),
      fetch("/api/categories"),
    ]);

    const pJson = await pRes.json();
    const cJson = await cRes.json();
    setProducts(pJson.data ?? []);
    setCategories(cJson.data ?? []);
    setLoading(false);
  }, [search, categoryFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} products?`)) return;
    await Promise.all(
      Array.from(selected).map((id) =>
        fetch(`/api/products/${id}`, { method: "DELETE" })
      )
    );
    setSelected(new Set());
    load();
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">Products ({products.length})</h1>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="rounded bg-primary px-4 py-2 text-sm text-white"
        >
          + Add Product
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-text" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded border border-border py-2 pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded border border-border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {selected.size > 0 && (
        <div className="mb-3 rounded bg-red-50 px-3 py-2 text-sm">
          <button type="button" onClick={bulkDelete} className="text-red-600">
            🗑️ Delete Selected ({selected.size})
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-page-bg text-xs text-grey-text">
            <tr>
              <th className="p-3">☐</th>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-grey-text">
                  Loading...
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-page-bg/50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleSelect(p.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded bg-page-bg">
                      {p.image && (
                        <Image src={p.image} alt="" fill className="object-cover" sizes="56px" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-grey-text">#{p.id.slice(0, 8)}</p>
                  </td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">${p.price.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={p.inStock ? "text-success" : "text-red-600"}>
                      {p.inStock ? "🟢 In Stock" : "Out"}
                    </span>
                    <span className="ml-1 text-grey-text">({p.stock})</span>
                  </td>
                  <td className="p-3">★{p.rating}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(p);
                          setModalOpen(true);
                        }}
                        aria-label="Edit"
                      >
                        <Pencil size={16} className="text-primary" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        open={modalOpen}
        product={editing}
        categories={categories}
        onClose={() => setModalOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
