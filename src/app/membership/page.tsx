import { OpeningSoon } from "@/components/ComingSoon";
import { isSoon } from "@/lib/site";
import type { Metadata } from "next";
import { SERVICE_PCT, TRAVELER_MIN_CENTS, breakdown, getProduct } from "@/lib/catalog";
import { FOUNDING_CAP, MEMBERSHIP_NAME, perks, plans } from "@/lib/membership";
import { money } from "@/lib/site";
import { PlanPicker, SavingsCalculator } from "./MembershipClient";

export const metadata: Metadata = {
  title: `${MEMBERSHIP_NAME} membership`,
  description: "No service fees, no traveler minimums, first pick of travelers.",
};

const example = getProduct("hydrating-essence-150")!;

const compare: { label: string; free: string; member: string }[] = [
  { label: "Service & protection fee", free: `${SERVICE_PCT * 100}% per traveler order`, member: "None" },
  { label: "Traveler minimum", free: `${money(TRAVELER_MIN_CENTS)} per order line`, member: "Covered by us" },
  { label: "US-stock shipping", free: "Free over $35", member: "Always free" },
  { label: "New trips on popular routes", free: "When published", member: "24 hours early" },
  { label: "Price-lock alerts", free: "—", member: "Included" },
  { label: "Problem reports", free: "Standard queue", member: "Reviewed first" },
  { label: "Escrow & authenticity guarantee", free: "Included", member: "Included" },
];

const faqs = [
  {
    q: "What do Founding members get before traveler delivery opens?",
    a: "Free US-stock shipping and priority support right away. Your membership year starts the day traveler delivery opens on your route, so you don't pay for months you can't use the traveler perks.",
  },
  {
    q: "Do travelers earn less from members?",
    a: `No. Travelers are paid the same share and the same ${money(TRAVELER_MIN_CENTS)} minimum on every order. For members, we cover the difference.`,
  },
  { q: "Can I cancel anytime?", a: "Yes. Cancel in one tap. You keep member pricing until the end of the period you paid for." },
  { q: "Does it apply to auto-replace orders?", a: "Yes, and it stacks with the auto-replace discount." },
  { q: "Is duty still included?", a: "Always. Membership removes our fees, never the duty. Every item is still declared." },
];

export default function MembershipPage() {
  if (isSoon) OpeningSoon();
  const free = breakdown(example, 1, false);
  const member = breakdown(example, 1, true);
  const rows = [
    ["Shelf price", free.item, member.item],
    ["US duty", free.duty, member.duty],
    ["Traveler", free.traveler, member.traveler],
    [`Service fee`, free.fee, member.fee],
  ] as const;

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_120%,rgba(179,20,29,0.4),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-block border-l-4 border-accent bg-white/10 px-3 py-1.5 text-sm text-white">
              <span className="font-semibold">Founding pre-sale:</span> {money(plans.founding.priceCents)} for your first year ·
              first {FOUNDING_CAP} members
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">{MEMBERSHIP_NAME} membership</p>
            <h1 className="mt-4 text-5xl sm:text-6xl">Overseas prices. Zero fees.</h1>
            <p className="mt-5 max-w-md text-lg text-white/75">
              Skip the service fee and the traveler minimum on every order, get first pick of travelers, and never pay
              for US-stock shipping. From {money(Math.round(plans.yearly.priceCents / 12))} a month.
            </p>
          </div>
          <PlanPicker />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What you get</p>
        <h2 className="mt-3 text-4xl text-ink">Everything in pay-as-you-go, without the fees.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p) => (
            <div key={p.title} className="border-l-4 border-accent bg-soft px-5 py-4">
              <h3 className="font-semibold text-ink">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl text-ink">Pay as you go vs. {MEMBERSHIP_NAME}</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-left text-sm">
                <thead className="bg-soft text-xs uppercase tracking-[0.15em] text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      <span className="sr-only">Benefit</span>
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Pay as you go
                    </th>
                    <th className="px-4 py-3 font-semibold text-ink" scope="col">
                      {MEMBERSHIP_NAME}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compare.map((r) => (
                    <tr key={r.label} className="border-t border-line align-top">
                      <th scope="row" className="px-4 py-3 font-medium text-ink">
                        {r.label}
                      </th>
                      <td className="px-4 py-3 text-muted">{r.free}</td>
                      <td className="px-4 py-3 font-semibold text-ink">{r.member}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-3xl text-ink">An example order</h2>
            <p className="mt-2 text-sm text-muted">{example.name}, carried from {example.boughtIn}. Sample prices.</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm tabular-nums">
                <thead className="bg-soft text-xs uppercase tracking-[0.15em] text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" scope="col">
                      <span className="sr-only">Line</span>
                    </th>
                    <th className="px-4 py-3 text-right font-semibold" scope="col">
                      Pay as you go
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-ink" scope="col">
                      {MEMBERSHIP_NAME}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, a, b]) => (
                    <tr key={label} className="border-t border-line">
                      <th scope="row" className="px-4 py-2.5 text-left font-normal text-muted">
                        {label}
                      </th>
                      <td className="px-4 py-2.5 text-right text-ink">{money(a)}</td>
                      <td className="px-4 py-2.5 text-right text-ink">{money(b)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-line font-semibold">
                    <th scope="row" className="px-4 py-3 text-left">
                      You pay
                    </th>
                    <td className="px-4 py-3 text-right">{money(free.total)}</td>
                    <td className="px-4 py-3 text-right text-emerald-700">{money(member.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted">
              Typical US price {money(example.usRetailCents)}. The traveler still receives {money(free.travelerPaid)} either way.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-3xl text-ink">Is it worth it for you?</h2>
        <p className="mt-2 text-muted">Slide to match how you shop.</p>
        <div className="mt-6">
          <SavingsCalculator />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-6">
        <h2 className="text-3xl text-ink">Questions</h2>
        <dl className="mt-6 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <div key={f.q} className="py-4">
              <dt className="font-semibold text-ink">{f.q}</dt>
              <dd className="mt-1 text-muted">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
