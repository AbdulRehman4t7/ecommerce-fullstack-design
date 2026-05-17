"use client";

import Image from "next/image";
import Link from "next/link";
import StarRating from "@/components/shared/StarRating";
import AddToCartButton from "@/components/shared/AddToCartButton";
import type { Product } from "@/types";

interface ProductGridItemProps {
  product: Product;
}

export default function ProductGridItem({ product }: ProductGridItemProps) {
  return (
    <article className="flex flex-col rounded border border-border bg-white overflow-hidden">
      <Link
        href={`/products/${product.id}`}
        className="relative h-[200px] w-full bg-page-bg"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-[13px] font-medium text-primary hover:underline"
        >
          {product.name}
        </Link>
        <StarRating rating={product.rating} className="mt-1" />
        <span className="text-xs text-grey-text">{product.reviews} reviews</span>
        <p className="mt-1 text-base font-bold text-success">
          ${product.price.toFixed(2)}
        </p>
        <p className="text-xs text-grey-text">
          Min. order: {product.minOrder} {product.unit}
        </p>
        <AddToCartButton product={product} className="mt-2 w-full" />
      </div>
    </article>
  );
}
