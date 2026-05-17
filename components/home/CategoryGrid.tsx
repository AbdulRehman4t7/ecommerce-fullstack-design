import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/mockData";

const cards = [
  {
    title: "Home and outdoor",
    products: products.filter((p) => p.category === "Home & Garden").slice(0, 3),
    fallback: products.slice(16, 19),
  },
  {
    title: "Consumer electronics and gadgets",
    products: products.filter((p) => p.subcategory === "Audio").slice(0, 3),
    fallback: products.slice(0, 3),
  },
];

export default function CategoryGrid() {
  return (
    <section className="mt-4 grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        const items =
          card.products.length >= 3 ? card.products : card.fallback;
        return (
          <div
            key={card.title}
            className="rounded border border-border bg-white p-4"
          >
            <h3 className="text-sm font-semibold text-dark-text">
              {card.title}
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {items.map((p) => (
                <div key={p.id} className="relative aspect-square">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="rounded object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
            <Link
              href="/products"
              className="mt-3 inline-block rounded border border-primary px-4 py-1.5 text-sm text-primary hover:bg-primary hover:text-white"
            >
              Source now
            </Link>
          </div>
        );
      })}
    </section>
  );
}
