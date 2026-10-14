"use client";

import Link from "next/link";
import { useState } from "react";
import { useMembership } from "@/components/MembershipProvider";
import { MEMBERSHIP_NAME, plans, yearlyFeesAvoidedCents, yearlySavingsPct, type PlanId } from "@/lib/membership";
import { launch, money } from "@/lib/site";

// Plan picker + join button. Demo: joining flips a flag in this browser so the
// member prices show across the site; production would start a Stripe subscription.
export function PlanPicker() {
  const { plan: current, join, leave } = useMembership();
  const [plan, setPlan] = useState<PlanId>("founding");
  const p = plans[plan];
  const monthlyEquivalent = plan === "monthly" ? p.priceCents : Math.round(p.priceCents / 12);

  if (current) {
    return (
      <div className="rounded-2xl bg-white p-5 text-ink sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">You&apos;re a {MEMBERSHIP_NAME} member</p>
        <p className="mt-2 text-2xl font-semibold">
          {plans[current].label} plan · {money(plans[current].priceCents)}/{plans[current].per}
        </p>
        <p className="mt-1 text-sm text-muted">Member prices now show across the site (demo).</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">
            Shop member prices
          </Link>
          <button onClick={leave} className="rounded-xl border border-line px-5 py-3 font-semibold text-ink hover:border-brand">
            Cancel membership
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 text-ink sm:p-6">
      <div className="grid grid-cols-3 gap-1 rounded-2xl bg-soft p-1" role="radiogroup" aria-label="Billing">
        {(Object.keys(plans) as PlanId[]).map((id) => (
          <button
            key={id}
            role="radio"
            aria-checked={plan === id}
            onClick={() => setPlan(id)}
            className={`rounded-xl px-2 py-1.5 text-center text-sm font-semibold ${plan === id ? "bg-ink text-white" : "text-muted"}`}
          >
            {plans[id].label}
            {id === "yearly" && <span className={`block text-xs ${plan === id ? "text-accent-soft" : "text-accent"}`}>save {yearlySavingsPct}%</span>}
            {id === "founding" && <span className={`block text-xs ${plan === id ? "text-accent-soft" : "text-accent"}`}>pre-sale</span>}
            {id === "monthly" && <span className="block text-xs text-transparent" aria-hidden>·</span>}
          </button>
        ))}
      </div>
      <p className="mt-5 flex items-baseline gap-2">
        <span className="text-5xl font-semibold">{money(p.priceCents)}</span>
        <span className="text-muted">/{p.per}</span>
      </p>
      <p className="mt-1 text-sm text-muted">
        {plan !== "monthly" ? `That's ${money(monthlyEquivalent)} a month. ` : ""}
        {p.billed}
      </p>
      {plan === "founding" && launch.foundingCheckoutUrl ? (
        // Real checkout: the Stripe Payment Link for the Founding pre-sale.
        <a
          href={launch.foundingCheckoutUrl}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-dark"
        >
          Reserve a Founding {MEMBERSHIP_NAME} spot
        </a>
      ) : (
        <>
          <button
            onClick={() => join(plan)}
            className="mt-5 h-12 w-full rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-dark"
          >
            {plan === "founding" ? `Reserve a Founding ${MEMBERSHIP_NAME} spot` : `Become a ${MEMBERSHIP_NAME} member`}
          </button>
          <p className="mt-2 text-center text-xs text-muted">Demo — no charge. Turns on member prices in this browser.</p>
        </>
      )}
    </div>
  );
}

export function SavingsCalculator() {
  const [orders, setOrders] = useState(2);
  const [avg, setAvg] = useState(30);
  const avoided = yearlyFeesAvoidedCents(orders, avg * 100);
  const cost = plans.yearly.priceCents;
  const net = avoided - cost;
  const perOrder = yearlyFeesAvoidedCents(1, avg * 100) / 12;
  const breakEven = Math.ceil(cost / perOrder);

  return (
    <div className="grid gap-6 rounded-2xl border border-line p-5 sm:p-8 md:grid-cols-2">
      <div className="space-y-6">
        <Slider label="Traveler orders per month" value={orders} min={1} max={8} step={1} onChange={setOrders} format={(v) => String(v)} />
        <Slider label="Average item price (overseas)" value={avg} min={10} max={150} step={5} onChange={setAvg} format={(v) => `$${v}`} />
        <p className="text-xs text-muted">
          Counts the service fee and traveler-minimum top-ups you&apos;d skip on traveler orders. Free US-stock shipping is extra.
        </p>
      </div>
      <div className="flex flex-col justify-center gap-3" aria-live="polite">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Fees you&apos;d skip in a year</span>
          <span className="font-semibold text-ink">{money(avoided)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Charter (yearly)</span>
          <span className="font-semibold text-ink">−{money(cost)}</span>
        </div>
        <div className={`border-l-4 px-4 py-3 ${net >= 0 ? "border-emerald-600 bg-emerald-50" : "border-line bg-soft"}`}>
          <p className="text-3xl font-semibold text-ink">{net >= 0 ? `+${money(net)}` : money(net)}</p>
          <p className="text-sm text-muted">
            {net >= 0 ? "a year in your pocket" : "Pay as you go is cheaper at this pace"} · pays for itself after {breakEven} orders a year
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const id = label.replace(/\W+/g, "-").toLowerCase();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <span className="text-lg font-semibold text-ink tabular-nums">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand"
      />
    </div>
  );
}
