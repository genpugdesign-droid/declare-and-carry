"use client";

import { useState } from "react";
import { TRAVELER_MIN_CENTS, TRAVELER_PCT, categories } from "@/lib/catalog";
import { money } from "@/lib/site";

type Role = "carry" | "receive";

// Demo only: nothing is sent. At launch, point this at a form service (Tally)
// or an API route that stores the signup.
export function WaitlistForm() {
  const [role, setRole] = useState<Role>("carry");
  const [picked, setPicked] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border-l-4 border-emerald-600 bg-emerald-50 p-5" role="status">
        <p className="font-semibold text-ink">You&apos;re on the list (demo).</p>
        <p className="mt-1 text-sm text-muted">
          {role === "carry"
            ? "We'll email you when traveler delivery opens on your route, with the verification steps to start earning."
            : "We'll email you when travelers start carrying on your route, plus first access to their trips."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="space-y-6"
    >
      <fieldset>
        <legend className="text-sm font-semibold text-ink">I want to…</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(
            [
              ["carry", "Carry and earn", `Earn ${TRAVELER_PCT * 100}% of each item, never less than ${money(TRAVELER_MIN_CENTS)} an order.`],
              ["receive", "Get items brought to me", "Overseas prices, declared and duty paid, delivered near you."],
            ] as const
          ).map(([id, title, body]) => (
            <label
              key={id}
              className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${role === id ? "border-brand bg-brand/5" : "border-line hover:border-brand"}`}
            >
              <input type="radio" name="role" checked={role === id} onChange={() => setRole(id)} className="mt-1 h-4 w-4 shrink-0 accent-brand" />
              <span>
                <span className="block font-semibold text-ink">{title}</span>
                <span className="text-sm text-muted">{body}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="wl-name" label="Name" autoComplete="name" />
        <Field id="wl-email" label="Email" type="email" autoComplete="email" />
        <Field id="wl-city" label="Your city" placeholder="e.g. Queens, NY" />
        {role === "carry" ? (
          <Field id="wl-route" label="Where do you travel often?" placeholder="e.g. Seoul, Tokyo, Hong Kong" />
        ) : (
          <Field id="wl-want" label="What do you want brought over?" placeholder="e.g. a specific serum or charger" required={false} />
        )}
        {role === "carry" && (
          <label htmlFor="wl-freq" className="block text-sm font-medium text-ink sm:col-span-2">
            How often do you fly internationally?
            <select id="wl-freq" required className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal">
              <option value="">Choose one</option>
              <option>A few times a year</option>
              <option>Monthly</option>
              <option>Several times a month</option>
            </select>
          </label>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-ink">{role === "carry" ? "Happy to carry" : "Interested in"}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = picked.includes(c.id);
            return (
              <label
                key={c.id}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${on ? "border-brand bg-brand text-white" : "border-line text-ink hover:border-brand"}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={on}
                  onChange={() => setPicked((p) => (on ? p.filter((x) => x !== c.id) : [...p, c.id]))}
                />
                {c.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <button className="h-12 w-full rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-dark sm:w-auto">
        Join the waitlist
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  required = true,
  ...input
}: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={id} className="block text-sm font-medium text-ink">
      {label}
      <input
        id={id}
        required={required}
        {...input}
        className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal outline-none focus:border-brand focus:bg-surface"
      />
    </label>
  );
}
