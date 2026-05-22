"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { formatPrice } from "@/lib/utils/formatPrice";

interface SearchDropdownProps {
  query: string;
  open: boolean;
  onClose: () => void;
}

export default function SearchDropdown({
  query,
  open,
  onClose,
}: SearchDropdownProps) {
  const { results, loading, error } = useSearch(query);

  if (!open || !query.trim()) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[360px] overflow-hidden rounded border border-border bg-white shadow-lg">
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-grey-text">
          <Loader2 size={18} className="animate-spin" />
          Searching...
        </div>
      )}

      {!loading && error && (
        <p className="px-4 py-6 text-center text-sm text-grey-text">{error}</p>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-grey-text">
          No products found for &quot;{query}&quot;
        </p>
      )}

      {!loading && !error && results.length > 0 && (
        <ul>
          {results.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.slug ?? product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 hover:bg-page-bg"
              >
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-border">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm text-dark-text">
                    {product.name}
                  </p>
                  <p className="text-xs font-bold text-success">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          <li className="border-t border-border">
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={onClose}
              className="flex items-center justify-center gap-1 py-2.5 text-sm text-primary hover:underline"
            >
              <Search size={14} />
              See all results
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
}
