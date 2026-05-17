"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories } from "@/data/mockData";

export default function CategorySidebar() {
  return (
    <aside className="hidden w-full shrink-0 rounded border border-border bg-white lg:block lg:w-[200px]">
      <ul className="py-1">
        {categories.map((cat) => (
          <li key={cat.name}>
            <Link
              href="/products"
              className="flex items-center gap-2 px-3 py-2 text-sm text-dark-text hover:bg-page-bg hover:text-primary"
            >
              <span>{cat.icon}</span>
              <span className="flex-1">{cat.name}</span>
              {cat.subcategories.length > 0 && (
                <ChevronRight size={14} className="text-grey-text" />
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-border px-3 py-2">
        <Link href="/products" className="text-sm text-primary hover:underline">
          See all
        </Link>
      </div>
    </aside>
  );
}
