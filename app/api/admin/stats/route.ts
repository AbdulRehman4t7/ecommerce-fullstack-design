import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      products: 24,
      users: 0,
      categories: 8,
      orders: 0,
    });
  }

  try {
    const supabase = createServiceClient();
    const [products, users, categories] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("categories").select("id", { count: "exact", head: true }),
    ]);

    return NextResponse.json({
      products: products.count ?? 0,
      users: users.count ?? 0,
      categories: categories.count ?? 0,
      orders: 0,
    });
  } catch (err) {
    console.error("GET /api/admin/stats:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
