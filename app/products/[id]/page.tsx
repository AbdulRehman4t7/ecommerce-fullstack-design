import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ProductDetail from "@/components/products/ProductDetail";
import { fetchProduct } from "@/lib/api/fetch";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const { data: product, relatedProducts } = await fetchProduct(id);

    return (
      <PageShell>
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </PageShell>
    );
  } catch {
    notFound();
  }
}
