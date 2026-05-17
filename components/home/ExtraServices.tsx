const services = [
  {
    title: "Source from Industry Hubs",
    bg: "from-blue-600 to-blue-800",
  },
  {
    title: "Customize Your Products",
    bg: "from-purple-600 to-purple-800",
  },
  {
    title: "Fast, reliable shipping by ocean or air",
    bg: "from-teal-600 to-teal-800",
  },
  {
    title: "Product monitoring and inspection",
    bg: "from-orange-600 to-orange-800",
  },
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
            className={`flex min-h-[100px] items-end rounded bg-gradient-to-br ${service.bg} p-4`}
          >
            <p className="text-sm font-semibold text-white">{service.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
