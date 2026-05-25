import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { requireAdmin } from "@/lib/auth/session";
import { createCategory, queryCategories } from "@/lib/queries/categories";

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

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = (await request.json()) as {
      name: string;
      slug: string;
      icon?: string;
      parent_id?: string | null;
    };

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const data = await createCategory(body);
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
