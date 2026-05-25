"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({
  open,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const name = profile?.full_name ?? profile?.email ?? "Admin";

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[250px] flex-col bg-[#1A1A2E] text-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <div>
            <p className="text-sm font-bold">ShopZone</p>
            <p className="text-xs text-white/60">Admin Panel</p>
          </div>
          <button type="button" className="lg:hidden" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${
                  active ? "bg-primary text-white" : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4 text-sm">
          <p className="truncate font-medium">{name}</p>
          <Link href="/" className="mt-2 inline-block text-xs text-primary hover:underline">
            ← Back to Store
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-2 block text-xs text-red-400 hover:underline"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
