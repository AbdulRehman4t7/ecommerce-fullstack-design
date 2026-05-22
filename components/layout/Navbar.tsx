"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { IMAGES } from "@/lib/assets";
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
import SearchDropdown from "@/components/products/SearchDropdown";

export default function Navbar() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const submitSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

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

          <Link href="/" className="relative flex shrink-0 items-center">
            <Image
              src={IMAGES.logo}
              alt="Brand"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <button
            type="button"
            className="hidden shrink-0 items-center gap-1 rounded border border-border px-3 py-2 text-sm text-dark-text hover:border-primary md:flex"
          >
            All category <ChevronDown size={14} />
          </button>

          <div
            ref={searchRef}
            className="relative hidden flex-1 items-center md:flex"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search products, suppliers..."
              className="h-9 flex-1 rounded-l border border-r-0 border-border px-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={submitSearch}
              className="flex h-9 items-center gap-1 rounded-r bg-primary px-4 text-sm text-white hover:bg-primary/90"
            >
              <Search size={16} />
              Search
            </button>
            <SearchDropdown
              query={searchQuery}
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
            />
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
        <div className="relative border-t border-border px-4 py-3 md:hidden">
          <div className="flex gap-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search..."
              className="h-9 flex-1 rounded border border-border px-3 text-sm"
            />
            <button
              type="button"
              onClick={submitSearch}
              className="rounded bg-primary px-3 text-white"
            >
              <Search size={18} />
            </button>
          </div>
          <SearchDropdown
            query={searchQuery}
            open={searchOpen && searchQuery.length > 0}
            onClose={() => setSearchOpen(false)}
          />
        </div>
      )}
    </header>
  );
}
