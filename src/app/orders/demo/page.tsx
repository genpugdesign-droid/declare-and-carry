import { OpeningSoon } from "@/components/ComingSoon";
import { isSoon } from "@/lib/site";
import type { Metadata } from "next";
import { demoOrder } from "@/lib/orders";
import { OrderTracker } from "./OrderTracker";

export const metadata: Metadata = { title: `Order ${demoOrder.id}` };

export default function OrderPage() {
  if (isSoon) return <OpeningSoon />;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl text-ink sm:text-5xl">Your order</h1>
      <p className="mt-2 text-muted">Track your delivery and confirm when it arrives.</p>
      <div className="mt-8">
        <OrderTracker />
      </div>
    </div>
  );
}
