import PageShell from "@/components/layout/PageShell";
import CartPage from "@/components/cart/CartPage";

export const dynamic = "force-dynamic";

export default function Cart() {
  return (
    <PageShell>
      <CartPage />
    </PageShell>
  );
}
