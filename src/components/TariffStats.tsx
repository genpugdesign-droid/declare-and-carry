import { tariffPoints } from "@/lib/tariffs";

const start = tariffPoints[0];
const now = tariffPoints[tariffPoints.length - 1];
const peak = tariffPoints.reduce((a, b) => (b.rate > a.rate ? b : a));

const stats = [
  { value: `${peak.rate}%`, label: `Peak average tariff, April 2025 — the highest since ${peak.since}` },
  { value: `${(now.rate / start.rate).toFixed(1)}×`, label: `Today's average tariff (${now.rate}%) vs. January 2025 (${start.rate}%)` },
  { value: "$0", label: "Duty-free allowance left for small packages from abroad. It used to be $800." },
];

// Stat tiles with a red rule on the left edge.
export function TariffStats({ dark = false, stacked = false }: { dark?: boolean; stacked?: boolean }) {
  return (
    <dl className={`grid gap-3 ${stacked ? "" : "sm:grid-cols-3"}`}>
      {stats.map((s) => (
        <div
          key={s.label}
          className={`flex flex-col-reverse justify-end gap-1 border-l-4 border-accent px-4 py-3 ${dark ? "bg-white/5" : "bg-soft"}`}
        >
          <dt className={`text-sm ${dark ? "text-white/70" : "text-muted"}`}>{s.label}</dt>
          <dd className={`text-4xl font-semibold ${dark ? "text-white" : "text-ink"}`}>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
