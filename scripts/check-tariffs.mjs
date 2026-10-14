// Validates src/data/tariff-points.json. Runs before every build so a bad
// automated (or manual) edit fails loudly instead of shipping a broken chart.
import { readFileSync } from "node:fs";

const file = new URL("../src/data/tariff-points.json", import.meta.url);
const data = JSON.parse(readFileSync(file, "utf8"));
const errors = [];
const isDate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));

if (!isDate(data.lastChecked)) errors.push(`lastChecked must be YYYY-MM-DD, got ${data.lastChecked}`);
if (!Array.isArray(data.points) || data.points.length < 2) errors.push("points must have at least 2 entries");

const seen = new Set();
let prev = "";
for (const [i, p] of (data.points ?? []).entries()) {
  const at = `points[${i}] (${p.date})`;
  if (!isDate(p.date)) errors.push(`${at}: date must be YYYY-MM-DD`);
  if (seen.has(p.date)) errors.push(`${at}: duplicate date`);
  if (p.date < prev) errors.push(`${at}: dates must be in ascending order`);
  if (typeof p.rate !== "number" || p.rate < 0 || p.rate > 100) errors.push(`${at}: rate must be a percent between 0 and 100`);
  if (!p.label?.trim()) errors.push(`${at}: label is required`);
  if (!p.reason?.trim()) errors.push(`${at}: reason is required`);
  if (p.since !== undefined && !/^\d{4}$/.test(p.since)) errors.push(`${at}: since must be a 4-digit year`);
  if (isDate(p.date) && p.date > data.lastChecked) errors.push(`${at}: date is after lastChecked`);
  seen.add(p.date);
  prev = p.date;
}

for (const [i, s] of (data.sources ?? []).entries()) {
  if (!s.label?.trim() || !/^https:\/\//.test(s.url ?? "")) errors.push(`sources[${i}]: needs a label and an https url`);
}

if (errors.length) {
  console.error("tariff-points.json is invalid:\n  - " + errors.join("\n  - "));
  process.exit(1);
}
console.log(`tariff-points.json OK: ${data.points.length} points, latest ${prev}, checked ${data.lastChecked}`);
