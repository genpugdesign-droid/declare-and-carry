import type { Metadata } from "next";
import Link from "next/link";
import { TRAVELER_PCT } from "@/lib/catalog";
import { WaitlistForm } from "./WaitlistForm";

export const metadata: Metadata = {
  title: "Traveler waitlist",
  description: "Join the waitlist to carry and earn, or to get overseas-priced goods brought to you.",
};

const opening = [
  { title: "Routes open one at a time", body: "Starting with the busiest routes into New York and Los Angeles." },
  { title: "Verified before day one", body: "Every traveler passes ID checks and a customs-rules quiz before carrying anything." },
  { title: "Founding members first", body: "Founding Charter members get the first pick of trips when a route opens." },
];

export default function WaitlistPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_120%,rgba(179,20,29,0.4),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">Traveler delivery · opening soon</p>
          <h1 className="mt-4 max-w-3xl text-5xl sm:text-6xl">Get on the list before your route opens.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">
            Travel often? Earn {TRAVELER_PCT * 100}% carrying everyday goods hit by tariffs. Want overseas prices? Be first in
            line when travelers start carrying to your city.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-5">
        <div className="rounded-2xl border border-line p-5 sm:p-8 lg:col-span-3">
          <h2 className="text-3xl text-ink">Join the waitlist</h2>
          <p className="mt-2 text-sm text-muted">One minute. We only email you about your route.</p>
          <div className="mt-6">
            <WaitlistForm />
          </div>
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-3xl text-ink">How launch works</h2>
          <ul className="mt-6 space-y-3">
            {opening.map((o) => (
              <li key={o.title} className="border-l-4 border-accent bg-soft px-5 py-4">
                <p className="font-semibold text-ink">{o.title}</p>
                <p className="mt-1 text-sm text-muted">{o.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/membership" className="mt-6 inline-block font-semibold text-brand underline-offset-4 hover:underline">
            Reserve a Founding Charter spot →
          </Link>
        </div>
      </section>
    </>
  );
}
