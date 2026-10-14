"use client";

import Link from "next/link";
import { useState } from "react";
import { breakdown, searchProducts } from "@/lib/catalog";
import { money } from "@/lib/site";

const examples = ["essence", "charger", "socks", "gel pens", "waste bags"];

export function FitFinder() {
  const [query, setQuery] = useState("");
  const results = searchProducts(query);

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <label htmlFor="search" className="text-sm font-semibold text-ink">
        What are you paying too much for?
      </label>
      <input
        id="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search a product or model number"
        autoComplete="off"
        className="mt-3 h-12 w-full rounded-xl border border-line bg-soft px-4 text-base outline-none focus:border-brand focus:bg-surface"
      />
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted">
        Try:
        {examples.map((e) => (
          <button key={e} onClick={() => setQuery(e)} className="rounded-full bg-soft px-2 py-0.5 hover:text-brand">
            {e}
          </button>
        ))}
      </div>

      {query.trim() && (
        <div className="mt-4 border-t border-line pt-4" aria-live="polite">
          {results.length === 0 ? (
            <p className="text-sm text-muted">
              Not listed yet.{" "}
              <Link href="/travelers" className="font-medium text-brand underline">
                Post a request
              </Link>{" "}
              and travelers on matching routes will quote it.
            </p>
          ) : (
            <ul className="space-y-2">
              {results.slice(0, 5).map((p) => {
                const b = breakdown(p);
                return (
                  <li key={p.slug}>
                    <Link
                      href={`/product/${p.slug}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-soft px-4 py-3 hover:bg-brand/10"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                        <span className="text-xs text-emerald-700">Save {money(b.savings)} vs US price</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-ink">{money(b.total)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
