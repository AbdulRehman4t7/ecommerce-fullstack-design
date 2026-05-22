import ProductListSkeleton from "@/components/shared/ProductListSkeleton";

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 h-4 w-64 animate-pulse rounded bg-border" />
      <ProductListSkeleton />
    </div>
  );
}
