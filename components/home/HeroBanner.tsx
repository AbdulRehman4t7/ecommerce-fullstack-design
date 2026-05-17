import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="flex gap-2 overflow-hidden rounded">
      <div className="flex flex-1 items-center justify-between bg-gradient-to-r from-slate-800 to-blue-900 px-6 py-6">
        <div>
          <p className="text-sm text-gray-300">Latest trending</p>
          <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
            Electronic Items
          </h2>
        </div>
        <div className="relative hidden h-[120px] w-[120px] shrink-0 sm:block md:h-[160px] md:w-[160px]">
          <Image
            src="https://placehold.co/200x200/1e3a5f/fff?text=Headphones"
            alt="Electronics"
            fill
            className="object-contain"
            sizes="160px"
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
              src="https://placehold.co/60x60/0d9488/fff?text=Deal"
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
