import { mapProductRow } from "@/lib/mappers/product";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ProductInsert, ProductRowWithCategory } from "@/types/database";
import type { Product } from "@/types";
import type { ProductsListResponse } from "@/types/api";
import {
  getFallbackProduct,
  getFallbackProducts,
  getFallbackSearch,
} from "./fallback";

export interface ProductQueryParams {
  category?: string;
  search?: string;
  featured?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "popular";
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  badge?: "Hot" | "New" | "Sale" | "Verified";
}

const PRODUCT_SELECT = `
  *,
  categories ( name, slug )
`;

export async function queryProducts(
  params: ProductQueryParams
): Promise<ProductsListResponse> {
  if (!isSupabaseConfigured()) {
    return getFallbackProducts(params);
  }

  const supabase = await createClient();
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" });

  if (params.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .maybeSingle();

    if (cat) {
      query = query.eq("category_id", cat.id);
    }
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params.featured) {
    query = query.eq("is_featured", true);
  }

  if (params.badge) {
    query = query.eq("badge", params.badge);
  }

  if (params.minPrice !== undefined) {
    query = query.gte("price", params.minPrice);
  }

  if (params.maxPrice !== undefined) {
    query = query.lte("price", params.maxPrice);
  }

  switch (params.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "popular":
      query = query.order("sold", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("queryProducts:", error.message);
    return getFallbackProducts(params);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data: (data as ProductRowWithCategory[]).map(mapProductRow),
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export async function queryProductByIdOrSlug(
  idOrSlug: string
): Promise<{ data: Product; relatedProducts: Product[] } | null> {
  if (!isSupabaseConfigured()) {
    return getFallbackProduct(idOrSlug);
  }

  const supabase = await createClient();

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug
    );

  let query = supabase.from("products").select(PRODUCT_SELECT);

  if (isUuid) {
    query = query.eq("id", idOrSlug);
  } else {
    query = query.eq("slug", idOrSlug);
  }

  const { data: row, error } = await query.maybeSingle();

  if (error || !row) {
    return getFallbackProduct(idOrSlug);
  }

  const product = mapProductRow(row as ProductRowWithCategory);

  const categoryId = (row as ProductRowWithCategory).category_id;

  let relatedQuery = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .neq("id", product.id)
    .limit(4);

  if (categoryId) {
    relatedQuery = relatedQuery.eq("category_id", categoryId);
  }

  const { data: relatedRows } = await relatedQuery;

  const relatedProducts = (relatedRows as ProductRowWithCategory[] | null)?.map(
    mapProductRow
  ) ?? [];

  return { data: product, relatedProducts };
}

export async function searchProducts(
  q: string,
  limit = 10
): Promise<{ data: Product[]; total: number }> {
  if (!q.trim()) {
    return { data: [], total: 0 };
  }

  if (!isSupabaseConfigured()) {
    return getFallbackSearch(q, limit);
  }

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" })
    .textSearch("name", q, { type: "websearch" })
    .limit(limit);

  if (error) {
    const { data: ilikeData, count: ilikeCount } = await supabase
      .from("products")
      .select(PRODUCT_SELECT, { count: "exact" })
      .ilike("name", `%${q}%`)
      .limit(limit);

    if (ilikeData) {
      return {
        data: (ilikeData as ProductRowWithCategory[]).map(mapProductRow),
        total: ilikeCount ?? ilikeData.length,
      };
    }
    return getFallbackSearch(q, limit);
  }

  return {
    data: (data as ProductRowWithCategory[]).map(mapProductRow),
    total: count ?? data.length,
  };
}

export async function createProduct(
  payload: ProductInsert
): Promise<Product> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapProductRow(data as ProductRowWithCategory);
}

export async function updateProduct(
  id: string,
  payload: Partial<ProductInsert>
): Promise<Product> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapProductRow(data as ProductRowWithCategory);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
