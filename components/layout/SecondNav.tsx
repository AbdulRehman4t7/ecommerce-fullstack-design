import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/assets";

const links = [
  "All offers",
  "Hot Offers",
  "Gift Boxes",
  "Projects",
  "Menu Item",
];

export default function SecondNav() {
  return (
    <nav className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link) => (
            <Link
              key={link}
              href="/products"
              className="text-sm text-dark-text hover:text-primary"
            >
              {link}
            </Link>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-xs text-grey-text">
          English, USD
          <span className="relative inline-block h-3.5 w-5">
            <Image
              src={IMAGES.flags["United States"]}
              alt="US"
              fill
              className="object-contain"
              sizes="20px"
            />
          </span>
        </span>
      </div>
    </nav>
  );
}
