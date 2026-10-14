"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductArt } from "@/components/ProductCard";
import { AUTO_CONFIRM_HOURS, MAX_CODE_ATTEMPTS, demoOrder as order } from "@/lib/orders";
import { money } from "@/lib/site";

type Mode = "in-person" | "shipped";
type Status = "awaiting" | "confirmed";

// Demo only: the code is generated in the browser. In production the server
// issues it, the traveler's app submits it, and the server releases escrow.
export function OrderTracker() {
  const [mode, setMode] = useState<Mode>("in-person");
  const [status, setStatus] = useState<Status>("awaiting");
  const [code, setCode] = useState("····");
  const [howConfirmed, setHowConfirmed] = useState("");

  useEffect(() => {
    setCode(String(Math.floor(1000 + Math.random() * 9000)));
  }, []);

  const confirm = (how: string) => {
    setHowConfirmed(how);
    setStatus("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        {/* Demo switch between the two delivery types */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <span className="font-semibold">Demo:</span> preview delivery type
          {(["in-person", "shipped"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setStatus("awaiting");
              }}
              className={`rounded-full px-3 py-1 font-medium ${mode === m ? "bg-amber-900 text-white" : "bg-white text-amber-900"}`}
            >
              {m === "in-person" ? "Meet in person" : "Shipped"}
            </button>
          ))}
        </div>

        {status === "confirmed" ? (
          <Confirmed how={howConfirmed} />
        ) : mode === "in-person" ? (
          <HandoffCode code={code} onConfirmed={() => confirm("Delivery code entered at handoff")} />
        ) : (
          <ShippedConfirm onConfirm={() => confirm("You confirmed delivery")} />
        )}

        <Timeline mode={mode} status={status} />
      </div>

      <OrderSummary />
    </div>
  );
}

function HandoffCode({ code, onConfirmed }: { code: string; onConfirmed: () => void }) {
  const checks = ["The seal and retail packaging are intact", "It's the right product and quantity", "It matches the sealed-item photo below"];
  const [checked, setChecked] = useState(checks.map(() => false));
  const ready = checked.every(Boolean);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Ready for handoff</p>
      <h2 className="mt-2 text-3xl text-ink">Meet {order.traveler.name}</h2>
      <p className="mt-1 text-sm text-muted">
        {order.meetup.window} · {order.meetup.place}
      </p>

      <div className="mt-5 rounded-xl bg-soft p-4">
        <p className="text-sm font-semibold text-ink">Check before you share your code</p>
        <ul className="mt-3 space-y-2">
          {checks.map((c, i) => (
            <li key={c}>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={(e) => setChecked((v) => v.map((x, j) => (j === i ? e.target.checked : x)))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                />
                {c}
              </label>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center gap-3">
          <ProductArt product={order.product} className="h-16 w-16 shrink-0 rounded-lg" />
          <p className="text-xs text-muted">Sealed-item photo the traveler uploaded at purchase, with one-time code Q7-31.</p>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm font-medium text-ink">Your delivery code</p>
        <div
          className={`mt-2 inline-flex gap-2 transition ${ready ? "" : "select-none blur-md"}`}
          aria-hidden={!ready}
          aria-label={ready ? `Delivery code ${code.split("").join(" ")}` : undefined}
        >
          {code.split("").map((d, i) => (
            <span
              key={i}
              className="flex h-16 w-12 items-center justify-center rounded-lg border-2 border-ink text-4xl font-semibold tabular-nums text-ink sm:h-20 sm:w-16 sm:text-5xl"
            >
              {d}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">
          {ready
            ? "Read it out or show your screen. Sharing it confirms you received the item and releases payment."
            : "Tick all three checks to reveal your code."}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-line pt-4 text-sm">
        <Link href="/orders/demo/report" className="font-semibold text-accent hover:underline">
          Something&apos;s wrong — don&apos;t share the code
        </Link>
      </div>

      <TravelerPhone code={code} onSuccess={onConfirmed} />
    </section>
  );
}

// Simulates the traveler's app so the whole handoff can be tried in one browser.
function TravelerPhone({ code, onSuccess }: { code: string; onSuccess: () => void }) {
  const [entry, setEntry] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const locked = attempts >= MAX_CODE_ATTEMPTS;

  return (
    <details className="mt-5 rounded-xl border border-dashed border-line p-4">
      <summary className="cursor-pointer text-sm font-semibold text-ink">Demo: the traveler&apos;s phone</summary>
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (locked) return;
          if (entry === code) return onSuccess();
          const n = attempts + 1;
          setAttempts(n);
          setEntry("");
          setError(n >= MAX_CODE_ATTEMPTS ? "Too many tries. Handoff locked — contact support." : `That code doesn't match. ${MAX_CODE_ATTEMPTS - n} tries left.`);
        }}
      >
        <label className="text-sm text-muted" htmlFor="handoff-code">
          Ask the buyer for their 4-digit code
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="handoff-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={4}
            value={entry}
            disabled={locked}
            onChange={(e) => setEntry(e.target.value.replace(/\D/g, ""))}
            className="h-12 w-32 rounded-xl border border-line bg-soft px-3 text-center text-2xl tracking-[0.4em] tabular-nums outline-none focus:border-brand disabled:opacity-50"
          />
          <button
            disabled={entry.length !== 4 || locked}
            className="h-12 flex-1 whitespace-nowrap rounded-xl bg-accent px-4 font-semibold text-white hover:bg-accent-dark disabled:opacity-40"
          >
            Complete
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-accent">{error}</p>}
      </form>
    </details>
  );
}

function ShippedConfirm({ onConfirm }: { onConfirm: () => void }) {
  // Demo deadline: AUTO_CONFIRM_HOURS from when the page opened.
  const [deadline] = useState(() => Date.now() + AUTO_CONFIRM_HOURS * 3600_000);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const left = Math.max(0, deadline - now);
  const h = Math.floor(left / 3600_000);
  const m = Math.floor((left % 3600_000) / 60_000);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Delivered</p>
      <h2 className="mt-2 text-3xl text-ink">Did everything arrive okay?</h2>
      <p className="mt-2 text-sm text-muted">
        {order.tracking.carrier} marked your package delivered {order.tracking.deliveredAt}. Tracking {order.tracking.number}.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button onClick={onConfirm} className="h-12 w-full rounded-xl bg-accent px-5 font-semibold text-white hover:bg-accent-dark sm:flex-1">
          Yes, it arrived as described
        </button>
        <Link
          href="/orders/demo/report"
          className="flex h-12 w-full items-center justify-center rounded-xl border border-line px-5 font-semibold text-ink hover:border-brand sm:flex-1"
        >
          Report a problem
        </Link>
      </div>
      <p className="mt-4 rounded-lg bg-soft px-3 py-2 text-xs text-muted">
        Auto-confirms in <span className="font-semibold text-ink tabular-nums">{h}h {m}m</span> if we don&apos;t hear from you.
        Reporting a problem before then freezes the payment.
      </p>
    </section>
  );
}

function Confirmed({ how }: { how: string }) {
  const [stars, setStars] = useState(0);
  return (
    <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Delivery confirmed</p>
      <h2 className="mt-2 text-3xl text-ink">Enjoy your order.</h2>
      <p className="mt-2 text-sm text-emerald-900">
        {how}. {order.traveler.name} has been paid. Problem later? You have 7 days to report authenticity issues.
      </p>
      <div className="mt-5">
        <p className="text-sm font-medium text-ink">Rate {order.traveler.name}</p>
        <div className="mt-1 flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              role="radio"
              aria-checked={stars === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setStars(n)}
              className={`text-3xl leading-none ${n <= stars ? "text-amber-500" : "text-line"}`}
            >
              ★
            </button>
          ))}
        </div>
        {stars > 0 && <p className="mt-2 text-sm text-emerald-900">Thanks — ratings help travelers move up a trust level.</p>}
      </div>
    </section>
  );
}

