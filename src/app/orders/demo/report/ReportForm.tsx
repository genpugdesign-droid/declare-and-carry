"use client";

import Link from "next/link";
import { useState } from "react";
import { TRAVELER_RESPONSE_HOURS, demoOrder as order, problemReasons, type ProblemReasonId } from "@/lib/orders";
import { money } from "@/lib/site";

const outcomes = [
  { id: "refund", label: "Full refund", hint: "Return the item if asked; your money comes back from escrow." },
  { id: "replace", label: "Replacement", hint: "Another traveler on the route sources the right item." },
  { id: "partial", label: "Partial refund", hint: "Keep the item; get part of your money back." },
] as const;

const MIN_DETAILS = 20;

// Demo only: nothing is sent. In production this opens a case, freezes the
// escrow release and notifies the traveler.
export function ReportForm() {
  const [reason, setReason] = useState<ProblemReasonId | null>(null);
  const [outcome, setOutcome] = useState<(typeof outcomes)[number]["id"]>("refund");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const picked = problemReasons.find((r) => r.id === reason);
  const needsPhoto = picked?.needsPhoto ?? false;
  const canSubmit = !!picked && details.trim().length >= MIN_DETAILS && (!needsPhoto || photos.length > 0);

  if (submitted && picked) return <CaseOpened reason={picked.label} outcome={outcomes.find((o) => o.id === outcome)!.label} />;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) {
          setSubmitted(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className="space-y-8"
    >
      <div className="rounded-xl border-l-4 border-accent bg-soft px-4 py-3 text-sm text-ink">
        Your {money(order.totalCents)} stays frozen in escrow while we look into this. {order.traveler.name} won&apos;t be paid until it&apos;s resolved.
      </div>

      <fieldset>
        <legend className="text-lg font-semibold text-ink">What went wrong?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {problemReasons.map((r) => (
            <label
              key={r.id}
              className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${reason === r.id ? "border-brand bg-brand/5" : "border-line hover:border-brand"}`}
            >
              <input
                type="radio"
                name="reason"
                checked={reason === r.id}
                onChange={() => setReason(r.id)}
                className="mt-1 h-4 w-4 shrink-0 accent-brand"
              />
              <span>
                <span className="block font-medium text-ink">{r.label}</span>
                <span className="text-sm text-muted">{r.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="details" className="text-lg font-semibold text-ink">
          Tell us what happened
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder="e.g. One bottle's safety seal was torn and the cap was loose."
          className="mt-2 w-full rounded-xl border border-line bg-soft p-3 text-base outline-none focus:border-brand focus:bg-surface"
        />
        <p className="mt-1 text-xs text-muted">
          {details.trim().length < MIN_DETAILS
            ? `At least ${MIN_DETAILS - details.trim().length} more characters.`
            : "Thanks — the more specific, the faster we can resolve it."}
        </p>
      </div>

      {picked && (
        <div>
          <p className="text-lg font-semibold text-ink">
            Photos {needsPhoto ? <span className="text-sm font-normal text-accent">required</span> : <span className="text-sm font-normal text-muted">optional</span>}
          </p>
          <p className="text-sm text-muted">Show the packaging, seal, label or batch code — whatever shows the problem.</p>
          <label className="mt-2 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-line px-4 py-8 text-center text-sm text-muted hover:border-brand">
            {photos.length ? `📷 ${photos.join(", ")}` : "Tap to add photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => setPhotos(Array.from(e.target.files ?? []).map((f) => f.name))}
            />
          </label>
          <p className="mt-1 text-xs text-muted">Stays on your device in this demo.</p>
        </div>
      )}

      <fieldset>
        <legend className="text-lg font-semibold text-ink">What would make it right?</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {outcomes.map((o) => (
            <label
              key={o.id}
              className={`flex cursor-pointer flex-col rounded-xl border p-4 ${outcome === o.id ? "border-brand bg-brand/5" : "border-line hover:border-brand"}`}
            >
              <span className="flex items-center gap-2 font-medium text-ink">
                <input type="radio" name="outcome" checked={outcome === o.id} onChange={() => setOutcome(o.id)} className="h-4 w-4 accent-brand" />
                {o.label}
              </span>
              <span className="mt-1 text-sm text-muted">{o.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button disabled={!canSubmit} className="h-12 rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-dark disabled:opacity-40">
          Submit report
        </button>
        <Link href="/orders/demo" className="text-center text-sm font-medium text-muted hover:text-ink">
          Cancel — back to my order
        </Link>
      </div>
    </form>
  );
}

function CaseOpened({ reason, outcome }: { reason: string; outcome: string }) {
  const steps = [
    { title: "Payment frozen", body: `Your ${money(order.totalCents)} stays in escrow. Nobody is paid while the case is open.` },
    {
      title: `${order.traveler.name} responds`,
      body: `They have ${TRAVELER_RESPONSE_HOURS} hours to reply with their side and evidence (receipt, sealed photo, handoff record).`,
    },
    { title: "We decide", body: "A specialist reviews both sides and the evidence, usually within 3 business days." },
    { title: "Money moves", body: "Refund, replacement or partial refund goes out; the traveler is paid only for what's owed." },
  ];
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Case {order.id}-R1 opened</p>
        <h2 className="mt-2 text-3xl text-ink">We&apos;ve got it from here.</h2>
        <p className="mt-2 text-muted">
          Reported: <span className="font-medium text-ink">{reason}</span> · You asked for:{" "}
          <span className="font-medium text-ink">{outcome}</span>. We&apos;ll text and email you at each step.
        </p>
      </section>
      <ol className="grid gap-3 sm:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-3 rounded-2xl bg-soft p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
            <span>
              <span className="block font-semibold text-ink">{s.title}</span>
              <span className="text-sm text-muted">{s.body}</span>
            </span>
          </li>
        ))}
      </ol>
      <Link href="/orders/demo" className="inline-block font-semibold text-brand hover:underline">
        ← Back to order
      </Link>
    </div>
  );
}
