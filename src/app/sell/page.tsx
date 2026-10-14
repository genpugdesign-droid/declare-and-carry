import type { Metadata } from "next";
import Link from "next/link";
import { SELLER_COMMISSION_PCT, TRAVELER_MIN_CENTS, TRAVELER_PCT, breakdown, getProduct } from "@/lib/catalog";
import { money, site } from "@/lib/site";
import { SellerApplication } from "./SellerApplication";

export const metadata: Metadata = { title: "Sell with us" };

// Worked example for the traveler earnings card.
const example = getProduct("gan-65w-3port")!;

const SELLER_COMMISSION = Math.round(SELLER_COMMISSION_PCT * 100);

const steps = [
  { title: "Apply", body: "Tell us what you stock. Show you're authorized for the brands you list." },
  { title: "List", body: "Send a spreadsheet or your store link; we build your listings and you approve prices." },
  { title: "Ship", body: "Orders come in with a prepaid label. Ship within 2 business days." },
  { title: "Get paid", body: `Weekly payouts. ${site.name} keeps ${SELLER_COMMISSION}% only when you sell.` },
];

const reasons = [
  { title: "Shoppers already looking", body: "People come here searching for exact model numbers and specific products. They're ready to buy." },
  { title: "Beat the import markup", body: "Tariffs pushed shelf prices up. Stock you already hold in the US is the fastest option they have." },
  { title: "No listing fees", body: `No monthly fee to list. You pay ${SELLER_COMMISSION}% per sale, and that's all.` },
  { title: "Shown next to every traveler offer", body: "\"Ships in 2–4 days\" sits beside the traveler price, so buyers who need it now pick you." },
];

export default function SellPage() {
  const b = breakdown(example);
  const perTrip = b.traveler * 8; // e.g. 8 small orders on one trip

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_120%,rgba(179,20,29,0.4),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">For US businesses</p>
          <h1 className="mt-4 max-w-3xl text-5xl sm:text-6xl">Have it in stock in the US? Sell it here.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Shops, distributors and importers: list the authorized stock you already hold and reach shoppers hunting for
            it. You set the price. We take {SELLER_COMMISSION}% when it sells.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#apply" className="rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">
              Apply to sell
            </a>
            <a href="#carry" className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:border-white">
              Travel often? Carry instead
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-4xl text-ink">How selling works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="border-l-4 border-accent bg-soft px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Step {i + 1}</p>
              <h3 className="mt-1 font-semibold text-ink">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="text-3xl text-ink">Why sell here</h2>
            <ul className="mt-6 space-y-5">
              {reasons.map((r) => (
                <li key={r.title}>
                  <p className="font-semibold text-ink">{r.title}</p>
                  <p className="text-sm text-muted">{r.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div id="apply" className="scroll-mt-24 rounded-2xl border border-line p-5 sm:p-8 lg:col-span-3">
            <h2 className="text-3xl text-ink">Apply to sell</h2>
            <p className="mt-2 text-sm text-muted">Takes about 3 minutes. We reply within 2 business days.</p>
            <div className="mt-6">
              <SellerApplication />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div id="carry" className="scroll-mt-24 grid gap-6 rounded-2xl bg-soft p-6 sm:p-8 md:grid-cols-[2fr_1fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">For frequent travelers</p>
            <h2 className="mt-2 text-3xl text-ink">Earn {TRAVELER_PCT * 100}% of every item you carry</h2>
            <p className="mt-2 text-muted">
              Never less than {money(TRAVELER_MIN_CENTS)} per order. Example: {example.name} costs {money(b.item)} in{" "}
              {example.boughtIn}; you earn {money(b.traveler)} per order, about {money(perTrip)} for eight orders on one trip.
            </p>
          </div>
          <Link
            href="/waitlist"
            className="justify-self-start rounded-xl border border-line bg-surface px-5 py-3 font-semibold text-ink hover:border-brand md:justify-self-end"
          >
            Join the traveler waitlist
          </Link>
        </div>
      </section>
    </>
  );
}
