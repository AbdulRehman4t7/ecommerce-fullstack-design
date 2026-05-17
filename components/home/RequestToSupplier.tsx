"use client";

import { useState } from "react";

export default function RequestToSupplier() {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");

  return (
    <section className="mt-4 rounded bg-gradient-to-r from-primary to-blue-700 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-white lg:max-w-md">
          <h2 className="text-lg font-semibold">
            An easy way to send requests to all suppliers
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div className="w-full max-w-md rounded bg-white p-5 shadow-lg">
          <h3 className="text-base font-semibold text-dark-text">
            Send quote to suppliers
          </h3>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setItem("");
              setQuantity("");
            }}
          >
            <textarea
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="What item you need?"
              rows={3}
              className="w-full rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                className="flex-1 rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="rounded border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="pieces">pieces</option>
                <option value="kg">kg</option>
                <option value="sets">sets</option>
                <option value="pairs">pairs</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded bg-success py-2.5 text-sm font-semibold text-white hover:bg-success/90"
            >
              Send inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
