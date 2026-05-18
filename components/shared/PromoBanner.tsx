"use client";

import Image from "next/image";
import { IMAGES } from "@/lib/assets";

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden py-6">
      <Image
        src={IMAGES.promoBanner}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-800/90" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-lg font-semibold text-white">
          Super discount on more than 100 USD
        </p>
        <button
          type="button"
          className="rounded bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-accent/90"
        >
          Subscribe
        </button>
      </div>
    </section>
  );
}
