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

export default function HomePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <CategorySidebar />
          <div className="min-w-0 flex-1">
            <HeroBanner />
            <DealsSection />
            <CategoryGrid />
            <RequestToSupplier />
            <RecommendedItems />
            <ExtraServices />
            <SuppliersByRegion />
          </div>
        </div>
        <NewsletterSection />
      </div>
    </PageShell>
  );
}
