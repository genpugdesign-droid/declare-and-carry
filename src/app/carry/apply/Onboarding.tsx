"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TRAVELER_MIN_CENTS, TRAVELER_PCT } from "@/lib/catalog";
import { money, site } from "@/lib/site";
import { deliveryChecks, quiz, trustLevels } from "@/lib/trust";

// Demo onboarding: nothing leaves the browser. In production, step 2 is a
// Stripe Identity session and step 3 is Stripe Connect onboarding.

const steps = ["About you", "Verify identity", "Payouts", "Carry rules", "Agreement", "First trip"];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<boolean[]>(steps.map(() => false));

  const complete = (i: number) => {
    setDone((d) => d.map((v, j) => (j === i ? true : v)));
    setStep(i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step >= steps.length) return <Finished />;

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Progress: horizontal bar on phones, vertical list on desktop */}
      <div>
        <div className="lg:hidden">
          <p className="text-sm font-medium text-ink">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft">
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(step / steps.length) * 100}%` }} />
          </div>
        </div>
        <ol className="hidden space-y-1 lg:block">
          {steps.map((s, i) => (
            <li key={s}>
              <button
                disabled={!done[i] && i !== step}
                onClick={() => setStep(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                  i === step ? "bg-brand/10 font-semibold text-ink" : done[i] ? "text-ink hover:bg-soft" : "text-muted"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done[i] ? "bg-brand text-white" : i === step ? "border-2 border-brand text-brand" : "border border-line"
                  }`}
                >
                  {done[i] ? "✓" : i + 1}
                </span>
                {s}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
        {step === 0 && <AboutYou onNext={() => complete(0)} />}
        {step === 1 && <VerifyIdentity onNext={() => complete(1)} />}
        {step === 2 && <Payouts onNext={() => complete(2)} />}
        {step === 3 && <RulesQuiz onNext={() => complete(3)} />}
        {step === 4 && <Agreement onNext={() => complete(4)} />}
        {step === 5 && <FirstTrip onNext={() => complete(5)} />}
      </div>
    </div>
  );
}

function StepHeader({ title, body }: { title: string; body: string }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
    </>
  );
}

function NextButton({ disabled, children = "Continue" }: { disabled?: boolean; children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-8 h-12 w-full rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-dark disabled:opacity-40 sm:w-auto"
    >
      {children}
    </button>
  );
}

function Field({ label, hint, className = "", ...input }: { label: string; hint?: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block text-sm font-medium text-ink ${className}`}>
      {label}
      <input
        required
        {...input}
        className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal outline-none focus:border-brand focus:bg-surface"
      />
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

function AboutYou({ onNext }: { onNext: () => void }) {
  return (
    <form onSubmit={(e) => (e.preventDefault(), onNext())}>
      <StepHeader title="Tell us about you" body="Use your legal name exactly as it appears on your passport — we match it against your ID and itineraries." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Legal first name" name="first" autoComplete="given-name" />
        <Field label="Legal last name" name="last" autoComplete="family-name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" hint="We text a code to confirm it." />
        <Field label="Home city (US)" name="city" placeholder="e.g. Chicago, IL" />
        <Field label="Home airport" name="airport" placeholder="e.g. ORD" maxLength={4} />
        <label className="block text-sm font-medium text-ink sm:col-span-2">
          How often do you travel internationally?
          <select required className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal">
            <option value="">Choose one</option>
            <option>A few times a year</option>
            <option>Monthly</option>
            <option>Several times a month</option>
          </select>
        </label>
      </div>
      <NextButton />
    </form>
  );
}

// Simulates a Stripe Identity session: document scan, selfie, liveness match.
function VerifyIdentity({ onNext }: { onNext: () => void }) {
  const checks = ["Scan passport or driver's license", "Take a live selfie", "Match selfie to ID photo", "Screen against sanctions lists"];
  const [progress, setProgress] = useState(-1);

  useEffect(() => {
    if (progress < 0 || progress >= checks.length) return;
    const t = setTimeout(() => setProgress((p) => p + 1), 700);
    return () => clearTimeout(t);
  }, [progress, checks.length]);

  const finished = progress >= checks.length;

  return (
    <form onSubmit={(e) => (e.preventDefault(), onNext())}>
      <StepHeader
        title="Verify your identity"
        body="A secure check run by our identity partner. It takes about 2 minutes on your phone. We never see or store your ID images."
      />
      <ul className="mt-6 space-y-2">
        {checks.map((c, i) => {
          const state = progress > i ? "done" : progress === i ? "active" : "todo";
          return (
            <li key={c} className="flex items-center gap-3 rounded-xl bg-soft px-4 py-3 text-sm">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  state === "done" ? "bg-emerald-600 text-white" : state === "active" ? "animate-pulse bg-brand/30" : "border border-line"
                }`}
              >
                {state === "done" ? "✓" : ""}
              </span>
              <span className={state === "todo" ? "text-muted" : "text-ink"}>{c}</span>
            </li>
          );
        })}
      </ul>
      {progress < 0 ? (
        <button
          type="button"
          onClick={() => setProgress(0)}
          className="mt-6 h-12 w-full rounded-xl border-2 border-brand px-6 font-semibold text-brand hover:bg-brand/5 sm:w-auto"
        >
          Start verification
        </button>
      ) : finished ? (
        <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Identity verified (demo).</p>
      ) : (
        <p className="mt-6 text-sm text-muted">Verifying…</p>
      )}
      <NextButton disabled={!finished} />
    </form>
  );
}

