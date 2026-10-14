"use client";

import { useState } from "react";
import { categories } from "@/lib/catalog";

// Demo only: nothing is sent. At launch, point this at a form service
// (Tally, Formspree) or an API route that creates the seller record.
export function SellerApplication() {
  const [sent, setSent] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  if (sent) {
    return (
      <div className="border-l-4 border-emerald-600 bg-emerald-50 p-5">
        <p className="font-semibold text-ink">Application received (demo).</p>
        <p className="mt-1 text-sm text-muted">
          We review applications within 2 business days and send listing instructions by email.
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
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field id="biz" label="Business name" autoComplete="organization" />
      <Field id="contact" label="Your name" autoComplete="name" />
      <Field id="email" label="Work email" type="email" autoComplete="email" />
      <Field id="site" label="Website or store link" type="url" placeholder="https://" required={false} />
      <Field id="state" label="Ships from (state)" placeholder="e.g. California" />
      <label className="block text-sm font-medium text-ink" htmlFor="volume">
        Orders you could fill per week
        <select id="volume" required className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal">
          <option value="">Choose one</option>
          <option>Under 25</option>
          <option>25–100</option>
          <option>100–500</option>
          <option>500+</option>
        </select>
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium text-ink">What do you stock?</legend>
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
      <label className="flex gap-3 text-sm text-ink sm:col-span-2">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
        I&apos;m an authorized retailer or distributor for the brands I&apos;ll list, and I can show proof.
      </label>
      <button className="h-12 rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-dark sm:col-span-2 sm:justify-self-start">
        Apply to sell
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
