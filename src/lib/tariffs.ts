// US average effective tariff rate over time. The data lives in
// src/data/tariff-points.json so the weekly update job edits data, never code
// (see scripts/tariff-update-instructions.md).
//
// Rates are Yale Budget Lab published estimates, pre-substitution (before
// shoppers change what they buy). Each point is an estimate on that date; the
// chart's line just connects them. "reason" is the justification given at the
// time, in plain language — not an endorsement or rebuttal.
import data from "@/data/tariff-points.json";

export type TariffPoint = {
  date: string; // ISO date of the estimate
  rate: number; // percent
  label: string; // short event name for the chart
  since?: string; // "highest since" year, as reported
  reason: string;
};

export const tariffPoints: TariffPoint[] = [...data.points].sort((a, b) => a.date.localeCompare(b.date));
export const tariffSources: { label: string; url: string }[] = data.sources;

// When the data was last reviewed for new estimates (even if nothing changed).
export const tariffLastChecked: string = data.lastChecked;

export function formatLongDate(d: string) {
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
