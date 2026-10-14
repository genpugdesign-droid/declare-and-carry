// SAMPLE DATA — placeholder products, prices, duty rates, sellers and travelers.
// Duty rates are illustrative estimates; confirm real HTS rates by country of
// origin before launch. Replace with real listings.
//
// Launch focus: recurring, tariff-hit categories with lighter regulation.
// Travelers are the core channel; a few items also have US-stock sellers.

export type Category = "skincare" | "chargers" | "basics" | "stationery" | "pet";

export const categories: { id: Category; label: string; blurb: string; rule: string }[] = [
  {
    id: "skincare",
    label: "Skin care",
    blurb: "K-beauty, J-beauty, EU pharmacy",
    rule: "Sealed, name-brand products from authorized sellers only. No sunscreens, acne treatments or other drug products. Liquids travel in checked bags.",
  },
  {
    id: "chargers",
    label: "Chargers & cables",
    blurb: "GaN chargers, cables, car & wireless",
    rule: "Name-brand chargers and cables with UL/FCC or equivalent certification only. No power banks or loose batteries.",
  },
  {
    id: "basics",
    label: "Everyday basics",
    blurb: "Socks, undershirts, essentials",
    rule: "New, tagged, name-brand adult basics with fiber-content labels. No children's clothing or sleepwear.",
  },
  {
    id: "stationery",
    label: "Office & school supplies",
    blurb: "Pens, refills, notebooks",
    rule: "Adult and office supplies in sealed retail packs only. No children's art supplies or toys.",
  },
  {
    id: "pet",
    label: "Pet consumables",
    blurb: "Waste bags, pads, wipes",
    rule: "Non-food pet consumables only. No pet food, treats, medications, or flea and tick products.",
  },
];

export type Product = {
  slug: string;
  name: string;
  category: Category;
  madeIn: string; // country of origin — this, not where it's bought, sets the duty
  boughtIn: string; // where travelers pick it up
  usRetailCents: number; // typical US shelf price today
  // Amazon's price for the same item and the date someone checked it. The
  // "less than Amazon" badge only shows while the check is recent and we're
  // actually cheaper (see amazonCompare). SAMPLE values below: replace with
  // real, screenshotted checks before launch.
  amazon?: { cents: number; checked: string };
  abroadCents: number; // overseas shelf price, converted
  dutyRate: number; // estimated US duty on declared value
  localCents?: number; // price if an authorized US seller has stock
  seller?: string; // the US shop or distributor that ships it
  replaceEveryMonths?: number; // consumables only; enables auto-replace
  fits?: string[]; // model numbers, for filters
  spec?: string;
  rating: number;
  reviews: number;
  travelerOffers: number;
  swatch: string; // tailwind gradient classes for placeholder art
};

// How each traveler-delivered price is built. Travelers earn a share of the
// item's purchase price, never less than a flat minimum per order line (so a
// cheap item is still worth carrying). Non-members pay a service & protection
// fee; Charter members pay no fee, and the platform covers any top-up to the
// traveler minimum for them, so travelers are always paid in full.
export const TRAVELER_PCT = 0.15;
export const TRAVELER_MIN_CENTS = 500;
export const SERVICE_PCT = 0.08;

// Commission on US-stock sales by business sellers. No listing or monthly fees.
export const SELLER_COMMISSION_PCT = 0.12;

export function breakdown(p: Product, qty = 1, member = false) {
  const item = p.abroadCents * qty;
  const duty = Math.round(item * p.dutyRate);
  const share = Math.round(item * TRAVELER_PCT);
  const travelerPaid = Math.max(share, TRAVELER_MIN_CENTS); // what the traveler receives
  const traveler = member ? share : travelerPaid; // what the buyer pays toward it
  const travelerIsMin = !member && share < TRAVELER_MIN_CENTS;
  const fee = member ? 0 : Math.round(item * SERVICE_PCT);
  const total = item + duty + traveler + fee;
  const usRetail = p.usRetailCents * qty;
  const savings = usRetail - total;
  return { item, duty, traveler, travelerPaid, travelerIsMin, fee, total, savings, savingsPct: Math.round((savings / usRetail) * 100) };
}

