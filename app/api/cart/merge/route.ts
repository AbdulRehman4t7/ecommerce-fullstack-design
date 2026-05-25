import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "OK" });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      items: { product_id: string; quantity: number }[];
    };

    if (!body.items?.length) {
      return NextResponse.json({ message: "Nothing to merge" });
    }

    const service = createServiceClient();

    for (const item of body.items) {
      const { data: existing } = await service
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id)
        .eq("product_id", item.product_id)
        .maybeSingle();

      const qty = (existing?.quantity ?? 0) + item.quantity;

      await service.from("cart_items").upsert(
        {
          user_id: user.id,
          product_id: item.product_id,
          quantity: qty,
          session_id: user.id,
        },
        { onConflict: "user_id,product_id" }
      );
    }

    return NextResponse.json({ message: "Cart merged" });
  } catch (err) {
    console.error("POST /api/cart/merge:", err);
    return NextResponse.json({ error: "Merge failed" }, { status: 500 });
  }
}
