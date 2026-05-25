import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mapProductRow } from "@/lib/mappers/product";
import type { ProductRowWithCategory } from "@/types/database";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "cart_session_id";

function getSessionId(request: NextRequest): string {
  return request.cookies.get(SESSION_COOKIE)?.value ?? crypto.randomUUID();
}

type CartRow = {
  quantity: number;
  products: ProductRowWithCategory;
};

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: [], message: "Cart uses local storage" });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ data: [] });
    }

    const service = createServiceClient();
    const { data, error } = await service
      .from("cart_items")
      .select("quantity, products(*, categories(name, slug))")
      .eq("user_id", user.id);

    if (error) throw error;

    const items = ((data ?? []) as CartRow[]).map((row) => ({
      quantity: row.quantity,
      product: mapProductRow(row.products),
      selected: true,
    }));

    return NextResponse.json({ data: items });
  } catch (err) {
    console.error("GET /api/cart:", err);
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "Cart uses local storage" });
  }

  try {
    const body = (await request.json()) as {
      product_id: string;
      quantity?: number;
    };

    if (!body.product_id) {
      return NextResponse.json({ error: "product_id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const response = NextResponse.json({ message: "Cart updated" });

    if (user) {
      const service = createServiceClient();
      const { error } = await service.from("cart_items").upsert(
        {
          user_id: user.id,
          product_id: body.product_id,
          quantity: body.quantity ?? 1,
          session_id: user.id,
        },
        { onConflict: "user_id,product_id" }
      );
      if (error) throw error;
      return response;
    }

    const sessionId = getSessionId(request);
    const service = createServiceClient();
    const { error } = await service.from("cart_items").upsert(
      {
        session_id: sessionId,
        product_id: body.product_id,
        quantity: body.quantity ?? 1,
      },
      { onConflict: "session_id,product_id" }
    );
    if (error) throw error;

    response.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (err) {
    console.error("POST /api/cart:", err);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}

export async function DELETE() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ message: "OK" });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "OK" });
    }

    const service = createServiceClient();
    await service.from("cart_items").delete().eq("user_id", user.id);
    return NextResponse.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("DELETE /api/cart:", err);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