// Simulates Stripe Connect onboarding. Sensitive fields are entered on Stripe, never here.
function Payouts({ onNext }: { onNext: () => void }) {
  const [connected, setConnected] = useState(false);
  return (
    <form onSubmit={(e) => (e.preventDefault(), onNext())}>
      <StepHeader title="Set up payouts" body="You'll be redirected to our payments partner to add a bank account. They also handle your tax form at year end." />
      <div className="mt-6 rounded-2xl bg-soft p-5 text-sm">
        <p className="font-semibold text-ink">Our payments partner will ask for</p>
        <ul className="mt-2 space-y-1 text-muted">
          <li>• Legal name and date of birth</li>
          <li>• Last 4 digits of your SSN (required by US tax law for payouts)</li>
          <li>• Bank account for deposits</li>
        </ul>
        <p className="mt-3 text-muted">
          {site.name} never sees these details. You&apos;ll get a 1099-K if your earnings cross the IRS reporting threshold.
        </p>
      </div>
      {connected ? (
        <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Bank account connected ••••6789 (demo).</p>
      ) : (
        <button
          type="button"
          onClick={() => setConnected(true)}
          className="mt-6 h-12 w-full rounded-xl border-2 border-brand px-6 font-semibold text-brand hover:bg-brand/5 sm:w-auto"
        >
          Connect bank account
        </button>
      )}
      <NextButton disabled={!connected} />
    </form>
  );
}

