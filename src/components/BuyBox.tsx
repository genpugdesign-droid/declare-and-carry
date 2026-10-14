"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AUTO_DISCOUNT, TRAVELER_MIN_CENTS, bestPack, breakdown, lineTotalCents, packNudge, packPrices, type Fulfillment, type Product } from "@/lib/catalog";
import { money } from "@/lib/site";
import { useCart } from "./CartProvider";
import { useMembership } from "./MembershipProvider";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const { member } = useMembership();
  const consumable = !!product.replaceEveryMonths;
  const [auto, setAuto] = useState(consumable);
  const [every, setEvery] = useState(product.replaceEveryMonths ?? 3);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("traveler");
  const [qty, setQty] = useState(1);
  const [qtyTouched, setQtyTouched] = useState(false);
  const [added, setAdded] = useState(false);

  // Default to 2 packs where the traveler minimum makes single packs poor value.
  const nudge = fulfillment === "traveler" && packNudge(product, member);
  useEffect(() => {
    if (!qtyTouched) setQty(nudge ? 2 : 1);
  }, [nudge, qtyTouched]);
  const chooseQty = (q: number) => {
    setQtyTouched(true);
    setQty(q);
  };
  const packs = packPrices(product, member, auto);
  const best = bestPack(product, member, auto);

  const lineTotal = lineTotalCents(product, fulfillment, auto, qty, member);
  // What joining would save on this exact selection (traveler orders only).
  const memberSaves = lineTotal - lineTotalCents(product, fulfillment, auto, qty, true);
  const intervals = Array.from(new Set([1, 2, 3, 4, 6, 12, 24, product.replaceEveryMonths ?? 3])).sort((a, b) => a - b);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">Delivery</legend>
        <div className={`mt-2 grid gap-2 ${product.localCents ? "grid-cols-2" : "grid-cols-1"}`}>
          <Choice on={fulfillment === "traveler"} onClick={() => setFulfillment("traveler")}>
            <span className="block font-medium text-ink">Via traveler · {money(lineTotalCents(product, "traveler", false, 1, member))}</span>
            <span className="text-xs text-muted">{product.travelerOffers} on route from {product.boughtIn}</span>
          </Choice>
          {product.localCents && (
            <Choice on={fulfillment === "local"} onClick={() => setFulfillment("local")}>
              <span className="block font-medium text-ink">US stock · {money(product.localCents)}</span>
              <span className="text-xs text-muted">Ships in 2–4 days</span>
            </Choice>
          )}
        </div>
      </fieldset>

      {consumable && (
        <fieldset className="mt-5 space-y-2">
          <legend className="mb-2 text-sm font-semibold text-ink">Purchase</legend>
          <Choice on={auto} onClick={() => setAuto(true)}>
            <span className="flex justify-between gap-2 text-sm font-semibold text-ink">
              Auto-replace · save {AUTO_DISCOUNT * 100}%
              <span>{money(lineTotalCents(product, fulfillment, true, 1, member))}</span>
            </span>
            <span className="mt-1 block text-xs text-muted">Price locked. Reminder before each order — skip or delay in one tap.</span>
          </Choice>
          {auto && (
            <label className="ml-1 flex items-center gap-2 text-sm text-muted">
              Every
              <select
                value={every}
                onChange={(e) => setEvery(Number(e.target.value))}
                className="rounded-lg border border-line bg-soft px-2 py-1 text-ink"
              >
                {intervals.map((m) => (
                  <option key={m} value={m}>
                    {m} month{m > 1 ? "s" : ""}
                    {m === product.replaceEveryMonths ? " (recommended)" : ""}
                  </option>
                ))}
              </select>
            </label>
          )}
          <Choice on={!auto} onClick={() => setAuto(false)}>
            <span className="flex justify-between gap-2 text-sm font-semibold text-ink">
              One-time purchase
              <span>{money(lineTotalCents(product, fulfillment, false, 1, member))}</span>
            </span>
          </Choice>
        </fieldset>
      )}

      {nudge && (
        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-ink">Buy more, pay less per pack</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {packs.map((o) => (
              <button
                key={o.qty}
                onClick={() => chooseQty(o.qty)}
                aria-pressed={qty === o.qty}
                className={`relative rounded-xl border p-2.5 text-left text-sm ${qty === o.qty ? "border-brand bg-brand/5" : "border-line hover:border-brand"}`}
              >
                {o.qty === best.qty && o.qty > 1 && (
                  <span className="absolute -top-2 right-2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    Best value
                  </span>
                )}
                <span className="block font-semibold text-ink">
                  {o.qty} pack{o.qty > 1 ? "s" : ""}
                </span>
                <span className="block text-ink">{money(o.each)} each</span>
                <span className="text-xs text-emerald-700">{o.savingsPct}% under US</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-12 items-center rounded-xl border border-line">
          <button className="h-full w-10 text-lg" onClick={() => chooseQty(Math.max(1, qty - 1))} aria-label="Decrease">
            −
          </button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <button className="h-full w-10 text-lg" onClick={() => chooseQty(Math.min(5, qty + 1))} aria-label="Increase">
            +
          </button>
        </div>
        <button
          onClick={() => {
            add({ slug: product.slug, qty, everyMonths: auto ? every : 0, fulfillment });
            setAdded(true);
          }}
          className="h-12 flex-1 rounded-xl bg-accent font-semibold text-white transition hover:bg-accent-dark"
        >
          Add · {money(lineTotal)}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted">
        {fulfillment === "traveler" && breakdown(product, 1, member).travelerIsMin && (
          <>Travelers earn at least {money(TRAVELER_MIN_CENTS)} per order line, so adding more units lowers the price per item. </>
        )}
        Max 5 per order so travelers stay within personal-carry quantities.
      </p>
      {member ? (
        <p className="mt-3 border-l-4 border-accent bg-soft px-3 py-2 text-xs text-ink">
          <span className="font-semibold">Charter price.</span> No service fee or traveler minimum.
        </p>
      ) : (
        memberSaves > 0 && (
          <Link href="/membership" className="mt-3 block border-l-4 border-accent bg-soft px-3 py-2 text-xs text-ink hover:bg-brand/5">
            <span className="font-semibold">Save {money(memberSaves)} on this order</span> with Charter membership →
          </Link>
        )
      )}
      {added && (
        <p className="mt-3 text-sm text-emerald-700">
          Added to cart.{" "}
          <Link href="/cart" className="font-medium underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full gap-3 rounded-xl border p-3 text-left text-sm ${on ? "border-brand bg-brand/5" : "border-line"}`}
    >
      <span
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 ${on ? "border-brand bg-brand shadow-[inset_0_0_0_3px_white]" : "border-line"}`}
      />
      <span className="flex-1">{children}</span>
    </button>
  );
}
