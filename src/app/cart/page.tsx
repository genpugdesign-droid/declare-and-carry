"use client";

import Link from "next/link";
import { linePriceCents, useCart } from "@/components/CartProvider";
import { useMembership } from "@/components/MembershipProvider";
import { ProductArt } from "@/components/ProductCard";
import { bestPack, getProduct, lineTotalCents, packNudge } from "@/lib/catalog";
import { money } from "@/lib/site";

const FREE_SHIPPING_CENTS = 3500;

export default function CartPage() {
  const { lines, subtotalCents, update, remove } = useCart();
  const { member } = useMembership();
  // Shipping only applies to US-stock lines (traveler orders are handed off or
  // mailed by the traveler). Free over $35, and always free for Charter members.
  const localSubtotal = lines.filter((l) => l.fulfillment === "local").reduce((n, l) => n + linePriceCents(l, member), 0);
  const shipping = member || localSubtotal === 0 || localSubtotal >= FREE_SHIPPING_CENTS ? 0 : 599;
  const memberSubtotal = lines.reduce((n, l) => n + linePriceCents(l, true), 0);
  const memberWouldSave = subtotalCents + shipping - memberSubtotal;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-muted">Find what you&apos;re overpaying for and get it at overseas prices.</p>
        <Link href="/#search" className="mt-6 inline-block rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark">
          Start searching
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <ul className="space-y-3 lg:col-span-2">
          {lines.map((line, i) => {
            const p = getProduct(line.slug);
            if (!p) return null;
            return (
              <li key={`${line.slug}-${line.everyMonths}-${line.fulfillment}`} className="flex gap-4 rounded-2xl border border-line p-3 sm:p-4">
                <ProductArt product={p} className="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <Link href={`/product/${p.slug}`} className="font-semibold text-ink hover:text-brand">
                      {p.name}
                    </Link>
                    <span className="shrink-0 font-semibold text-ink">{money(linePriceCents(line, member))}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {line.everyMonths > 0 ? `Auto-replace every ${line.everyMonths} mo · 5% off` : "One-time"} ·{" "}
                    {line.fulfillment === "traveler" ? `Via traveler from ${p.boughtIn}` : "US stock"}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <select
                      value={line.qty}
                      onChange={(e) => update(i, { qty: Number(e.target.value) })}
                      className="rounded-lg border border-line bg-surface px-2 py-1 text-sm"
                      aria-label="Quantity"
                    >
                      {Array.from({ length: 5 }, (_, n) => n + 1).map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                    <button onClick={() => remove(i)} className="text-sm text-muted underline hover:text-ink">
                      Remove
                    </button>
                  </div>
                  {(() => {
                    // Multi-pack prompt: one more pack spreads the traveler minimum.
                    if (line.fulfillment !== "traveler" || !packNudge(p, member)) return null;
                    const best = bestPack(p, member, line.everyMonths > 0);
                    if (line.qty >= best.qty) return null;
                    const auto = line.everyMonths > 0;
                    const nowEach = Math.round(lineTotalCents(p, "traveler", auto, line.qty, member) / line.qty);
                    const nextEach = Math.round(lineTotalCents(p, "traveler", auto, line.qty + 1, member) / (line.qty + 1));
                    return (
                      <button
                        onClick={() => update(i, { qty: line.qty + 1 })}
                        className="mt-3 block w-full border-l-4 border-emerald-600 bg-emerald-50 px-3 py-2 text-left text-xs text-ink hover:bg-emerald-100"
                      >
                        <span className="font-semibold">Add one more pack</span> and pay {money(nextEach)} each instead of{" "}
                        {money(nowEach)} (save {money(nowEach - nextEach)} per pack) →
                      </button>
                    );
                  })()}
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-2xl bg-soft p-5 lg:sticky lg:top-24">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="text-ink">{money(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-ink">{shipping ? money(shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Duty, traveler share & fees</dt>
              <dd className="text-ink">Included</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{money(subtotalCents + shipping)}</dd>
            </div>
          </dl>
          <button
            disabled
            className="mt-5 h-12 w-full rounded-xl bg-accent font-semibold text-white opacity-60"
            title="Payments are connected at launch"
          >
            Checkout (coming soon)
          </button>
          <p className="mt-2 text-center text-xs text-muted">Payments connect at launch.</p>
          {member ? (
            <p className="mt-4 border-l-4 border-accent bg-surface px-3 py-2 text-xs text-ink">
              <span className="font-semibold">Charter pricing applied.</span> No service fee, traveler minimum or shipping charge.
            </p>
          ) : (
            memberWouldSave > 0 && (
              <Link href="/membership" className="mt-4 block border-l-4 border-accent bg-surface px-3 py-2 text-xs text-ink hover:bg-brand/5">
                <span className="font-semibold">Charter members would pay {money(memberSubtotal)}</span> — save {money(memberWouldSave)} on this cart →
              </Link>
            )
          )}
        </aside>
      </div>
    </div>
  );
}
