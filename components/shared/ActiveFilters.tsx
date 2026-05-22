"use client";

import Link from "next/link";
import { X } from "lucide-react";

interface ActiveFiltersProps {
  filters: { key: string; label: string; href: string }[];
}

export default function ActiveFilters({ filters }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {filters.map((f) => (
        <Link
          key={f.key}
          href={f.href}
          className="inline-flex items-center gap-1 rounded-full border border-primary bg-blue-50 px-3 py-1 text-xs text-primary"
        >
          {f.label}
          <X size={12} />
        </Link>
      ))}
      <Link
        href="/products"
        className="text-xs text-grey-text hover:text-primary hover:underline"
      >
        Clear filters
      </Link>
    </div>
  );
}
