"use client";

import { useState } from "react";
import { categories } from "@/lib/catalog";
import { launch, submitForm } from "@/lib/site";

// Sends to launch.forms.sellerApplication (e.g. Formspree). With no endpoint
// set it runs as a demo and nothing leaves the browser.
export function SellerApplication() {
  const [sent, setSent] = useState<"sent" | "demo" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  if (sent) {
    return (
      <div className="border-l-4 border-emerald-600 bg-emerald-50 p-5">
        <p className="font-semibold text-ink">Application received{sent === "demo" ? " (demo)" : ""}.</p>
        <p className="mt-1 text-sm text-muted">
          We review applications within 2 business days and send listing instructions by email.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const data = { ...Object.fromEntries(new FormData(e.currentTarget)), categories: picked.join(", "), form: "seller-application" };
          setSent(await submitForm(launch.forms.sellerApplication, data));
        } catch {
          setError("That didn't go through. Check your connection and try again, or email us.");
        } finally {
          setBusy(false);
        }
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
        <select id="volume" name="volume" required className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal">
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
        <input type="checkbox" name="authorized" value="yes" required className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
        I&apos;m an authorized retailer or distributor for the brands I&apos;ll list, and I can show proof.
      </label>
      {error && <p className="text-sm text-accent sm:col-span-2">{error}</p>}
      <button
        disabled={busy}
        className="h-12 rounded-xl bg-accent px-6 font-semibold text-white hover:bg-accent-dark disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
      >
        {busy ? "Sending…" : "Apply to sell"}
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
        name={id}
        required={required}
        {...input}
        className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal outline-none focus:border-brand focus:bg-surface"
      />
    </label>
  );
}
