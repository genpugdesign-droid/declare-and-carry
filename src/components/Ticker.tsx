import Link from "next/link";
import { SELLER_COMMISSION_PCT, TRAVELER_MIN_CENTS, TRAVELER_PCT } from "@/lib/catalog";
import { isSoon, launchDateLabel, money } from "@/lib/site";

const items = isSoon
  ? [
      `Opening ${launchDateLabel()}`,
      "Declared · Duty paid · Delivered",
      `Founding sellers: no listing fees · ${Math.round(SELLER_COMMISSION_PCT * 100)}% only when it sells`,
      "Founding Charter pre-sale: $49 your first year",
      `Travelers earn ${TRAVELER_PCT * 100}% · join the waitlist`,
    ]
  : [
  "Declared · Duty paid · Delivered",
  "Overseas prices on everyday goods hit by tariffs",
  "Authentic or your money back",
  "Founding Charter pre-sale: $49 your first year",
  `US shops: sell your stock here · ${Math.round(SELLER_COMMISSION_PCT * 100)}% only when it sells`,
  `Travelers earn ${TRAVELER_PCT * 100}% · never less than ${money(TRAVELER_MIN_CENTS)} per order`,
    ];

// Scrolling announcement bar: shopping benefits only. Political context lives on /why.
// The list is rendered twice so the loop is seamless;
// motion stops for people who prefer reduced motion.
export function Ticker() {
  return (
    <Link href={isSoon ? "/waitlist" : "/shop"} className="block overflow-hidden bg-ink text-white" aria-label={isSoon ? "Join the waitlist" : "Shop overseas prices"}>
      <div className="flex w-max animate-ticker py-1.5" aria-hidden>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((item) => (
              <span key={item} className="flex items-center whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.2em]">
                {item}
                <span className="ml-12 text-accent-soft">★</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </Link>
  );
}
