"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types";
import { slugify } from "@/lib/utils/slug";

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("📦");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    setCategories(json.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setIcon("📦");
    setEditId(null);
  };

  const save = async () => {
    if (!name || !slug) return;

    const payload = { name, slug, icon };

    if (editId) {
      await fetch(`/api/categories/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    load();
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id ?? null);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon);
  };

  const remove = async (cat: Category) => {
    if (!cat.id) return;
    if (
      !confirm(
        `Delete "${cat.name}"? This may affect ${cat.productCount ?? 0} products.`
      )
    )
      return;
    await fetch(`/api/categories/${cat.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="rounded-lg border border-border bg-white p-4 lg:col-span-2">
        <h2 className="mb-4 font-semibold">
          {editId ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs text-grey-text">Category Name *</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editId) setSlug(slugify(e.target.value));
              }}
              className="mt-1 w-full rounded border border-border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-xs text-grey-text">Slug *</label>
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="mt-1 w-full rounded border border-border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-xs text-grey-text">Icon (emoji)</label>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="mt-1 w-full rounded border border-border px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={save}
            className="w-full rounded bg-primary py-2 text-white"
          >
            Save Category
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="w-full text-sm text-grey-text">
              Cancel edit
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-white p-4 lg:col-span-3">
        <h2 className="mb-4 font-semibold">Categories</h2>
        {loading ? (
          <p className="text-sm text-grey-text">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs text-grey-text">
              <tr>
                <th className="pb-2 text-left">Icon</th>
                <th className="pb-2 text-left">Name</th>
                <th className="pb-2 text-left">Slug</th>
                <th className="pb-2 text-left">Products</th>
                <th className="pb-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id ?? cat.slug} className="border-t border-border">
                  <td className="py-2">{cat.icon}</td>
                  <td className="py-2">{cat.name}</td>
                  <td className="py-2 text-grey-text">{cat.slug}</td>
                  <td className="py-2">{cat.productCount ?? 0}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(cat)}>
                        <Pencil size={14} />
                      </button>
                      <button type="button" onClick={() => remove(cat)}>
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
