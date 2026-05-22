import { Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import ProductListingClient from "@/components/products/ProductListingClient";
import ProductListSkeleton from "@/components/shared/ProductListSkeleton";
import { fetchCategories, fetchProducts } from "@/lib/api/fetch";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function normalizeParams(
  raw: Record<string, string | string[] | undefined>
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  Object.entries(raw).forEach(([key, value]) => {
    out[key] = Array.isArray(value) ? value[0] : value;
  });
  return out;
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const [listRes, categoriesRes] = await Promise.all([
    fetchProducts({
      category: searchParams.category,
      search: searchParams.search,
      sort: searchParams.sort,
      badge: searchParams.badge,
      page: searchParams.page ?? "1",
      limit: searchParams.limit ?? "12",
      min_price: searchParams.min_price,
      max_price: searchParams.max_price,
      featured: searchParams.featured,
    }),
    fetchCategories(),
  ]);

  return (
    <ProductListingClient
      initialData={listRes}
      categories={categoriesRes.data}
    />
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = normalizeParams(await searchParams);

  return (
    <PageShell>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductsContent searchParams={params} />
      </Suspense>
    </PageShell>
  );
}
