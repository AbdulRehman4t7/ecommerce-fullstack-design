import PageShell from "@/components/layout/PageShell";
import CategorySidebar from "@/components/home/CategorySidebar";
import HeroBanner from "@/components/home/HeroBanner";
import DealsSection from "@/components/home/DealsSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import RequestToSupplier from "@/components/home/RequestToSupplier";
import RecommendedItems from "@/components/home/RecommendedItems";
import ExtraServices from "@/components/home/ExtraServices";
import SuppliersByRegion from "@/components/home/SuppliersByRegion";
import NewsletterSection from "@/components/shared/NewsletterSection";
import { fetchCategories, fetchProducts } from "@/lib/api/fetch";
import { calcDiscount } from "@/lib/mappers/product";
import type { DealProduct } from "@/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [
    categoriesRes,
    recommendedRes,
    dealsRes,
    featuredRes,
    homeGardenRes,
    electronicsRes,
  ] = await Promise.all([
    fetchCategories(),
    fetchProducts({ limit: "10", sort: "newest" }),
    fetchProducts({ badge: "Sale", limit: "5" }),
    fetchProducts({ featured: "true", limit: "10" }),
    fetchProducts({ category: "home-garden", limit: "3" }),
    fetchProducts({ category: "electronics", limit: "3" }),
  ]);

  const dealProducts: DealProduct[] = dealsRes.data.map((p) => ({
    ...p,
    discount: calcDiscount(p) ?? 20,
  }));

  const recommended =
    featuredRes.data.length > 0 ? featuredRes.data : recommendedRes.data;

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <CategorySidebar categories={categoriesRes.data} />
          <div className="min-w-0 flex-1">
            <HeroBanner />
            <DealsSection products={dealProducts} />
            <CategoryGrid
              homeProducts={homeGardenRes.data}
              electronicsProducts={electronicsRes.data}
            />
            <RequestToSupplier />
            <RecommendedItems products={recommended} />
            <ExtraServices />
            <SuppliersByRegion />
          </div>
        </div>
        <NewsletterSection />
      </div>
    </PageShell>
  );
}
