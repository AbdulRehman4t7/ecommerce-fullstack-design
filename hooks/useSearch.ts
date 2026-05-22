"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";

export function useSearch(query: string, debounceMs = 300) {
  const [results, setResults] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=5`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Search failed");
        const json = (await res.json()) as { data: Product[]; total: number };
        setResults(json.data);
        setTotal(json.total);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Search unavailable");
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, debounceMs]);

  return { results, total, loading, error };
}
