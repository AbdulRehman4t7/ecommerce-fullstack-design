import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ProductDetail from "@/components/products/ProductDetail";
import { fetchProduct } from "@/lib/api/fetch";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const { data: product } = await fetchProduct(id);
    return {
      title: `${product.name} | ShopZone`,
      description: product.description,
      openGraph: {
        images: product.images[0] ? [product.images[0]] : [],
      },
    };
  } catch {
    return { title: "Product | ShopZone" };
  }
}

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
