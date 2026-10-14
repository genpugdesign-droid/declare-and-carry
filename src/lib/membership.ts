// Charter membership: the recurring-revenue plan. Members pay no service fee
// and never see the traveler minimum.
import { SERVICE_PCT, TRAVELER_MIN_CENTS, TRAVELER_PCT } from "./catalog";
import { money } from "./site";

export const MEMBERSHIP_NAME = "Charter";

// Founding Charter pre-sale for launch. PLACEHOLDERS: the $49 price and the
// 500-member cap are judgment calls, not benchmarked. No live "spots left"
// counter until there's a real member count to show.
export const FOUNDING_CAP = 500;

export const plans = {
  founding: {
    id: "founding",
    label: "Founding",
    priceCents: 4900,
    per: "first year",
    billed: "First year at $49, then $59/year. Limited to the first 500 members. Cancel anytime.",
  },
  monthly: { id: "monthly", label: "Monthly", priceCents: 799, per: "month", billed: "Billed monthly. Cancel anytime." },
  yearly: { id: "yearly", label: "Yearly", priceCents: 5900, per: "year", billed: "Billed once a year. Cancel anytime." },
} as const;

export type PlanId = keyof typeof plans;

export const yearlySavingsPct = Math.round((1 - plans.yearly.priceCents / (plans.monthly.priceCents * 12)) * 100);

export const perks = [
  { title: "No service fee", body: `Skip the ${SERVICE_PCT * 100}% service & protection fee on every traveler order.` },
  { title: "No traveler minimum", body: `Travelers still earn at least ${money(TRAVELER_MIN_CENTS)} an order — we cover it, not you.` },
  { title: "First pick of travelers", body: "See new trips on popular routes 24 hours before everyone else." },
  { title: "Price-lock alerts", body: "Get pinged when something on your list drops below the US price by your target." },
  { title: "Free US-stock shipping", body: "No shipping charge on orders that ship from US sellers." },
  { title: "Priority support", body: "Problem reports from members are reviewed first." },
];

// Rough yearly fees a member avoids, for the savings calculator: the service
// fee plus any traveler-minimum top-up, on traveler-delivered orders.
export function yearlyFeesAvoidedCents(ordersPerMonth: number, avgItemCents: number) {
  const perOrder = Math.round(avgItemCents * SERVICE_PCT) + Math.max(0, TRAVELER_MIN_CENTS - Math.round(avgItemCents * TRAVELER_PCT));
  return perOrder * ordersPerMonth * 12;
}
