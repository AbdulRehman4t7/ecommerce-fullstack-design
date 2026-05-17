"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-2.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded p-1 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            href="/"
            className="shrink-0 text-xl font-bold text-primary"
          >
            Brand
          </Link>

          <button
            type="button"
            className="hidden shrink-0 items-center gap-1 rounded border border-border px-3 py-2 text-sm text-dark-text hover:border-primary md:flex"
          >
            All category <ChevronDown size={14} />
          </button>

          <div className="hidden flex-1 items-center md:flex">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, suppliers..."
              className="h-9 flex-1 rounded-l border border-r-0 border-border px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              className="flex h-9 items-center gap-1 rounded-r bg-primary px-4 text-sm text-white hover:bg-primary/90"
            >
              <Search size={16} />
              Search
            </button>
          </div>

          <div className="ml-auto flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="hidden text-grey-text hover:text-primary sm:block"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            <button
              type="button"
              className="hidden items-center gap-1 text-sm text-grey-text hover:text-primary sm:flex"
            >
              <User size={20} />
              <span className="hidden lg:inline">Profile</span>
            </button>
            <button
              type="button"
              className="hidden items-center gap-1 text-sm text-grey-text hover:text-primary sm:flex"
            >
              <Heart size={20} />
              <span className="hidden lg:inline">Wishlist</span>
            </button>
            <Link
              href="/cart"
              className="flex items-center gap-1 text-sm text-grey-text hover:text-primary"
            >
              <ShoppingCart size={20} />
              <span>Cart ({itemCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <div className="flex gap-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-9 flex-1 rounded border border-border px-3 text-sm"
            />
            <button type="button" className="rounded bg-primary px-3 text-white">
              <Search size={18} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
