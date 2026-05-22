import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Category } from "@/types";
import { getFallbackCategories } from "./fallback";

export async function queryCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return getFallbackCategories();
  }

  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug, icon")
    .order("name");

  if (error || !categories) {
    console.error("queryCategories:", error?.message);
    return getFallbackCategories();
  }

  const { data: products } = await supabase
    .from("products")
    .select("category_id");

  const counts = new Map<string, number>();
  products?.forEach((p) => {
    if (p.category_id) {
      counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    }
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon ?? "📦",
    subcategories: [],
    productCount: counts.get(cat.id) ?? 0,
  }));
}