function Timeline({ mode, status }: { mode: Mode; status: Status }) {
  const last =
    mode === "in-person"
      ? { title: "Handed off", proof: "Confirmed with your delivery code." }
      : { title: "Delivered", proof: `Carrier scan ${order.tracking.deliveredAt}.` };
  const steps = [
    ...order.history.map((s) => ({ ...s, done: true })),
    mode === "in-person"
      ? { title: "Landed · ready for handoff", when: "Oct 19", proof: order.meetup.place, done: true }
      : { title: "Shipped", when: "Oct 19", proof: `${order.tracking.carrier} ${order.tracking.number}`, done: true },
    { ...last, when: status === "confirmed" ? "Today" : "", done: status === "confirmed" },
  ];

  return (
    <section>
      <h2 className="text-2xl text-ink">Order progress</h2>
      <ol className="mt-4 border-l border-line">
        {steps.map((s) => (
          <li key={s.title} className="relative pb-6 pl-6 last:pb-0">
            <span
              className={`absolute -left-[7px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ${
                s.done ? "bg-emerald-600" : "border-2 border-line bg-surface"
              }`}
            />
            <p className={`font-semibold ${s.done ? "text-ink" : "text-muted"}`}>
              {s.title} {s.when && <span className="ml-1 text-sm font-normal text-muted">{s.when}</span>}
            </p>
            <p className="text-sm text-muted">{s.proof}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function OrderSummary() {
  return (
    <aside className="h-fit space-y-4 rounded-2xl bg-soft p-5 lg:sticky lg:top-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Order {order.id}</p>
      <div className="flex gap-3">
        <ProductArt product={order.product} className="h-16 w-16 shrink-0 rounded-lg" />
        <div>
          <p className="font-semibold text-ink">{order.product.name}</p>
          <p className="text-sm text-muted">Qty {order.qty} · via traveler from {order.product.boughtIn}</p>
        </div>
      </div>
      <dl className="space-y-1 border-t border-line pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Paid (held in escrow)</dt>
          <dd className="font-semibold text-ink">{money(order.totalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Traveler</dt>
          <dd className="text-ink">
            {order.traveler.name} · ★ {order.traveler.rating}
          </dd>
        </div>
      </dl>
      <Link href="/orders/demo/report" className="block text-sm font-medium text-accent hover:underline">
        Report a problem
      </Link>
    </aside>
  );
}
