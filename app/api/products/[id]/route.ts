import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import {
  deleteProduct,
  queryProductByIdOrSlug,
  updateProduct,
} from "@/lib/queries/products";
import type { ProductInsert } from "@/types/database";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await queryProductByIdOrSlug(id);

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: result.data, relatedProducts: result.relatedProducts },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/products/[id]:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<ProductInsert>;
    const product = await updateProduct(id, body);

    return NextResponse.json(
      { data: product, message: "Product updated" },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteProduct(id);
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
