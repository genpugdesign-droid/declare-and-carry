import Link from "next/link";
import { TariffStats } from "@/components/TariffStats";
import { SELLER_COMMISSION_PCT, TRAVELER_PCT } from "@/lib/catalog";
import { MEMBERSHIP_NAME, plans } from "@/lib/membership";
import { launchDateLabel, money, site } from "@/lib/site";
import { QuickSignup } from "./QuickSignup";

// Home page while launch.mode is "soon": three ways in (sell, carry, join).
export function ComingSoon() {
  const paths = [
    {
      eyebrow: "For US businesses",
      title: "Become a founding seller",
      body: `List the authorized stock you already hold. No listing or monthly fees; ${Math.round(SELLER_COMMISSION_PCT * 100)}% only when it sells.`,
      cta: "Apply to sell",
      href: "/sell#apply",
    },
    {
      eyebrow: "For frequent travelers",
      title: "Carry and earn",
      body: `Earn ${TRAVELER_PCT * 100}% carrying everyday goods hit by tariffs, declared and duty paid. Get on the list for your route.`,
      cta: "Join the traveler waitlist",
      href: "/waitlist",
    },
    {
      eyebrow: "For shoppers",
      title: `Founding ${MEMBERSHIP_NAME}`,
      body: `${money(plans.founding.priceCents)} for your first year, and it doesn't start until traveler delivery opens on your route.`,
      cta: "Reserve a founding spot",
      href: "/membership",
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_110%,rgba(179,20,29,0.4),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[3fr_2fr] md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
              {site.tagline} · Opening {launchDateLabel()}
            </p>
            <h1 className="mt-4 text-5xl sm:text-6xl md:text-7xl">{site.rallyLine}</h1>
            <p className="mt-5 max-w-xl text-lg text-white/75">
              A new marketplace for everyday goods hit by tariffs. Bought at overseas prices by verified travelers, declared at
              customs and delivered, or shipped from authorized US shops.
            </p>
          </div>
          <div id="early-access" className="scroll-mt-24">
            <QuickSignup tone="dark" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Be first in</p>
        <h2 className="mt-3 text-4xl text-ink">Three ways to join before we open</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {paths.map((p) => (
            <div key={p.title} className="flex flex-col border-l-4 border-accent bg-soft px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{p.eyebrow}</p>
              <h3 className="mt-2 text-2xl text-ink" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted">{p.body}</p>
              <Link href={p.href} className="mt-4 font-semibold text-brand underline-offset-4 hover:underline">
                {p.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="grid items-center gap-6 rounded-2xl bg-soft p-6 sm:p-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why now</p>
            <h2 className="mt-3 text-3xl text-ink">Imported everyday goods cost more than they used to.</h2>
            <Link href="/why" className="mt-4 inline-block font-semibold text-brand underline-offset-4 hover:underline">
              See what changed →
            </Link>
          </div>
          <TariffStats />
        </div>
      </section>
    </>
  );
}

// Shown on catalog pages (shop, product, cart, orders) until launch.
export function OpeningSoon() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Opening {launchDateLabel()}</p>
      <h1 className="mt-4 text-5xl text-ink">The shop opens soon.</h1>
      <p className="mt-4 text-muted">
        We&apos;re signing founding sellers and travelers now. Join the waitlist and we&apos;ll email you the day it opens.
      </p>
      <div className="mx-auto mt-8 max-w-md text-left">
        <QuickSignup />
      </div>
    </section>
  );
}
