import Link from "next/link";
import { redirect } from "next/navigation";
import { TariffStats } from "@/components/TariffStats";
import { site } from "@/lib/site";
import { QuickSignup } from "./QuickSignup";

// Home page while launch.mode is "soon". The site is two pages before launch:
// this one (the waitlist sign-up, centered) and /why.
export function ComingSoon() {
  const words = site.rallyLine.split(" ");

  return (
    <>
      <section className="relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden bg-ink text-white">
        <div className="soon-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 text-center">
          <p className="soon-rise mx-auto max-w-2xl text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
            {site.tagline} · Opening soon
          </p>
          {/* One line at every width: the size scales with the viewport instead of wrapping. */}
          <h1 className="mt-4 whitespace-nowrap text-[clamp(1.75rem,8.4vw,5.75rem)]">
            {words.map((w, i) => (
              <span key={i} className="soon-rise inline-block" style={{ animationDelay: `${120 + i * 90}ms` }}>
                {w}
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h1>
          <p className="soon-rise mx-auto mt-5 max-w-lg text-lg text-white/75" style={{ animationDelay: `${200 + words.length * 90}ms` }}>
            Everyday goods hit by tariffs, bought at overseas prices by verified travelers, declared at customs and
            delivered. Join the waitlist and be first in when we open.
          </p>
          <div
            id="join"
            className="soon-rise soon-ring mx-auto mt-10 max-w-lg scroll-mt-28 text-left"
            style={{ animationDelay: `${320 + words.length * 90}ms` }}
          >
            <QuickSignup tone="dark" />
          </div>
          <Link
            href="/why"
            className="soon-rise mt-8 inline-block text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline"
            style={{ animationDelay: `${440 + words.length * 90}ms` }}
          >
            Why prices rose →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 pb-6">
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

// Every page other than home and /why sends visitors to the sign-up until launch.
export function OpeningSoon(): never {
  redirect("/");
}
