import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { mapProductRow } from "@/lib/mappers/product";
import type {
  Database,
  ProductRowWithCategory,
} from "@/types/database";

export const dynamic = "force-dynamic";

type CartItemInsert = Database["public"]["Tables"]["cart_items"]["Insert"];

const SESSION_COOKIE = "cart_session_id";

function getSessionId(request: NextRequest): string {
  const existing = request.cookies.get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  return crypto.randomUUID();
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ data: [], message: "Cart uses local storage" });
  }

  try {
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (!sessionId) {
      return NextResponse.json({ data: [] });
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity, products(*, categories(name, slug))")
      .eq("session_id", sessionId);

    if (error) throw error;

    type CartRow = {
      quantity: number;
      products: ProductRowWithCategory;
    };

    const items = ((data ?? []) as CartRow[]).map((row) => ({
      quantity: row.quantity,
      product: mapProductRow(row.products),
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
      return NextResponse.json(
        { error: "product_id is required" },
        { status: 400 }
      );
    }

    const sessionId = getSessionId(request);
    const supabase = createServiceClient();

    const payload: CartItemInsert = {
      session_id: sessionId,
      product_id: body.product_id,
      quantity: body.quantity ?? 1,
    };

    const { error } = await supabase
      .from("cart_items")
      .upsert([payload], { onConflict: "session_id,product_id" });

    if (error) throw error;

    const response = NextResponse.json({ message: "Cart updated" });
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
