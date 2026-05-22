import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/queries/products";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    const limit = parseInt(
      request.nextUrl.searchParams.get("limit") ?? "10",
      10
    );

    if (!q.trim()) {
      return NextResponse.json({ data: [], total: 0 }, { status: 200 });
    }

    const result = await searchProducts(q, Number.isNaN(limit) ? 10 : limit);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("GET /api/search:", err);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
