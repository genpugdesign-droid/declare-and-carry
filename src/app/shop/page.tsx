import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "./ShopGrid";

export const metadata: Metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-ink">Shop</h1>
      <p className="mt-2 text-muted">Overseas prices, duty included. Every price is all-in.</p>
      <div className="mt-6">
        <Suspense>
          <ShopGrid />
        </Suspense>
      </div>
    </div>
  );
}
