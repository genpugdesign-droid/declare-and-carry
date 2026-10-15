import type { Metadata } from "next";
import Link from "next/link";
import { Serpent } from "@/components/Serpent";
import { TariffChart } from "@/components/TariffChart";
import { TariffStats } from "@/components/TariffStats";
import { TRAVELER_PCT } from "@/lib/catalog";
import { isSoon, site } from "@/lib/site";
import { formatLongDate, tariffPoints, tariffSources } from "@/lib/tariffs";

export const metadata: Metadata = {
  title: "Why prices rose",
  description: "How tariff policy since 2025 shows up on everyday receipts — and what you can do about it.",
};

export default function WhyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_120%,rgba(179,20,29,0.35),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <Serpent variant="serpent" height={110} className="absolute right-4 top-16 hidden lg:block" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">Why we exist</p>
          <h1 className="mt-4 max-w-3xl text-5xl sm:text-6xl md:text-7xl">Politics shows up on your receipt.</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            You may never read a trade proclamation or follow a court ruling. You still pay for them — at the register, on
            the everyday things you buy. Here&apos;s what changed, when, and the reason given each time.
          </p>
          <div className="mt-10">
            <TariffStats dark />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The average tariff, 2025–2026</p>
        <h2 className="mt-3 text-4xl text-ink">From 2.4% to the highest in over a century — in four months.</h2>
        <div className="mt-8 rounded-2xl border border-line p-4 sm:p-6">
          <TariffChart />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <h2 className="text-3xl text-ink">What changed, and the reason given</h2>
        <ol className="mt-6 border-l border-line">
          {tariffPoints.map((p) => (
            <li key={p.date} className="relative pb-8 pl-6 last:pb-0">
              <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{formatLongDate(p.date)}</p>
              <p className="mt-1 text-lg font-semibold text-ink">
                {p.label} <span className="font-normal text-muted">· {p.rate.toFixed(1)}%</span>
                {p.since && <span className="ml-2 align-middle text-xs font-medium text-accent">highest since {p.since}</span>}
              </p>
              <p className="mt-1 max-w-3xl text-muted">{p.reason}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_-20%,rgba(179,20,29,0.3),transparent_55%)]" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">Protest with your wallet</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">Not everyone can march. Everyone can choose where their money goes.</h2>
            <div className="mt-6 space-y-4 text-lg text-white/75">
              <p>
                Maybe you can&apos;t take a day off to protest. Maybe you think the whole thing is noise. Either way, you cast a
                vote every time you check out — and you have every right to cast it somewhere that respects your budget.
              </p>
              <p>
                {site.name} plays it straight: every item is declared, every duty is paid, and you still pay less because you
                skip the markups stacked on top. Travelers who make it happen earn {TRAVELER_PCT * 100}% for their trouble.
              </p>
              <p className="text-white">
                The American people have a right not only to a modest life, but to a well-lived one.
              </p>
            </div>
            {isSoon ? (
            <div className="mt-8">
              <Link href="/#join" className="inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark">
                Join the waitlist
              </Link>
            </div>
            ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">
                Shop at overseas prices
              </Link>
              <Link href="/waitlist" className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:border-white">
                Earn as a traveler
              </Link>
            </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6 text-sm text-muted">
        <h2 className="text-xl text-ink">About these numbers</h2>
        <p className="mt-2 max-w-3xl">
          Rates are the Yale Budget Lab&apos;s published estimates of the average effective US tariff rate, measured before
          shoppers shift what they buy. Each point is an estimate on that date; the line simply connects them. The Budget Lab
          refined its method in 2026, so early-2025 and 2026 figures aren&apos;t perfectly comparable. Reasons are the
          justification given at the time, in plain language.
        </p>
        <ul className="mt-3 space-y-1">
          {tariffSources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="underline hover:text-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
