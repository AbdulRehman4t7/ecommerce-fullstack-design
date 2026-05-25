"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Product, CartItem } from "@/types";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleSelect: (productId: string) => void;
  toggleSelectAll: () => void;
  removeSelected: () => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "ecommerce-cart";

function loadGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const mergedRef = useRef(false);
  const supabase = useMemo(
    () => (isSupabaseConfigured() ? createClient() : null),
    []
  );

  const persistGuest = useCallback((next: CartItem[]) => {
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, [user]);

  const fetchServerCart = useCallback(async () => {
    const res = await fetch("/api/cart");
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: CartItem[] };
    return json.data ?? [];
  }, []);

  const mergeGuestCart = useCallback(async () => {
    const guest = loadGuestCart();
    if (!guest.length || !user) return;

    await fetch("/api/cart/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: guest.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      }),
    });

    localStorage.removeItem(STORAGE_KEY);
    const server = await fetchServerCart();
    setItems(server);
  }, [user, fetchServerCart]);

  useEffect(() => {
    if (authLoading) return;

    const init = async () => {
      setLoading(true);
      if (user) {
        if (!mergedRef.current) {
          mergedRef.current = true;
          await mergeGuestCart();
        } else {
          const server = await fetchServerCart();
          setItems(server);
        }
      } else {
        mergedRef.current = false;
        setItems(loadGuestCart());
      }
      setLoading(false);
    };

    init();
  }, [user, authLoading, mergeGuestCart, fetchServerCart]);

  useEffect(() => {
    if (!user && !authLoading) {
      persistGuest(items);
    }
  }, [items, user, authLoading, persistGuest]);

  useEffect(() => {
    if (!user || !supabase) return;

    const channel = supabase
      .channel("cart-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchServerCart().then(setItems);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase, fetchServerCart]);

  const syncItem = useCallback(
    async (productId: string, quantity: number) => {
      if (user) {
        if (quantity <= 0) {
          await fetch(`/api/cart/${productId}`, { method: "DELETE" });
        } else {
          await fetch(`/api/cart/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity }),
          });
        }
      } else {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product_id: productId, quantity }),
        }).catch(() => {});
      }
    },
    [user]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        const newQty = existing ? existing.quantity + quantity : quantity;
        const next = existing
          ? prev.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: newQty }
                : i
            )
          : [...prev, { product, quantity, selected: true }];

        syncItem(product.id, newQty);
        return next;
      });
    },
    [syncItem]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      syncItem(productId, 0);
    },
    [syncItem]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
      );
      syncItem(productId, quantity);
    },
    [removeFromCart, syncItem]
  );

  const toggleSelect = useCallback((productId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, selected: !i.selected } : i
      )
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setItems((prev) => {
      const allSelected = prev.every((i) => i.selected);
      return prev.map((i) => ({ ...i, selected: !allSelected }));
    });
  }, []);

  const removeSelected = useCallback(() => {
    setItems((prev) => {
      prev.filter((i) => i.selected).forEach((i) => syncItem(i.product.id, 0));
      return prev.filter((i) => !i.selected);
    });
  }, [syncItem]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user) {
      await fetch("/api/cart", { method: "DELETE" });
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const isInCart = useCallback(
    (productId: string) => items.some((i) => i.product.id === productId),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelect,
      toggleSelectAll,
      removeSelected,
      clearCart,
      isInCart,
    }),
    [
      items,
      itemCount,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelect,
      toggleSelectAll,
      removeSelected,
      clearCart,
      isInCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
