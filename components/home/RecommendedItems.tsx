import ProductCard from "@/components/shared/ProductCard";
import type { Product } from "@/types";

interface RecommendedItemsProps {
  products: Product[];
}

export default function RecommendedItems({ products }: RecommendedItemsProps) {
  return (
    <section className="mt-4 rounded border border-border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold text-dark-text">
        Recommended items
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} compact={false} />
        ))}
      </div>
    </section>
  );
}
