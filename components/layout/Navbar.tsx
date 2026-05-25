"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IMAGES } from "@/lib/assets";
import {
  Bell,
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import SearchDropdown from "@/components/products/SearchDropdown";
import MobileDrawer from "./MobileDrawer";

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, profile, signOut, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName =
    profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "User";
  const initials = (profile?.full_name ?? user?.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const submitSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2.5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded p-1 md:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="relative flex shrink-0 items-center">
              <Image
                src={IMAGES.logo}
                alt="ShopZone"
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

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {!loading && !user && (
                <>
                  <Link
                    href="/login"
                    className="hidden rounded border border-primary px-3 py-1.5 text-sm text-primary hover:bg-primary/5 sm:inline-block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden rounded bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary/90 sm:inline-block"
                  >
                    Join Free
                  </Link>
                </>
              )}

              {!loading && user && (
                <>
                  <button
                    type="button"
                    className="hidden text-grey-text hover:text-primary sm:block"
                    aria-label="Notifications"
                  >
                    <Bell size={20} />
                  </button>
                  <div className="relative hidden sm:block" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-1 text-sm text-grey-text hover:text-primary"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-white">
                        {initials}
                      </span>
                      <span className="hidden lg:inline">{displayName}</span>
                      <ChevronDown size={14} />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded border border-border bg-white py-1 shadow-lg text-sm">
                        <Link href="/profile" className="block px-3 py-2 hover:bg-page-bg">
                          My Profile
                        </Link>
                        <Link href="/orders" className="block px-3 py-2 hover:bg-page-bg">
                          My Orders
                        </Link>
                        <Link href="/products" className="block px-3 py-2 hover:bg-page-bg">
                          Wishlist
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="block px-3 py-2 text-primary hover:bg-page-bg">
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-border" />
                        <button
                          type="button"
                          onClick={() => signOut()}
                          className="block w-full px-3 py-2 text-left text-red-600 hover:bg-page-bg"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

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
                <span className="hidden xs:inline">Cart</span>
                <span>({itemCount})</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-4 py-2 md:hidden">
          <div className="flex gap-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
              placeholder="Search products..."
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
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
