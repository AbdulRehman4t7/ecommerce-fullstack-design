import { NextResponse } from "next/server";
import { queryCategories } from "@/lib/queries/categories";

export async function GET() {
  try {
    const data = await queryCategories();
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("GET /api/categories:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
