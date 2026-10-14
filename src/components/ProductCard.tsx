import Link from "next/link";
import { amazonCompare, bestPack, breakdown, packNudge, type Product } from "@/lib/catalog";
import { money } from "@/lib/site";

export function OriginBadge({ product }: { product: Product }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700">
      Made in {product.madeIn} · duty included
    </span>
  );
}

// Two savings badges side by side: vs. the typical US price, and vs. Amazon
// (only while there's a recent Amazon check and we're cheaper).
export function SavingsBadge({ product }: { product: Product }) {
  const { savingsPct, total } = breakdown(product);
  const vsAmazon = amazonCompare(product, total);
  return (
    <>
      {savingsPct > 0 && (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          {savingsPct}% under US price
        </span>
      )}
      {vsAmazon && (
        <span
          className="inline-flex items-center rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white"
          title={`Amazon price ${money(vsAmazon.amazonCents)}, checked ${vsAmazon.checked}`}
        >
          {vsAmazon.pct}% less than Amazon
        </span>
      )}
    </>
  );
}

export function ProductArt({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br ${product.swatch} ${className}`}>
      <svg viewBox="0 0 64 64" className="h-1/2 w-1/2 opacity-70" aria-hidden>
        <rect x="16" y="10" width="32" height="44" rx="8" fill="white" />
        <rect x="22" y="18" width="20" height="28" rx="4" className="fill-brand/20" />
      </svg>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { total } = breakdown(product);
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <ProductArt product={product} className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          <SavingsBadge product={product} />
          {product.localCents && (
            <span className="inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
              In US stock · ships fast
            </span>
          )}
        </div>
        <h3 className="font-semibold leading-snug text-ink group-hover:text-brand">{product.name}</h3>
        <p className="text-xs text-muted">
          ★ {product.rating} · {product.reviews.toLocaleString()} reviews · from {product.boughtIn}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-semibold text-ink">{money(total)}</span>
          <span className="text-sm text-muted line-through">{money(product.usRetailCents)}</span>
        </div>
        {packNudge(product) ? (
          <p className="text-xs font-medium text-emerald-700">
            {money(bestPack(product).each)} each when you buy {bestPack(product).qty}
          </p>
        ) : (
          <p className="text-xs text-muted">All-in: duty, traveler & fees included</p>
        )}
      </div>
    </Link>
  );
}
