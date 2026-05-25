"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, LayoutGrid, List, PackageOpen } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ActiveFilters from "@/components/shared/ActiveFilters";
import FilterSidebar from "./FilterSidebar";
import ProductListItem from "./ProductListItem";
import ProductGridItem from "./ProductGridItem";
import NewsletterSection from "@/components/shared/NewsletterSection";
import type { Category, Product } from "@/types";
import type { ProductsListResponse } from "@/types/api";

interface ProductListingClientProps {
  initialData: ProductsListResponse;
  categories: Category[];
}

export default function ProductListingClient({
  initialData,
  categories,
}: ProductListingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "grid" ? "grid" : "list";
  const [filterOpen, setFilterOpen] = useState(false);

  const categorySlug = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;
  const badge = searchParams.get("badge") ?? undefined;
  const verifiedOnly = badge === "Verified";

  const { data: products, total, page, totalPages } = initialData;

  const categoryLabel =
    categories.find((c) => c.slug === categorySlug)?.name ??
    (search ? `Search: ${search}` : "All products");

  const setView = useCallback(
    (newView: "list" | "grid") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", newView);
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  };

  const activeFilters: { key: string; label: string; href: string }[] = [];
  const buildHrefWithout = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete("page");
    return `/products?${params.toString()}`;
  };

  if (categorySlug) {
    activeFilters.push({
      key: "category",
      label: categoryLabel,
      href: buildHrefWithout("category"),
    });
  }
  if (search) {
    activeFilters.push({
      key: "search",
      label: `"${search}"`,
      href: buildHrefWithout("search"),
    });
  }
  if (verifiedOnly) {
    activeFilters.push({
      key: "badge",
      label: "Verified",
      href: buildHrefWithout("badge"),
    });
  }

  const goToPage = (n: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(n));
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: categoryLabel,
            href: categorySlug ? `/products?category=${categorySlug}` : "/products",
          },
        ]}
      />

      <ActiveFilters filters={activeFilters} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-dark-text">
          <span className="font-semibold">{total.toLocaleString()}</span> items
          in {categoryLabel}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) =>
                updateParam("badge", e.target.checked ? "Verified" : null)
              }
            />
            Verified only
          </label>
          <select
            className="rounded border border-border px-2 py-1 text-sm"
            value={sort ?? "featured"}
            onChange={(e) => {
              const v = e.target.value;
              updateParam("sort", v === "featured" ? null : v);
            }}
          >
            <option value="featured">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
          </select>
          <div className="flex rounded border border-border">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
                view === "list"
                  ? "bg-primary text-white"
                  : "text-grey-text hover:bg-page-bg"
              }`}
              aria-label="List view"
            >
              <List size={16} /> List
            </button>
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm ${
                view === "grid"
                  ? "bg-primary text-white"
                  : "text-grey-text hover:bg-page-bg"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} /> Grid
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFilterOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-lg lg:hidden"
      >
        <Filter size={16} />
        Filters
      </button>

      <div className="flex gap-4">
        <FilterSidebar
          categories={categories}
          mobileOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          activeCategory={categorySlug}
        />
        <div className="min-w-0 flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded border border-border bg-white py-16 text-center">
              <PackageOpen size={48} className="text-grey-text" />
              <p className="mt-4 text-lg font-semibold text-dark-text">
                No products found
              </p>
              <Link
                href="/products"
                className="mt-3 text-sm text-primary hover:underline"
              >
                Clear filters
              </Link>
            </div>
          ) : view === "list" ? (
            <div className="rounded border border-border">
              {products.map((product: Product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product) => (
                <ProductGridItem key={product.id} product={product} />
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded border border-border bg-white px-4 py-3 text-sm">
              <select
                className="rounded border border-border px-2 py-1"
                value={searchParams.get("limit") ?? "12"}
                onChange={(e) => updateParam("limit", e.target.value)}
              >
                <option value="10">Show 10</option>
                <option value="12">Show 12</option>
                <option value="20">Show 20</option>
              </select>
              <div className="flex items-center gap-1">
                <span className="text-grey-text">Page:</span>
                {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goToPage(n)}
                      className={`min-w-[32px] rounded border px-2 py-1 ${
                        n === page
                          ? "border-primary bg-primary text-white"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
                {totalPages > 4 && (
                  <>
                    <span className="px-1">...</span>
                    <button
                      type="button"
                      onClick={() => goToPage(totalPages)}
                      className="min-w-[32px] rounded border border-border px-2 py-1 hover:border-primary"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                {page < totalPages && (
                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    className="ml-2 text-primary hover:underline"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
