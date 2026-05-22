import { applyProductImages, products, categories } from "@/data/mockData";
import { calcDiscount } from "@/lib/mappers/product";
import type { Category, DealProduct, Product } from "@/types";
import type { ProductsListResponse } from "@/types/api";
import type { ProductQueryParams } from "./products";

applyProductImages(products);

function toProduct(p: (typeof products)[0]): Product {
  return {
    ...p,
    id: String(p.id),
    slug: `product-${p.id}`,
    categorySlug: p.category.toLowerCase().replace(/\s+/g, "-"),
    isFeatured: p.badge === "Hot" || p.badge === "Verified",
  };
}

const FALLBACK_PRODUCTS: Product[] = products.map(toProduct);

const FALLBACK_CATEGORIES: Category[] = categories
  .filter((c) => c.name !== "See all categories")
  .map((c, i) => ({
    id: `cat-${i}`,
    name: c.name,
    slug: c.name.toLowerCase().replace(/\s+/g, "-"),
    icon: c.icon,
    subcategories: c.subcategories,
    productCount: FALLBACK_PRODUCTS.filter(
      (p) => p.category === c.name
    ).length,
  }));

export function getFallbackProducts(
  params: ProductQueryParams
): ProductsListResponse {
  let list = [...FALLBACK_PRODUCTS];

  if (params.category) {
    const slug = params.category.toLowerCase();
    list = list.filter(
      (p) =>
        p.categorySlug === slug ||
        p.category.toLowerCase().replace(/\s+/g, "-") === slug
    );
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (params.featured) {
    list = list.filter((p) => p.isFeatured);
  }

  if (params.badge) {
    list = list.filter((p) => p.badge === params.badge);
  }

  if (params.minPrice !== undefined) {
    list = list.filter((p) => p.price >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= params.maxPrice!);
  }

  switch (params.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      list.sort((a, b) => b.sold - a.sold);
      break;
    case "newest":
    default:
      break;
  }

  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);

  return {
    data,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export function getFallbackProduct(
  idOrSlug: string
): { data: Product; relatedProducts: Product[] } | null {
  const product = FALLBACK_PRODUCTS.find(
    (p) => p.id === idOrSlug || p.slug === idOrSlug
  );
  if (!product) return null;
  const related = FALLBACK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);
  return { data: product, relatedProducts: related };
}

export function getFallbackCategories(): Category[] {
  return FALLBACK_CATEGORIES;
}

export function getFallbackSearch(
  q: string,
  limit: number
): { data: Product[]; total: number } {
  const query = q.toLowerCase();
  const data = FALLBACK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  ).slice(0, limit);
  return { data, total: data.length };
}

export function getFallbackDeals(): DealProduct[] {
  return FALLBACK_PRODUCTS.filter((p) => p.badge === "Sale" || p.originalPrice)
    .slice(0, 5)
    .map((p) => ({
      ...p,
      discount: calcDiscount(p) ?? 20,
    }));
}
