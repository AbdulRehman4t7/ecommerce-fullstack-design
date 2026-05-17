"use client";

export default function PromoBanner() {
  return (
    <section className="bg-gradient-to-r from-primary to-blue-800 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
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
