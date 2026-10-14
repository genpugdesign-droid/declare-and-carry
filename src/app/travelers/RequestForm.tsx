"use client";

import { useState } from "react";

// Demo only: no backend yet. Wire to a form service or API route at launch.
export function RequestForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl bg-emerald-50 p-6 text-emerald-800">
        <p className="font-semibold">Request posted (demo).</p>
        <p className="mt-1 text-sm">Travelers heading your way will send offers with the total price, duty included.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="grid gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-2"
    >
      <Field label="Product (brand, name or model)" name="item" placeholder="e.g. Ceramide cream 50ml" className="sm:col-span-2" />
      <Field label="Your city" name="city" placeholder="e.g. Chicago, IL" />
      <Field label="Needed by" name="by" type="date" />
      <Field label="Quantity" name="qty" type="number" placeholder="1" />
      <Field label="Max total budget (USD)" name="budget" type="number" placeholder="40" />
      <button className="h-12 rounded-xl bg-accent font-semibold text-white hover:bg-accent-dark sm:col-span-2">
        Post request
      </button>
    </form>
  );
}

function Field({
  label,
  className = "",
  ...input
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block text-sm font-medium text-ink ${className}`}>
      {label}
      <input
        required
        {...input}
        className="mt-1 h-11 w-full rounded-xl border border-line bg-soft px-3 text-base font-normal outline-none focus:border-brand focus:bg-surface"
      />
    </label>
  );
}
