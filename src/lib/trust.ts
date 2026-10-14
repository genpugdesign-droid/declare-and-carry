// Traveler trust levels. Limits grow with clean delivery history.
export const trustLevels = [
  {
    id: "new",
    name: "New",
    unlock: "ID verified + carry rules quiz passed",
    limits: ["Up to 3 orders per trip", "$150 total item value per trip", "Items over $60 locked"],
  },
  {
    id: "trusted",
    name: "Trusted",
    unlock: "5 clean deliveries, rating 4.7+",
    limits: ["Up to 10 orders per trip", "$600 total item value per trip", "All categories"],
  },
  {
    id: "pro",
    name: "Pro",
    unlock: "25 clean deliveries + background check",
    limits: ["Higher limits on request", "Featured in search", "Priority on new requests"],
  },
];

// What a traveler proves on every single delivery before payout.
export const deliveryChecks = [
  { title: "Store receipt", body: "From an authorized retailer, dated during your trip, in the city on your itinerary." },
  { title: "Sealed-item photo", body: "The unopened item next to a one-time code the app shows you, so the photo can't be reused." },
  { title: "Customs proof", body: "Declare everything. If CBP collects duty, upload the receipt and the duty is reimbursed in full." },
  { title: "Handoff code", body: "The buyer shows a QR code or PIN at handoff (or confirms delivery by mail). Escrow releases then." },
];

export const quiz = [
  {
    q: "You're carrying a $30 serum a buyer already paid for. At customs you:",
    options: [
      "Count it toward your personal $800 duty-free allowance",
      "Declare it as goods acquired for someone else",
      "Leave it off the form since it's under $50",
    ],
    answer: 1,
    why: "Goods bought for someone else aren't covered by your personal exemption. Declare them every time.",
  },
  {
    q: "A buyer requests a cheap, unbranded charger with no certification marks. You:",
    options: [
      "Buy it — it's cheaper for the buyer",
      "Decline — only name-brand, certified chargers are allowed",
      "Buy it if it's under $20",
    ],
    answer: 1,
    why: "Uncertified chargers are a fire risk. We only allow name-brand chargers with UL/FCC or equivalent marks, and never power banks.",
  },
  {
    q: "A request asks for a Korean SPF 50 sunscreen. You:",
    options: ["Accept — it's skin care", "Decline — sunscreens are regulated as drugs in the US", "Accept if it's under 3.4oz"],
    answer: 1,
    why: "Sunscreens are FDA-regulated OTC drugs and most foreign formulas aren't approved for US sale.",
  },
];
