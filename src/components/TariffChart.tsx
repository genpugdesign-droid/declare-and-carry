"use client";

import { useEffect, useRef, useState } from "react";
import { formatLongDate, tariffLastChecked, tariffPoints, type TariffPoint } from "@/lib/tariffs";

// Single-series line chart of the US average effective tariff rate.
// Hover (or tap / keyboard-focus) a point for the date, rate and stated reason.

const M = { top: 28, right: 52, bottom: 36, left: 40 };
const Y_MAX = 30;
const LINE = "#2a56ad"; // validated: passes lightness, chroma and contrast on white

const t = (d: string) => new Date(d + "T00:00:00Z").getTime();
const X0 = t("2025-01-01");
const X1 = t("2026-09-30");

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const fmtRate = (r: number) => `${r.toFixed(1)}%`;

const xTicks = [
  { d: "2025-01-01", label: "Jan 2025" },
  { d: "2025-07-01", label: "Jul 2025" },
  { d: "2026-01-01", label: "Jan 2026" },
  { d: "2026-07-01", label: "Jul 2026" },
];

export function TariffChart({ points = tariffPoints }: { points?: TariffPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLElement>(null);

  // Draw at the real pixel width so text stays 12–13px on phones instead of
  // shrinking with a scaled viewBox.
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = Math.round(Math.min(340, Math.max(240, W * 0.5)));
  const narrow = W < 480;
  const x = (d: string) => M.left + ((t(d) - X0) / (X1 - X0)) * (W - M.left - M.right);
  const y = (r: number) => M.top + (1 - r / Y_MAX) * (H - M.top - M.bottom);
  const ticks = narrow ? xTicks.filter((_, i) => i % 2 === 0) : xTicks;

  const peak = points.reduce((best, p, i) => (p.rate > points[best].rate ? i : best), 0);
  const last = points.length - 1;
  const linePath = points.map((p, i) => `${i ? "L" : "M"}${x(p.date)},${y(p.rate)}`).join("");
  const areaPath = `${linePath}L${x(points[last].date)},${y(0)}L${x(points[0].date)},${y(0)}Z`;

  // Nearest point by x, so the whole plot is the hover target, not just the dots.
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    let best = 0;
    points.forEach((p, i) => {
      if (Math.abs(x(p.date) - px) < Math.abs(x(points[best].date) - px)) best = i;
    });
    setActive(best);
  };

  const a = active !== null ? points[active] : null;
  const leftPct = a ? (x(a.date) / W) * 100 : 0;
  const topPct = a ? (y(a.rate) / H) * 100 : 0;

  return (
    <figure ref={boxRef} className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-pan-y select-none"
        role="img"
        aria-label={`US average effective tariff rate rose from ${fmtRate(points[0].rate)} in January 2025 to a peak of ${fmtRate(points[peak].rate)} in April 2025, and was ${fmtRate(points[last].rate)} as of August 2026.`}
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
      >
        {/* Gridlines + y ticks */}
        {[0, 10, 20, 30].map((v) => (
          <g key={v}>
            <line x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth={1} />
            <text x={M.left - 8} y={y(v)} dy="0.32em" textAnchor="end" className="fill-muted text-[12px] tabular-nums">
              {v}%
            </text>
          </g>
        ))}
        {/* X ticks */}
        {ticks.map((tk) => (
          <text key={tk.d} x={x(tk.d)} y={H - M.bottom + 22} textAnchor="middle" className="fill-muted text-[12px]">
            {tk.label}
          </text>
        ))}

        <path d={areaPath} fill={LINE} fillOpacity={0.1} />
        <path d={linePath} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Crosshair */}
        {a && <line x1={x(a.date)} x2={x(a.date)} y1={M.top} y2={y(0)} stroke="var(--muted)" strokeWidth={1} opacity={0.5} />}

        {/* Markers: 2px surface ring; bigger invisible hit target for keyboard/tap */}
        {points.map((p, i) => (
          <g key={p.date}>
            <circle cx={x(p.date)} cy={y(p.rate)} r={active === i ? 6 : 4} fill={LINE} stroke="white" strokeWidth={2} />
            <circle
              cx={x(p.date)}
              cy={y(p.rate)}
              r={14}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${fmtDate(p.date)}: ${fmtRate(p.rate)}. ${p.label}.`}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="outline-none focus-visible:stroke-accent focus-visible:stroke-2"
            />
          </g>
        ))}

        {/* Selective direct labels: start, peak, latest (text in ink tokens, never the series color) */}
        <text x={x(points[0].date) + 10} y={y(points[0].rate) - 10} className="fill-ink text-[13px] font-semibold">
          {fmtRate(points[0].rate)}
        </text>
        <text x={x(points[peak].date) + 12} y={y(points[peak].rate) + 4} className="fill-ink text-[13px] font-semibold">
          {fmtRate(points[peak].rate)}
          {!narrow && <tspan className="fill-muted font-normal"> · highest since {points[peak].since}</tspan>}
        </text>
        <text x={x(points[last].date) + 10} y={y(points[last].rate) + 4} className="fill-ink text-[13px] font-semibold">
          {fmtRate(points[last].rate)}
        </text>
      </svg>

      {a && (
        // Floating tooltip on wide screens; on phones it docks below the plot so it never runs off-screen.
        <div
          className={
            narrow
              ? "mt-2 rounded-md border border-line bg-soft p-3 text-left"
              : "pointer-events-none absolute z-10 w-64 max-w-[80%] rounded-md border border-line bg-surface p-3 text-left shadow-lg"
          }
          style={
            narrow
              ? undefined
              : {
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(${leftPct > 55 ? "calc(-100% - 12px)" : "12px"}, ${topPct > 50 ? "calc(-100% - 8px)" : "8px"})`,
                }
          }
        >
          <p className="text-xs text-muted">{fmtDate(a.date)}</p>
          <p className="mt-0.5 text-lg font-semibold text-ink">
            {fmtRate(a.rate)}
            {a.since && <span className="ml-1 text-xs font-normal text-muted">highest since {a.since}</span>}
          </p>
          <p className="mt-1 text-sm font-semibold text-ink">{a.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{a.reason}</p>
        </div>
      )}
      <figcaption className="mt-2 text-xs text-muted">
        Average effective US tariff rate on imports. Hover or tap a point for what changed and why.
        <span className="mt-1 block">
          Latest estimate {formatLongDate(points[last].date)} · checked for updates {formatLongDate(tariffLastChecked)}
        </span>
      </figcaption>
    </figure>
  );
}
