import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import ProductDetail from "@/components/products/ProductDetail";
import { getProductById } from "@/data/mockData";

interface ProductPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return Array.from({ length: 24 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(Number(params.id));

  if (!product) {
    notFound();
  }

  return (
    <PageShell>
      <ProductDetail product={product} />
    </PageShell>
  );
}
