"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import StarRating from "@/components/shared/StarRating";
import AddToCartButton from "@/components/shared/AddToCartButton";
import type { Product } from "@/types";

interface ProductListItemProps {
  product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  return (
    <article className="flex gap-4 border-b border-border bg-white p-4 last:border-b-0">
      <input type="checkbox" className="mt-2 shrink-0" aria-label="Select product" />
      <Link
        href={`/products/${product.slug ?? product.id}`}
        className="relative h-40 w-40 shrink-0 overflow-hidden rounded border border-border bg-page-bg"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="160px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${product.slug ?? product.id}`}
          className="text-[15px] font-bold text-primary hover:underline"
        >
          {product.name}
        </Link>
        <StarRating
          rating={product.rating}
          showValue
          className="mt-1"
        />
        <span className="ml-2 text-xs text-grey-text">
          {product.reviews} reviews
        </span>
        <p className="mt-2 line-clamp-3 text-sm text-grey-text">
          {product.description}
        </p>
        <Link
          href={`/products/${product.slug ?? product.id}`}
          className="mt-1 inline-block text-sm text-primary hover:underline"
        >
          View details
        </Link>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.freeShipping && (
            <span className="rounded bg-green-50 px-2 py-0.5 text-xs text-success">
              Free Shipping
            </span>
          )}
          {product.badge === "Verified" && (
            <span className="rounded border border-primary px-2 py-0.5 text-xs text-primary">
              Verified
            </span>
          )}
        </div>
      </div>
      <div className="flex w-[150px] shrink-0 flex-col items-end gap-2">
        <p className="text-xl font-bold text-dark-text">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-xs text-grey-text">
          Min. order: {product.minOrder} {product.unit}
          {product.minOrder > 1 ? "s" : ""}
        </p>
        <AddToCartButton product={product} className="w-full" />
        <button
          type="button"
          className="rounded border border-border p-2 text-grey-text hover:text-accent"
          aria-label="Add to wishlist"
        >
          <Heart size={18} />
        </button>
      </div>
    </article>
  );
}
