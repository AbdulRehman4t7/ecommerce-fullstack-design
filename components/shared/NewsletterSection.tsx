"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-xl font-semibold text-dark-text">
          Subscribe to our newsletter
        </h2>
        <p className="mt-2 text-sm text-grey-text">
          Get daily news on upcoming offers from many suppliers all over the
          world
        </p>
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="flex-1 rounded border border-border px-4 py-2 text-sm outline-none focus:border-primary sm:max-w-xs"
          />
          <button
            type="submit"
            className="rounded bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
