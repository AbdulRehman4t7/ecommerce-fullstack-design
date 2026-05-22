import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  queryProducts,
  type ProductQueryParams,
} from "@/lib/queries/products";
import type { ProductInsert } from "@/types/database";

function parseSearchParams(
  searchParams: URLSearchParams
): ProductQueryParams {
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");

  return {
    category: searchParams.get("category") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    featured: searchParams.get("featured") === "true",
    sort:
      (searchParams.get("sort") as ProductQueryParams["sort"]) ?? undefined,
    badge: searchParams.get("badge") ?? undefined,
    page: Number.isNaN(page) ? 1 : page,
    limit: Number.isNaN(limit) ? 12 : limit,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const params = parseSearchParams(request.nextUrl.searchParams);
    const result = await queryProducts(params);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("GET /api/products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ProductInsert>;

    if (!body.name || body.price === undefined || !body.slug) {
      return NextResponse.json(
        { error: "name, slug, and price are required" },
        { status: 400 }
      );
    }

    const product = await createProduct({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      price: body.price,
      original_price: body.original_price ?? null,
      min_order: body.min_order ?? 1,
      unit: body.unit ?? "piece",
      stock: body.stock ?? 0,
      category_id: body.category_id ?? null,
      subcategory: body.subcategory ?? null,
      seller_name: body.seller_name ?? null,
      seller_country: body.seller_country ?? null,
      seller_flag: body.seller_flag ?? null,
      free_shipping: body.free_shipping ?? false,
      is_featured: body.is_featured ?? false,
      badge: body.badge ?? null,
      images: body.images ?? [],
      specs: body.specs ?? [],
      tags: body.tags ?? [],
    });

    return NextResponse.json(
      { data: product, message: "Product created" },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
