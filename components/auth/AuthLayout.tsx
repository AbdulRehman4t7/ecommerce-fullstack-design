import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/assets";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Source from millions of global suppliers",
  "Trade assurance and secure payments",
  "Fast shipping to 200+ countries",
];

export default function AuthLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[40%] flex-col justify-between bg-gradient-to-br from-primary to-[#084298] p-10 text-white lg:flex">
        <div>
          <Image src={IMAGES.logo} alt="ShopZone" width={140} height={40} className="brightness-0 invert" />
          <h1 className="mt-10 text-3xl font-bold leading-tight">
            Join millions of buyers and sellers
          </h1>
          <ul className="mt-8 space-y-4">
            {benefits.map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-white/90">
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-48 w-full opacity-80">
          <Image
            src={IMAGES.heroProduct}
            alt=""
            fill
            className="object-contain object-left"
            sizes="40vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-page-bg px-4 py-10">
        <div className="mb-6 w-full max-w-md lg:hidden">
          <Link href="/">
            <Image src={IMAGES.logo} alt="ShopZone" width={120} height={32} />
          </Link>
        </div>
        <div className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-xl font-semibold text-dark-text">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
