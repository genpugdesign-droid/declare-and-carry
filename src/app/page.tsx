import { ComingSoon } from "@/components/ComingSoon";
import { isSoon } from "@/lib/site";
import Link from "next/link";
import { FitFinder } from "@/components/FitFinder";
import { TariffStats } from "@/components/TariffStats";
import { ProductCard } from "@/components/ProductCard";
import { SELLER_COMMISSION_PCT, TRAVELER_PCT, breakdown, categories, products, travelers } from "@/lib/catalog";
import { site } from "@/lib/site";

const promises = [
  { title: "Overseas shelf prices", body: "The same products cost far less where they're made and sold. You pay that price, not the import chain's markup." },
  { title: "Duty paid, never dodged", body: "Every item is declared at customs and the duty is in the price you see. No surprise charges, no legal gray area." },
  { title: "Authentic or refunded", body: "Travelers buy from authorized retailers and upload the receipt. Sealed packaging, every time." },
  { title: "Escrow on every order", body: "Your payment is held until you confirm the item arrived as described." },
];

export default function Home() {
  if (isSoon) return <ComingSoon />;
  const top = [...products].sort((a, b) => breakdown(b).savingsPct - breakdown(a).savingsPct).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_110%,rgba(179,20,29,0.4),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">Declared · Duty paid · Delivered</p>
            <h1 className="mt-4 text-5xl sm:text-6xl md:text-7xl">{site.tagline}</h1>
            <p className="mt-5 max-w-md text-lg text-white/75">
              Everyday goods that tariffs made pricier, bought at overseas prices by verified travelers, declared at
              customs, and delivered to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">
                Shop deals
              </Link>
              <Link href="/waitlist" className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:border-white">
                Earn {TRAVELER_PCT * 100}% when you travel
              </Link>
            </div>
          </div>
          <div id="search" className="scroll-mt-24 text-ink">
            <FitFinder />
          </div>
        </div>
      </section>

      {/* Seller call-out, right under the hero so US businesses see it first. */}
      <section className="border-b border-line bg-soft">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="border-l-4 border-accent pl-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">For US businesses</p>
            <p className="mt-1 text-2xl leading-tight text-ink" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
              Have authorized stock in the US? Sell it here. No listing fees, {Math.round(SELLER_COMMISSION_PCT * 100)}% only when it sells.
            </p>
          </div>
          <Link href="/sell" className="shrink-0 rounded-xl bg-ink px-5 py-3 text-center font-semibold text-white hover:bg-brand">
            Start selling →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold text-ink">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/shop?c=${c.id}`}
              // On the 2-column phone grid, an odd last card spans both columns instead of sitting alone.
              className={`rounded-2xl border border-line bg-surface p-4 transition hover:border-brand ${
                i === categories.length - 1 && categories.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <span className="block font-semibold text-ink">{c.label}</span>
              <span className="text-sm text-muted">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Neutral context strip; the full timeline and point of view live on /why. */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-center gap-6 rounded-2xl bg-soft p-6 sm:p-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why prices rose</p>
            <h2 className="mt-3 text-3xl text-ink">Imported everyday goods cost more than they used to.</h2>
            <p className="mt-3 text-muted">
              Tariffs on imports have climbed since 2025. Buying at overseas shelf prices — declared and duty paid — still
              comes out ahead.
            </p>
            <Link href="/why" className="mt-4 inline-block font-semibold text-brand underline-offset-4 hover:underline">
              See what changed →
            </Link>
          </div>
          <TariffStats />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((p) => (
            <div key={p.title} className="rounded-2xl bg-soft p-5">
              <h3 className="font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-ink">Biggest savings right now</h2>
          <Link href="/shop" className="text-sm font-medium text-brand">
            See all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {top.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-8 overflow-hidden rounded-3xl bg-ink p-6 text-white sm:p-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">For travelers</p>
            <h2 className="mt-2 text-3xl font-bold">Already flying? Earn {TRAVELER_PCT * 100}% on what you carry.</h2>
            <p className="mt-3 text-white/70">
              Pick up requested items at authorized stores on your trip, declare them when you land, and hand them off.
              Buyers pay into escrow up front, so you&apos;re never out of pocket for long.
            </p>
            <Link href="/waitlist" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-ink">
              Join the traveler waitlist
            </Link>
          </div>
          <ul className="space-y-3">
            {travelers.slice(0, 4).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 px-4 py-3">
                <span className="min-w-0">
                  <span className="block font-semibold">{t.route}</span>
                  <span className="text-sm text-white/60">
                    {t.name} · {t.trips} trips · ★ {t.rating}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-accent-soft">Arrives {t.arrives}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
