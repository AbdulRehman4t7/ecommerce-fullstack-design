import { apiUrl } from "./url";
import type { Category, Product } from "@/types";
import type { ProductsListResponse } from "@/types/api";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

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
  return parseJson<ProductsListResponse>(res);
}

export async function fetchProduct(
  id: string
): Promise<{ data: Product; relatedProducts: Product[] }> {
  const res = await fetch(apiUrl(`/api/products/${id}`), { cache: "no-store" });
  if (res.status === 404) {
    throw new Error("Product not found");
  }
  return parseJson<{ data: Product; relatedProducts: Product[] }>(res);
}

export async function fetchCategories(): Promise<{ data: Category[] }> {
  const res = await fetch(apiUrl("/api/categories"), { cache: "no-store" });
  return parseJson<{ data: Category[] }>(res);
}
