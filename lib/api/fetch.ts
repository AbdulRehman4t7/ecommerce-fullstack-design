import { queryCategories } from "@/lib/queries/categories";
import {
  queryProductByIdOrSlug,
  queryProducts,
  type ProductQueryParams,
} from "@/lib/queries/products";
import type { Category, Product } from "@/types";
import type { ProductsListResponse } from "@/types/api";

const BADGES = ["Hot", "New", "Sale", "Verified"] as const;

function toQueryParams(
  searchParams: Record<string, string | undefined>
): ProductQueryParams {
  const page = parseInt(searchParams.page ?? "1", 10);
  const limit = parseInt(searchParams.limit ?? "12", 10);
  const badgeParam = searchParams.badge;
  const badge = BADGES.includes(badgeParam as (typeof BADGES)[number])
    ? (badgeParam as ProductQueryParams["badge"])
    : undefined;

  return {
    category: searchParams.category,
    search: searchParams.search,
    featured: searchParams.featured === "true",
    sort: searchParams.sort as ProductQueryParams["sort"],
    badge,
    page: Number.isNaN(page) ? 1 : page,
    limit: Number.isNaN(limit) ? 12 : limit,
    minPrice: searchParams.min_price
      ? parseFloat(searchParams.min_price)
      : undefined,
    maxPrice: searchParams.max_price
      ? parseFloat(searchParams.max_price)
      : undefined,
  };
}

/** Server-side data loading — calls Supabase directly (no HTTP loopback). */
export async function fetchProducts(
  searchParams: Record<string, string | undefined> = {}
): Promise<ProductsListResponse> {
  return queryProducts(toQueryParams(searchParams));
}

export async function fetchProduct(
  id: string
): Promise<{ data: Product; relatedProducts: Product[] }> {
  const result = await queryProductByIdOrSlug(id);
  if (!result) {
    throw new Error("Product not found");
  }
  return result;
}

export async function fetchCategories(): Promise<{ data: Category[] }> {
  const data = await queryCategories();
  return { data };
}
