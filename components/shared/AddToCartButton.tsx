"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  showIcon?: boolean;
  label?: string;
}

export default function AddToCartButton({
  product,
  className = "",
  showIcon = false,
  label = "Add to cart",
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className={`rounded bg-success px-4 py-2 text-sm font-medium text-white hover:bg-success/90 ${className}`}
    >
      {showIcon && <ShoppingCart size={16} className="mr-1 inline" />}
      {label}
    </button>
  );
}
