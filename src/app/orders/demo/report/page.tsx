import type { Metadata } from "next";
import Link from "next/link";
import { demoOrder } from "@/lib/orders";
import { ReportForm } from "./ReportForm";

export const metadata: Metadata = { title: "Report a problem" };

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/orders/demo" className="text-sm text-muted hover:text-ink">
        ← Order {demoOrder.id}
      </Link>
      <h1 className="mt-3 text-4xl text-ink sm:text-5xl">Report a problem</h1>
      <p className="mt-2 text-muted">
        {demoOrder.product.name} × {demoOrder.qty} from {demoOrder.traveler.name}
      </p>
      <p className="mt-3 inline-block rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
        Demo — nothing you enter leaves this browser.
      </p>
      <div className="mt-8">
        <ReportForm />
      </div>
    </div>
  );
}
