"use client";

import { useState } from "react";
import { launch, submitForm } from "@/lib/site";

const roles = [
  { id: "interested", label: "Shopper", hint: "Tell me when it opens" },
  { id: "traveler", label: "Traveler", hint: "I travel and want to earn" },
  { id: "seller", label: "Seller", hint: "I have US stock to sell" },
] as const;

type RoleId = (typeof roles)[number]["id"];

// One-step sign-up for the launching-soon page: pick who you are, add an
// email, done. Posts to launch.forms.interest (falls back to the waitlist
// endpoint); with neither set it runs as a demo and nothing is collected.
export function QuickSignup({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [role, setRole] = useState<RoleId>("interested");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: people never see it, bots fill it in
  const [state, setState] = useState<"idle" | "busy" | "sent" | "demo" | "error">("idle");
  const picked = roles.find((r) => r.id === role)!;

  if (state === "sent" || state === "demo") {
    return (
      <div className="rounded-2xl bg-white p-5 text-ink sm:p-6" role="status">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">You&apos;re in{state === "demo" ? " (demo)" : ""}</p>
        <p className="mt-2 text-2xl" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
          We&apos;ll email {email} as soon as we open.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState("busy");
        try {
          const endpoint = launch.forms.interest || launch.forms.waitlist;
          setState(
            await submitForm(endpoint, { email, role, website, page: location.pathname, referrer: document.referrer, form: "quick-signup" }),
          );
        } catch {
          setState("error");
        }
      }}
      className={`relative rounded-2xl bg-white p-5 text-ink sm:p-6 ${tone === "light" ? "border border-line" : ""}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Join the waitlist</p>
      <fieldset className="mt-3">
        <legend className="text-sm font-semibold">I&apos;m a…</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => setRole(r.id)}
              aria-pressed={role === r.id}
              className={`rounded-xl border px-2 py-2.5 text-center text-sm font-semibold leading-tight ${
                role === r.id ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-brand"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{picked.hint}</p>
      </fieldset>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      <label htmlFor="quick-email" className="mt-4 block text-sm font-semibold">
        Email
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          id="quick-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-12 w-full rounded-xl border border-line bg-soft px-3 text-base outline-none focus:border-brand focus:bg-surface sm:flex-1"
        />
        <button
          disabled={state === "busy"}
          className="soon-shine h-12 w-full shrink-0 rounded-xl bg-accent px-5 font-semibold text-white hover:bg-accent-dark disabled:opacity-50 sm:w-auto"
        >
          {state === "busy" ? "Sending…" : "Count me in"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-accent">That didn&apos;t go through. Check your connection and try again.</p>}
      <p className="mt-3 text-xs text-muted">One email when we open. No spam; unsubscribe anytime.</p>
    </form>
  );
}
