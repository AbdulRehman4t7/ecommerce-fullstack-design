"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import PromoBanner from "@/components/shared/PromoBanner";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    toggleSelect,
    toggleSelectAll,
    removeSelected,
  } = useCart();
  const [coupon, setCoupon] = useState("");

  const selectedItems = items.filter((i) => i.selected);
  const allSelected = items.length > 0 && items.every((i) => i.selected);

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const discount = subtotal * 0.1;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="text-2xl font-bold text-dark-text">
        My cart ({items.length})
      </h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 lg:w-[65%]">
          <div className="overflow-hidden rounded border border-border bg-white">
            <div className="hidden border-b border-border bg-page-bg px-4 py-2 text-sm font-medium text-grey-text sm:grid sm:grid-cols-[auto_1fr_100px_120px_100px] sm:gap-4">
              <span />
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
            </div>

            <label className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
              Select all ({items.length} items)
            </label>

            {items.map((item) => (
              <div
                key={item.product.id}
                className="grid grid-cols-1 gap-3 border-b border-border p-4 last:border-b-0 sm:grid-cols-[auto_1fr_100px_120px_100px] sm:items-center sm:gap-4"
              >
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.product.id)}
                  className="sm:mt-0"
                />
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-border">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/products/${item.product.slug ?? item.product.id}`}
                      className="line-clamp-2 text-sm font-medium text-dark-text hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-grey-text">
                      {item.product.seller}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold sm:text-center">
                  ${item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center justify-center">
                  <div className="flex items-center rounded border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="px-2 py-1 hover:bg-page-bg"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[32px] text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="px-2 py-1 hover:bg-page-bg"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-bold text-dark-text sm:text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <Link href="/products" className="text-primary hover:underline">
              ← Back to shop
            </Link>
            <button
              type="button"
              onClick={removeSelected}
              className="flex items-center gap-1 text-red-500 hover:underline"
            >
              <Trash2 size={16} /> Remove selected
            </button>
          </div>
        </div>

        <aside className="lg:w-[35%]">
          <div className="sticky top-24 rounded border border-border bg-white p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-grey-text">
                  Subtotal ({selectedItems.length} items)
                </dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-grey-text">Shipping</dt>
                <dd className="text-success">$0.00 (Free)</dd>
              </div>
              <div className="flex justify-between text-success">
                <dt>Discount (10%)</dt>
                <dd>- ${discount.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-grey-text">Tax (5%)</dt>
                <dd>${tax.toFixed(2)}</dd>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <dt>Total</dt>
                  <dd className="text-success">${total.toFixed(2)}</dd>
                </div>
              </div>
            </dl>

            <button
              type="button"
              className="mt-4 w-full rounded bg-success py-3 text-sm font-semibold text-white hover:bg-success/90"
            >
              Checkout (${total.toFixed(2)})
            </button>

            <p className="my-3 text-center text-xs text-grey-text">or</p>
            <Link
              href="/products"
              className="block text-center text-sm text-grey-text hover:text-primary"
            >
              ← Continue shopping
            </Link>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-sm font-medium">COUPON CODE</p>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded border border-border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs text-grey-text">We accept:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Visa", "Mastercard", "PayPal", "COD"].map((p) => (
                  <span
                    key={p}
                    className="rounded border border-border px-2 py-1 text-xs"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-primary">
              <p>📦 Source from Industry Hubs</p>
              <p>🎨 Customize Products</p>
              <p>🚚 Fast Shipping</p>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-8">
        <PromoBanner />
      </div>
    </div>
  );
}