export const products: Product[] = [
  {
    slug: "hydrating-essence-150",
    name: "Hydrating Essence 150ml",
    category: "skincare",
    madeIn: "South Korea",
    boughtIn: "Seoul",
    usRetailCents: 2500,
    amazon: { cents: 2500, checked: "2026-10-14" },
    abroadCents: 1300,
    dutyRate: 0.15,
    replaceEveryMonths: 3,
    rating: 4.8,
    reviews: 2140,
    travelerOffers: 6,
    swatch: "from-rose-100 to-orange-50",
  },
  {
    slug: "rice-toner-150",
    name: "Rice Brightening Toner 150ml",
    category: "skincare",
    madeIn: "South Korea",
    boughtIn: "Seoul",
    usRetailCents: 2200,
    amazon: { cents: 2200, checked: "2026-10-14" },
    abroadCents: 1100,
    dutyRate: 0.15,
    replaceEveryMonths: 3,
    rating: 4.7,
    reviews: 1310,
    travelerOffers: 5,
    swatch: "from-amber-50 to-rose-50",
  },
  {
    slug: "cleansing-balm-100",
    name: "Cleansing Balm 100ml",
    category: "skincare",
    madeIn: "South Korea",
    boughtIn: "Seoul",
    usRetailCents: 2000,
    amazon: { cents: 2000, checked: "2026-10-14" },
    abroadCents: 1100,
    dutyRate: 0.15,
    replaceEveryMonths: 2,
    rating: 4.8,
    reviews: 1655,
    travelerOffers: 4,
    swatch: "from-orange-50 to-amber-100",
  },
  {
    slug: "sheet-masks-10",
    name: "Hydrating Sheet Masks (10-Pack)",
    category: "skincare",
    madeIn: "South Korea",
    boughtIn: "Seoul",
    usRetailCents: 2500,
    amazon: { cents: 2500, checked: "2026-10-14" },
    abroadCents: 1000,
    dutyRate: 0.15,
    replaceEveryMonths: 1,
    rating: 4.6,
    reviews: 2890,
    travelerOffers: 5,
    swatch: "from-sky-50 to-rose-50",
  },
  {
    slug: "ceramide-cream-50",
    name: "Ceramide Barrier Cream 50ml",
    category: "skincare",
    madeIn: "Japan",
    boughtIn: "Tokyo",
    usRetailCents: 3200,
    amazon: { cents: 3200, checked: "2026-10-14" },
    abroadCents: 1700,
    dutyRate: 0.15,
    replaceEveryMonths: 2,
    rating: 4.8,
    reviews: 876,
    travelerOffers: 3,
    swatch: "from-sky-50 to-indigo-100",
  },
  {
    slug: "retinal-serum-30",
    name: "Retinal Night Serum 30ml",
    category: "skincare",
    madeIn: "France",
    boughtIn: "Paris",
    usRetailCents: 4800,
    amazon: { cents: 4800, checked: "2026-10-14" },
    abroadCents: 2800,
    dutyRate: 0.15,
    localCents: 4500,
    seller: "Sample Pharmacy (example) · Chicago, IL",
    replaceEveryMonths: 2,
    rating: 4.6,
    reviews: 512,
    travelerOffers: 2,
    swatch: "from-violet-100 to-fuchsia-50",
  },
  {
    slug: "gan-65w-3port",
    name: "65W GaN 3-Port Charger",
    category: "chargers",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 4500,
    amazon: { cents: 4500, checked: "2026-10-14" },
    abroadCents: 2600,
    dutyRate: 0.25,
    localCents: 4200,
    seller: "Sample Mobile Shop (example) · New York, NY",
    spec: "2× USB-C, 1× USB-A · foldable US plug · UL listed",
    rating: 4.8,
    reviews: 3020,
    travelerOffers: 4,
    swatch: "from-slate-200 to-zinc-100",
  },
  {
    slug: "gan-30w-compact",
    name: "30W Compact USB-C Charger",
    category: "chargers",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 2500,
    amazon: { cents: 2500, checked: "2026-10-14" },
    abroadCents: 1300,
    dutyRate: 0.25,
    spec: "Foldable plug · fast-charges phones and tablets · UL listed",
    rating: 4.7,
    reviews: 2410,
    travelerOffers: 4,
    swatch: "from-zinc-100 to-slate-200",
  },
  {
    slug: "usbc-240w-2pack",
    name: "USB-C 240W Braided Cable (2-Pack)",
    category: "chargers",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 1900,
    amazon: { cents: 1900, checked: "2026-10-14" },
    abroadCents: 900,
    dutyRate: 0.25,
    replaceEveryMonths: 12,
    spec: "2m · e-marker chip · 40Gbps",
    rating: 4.7,
    reviews: 1880,
    travelerOffers: 4,
    swatch: "from-zinc-200 to-stone-100",
  },
  {
    slug: "usbc-lightning-2pack",
    name: "USB-C to Lightning Cable (2-Pack)",
    category: "chargers",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 1900,
    amazon: { cents: 1900, checked: "2026-10-14" },
    abroadCents: 900,
    dutyRate: 0.25,
    replaceEveryMonths: 12,
    spec: "1m · MFi certified",
    rating: 4.6,
    reviews: 1342,
    travelerOffers: 3,
    swatch: "from-stone-100 to-zinc-200",
  },
  {
    slug: "car-charger-45w",
    name: "45W Dual USB-C Car Charger",
    category: "chargers",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 2200,
    amazon: { cents: 2200, checked: "2026-10-14" },
    abroadCents: 1100,
    dutyRate: 0.25,
    spec: "Two USB-C ports · fits any 12V socket",
    rating: 4.6,
    reviews: 904,
    travelerOffers: 2,
    swatch: "from-slate-100 to-sky-100",
  },
  {
    slug: "wireless-pad-15w",
    name: "15W Magnetic Wireless Charger",
    category: "chargers",
    madeIn: "Japan",
    boughtIn: "Tokyo",
    usRetailCents: 3500,
    amazon: { cents: 3500, checked: "2026-10-14" },
    abroadCents: 1800,
    dutyRate: 0.15,
    localCents: 3200,
    seller: "Sample Gadget Shop (example) · San Jose, CA",
    spec: "Qi2 certified · includes USB-C cable",
    rating: 4.5,
    reviews: 640,
    travelerOffers: 2,
    swatch: "from-gray-100 to-sky-100",
  },
  {
    slug: "merino-socks-3",
    name: "Merino Crew Socks (3-Pack)",
    category: "basics",
    madeIn: "Japan",
    boughtIn: "Tokyo",
    usRetailCents: 2400,
    amazon: { cents: 2400, checked: "2026-10-14" },
    abroadCents: 1200,
    dutyRate: 0.25,
    replaceEveryMonths: 6,
    spec: "Wool blend · sizes S–L",
    rating: 4.8,
    reviews: 1520,
    travelerOffers: 3,
    swatch: "from-stone-100 to-amber-50",
  },
  {
    slug: "cotton-undershirts-3",
    name: "Cotton Crew Undershirts (3-Pack)",
    category: "basics",
    madeIn: "Vietnam",
    boughtIn: "Seoul",
    usRetailCents: 3600,
    amazon: { cents: 3600, checked: "2026-10-14" },
    abroadCents: 1800,
    dutyRate: 0.3,
    replaceEveryMonths: 6,
    spec: "100% cotton · sizes S–XXL",
    rating: 4.7,
    reviews: 2210,
    travelerOffers: 4,
    swatch: "from-slate-50 to-stone-100",
  },
  {
    slug: "no-show-socks-6",
    name: "No-Show Socks (6-Pack)",
    category: "basics",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 2000,
    amazon: { cents: 2000, checked: "2026-10-14" },
    abroadCents: 900,
    dutyRate: 0.35,
    replaceEveryMonths: 6,
    spec: "Cotton blend · silicone heel grip",
    rating: 4.5,
    reviews: 3105,
    travelerOffers: 3,
    swatch: "from-zinc-50 to-slate-100",
  },
  {
    slug: "gel-pens-10",
    name: "Gel Ink Pens 0.5mm (10-Pack)",
    category: "stationery",
    madeIn: "Japan",
    boughtIn: "Tokyo",
    usRetailCents: 1800,
    amazon: { cents: 1800, checked: "2026-10-14" },
    abroadCents: 800,
    dutyRate: 0.15,
    replaceEveryMonths: 2,
    spec: "Quick-dry ink · black, blue, red mix",
    rating: 4.8,
    reviews: 3420,
    travelerOffers: 4,
    swatch: "from-sky-50 to-slate-100",
  },
  {
    slug: "pen-refills-10",
    name: "Gel Pen Refills 0.5mm (10-Pack)",
    category: "stationery",
    madeIn: "Japan",
    boughtIn: "Tokyo",
    usRetailCents: 1500,
    amazon: { cents: 1500, checked: "2026-10-14" },
    abroadCents: 600,
    dutyRate: 0.15,
    replaceEveryMonths: 2,
    spec: "Fits the 0.5mm gel pens · black",
    rating: 4.8,
    reviews: 1980,
    travelerOffers: 4,
    swatch: "from-slate-50 to-sky-50",
  },
  {
    slug: "dot-notebooks-3",
    name: "A5 Dot-Grid Notebooks (3-Pack)",
    category: "stationery",
    madeIn: "Japan",
    boughtIn: "Tokyo",
    usRetailCents: 2400,
    amazon: { cents: 2400, checked: "2026-10-14" },
    abroadCents: 1200,
    dutyRate: 0.15,
    replaceEveryMonths: 3,
    spec: "Fountain-pen-friendly paper · lay-flat binding",
    rating: 4.7,
    reviews: 1240,
    travelerOffers: 3,
    swatch: "from-amber-50 to-stone-100",
  },
  {
    slug: "sticky-notes-12",
    name: "Sticky Notes 3×3 (12 Pads)",
    category: "stationery",
    madeIn: "South Korea",
    boughtIn: "Seoul",
    usRetailCents: 1600,
    amazon: { cents: 1600, checked: "2026-10-14" },
    abroadCents: 700,
    dutyRate: 0.15,
    replaceEveryMonths: 2,
    spec: "Removable · 100 sheets per pad",
    rating: 4.6,
    reviews: 2075,
    travelerOffers: 3,
    swatch: "from-yellow-50 to-amber-50",
  },
  {
    slug: "waste-bags-360",
    name: "Dog Waste Bags (24 Rolls, 360 Bags)",
    category: "pet",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 1800,
    amazon: { cents: 1800, checked: "2026-10-14" },
    abroadCents: 800,
    dutyRate: 0.3,
    localCents: 1600,
    seller: "Sample Pet Shop (example) · Brooklyn, NY",
    replaceEveryMonths: 2,
    spec: "Leak-proof · fits standard dispensers",
    rating: 4.8,
    reviews: 5120,
    travelerOffers: 3,
    swatch: "from-emerald-50 to-teal-50",
  },
  {
    slug: "training-pads-100",
    name: "Puppy Training Pads (100-Count)",
    category: "pet",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 3200,
    amazon: { cents: 3200, checked: "2026-10-14" },
    abroadCents: 1500,
    dutyRate: 0.3,
    localCents: 2800,
    seller: "Sample Pet Shop (example) · Brooklyn, NY",
    replaceEveryMonths: 1,
    spec: "22×22 in · bulky: usually ships from US stock",
    rating: 4.6,
    reviews: 2890,
    travelerOffers: 1,
    swatch: "from-sky-50 to-emerald-50",
  },
  {
    slug: "grooming-wipes-200",
    name: "Pet Grooming Wipes (200-Count)",
    category: "pet",
    madeIn: "China",
    boughtIn: "Hong Kong",
    usRetailCents: 2000,
    amazon: { cents: 2000, checked: "2026-10-14" },
    abroadCents: 900,
    dutyRate: 0.3,
    replaceEveryMonths: 1,
    spec: "Unscented · for paws and coats",
    rating: 4.5,
    reviews: 1460,
    travelerOffers: 2,
    swatch: "from-teal-50 to-sky-50",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(id: Category) {
  return categories.find((c) => c.id === id)!;
}

const norm = (s: string) => s.toLowerCase().replace(/[\s\-–]+/g, "");

export function searchProducts(query: string) {
  const q = norm(query);
  if (!q) return [];
  return products.filter(
    (p) =>
      norm(p.name).includes(q) ||
      norm(getCategory(p.category).label).includes(q) ||
      (p.fits ?? []).some((m) => norm(m).includes(q)),
  );
}

export type Traveler = {
  id: string;
  name: string;
  route: string;
  arrives: string;
  trips: number;
  rating: number;
  carries: string[]; // product slugs
};

export const travelers: Traveler[] = [
  { id: "t1", name: "Jiwoo P.", route: "Seoul → Los Angeles", arrives: "Oct 19", trips: 47, rating: 4.9, carries: ["hydrating-essence-150", "rice-toner-150", "cleansing-balm-100", "sheet-masks-10", "cotton-undershirts-3", "sticky-notes-12"] },
  { id: "t2", name: "Ken T.", route: "Tokyo → San Francisco", arrives: "Oct 22", trips: 31, rating: 4.8, carries: ["ceramide-cream-50", "wireless-pad-15w", "merino-socks-3", "gel-pens-10", "pen-refills-10", "dot-notebooks-3"] },
  { id: "t3", name: "Alicia W.", route: "Hong Kong → New York", arrives: "Oct 24", trips: 62, rating: 5.0, carries: ["gan-65w-3port", "gan-30w-compact", "usbc-240w-2pack", "car-charger-45w", "no-show-socks-6", "waste-bags-360", "grooming-wipes-200"] },
  { id: "t4", name: "Marco B.", route: "Paris → Chicago", arrives: "Oct 26", trips: 19, rating: 4.8, carries: ["retinal-serum-30"] },
];

export type Fulfillment = "traveler" | "local";

// Auto-replace subscribers get 5% off whichever delivery they choose.
export const AUTO_DISCOUNT = 0.05;

// Price for one order line. The traveler minimum applies once per line, so
// buying several units spreads it out. The auto-replace discount comes out of
// the platform's side; travelers are always paid their full share.
export function lineTotalCents(p: Product, fulfillment: Fulfillment, auto: boolean, qty = 1, member = false) {
  const base = fulfillment === "local" && p.localCents ? p.localCents * qty : breakdown(p, qty, member).total;
  return auto ? Math.round(base * (1 - AUTO_DISCOUNT)) : base;
}

// Multi-pack pricing. The traveler minimum applies once per order line, so on
// cheap items buying 2–3 spreads it out. Used to push multi-packs wherever a
// single unit is held back by the minimum.
export const PACK_OPTIONS = [1, 2, 3] as const;

// Only nudge where a second pack lowers the per-pack price meaningfully
// (at least 5 points of savings); on pricier items the 15% share already
// clears the minimum and extra units barely help.
export function packNudge(p: Product, member = false) {
  if (!breakdown(p, 1, member).travelerIsMin) return false;
  const [one, two] = packPrices(p, member);
  return two.savingsPct - one.savingsPct >= 5;
}

export function bestPack(p: Product, member = false, auto = false) {
  return packPrices(p, member, auto).reduce((best, o) => (o.each < best.each ? o : best));
}

export function packPrices(p: Product, member = false, auto = false) {
  return PACK_OPTIONS.map((qty) => {
    const total = lineTotalCents(p, "traveler", auto, qty, member);
    const each = Math.round(total / qty);
    return { qty, total, each, savingsPct: Math.round((1 - each / p.usRetailCents) * 100) };
  });
}

// "X% less than Amazon" comparison. Returns null (no badge) when there's no
// Amazon check, the check is older than AMAZON_MAX_AGE_DAYS at build time, or
// we aren't cheaper. Comparative claims must be true when shown.
export const AMAZON_MAX_AGE_DAYS = 30;

export function amazonCompare(p: Product, ourCents: number, now = new Date()) {
  if (!p.amazon) return null;
  const ageDays = (now.getTime() - new Date(p.amazon.checked + "T00:00:00Z").getTime()) / 86_400_000;
  if (ageDays > AMAZON_MAX_AGE_DAYS || ageDays < 0) return null;
  const pct = Math.round((1 - ourCents / p.amazon.cents) * 100);
  if (pct < 1) return null;
  return { pct, amazonCents: p.amazon.cents, checked: p.amazon.checked, savedCents: p.amazon.cents - ourCents };
}
