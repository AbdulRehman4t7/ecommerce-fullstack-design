"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Star } from "lucide-react";
import { brands, features } from "@/data/mockData";
import type { Category } from "@/types";

interface FilterSidebarProps {
  categories: Category[];
  mobileOpen?: boolean;
  onClose?: () => void;
  activeCategory?: string;
}

export default function FilterSidebar({
  categories,
  mobileOpen = false,
  onClose,
  activeCategory,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(
    searchParams.get("min_price") ?? ""
  );
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("max_price") ?? ""
  );
  const [condition, setCondition] = useState("any");

  const applyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("min_price", minPrice);
    else params.delete("min_price");
    if (maxPrice) params.set("max_price", maxPrice);
    else params.delete("max_price");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
    onClose?.();
  };

  const content = (
    <aside className="w-full rounded border border-border bg-white p-4 lg:w-[200px]">
      <Section title="Category">
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/products?category=${cat.slug}`}
                onClick={onClose}
                className={`block w-full text-left text-sm hover:text-primary ${
                  activeCategory === cat.slug
                    ? "font-semibold text-primary"
                    : "text-dark-text"
                }`}
              >
                {cat.name}
                {cat.productCount !== undefined && (
                  <span className="text-grey-text"> ({cat.productCount})</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/products"
          onClick={onClose}
          className="mt-2 inline-block text-sm text-primary"
        >
          See all
        </Link>
      </Section>

      <Section title="Brands">
        {brands.map((brand) => (
          <label key={brand} className="flex items-center gap-2 py-0.5 text-sm">
            <input type="checkbox" className="rounded border-border" />
            {brand}
          </label>
        ))}
        <button type="button" className="mt-1 text-sm text-primary">
          See all
        </button>
      </Section>

      <Section title="Features">
        {features.map((feature) => (
          <label
            key={feature}
            className="flex items-center gap-2 py-0.5 text-sm"
          >
            <input type="checkbox" className="rounded border-border" />
            {feature}
          </label>
        ))}
      </Section>

      <Section title="Price range">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded border border-border px-2 py-1 text-sm"
          />
          <span className="text-grey-text">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded border border-border px-2 py-1 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={applyPrice}
          className="mt-2 w-full rounded bg-primary py-1.5 text-sm text-white hover:bg-primary/90"
        >
          Apply
        </button>
      </Section>

      <Section title="Condition">
        {["any", "refurbished", "brand new"].map((opt) => (
          <label key={opt} className="flex items-center gap-2 py-0.5 text-sm capitalize">
            <input
              type="radio"
              name="condition"
              checked={condition === opt}
              onChange={() => setCondition(opt)}
            />
            {opt === "any" ? "Any" : opt}
          </label>
        ))}
      </Section>

      <Section title="Ratings">
        {[5, 4, 3].map((stars) => (
          <button
            key={stars}
            type="button"
            className="flex w-full items-center gap-1 py-1 text-sm hover:text-primary"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < stars
                    ? "fill-accent text-accent"
                    : "fill-none text-border"
                }
              />
            ))}
            <span className="ml-1 text-grey-text">& above</span>
          </button>
        ))}
      </Section>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{content}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Close filters"
          />
          <div className="absolute left-0 top-0 h-full w-[280px] overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              <button type="button" onClick={onClose} className="text-primary">
                Close
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 border-b border-border pb-4 last:border-0">
      <h4 className="mb-2 text-sm font-semibold text-dark-text">{title}</h4>
      {children}
    </div>
  );
}
