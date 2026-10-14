"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, lineTotalCents, type Fulfillment } from "@/lib/catalog";
import { useMembership } from "./MembershipProvider";

export type { Fulfillment };

export type CartLine = {
  slug: string;
  qty: number;
  // 0 = one-time purchase; otherwise auto-replace every N months.
  everyMonths: number;
  fulfillment: Fulfillment;
};

type CartState = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  add: (line: CartLine) => void;
  update: (index: number, patch: Partial<CartLine>) => void;
  remove: (index: number) => void;
};

const CartContext = createContext<CartState | null>(null);
const KEY = "declareandcarry-cart-v1";

export function linePriceCents(line: CartLine, member = false) {
  const p = getProduct(line.slug);
  if (!p) return 0;
  return lineTotalCents(p, line.fulfillment, line.everyMonths > 0, line.qty, member);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { member } = useMembership();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, loaded]);

  const value = useMemo<CartState>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotalCents: lines.reduce((n, l) => n + linePriceCents(l, member), 0),
      add: (line) =>
        setLines((prev) => {
          const i = prev.findIndex(
            (l) => l.slug === line.slug && l.everyMonths === line.everyMonths && l.fulfillment === line.fulfillment,
          );
          if (i === -1) return [...prev, line];
          const next = [...prev];
          next[i] = { ...next[i], qty: next[i].qty + line.qty };
          return next;
        }),
      update: (index, patch) =>
        setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l))),
      remove: (index) => setLines((prev) => prev.filter((_, i) => i !== index)),
    }),
    [lines, member],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
