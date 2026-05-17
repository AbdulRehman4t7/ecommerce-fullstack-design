import { Suspense } from "react";
import ProductCard from "@/components/shared/ProductCard";
import ProductCardSkeleton from "@/components/shared/ProductCardSkeleton";
import { recommendedProducts } from "@/data/mockData";

function RecommendedGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {recommendedProducts.map((product) => (
        <ProductCard key={product.id} product={product} compact={false} />
      ))}
    </div>
  );
}

export default function RecommendedItems() {
  return (
    <section className="mt-4 rounded border border-border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold text-dark-text">
        Recommended items
      </h2>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <RecommendedGrid />
      </Suspense>
    </section>
  );
}
