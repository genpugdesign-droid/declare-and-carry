// SAMPLE ORDER for the demo order-tracking and report-a-problem screens.
import { getProduct, lineTotalCents, travelers } from "./catalog";

export const AUTO_CONFIRM_HOURS = 72; // shipped orders auto-confirm after the carrier's delivery scan
export const TRAVELER_RESPONSE_HOURS = 48; // time a traveler has to answer a dispute
export const MAX_CODE_ATTEMPTS = 5;

const product = getProduct("hydrating-essence-150")!;
const traveler = travelers.find((t) => t.id === "t1")!;

export const demoOrder = {
  id: "DC-20481",
  product,
  qty: 2,
  totalCents: lineTotalCents(product, "traveler", false, 2),
  traveler,
  meetup: { place: "Union Station, Main Hall (staffed public area)", window: "Tue, Oct 20 · 6:00–8:00 pm" },
  tracking: { carrier: "USPS", number: "9400 1118 9922 3456 7890 12", deliveredAt: "Wed, Oct 21 · 2:14 pm" },
  // Steps already completed before handoff, with the proof collected at each.
  history: [
    { title: "Paid · held in escrow", when: "Oct 14", proof: "Your payment is held until you confirm delivery." },
    { title: "Traveler bought it", when: "Oct 17", proof: "Store receipt and sealed-item photo verified." },
    { title: "Declared at customs", when: "Oct 19", proof: "Customs declaration and duty receipt on file." },
  ],
};

export const problemReasons = [
  { id: "wrong", label: "Wrong item", hint: "Different product, size or model than you ordered.", needsPhoto: true },
  { id: "damaged", label: "Damaged", hint: "Crushed, leaking, cracked or otherwise unusable.", needsPhoto: true },
  { id: "unsealed", label: "Seal broken or opened", hint: "Retail packaging or safety seal wasn't intact.", needsPhoto: true },
  { id: "authenticity", label: "Doesn't look authentic", hint: "Packaging, batch code or quality doesn't match the real thing.", needsPhoto: true },
  { id: "missing", label: "Missing items", hint: "Fewer units than you paid for.", needsPhoto: true },
  { id: "never", label: "Never arrived", hint: "Traveler didn't show, or the package never came.", needsPhoto: false },
] as const;

export type ProblemReasonId = (typeof problemReasons)[number]["id"];
