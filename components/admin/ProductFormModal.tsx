"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Product } from "@/types";
import type { Category } from "@/types";
import { slugify } from "@/lib/utils/slug";

export interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  min_order: number;
  unit: string;
  stock: number;
  category_id: string;
  subcategory: string;
  seller_name: string;
  seller_country: string;
  seller_flag: string;
  free_shipping: boolean;
  is_featured: boolean;
  badge: string | null;
  images: string[];
  specs: { key: string; value: string }[];
  tags: string[];
}

const emptyForm = (): ProductFormValues => ({
  name: "",
  slug: "",
  description: "",
  price: 0,
  original_price: null,
  min_order: 1,
  unit: "piece",
  stock: 0,
  category_id: "",
  subcategory: "",
  seller_name: "",
  seller_country: "China",
  seller_flag: "🇨🇳",
  free_shipping: false,
  is_featured: false,
  badge: null,
  images: [""],
  specs: [],
  tags: [],
});

interface ProductFormModalProps {
  open: boolean;
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductFormModal({
  open,
  product,
  categories,
  onClose,
  onSaved,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormValues>(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug ?? slugify(product.name),
        description: product.description,
        price: product.price,
        original_price: product.originalPrice ?? null,
        min_order: product.minOrder,
        unit: product.unit,
        stock: product.stock ?? 0,
        category_id:
          categories.find((c) => c.slug === product.categorySlug)?.id ?? "",
        subcategory: product.subcategory,
        seller_name: product.seller,
        seller_country: product.sellerCountry,
        seller_flag: product.sellerFlag,
        free_shipping: product.freeShipping,
        is_featured: product.isFeatured ?? false,
        badge: product.badge ?? null,
        images: product.images.length ? product.images : [""],
        specs: product.specs,
        tags: product.tags,
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [open, product, categories]);

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (!form.category_id) e.category_id = "Category is required";
    if (form.price <= 0) e.price = "Price must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      ...form,
      badge: form.badge || null,
      images: form.images.filter(Boolean),
    };

    const url = product ? `/api/products/${product.id}` : "/api/products";
    const method = product ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!res.ok) {
      const json = await res.json();
      setErrors({ form: json.error ?? "Save failed" });
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40">
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-xl sm:max-w-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="font-semibold">{product ? "Edit Product" : "Add Product"}</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {errors.form && <p className="text-red-600">{errors.form}</p>}

          <div>
            <label className="text-xs text-grey-text">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                  slug: f.slug || slugify(e.target.value),
                }))
              }
              className="mt-1 w-full rounded border border-border px-3 py-2"
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs text-grey-text">Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              className="mt-1 w-full rounded border border-border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-xs text-grey-text">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded border border-border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-grey-text">Category *</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="mt-1 w-full rounded border border-border px-2 py-2"
              >
                <option value="">Select</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-grey-text">Badge</label>
              <select
                value={form.badge ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, badge: e.target.value || null }))
                }
                className="mt-1 w-full rounded border border-border px-2 py-2"
              >
                <option value="">None</option>
                <option value="Hot">Hot</option>
                <option value="New">New</option>
                <option value="Sale">Sale</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-grey-text">Price *</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: +e.target.value }))}
                className="mt-1 w-full rounded border border-border px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs text-grey-text">Original Price</label>
              <input
                type="number"
                min={0}
                value={form.original_price ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    original_price: e.target.value ? +e.target.value : null,
                  }))
                }
                className="mt-1 w-full rounded border border-border px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-grey-text">Min order</label>
              <input
                type="number"
                value={form.min_order}
                onChange={(e) => setForm((f) => ({ ...f, min_order: +e.target.value }))}
                className="mt-1 w-full rounded border border-border px-2 py-2"
              />
            </div>
            <div>
              <label className="text-xs text-grey-text">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                className="mt-1 w-full rounded border border-border px-2 py-2"
              >
                <option value="piece">piece</option>
                <option value="kg">kg</option>
                <option value="set">set</option>
                <option value="pair">pair</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-grey-text">Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: +e.target.value }))}
                className="mt-1 w-full rounded border border-border px-2 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.free_shipping}
                onChange={(e) => setForm((f) => ({ ...f, free_shipping: e.target.checked }))}
              />
              Free shipping
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              />
              Featured
            </label>
          </div>

          <div>
            <label className="text-xs text-grey-text">Image URLs</label>
            {form.images.map((url, i) => (
              <div key={i} className="mt-1 flex gap-2">
                <input
                  value={url}
                  onChange={(e) => {
                    const imgs = [...form.images];
                    imgs[i] = e.target.value;
                    setForm((f) => ({ ...f, images: imgs }));
                  }}
                  className="flex-1 rounded border border-border px-2 py-1"
                  placeholder="/assets/..."
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      images: f.images.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 text-xs text-primary"
              onClick={() => setForm((f) => ({ ...f, images: [...f.images, ""] }))}
            >
              + Add image URL
            </button>
          </div>

          <div>
            <label className="text-xs text-grey-text">Tags</label>
            <div className="mt-1 flex flex-wrap gap-1">
              {form.tags.map((t) => (
                <span
                  key={t}
                  className="rounded bg-page-bg px-2 py-0.5 text-xs"
                >
                  {t}{" "}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }))
                    }
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && tagInput.trim()) {
                  e.preventDefault();
                  setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
                  setTagInput("");
                }
              }}
              placeholder="Press Enter to add tag"
              className="mt-1 w-full rounded border border-border px-2 py-1"
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-border p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded border border-border py-2 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded bg-primary py-2 text-sm text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
