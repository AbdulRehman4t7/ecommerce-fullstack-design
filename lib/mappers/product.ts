import { resolveProductImages } from "@/lib/productImages";
import type { Product } from "@/types";
import type { ProductRowWithCategory } from "@/types/database";

interface SpecItem {
  key: string;
  value: string;
}

function parseSpecs(specs: unknown): { key: string; value: string }[] {
  if (!Array.isArray(specs)) return [];
  return specs.filter(
    (s): s is SpecItem =>
      typeof s === "object" &&
      s !== null &&
      "key" in s &&
      "value" in s &&
      typeof (s as SpecItem).key === "string" &&
      typeof (s as SpecItem).value === "string"
  );
}

export function mapProductRow(row: ProductRowWithCategory): Product {
  const { image, images } = resolveProductImages(row.slug, row.images);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    minOrder: row.min_order,
    unit: row.unit,
    image,
    images,
    description: row.description ?? "",
    category: row.categories?.name ?? "General",
    categorySlug: row.categories?.slug,
    subcategory: row.subcategory ?? "",
    rating: Number(row.rating),
    reviews: row.reviews_count,
    sold: row.sold,
    seller: row.seller_name ?? "Verified Supplier",
    sellerCountry: row.seller_country ?? "China",
    sellerFlag: row.seller_flag ?? "🇨🇳",
    badge: row.badge ?? undefined,
    freeShipping: row.free_shipping,
    inStock: row.stock > 0,
    stock: row.stock,
    specs: parseSpecs(row.specs),
    tags: row.tags ?? [],
    isFeatured: row.is_featured,
  };
}

export function calcDiscount(product: Product): number | undefined {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return undefined;
  }
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}
