import { OpeningSoon } from "@/components/ComingSoon";
import { isSoon } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { OriginBadge, ProductArt, ProductCard, SavingsBadge } from "@/components/ProductCard";
import { SERVICE_PCT, TRAVELER_MIN_CENTS, TRAVELER_PCT, amazonCompare, breakdown, getCategory, getProduct, products, travelers } from "@/lib/catalog";
import { money } from "@/lib/site";
import { formatLongDate } from "@/lib/tariffs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return { title: p?.name ?? "Product" };
}

export default async function ProductPage({ params }: Props) {
  if (isSoon) return <OpeningSoon />;
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const b = breakdown(product);
  const carriers = travelers.filter((t) => t.carries.includes(product.slug));
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const rows = [
    [`Shelf price in ${product.boughtIn}`, b.item],
    [`US duty (made in ${product.madeIn}, est. ${Math.round(product.dutyRate * 100)}%)`, b.duty],
    [b.travelerIsMin ? `Traveler delivery (${money(TRAVELER_MIN_CENTS)} minimum)` : `Traveler's share (${TRAVELER_PCT * 100}%)`, b.traveler],
    [`Service & protection (${SERVICE_PCT * 100}%)`, b.fee],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-muted">
        <Link href="/shop" className="hover:text-brand">Shop</Link> /{" "}
        <Link href={`/shop?c=${product.category}`} className="hover:text-brand">{category.label}</Link>
      </nav>

      {/* Phone order: art, details, breakdown. Desktop: breakdown sits under the art. */}
      <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-x-8">
        <ProductArt product={product} className="aspect-square rounded-3xl md:col-start-1 md:row-start-1" />
        <div className="order-last h-fit rounded-2xl border border-line p-5 md:order-none md:col-start-1 md:row-start-2">
            <h2 className="font-semibold text-ink">Where your money goes</h2>
            <dl className="mt-3 space-y-2 text-sm">
              {rows.map(([label, cents]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-ink">{money(cents)}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-line pt-2 font-semibold">
                <dt>You pay</dt>
                <dd>{money(b.total)}</dd>
              </div>
              <div className="flex justify-between text-emerald-700">
                <dt>Typical US price {money(product.usRetailCents)}</dt>
                <dd>You save {money(b.savings)}</dd>
              </div>
            </dl>
            <Link
              href="/membership"
              className="mt-4 flex items-center justify-between gap-3 border-l-4 border-accent bg-soft px-3 py-2 text-sm hover:bg-brand/5"
            >
              <span className="text-ink">
                <span className="font-semibold">Charter members pay {money(breakdown(product, 1, true).total)}</span>
                <span className="text-muted"> · no service fee or traveler minimum</span>
              </span>
              <span className="shrink-0 font-medium text-brand">Join →</span>
            </Link>
        </div>

        <div className="md:col-start-2 md:row-span-2 md:row-start-1">
          <div className="flex flex-wrap gap-1.5">
            <SavingsBadge product={product} />
            <OriginBadge product={product} />
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink">{product.name}</h1>
          <p className="mt-2 text-sm text-muted">
            ★ {product.rating} · {product.reviews.toLocaleString()} reviews
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-ink">{money(b.total)}</span>
            <span className="text-muted line-through">{money(product.usRetailCents)}</span>
          </div>
          {(() => {
            const vs = amazonCompare(product, b.total);
            return vs ? (
              <p className="mt-1 text-sm text-muted">
                <span className="font-semibold text-ink">{money(vs.savedCents)} less than Amazon</span> ({money(vs.amazonCents)}) · Amazon price checked{" "}
                {formatLongDate(vs.checked)}
              </p>
            ) : null;
          })()}

          {(product.spec || product.fits) && (
            <div className="mt-4 rounded-2xl bg-soft p-4 text-sm">
              {product.spec && <p className="text-ink">{product.spec}</p>}
              {product.fits && <p className="mt-1 text-muted">Fits: {product.fits.join(" · ")}</p>}
            </div>
          )}

          <div className="mt-5">
            <BuyBox product={product} />
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">{category.label} carry rules</p>
            <p className="mt-1">{category.rule}</p>
          </div>
        </div>
      </div>

      {carriers.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">Travelers carrying this</h2>
          <p className="mt-1 text-sm text-muted">Declared at customs. Duty is already in the price.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {carriers.map((t) => (
              <div key={t.id} className="rounded-2xl border border-line p-4">
                <p className="font-semibold text-ink">{t.route}</p>
                <p className="text-sm text-muted">
                  {t.name} · {t.trips} trips · ★ {t.rating} · arrives {t.arrives}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">More {category.label.toLowerCase()}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
