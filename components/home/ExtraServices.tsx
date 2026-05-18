import Image from "next/image";
import { IMAGES } from "@/lib/assets";

const services = [
  { title: "Source from Industry Hubs", image: IMAGES.serviceBgs[0] },
  { title: "Customize Your Products", image: IMAGES.serviceBgs[1] },
  { title: "Fast, reliable shipping by ocean or air", image: IMAGES.serviceBgs[2] },
  { title: "Product monitoring and inspection", image: IMAGES.serviceBgs[3] },
];

export default function ExtraServices() {
  return (
    <section className="mt-4 rounded border border-border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold text-dark-text">
        Our extra services
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <div
            key={service.title}
            className="relative flex min-h-[100px] items-end overflow-hidden rounded p-4"
          >
            <Image
              src={service.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            <p className="relative z-10 text-sm font-semibold text-white">
              {service.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
