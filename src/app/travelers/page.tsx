import type { Metadata } from "next";
import Link from "next/link";
import { TRAVELER_PCT, categories, getProduct, travelers } from "@/lib/catalog";
import { RequestForm } from "./RequestForm";

export const metadata: Metadata = { title: "Request an item" };

const steps = [
  { n: "1", title: "Post what you need", body: "Name the product, your city and when you need it. Or buy a listed item directly." },
  { n: "2", title: "Get an all-in quote", body: "Travelers on matching routes quote one price: overseas shelf price, declared duty, their share and fees." },
  { n: "3", title: "Pay into escrow", body: "Your money is held until you confirm the item arrived sealed and authentic." },
  { n: "4", title: "Meet or ship", body: "The traveler hands it off locally or mails it once they land." },
];

const rules = [
  "Travelers declare every item they carry for buyers at customs. Goods bought for someone else don't count toward the traveler's own duty-free allowance.",
  "Duty is built into the price. Buyers never get a separate customs bill.",
  "Authorized retailers only. Travelers upload the store receipt, and items stay sealed.",
  "Personal-carry quantities only (max 5 per item per order). Larger volume goes through our seller program with a licensed customs broker.",
  "Restricted items are never listed: sunscreens and other drug products, power banks and loose batteries, uncertified chargers, and counterfeit or replica goods.",
];

export default function TravelersPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Request an item</p>
      <h1 className="mt-2 max-w-2xl text-3xl font-bold text-ink sm:text-4xl">
        Can&apos;t find it listed? Someone flying in can bring it.
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Many everyday products cost far less where they&apos;re made and sold. Frequent travelers buy them there, declare them,
        and earn {TRAVELER_PCT * 100}% of the item price (at least $5 per order) for carrying them to you.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} className="rounded-2xl bg-soft p-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{s.n}</span>
            <h2 className="mt-3 font-semibold text-ink">{s.title}</h2>
            <p className="mt-1 text-sm text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="text-xl font-bold text-ink">Post a request</h2>
          <div className="mt-4">
            <RequestForm />
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-xl font-bold text-ink">Upcoming trips</h2>
          <ul className="mt-4 space-y-3">
            {travelers.map((t) => (
              <li key={t.id} className="rounded-2xl border border-line p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{t.route}</p>
                    <p className="text-sm text-muted">
                      {t.name} · {t.trips} trips · ★ {t.rating}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">{t.arrives}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.carries.map((slug) => {
                    const p = getProduct(slug);
                    return p ? (
                      <Link key={slug} href={`/product/${slug}`} className="rounded-full bg-soft px-2 py-1 text-xs text-ink hover:text-brand">
                        {p.name}
                      </Link>
                    ) : null;
                  })}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-12 rounded-3xl border border-line p-6 sm:p-8">
        <h2 className="text-xl font-bold text-ink">Carry rules</h2>
        <ul className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
          {rules.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="text-brand">●</span>
              {r}
            </li>
          ))}
        </ul>
        <h3 className="mt-8 font-semibold text-ink">By category</h3>
        <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
          {categories.map((c) => (
            <div key={c.id} className="rounded-xl bg-soft p-4">
              <dt className="font-medium text-ink">{c.label}</dt>
              <dd className="mt-1 text-muted">{c.rule}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
