"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/cart", label: "Cart" },
  { href: "/profile", label: "My Profile" },
  { href: "/orders", label: "My Orders" },
];

const categories = [
  { href: "/products?category=electronics", label: "Electronics" },
  { href: "/products?category=clothes", label: "Clothes" },
  { href: "/products?category=home-garden", label: "Home & Garden" },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { user, profile, signOut, isAdmin } = useAuth();

  if (!open) return null;

  const initials = (profile?.full_name ?? user?.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[55] bg-black/40"
        onClick={onClose}
        aria-label="Close menu"
      />
      <aside className="fixed left-0 top-0 z-[56] flex h-full w-[280px] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm text-white">
                {initials}
              </span>
              <div>
                <p className="text-sm font-medium">{profile?.full_name ?? "User"}</p>
                <p className="text-xs text-grey-text">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="rounded border border-primary px-3 py-1.5 text-sm text-primary"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="rounded bg-primary px-3 py-1.5 text-sm text-white"
              >
                Join Free
              </Link>
            </div>
          )}
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-2 text-xs font-semibold uppercase text-grey-text">Menu</p>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block rounded px-2 py-2 text-sm hover:bg-page-bg"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="mt-2 block rounded px-2 py-2 text-sm text-primary"
            >
              Admin Panel
            </Link>
          )}
          <p className="mb-2 mt-6 text-xs font-semibold uppercase text-grey-text">
            Categories
          </p>
          {categories.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block rounded px-2 py-2 text-sm text-grey-text hover:bg-page-bg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {user && (
          <button
            type="button"
            onClick={() => {
              signOut();
              onClose();
            }}
            className="border-t border-border p-4 text-left text-sm text-red-600"
          >
            Sign Out
          </button>
        )}
      </aside>
    </>
  );
}
