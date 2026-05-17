"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, LayoutGrid, List } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import FilterSidebar from "./FilterSidebar";
import ProductListItem from "./ProductListItem";
import ProductGridItem from "./ProductGridItem";
import NewsletterSection from "@/components/shared/NewsletterSection";
import { products } from "@/data/mockData";

const listingProducts = products.filter(
  (p) => p.subcategory === "Mobile accessories"
).slice(0, 6);

export default function ProductListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") === "grid" ? "grid" : "list";
  const [filterOpen, setFilterOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const setView = useCallback(
    (newView: "list" | "grid") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", newView);
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const displayed = verifiedOnly
    ? listingProducts.filter((p) => p.badge === "Verified")
    : listingProducts;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Electronics", href: "/products" },
          { label: "Mobile accessories" },
        ]}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-dark-text">
          <span className="font-semibold">12,911</span> items in Mobile accessory
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            Verified only
          </label>
          <select className="rounded border border-border px-2 py-1 text-sm">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
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
        className="mb-4 flex items-center gap-2 rounded border border-border bg-white px-4 py-2 text-sm lg:hidden"
      >
        <Filter size={16} />
        Filters
      </button>

      <div className="flex gap-4">
        <FilterSidebar
          mobileOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />
        <div className="min-w-0 flex-1">
          {view === "list" ? (
            <div className="rounded border border-border">
              {displayed.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((product) => (
                <ProductGridItem key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded border border-border bg-white px-4 py-3 text-sm">
            <select className="rounded border border-border px-2 py-1">
              <option>Show 10</option>
              <option>Show 20</option>
            </select>
            <div className="flex items-center gap-1">
              <span className="text-grey-text">Page:</span>
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`min-w-[32px] rounded border px-2 py-1 ${
                    n === 1
                      ? "border-primary bg-primary text-white"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="px-1">...</span>
              <button
                type="button"
                className="min-w-[32px] rounded border border-border px-2 py-1 hover:border-primary"
              >
                9
              </button>
              <button
                type="button"
                className="ml-2 text-primary hover:underline"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <NewsletterSection />
    </div>
  );
}
