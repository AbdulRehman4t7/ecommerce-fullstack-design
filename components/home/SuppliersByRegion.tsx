import { supplierCountries } from "@/data/mockData";

export default function SuppliersByRegion() {
  return (
    <section className="mt-4 rounded border border-border bg-white p-4">
      <h2 className="mb-3 text-base font-semibold text-dark-text">
        Suppliers by region
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-9">
        {supplierCountries.map((country) => (
          <button
            key={country.name}
            type="button"
            className="flex flex-col items-center rounded border border-border p-3 text-center hover:border-primary hover:bg-page-bg"
          >
            <span className="text-2xl">{country.flag}</span>
            <span className="mt-1 text-xs text-dark-text">{country.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
