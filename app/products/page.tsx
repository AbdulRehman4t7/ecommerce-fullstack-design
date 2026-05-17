import { Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import ProductListing from "@/components/products/ProductListing";

function ListingFallback() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8">
      <div className="mb-4 h-4 w-64 rounded bg-border" />
      <div className="h-64 rounded bg-border" />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <PageShell>
      <Suspense fallback={<ListingFallback />}>
        <ProductListing />
      </Suspense>
    </PageShell>
  );
}
