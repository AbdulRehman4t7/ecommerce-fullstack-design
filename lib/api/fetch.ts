import { apiUrl } from "./url";
import type { Category, Product } from "@/types";
import type { ProductsListResponse } from "@/types/api";

export async function fetchProducts(
  searchParams: Record<string, string | undefined> = {}
): Promise<ProductsListResponse> {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  const res = await fetch(apiUrl(`/api/products${qs ? `?${qs}` : ""}`), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json() as Promise<ProductsListResponse>;
}

export async function fetchProduct(
  id: string
): Promise<{ data: Product; relatedProducts: Product[] }> {
  const res = await fetch(apiUrl(`/api/products/${id}`), { cache: "no-store" });
  if (res.status === 404) {
    throw new Error("Product not found");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json() as Promise<{ data: Product; relatedProducts: Product[] }>;
}

export async function fetchCategories(): Promise<{ data: Category[] }> {
  const res = await fetch(apiUrl("/api/categories"), { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json() as Promise<{ data: Category[] }>;
}
