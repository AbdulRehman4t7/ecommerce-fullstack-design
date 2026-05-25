import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ productId: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "OK" });
  }

  const { productId } = await context.params;
  const body = (await request.json()) as { quantity?: number };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = createServiceClient();

    if (!body.quantity || body.quantity <= 0) {
      await service
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      return NextResponse.json({ message: "Removed" });
    }

    const { error } = await service
      .from("cart_items")
      .update({ quantity: body.quantity })
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) throw error;
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    console.error("PATCH /api/cart/[productId]:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "OK" });
  }

  const { productId } = await context.params;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = createServiceClient();
    await service
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    return NextResponse.json({ message: "Removed" });
  } catch (err) {
    console.error("DELETE /api/cart/[productId]:", err);
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 });
  }
}
