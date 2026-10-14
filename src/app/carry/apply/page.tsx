import { OpeningSoon } from "@/components/ComingSoon";
import { isSoon } from "@/lib/site";
import type { Metadata } from "next";
import { Onboarding } from "./Onboarding";

export const metadata: Metadata = { title: "Become a traveler" };

export default function ApplyPage() {
  if (isSoon) return <OpeningSoon />;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Traveler sign-up</p>
      <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Get verified to carry</h1>
      <p className="mt-2 max-w-2xl text-muted">About 10 minutes. You&apos;ll need your passport, your phone and an upcoming trip.</p>
      <p className="mt-3 inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
        Demo flow — verification is simulated and nothing you enter leaves this browser.
      </p>
      <div className="mt-8">
        <Onboarding />
      </div>
    </div>
  );
}
