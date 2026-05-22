"use client";

import Link from "next/link";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-dark-text">Something went wrong</h1>
      <p className="mt-2 text-sm text-grey-text">
        {error.message || "Could not load products."}
      </p>
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
        >
          Try again
        </button>
        <Link href="/" className="text-sm text-primary hover:underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
