"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { breakdown, categories, getCategory, products, type Category } from "@/lib/catalog";

type Sort = "savings" | "popular" | "price-asc" | "price-desc";

export function ShopGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const active = (params.get("c") as Category | null) ?? null;
  const [sort, setSort] = useState<Sort>("savings");
  const [usStock, setUsStock] = useState(false);

  const list = products
    .filter((p) => !active || p.category === active)
    .filter((p) => !usStock || !!p.localCents)
    .map((p) => ({ p, b: breakdown(p) }))
    .sort((x, y) =>
      sort === "savings"
        ? y.b.savingsPct - x.b.savingsPct
        : sort === "price-asc"
          ? x.b.total - y.b.total
          : sort === "price-desc"
            ? y.b.total - x.b.total
            : y.p.reviews - x.p.reviews,
    );

  const setCategory = (c: Category | null) => router.replace(c ? `/shop?c=${c}` : "/shop", { scroll: false });

  return (
    <>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">
        <Chip on={!active} onClick={() => setCategory(null)}>All</Chip>
        {categories.map((c) => (
          <Chip key={c.id} on={active === c.id} onClick={() => setCategory(c.id)}>
            {c.label}
          </Chip>
        ))}
      </div>

      {active && <p className="mt-3 rounded-xl bg-soft px-4 py-3 text-sm text-muted">{getCategory(active).rule}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm text-muted">{list.length} products</p>
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input type="checkbox" checked={usStock} onChange={(e) => setUsStock(e.target.checked)} className="h-4 w-4 accent-brand" />
            Ships from US stock
          </label>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          aria-label="Sort"
        >
          <option value="savings">Biggest savings</option>
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map(({ p }) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
        on ? "border-brand bg-brand text-white" : "border-line bg-surface text-ink hover:border-brand"
      }`}
    >
      {children}
    </button>
  );
}
