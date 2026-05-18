import Image from "next/image";
import { IMAGES } from "@/lib/assets";

export default function HeroBanner() {
  return (
    <section className="flex gap-2 overflow-hidden rounded">
      <div className="relative flex flex-1 items-center justify-between overflow-hidden px-6 py-6">
        <Image
          src={IMAGES.heroBanner}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 70vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-blue-900/60" />
        <div className="relative z-10">
          <p className="text-sm text-gray-300">Latest trending</p>
          <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
            Electronic Items
          </h2>
        </div>
        <div className="relative z-10 hidden h-[120px] w-[120px] shrink-0 sm:block md:h-[160px] md:w-[160px]">
          <Image
            src={IMAGES.heroProduct}
            alt="Electronics"
            fill
            className="object-contain drop-shadow-lg"
            sizes="160px"
            priority
          />
        </div>
      </div>
      <div className="hidden w-[100px] flex-col gap-2 sm:flex">
        <div className="flex flex-1 items-center justify-center rounded bg-accent p-2 text-center text-xs font-semibold text-white">
          Hot deals
        </div>
        <div className="flex flex-1 flex-col items-center justify-center rounded bg-teal-600 p-2 text-white">
          <div className="relative h-10 w-10">
            <Image
              src={IMAGES.dealThumb}
              alt="Deal"
              fill
              className="rounded object-cover"
              sizes="40px"
            />
          </div>
          <span className="mt-1 text-xs font-bold">$12.50</span>
        </div>
      </div>
    </section>
  );
}
