"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DealProduct } from "@/types";
import { calcDiscount } from "@/lib/mappers/product";

interface DealsSectionProps {
  products: DealProduct[];
}

export default function DealsSection({ products }: DealsSectionProps) {
  const [time, setTime] = useState({ h: 3, m: 27, s: 31 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          return { h: 3, m: 27, s: 31 };
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="mt-4 rounded border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-dark-text">
          Deals and offers
        </h2>
        <div className="flex items-center gap-1 text-sm">
          <span className="rounded bg-primary px-2 py-1 font-mono text-white">
            {pad(time.h)}h
          </span>
          <span className="text-grey-text">:</span>
          <span className="rounded bg-primary px-2 py-1 font-mono text-white">
            {pad(time.m)}m
          </span>
          <span className="text-grey-text">:</span>
          <span className="rounded bg-accent px-2 py-1 font-mono text-white">
            {pad(time.s)}s
          </span>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {products.map((product) => {
          const discount =
            product.discount ?? calcDiscount(product) ?? 15;
          return (
            <Link
              key={product.id}
              href={`/products/${product.slug ?? product.id}`}
              className="flex w-[140px] shrink-0 flex-col rounded border border-border p-2 hover:shadow-sm"
            >
              <div className="relative h-20 w-20">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="rounded object-cover"
                  sizes="80px"
                />
              </div>
              <span className="mt-1 inline-block w-fit rounded bg-red-500 px-1 text-[10px] font-bold text-white">
                -{discount}%
              </span>
              <p className="mt-1 line-clamp-2 text-xs text-dark-text">
                {product.name}
              </p>
              <p className="mt-1 text-sm font-bold text-success">
                ${product.price.toFixed(2)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
