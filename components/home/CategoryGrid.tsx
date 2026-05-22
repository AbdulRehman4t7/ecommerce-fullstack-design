import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";

interface PromoCard {
  title: string;
  href: string;
  products: Product[];
}

interface CategoryGridProps {
  homeProducts: Product[];
  electronicsProducts: Product[];
}

export default function CategoryGrid({
  homeProducts,
  electronicsProducts,
}: CategoryGridProps) {
  const cards: PromoCard[] = [
    {
      title: "Home and outdoor",
      href: "/products?category=home-garden",
      products: homeProducts.slice(0, 3),
    },
    {
      title: "Consumer electronics and gadgets",
      href: "/products?category=electronics",
      products: electronicsProducts.slice(0, 3),
    },
  ];

  return (
    <section className="mt-4 grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded border border-border bg-white p-4"
        >
          <h3 className="text-sm font-semibold text-dark-text">{card.title}</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {card.products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug ?? p.id}`}
                className="relative aspect-square overflow-hidden rounded hover:opacity-90"
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </Link>
            ))}
          </div>
          <Link
            href={card.href}
            className="mt-3 inline-block rounded border border-primary px-4 py-1.5 text-sm text-primary hover:bg-primary hover:text-white"
          >
            Source now
          </Link>
        </div>
      ))}
    </section>
  );
}