function RulesQuiz({ onNext }: { onNext: () => void }) {
  const [picks, setPicks] = useState<(number | null)[]>(quiz.map(() => null));
  const allRight = picks.every((p, i) => p === quiz[i].answer);

  return (
    <form onSubmit={(e) => (e.preventDefault(), onNext())}>
      <StepHeader title="Carry rules check" body="Three quick questions. Getting these right is what keeps you — and your buyers — out of trouble at the border." />
      <div className="mt-6 space-y-6">
        {quiz.map((item, i) => {
          const picked = picks[i];
          return (
            <fieldset key={item.q}>
              <legend className="font-semibold text-ink">
                {i + 1}. {item.q}
              </legend>
              <div className="mt-3 space-y-2">
                {item.options.map((opt, j) => {
                  const chosen = picked === j;
                  const right = j === item.answer;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setPicks((p) => p.map((v, k) => (k === i ? j : v)))}
                      className={`block w-full rounded-xl border px-4 py-3 text-left text-sm ${
                        chosen ? (right ? "border-emerald-500 bg-emerald-50" : "border-red-400 bg-red-50") : "border-line hover:border-brand"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <p className={`mt-2 text-sm ${picked === item.answer ? "text-emerald-700" : "text-red-700"}`}>
                  {picked === item.answer ? "Correct. " : "Not quite. "}
                  {item.why}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>
      <NextButton disabled={!allRight} />
    </form>
  );
}

function Agreement({ onNext }: { onNext: () => void }) {
  const terms = [
    "I will declare every item I carry for a buyer to US Customs, every trip.",
    "I will only buy from authorized retailers and keep items sealed in retail packaging.",
    "I will upload a receipt and a sealed-item photo for every order before handoff.",
    "I will follow airline rules for liquids and electronics, and never carry restricted items.",
    "I understand counterfeit goods or undeclared items mean permanent removal and loss of pending payouts.",
  ];
  const [checked, setChecked] = useState(terms.map(() => false));

  return (
    <form onSubmit={(e) => (e.preventDefault(), onNext())}>
      <StepHeader title="Traveler agreement" body="Plain-language commitments. Check each one to continue." />
      <div className="mt-6 space-y-2">
        {terms.map((t, i) => (
          <label key={t} className="flex cursor-pointer gap-3 rounded-xl border border-line p-4 text-sm text-ink has-[:checked]:border-brand has-[:checked]:bg-brand/5">
            <input
              type="checkbox"
              checked={checked[i]}
              onChange={(e) => setChecked((c) => c.map((v, k) => (k === i ? e.target.checked : v)))}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
            />
            {t}
          </label>
        ))}
      </div>
      <NextButton disabled={!checked.every(Boolean)}>I agree</NextButton>
    </form>
  );
}

function FirstTrip({ onNext }: { onNext: () => void }) {
  const [flight, setFlight] = useState("");
  const [found, setFound] = useState(false);
  const [file, setFile] = useState("");

  return (
    <form onSubmit={(e) => (e.preventDefault(), onNext())}>
      <StepHeader
        title="Add your next trip"
        body="We only show you requests on routes you've proven. The name on your itinerary must match your verified ID."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Flying from" name="from" placeholder="e.g. Seoul (ICN)" />
        <Field label="Landing in (US)" name="to" placeholder="e.g. Los Angeles (LAX)" />
        <Field label="Arrival date" name="arrive" type="date" />
        <label className="block text-sm font-medium text-ink">
          Return flight number
          <div className="mt-1 flex gap-2">
            <input
              required
              value={flight}
              onChange={(e) => {
                setFlight(e.target.value.toUpperCase());
                setFound(false);
              }}
              placeholder="e.g. KE017"
              className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-soft px-3 text-base font-normal outline-none focus:border-brand focus:bg-surface"
            />
            <button
              type="button"
              disabled={flight.length < 3}
              onClick={() => setFound(true)}
              className="h-11 shrink-0 rounded-xl border border-brand px-3 text-sm font-semibold text-brand disabled:opacity-40"
            >
              Check
            </button>
          </div>
          {found && <span className="mt-1 block text-xs font-normal text-emerald-700">✓ Flight {flight} found (demo)</span>}
        </label>
        <label className="block text-sm font-medium text-ink sm:col-span-2">
          Itinerary or booking confirmation
          <span className="mt-1 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-line px-4 py-6 text-center text-sm font-normal text-muted hover:border-brand">
            {file ? `📄 ${file}` : "Tap to upload a PDF or screenshot"}
            <input
              type="file"
              accept="image/*,application/pdf"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")}
            />
          </span>
          <span className="mt-1 block text-xs font-normal text-muted">Stays on your device in this demo.</span>
        </label>
      </div>
      <NextButton disabled={!found || !file}>Submit for review</NextButton>
    </form>
  );
}

function Finished() {
  const [current, ...next] = trustLevels;
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-ink p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">You&apos;re verified</p>
        <h2 className="mt-2 text-3xl font-bold">Welcome aboard. You&apos;re a {current.name} traveler.</h2>
        <p className="mt-3 text-white/70">
          Your trip is under review (usually under an hour). Once approved, you&apos;ll see requests on your route and earn{" "}
          {TRAVELER_PCT * 100}% of each item, never less than {money(TRAVELER_MIN_CENTS)} per order.
        </p>
        <div className="mt-6">
          <div className="flex justify-between text-sm text-white/70">
            <span>Progress to Trusted</span>
            <span>0 / 5 clean deliveries</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/15">
            <div className="h-full w-[3%] rounded-full bg-accent-soft" />
          </div>
        </div>
        <Link href="/travelers" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-ink">
          See requests on my route
        </Link>
      </div>

      <section>
        <h3 className="text-xl font-bold text-ink">Your limits grow as you deliver</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[current, ...next].map((lvl, i) => (
            <div key={lvl.id} className={`rounded-2xl border p-5 ${i === 0 ? "border-brand bg-brand/5" : "border-line"}`}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{lvl.name}</p>
                {i === 0 && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">You</span>}
              </div>
              <p className="mt-1 text-xs text-muted">{lvl.unlock}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink">
                {lvl.limits.map((l) => (
                  <li key={l}>• {l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-ink">On every delivery, you&apos;ll prove</h3>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {deliveryChecks.map((c, i) => (
            <li key={c.title} className="flex gap-3 rounded-2xl bg-soft p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
              <span>
                <span className="block font-semibold text-ink">{c.title}</span>
                <span className="text-sm text-muted">{c.body}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">Payout (item cost + duty + your share) is released once all four are confirmed.</p>
      </section>
    </div>
  );
}
