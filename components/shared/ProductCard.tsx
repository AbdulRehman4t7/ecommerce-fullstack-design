"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = true }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded border border-border bg-white p-2 transition-shadow hover:shadow-md"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[120px] overflow-hidden bg-page-bg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
      <p className="mt-2 text-base font-bold text-success">
        ${product.price.toFixed(2)}
      </p>
      <h3 className="mt-0.5 line-clamp-2 text-xs leading-tight text-dark-text group-hover:text-primary">
        {product.name}
      </h3>
      {!compact && (
        <p className="mt-0.5 line-clamp-1 text-[11px] text-grey-text">
          {product.description}
        </p>
      )}
      {compact && (
        <p className="mt-0.5 line-clamp-1 text-[11px] text-grey-text">
          Min. order: {product.minOrder} {product.unit}
          {product.minOrder > 1 ? "s" : ""}
        </p>
      )}
    </Link>
  );
}
