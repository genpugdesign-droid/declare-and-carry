// Single source of truth for brand. Rename the store by editing this file
// (and public/manifest.webmanifest).
export const site = {
  name: "Declare & Carry",
  tagline: "Life, liberty, and lower prices.",
  description:
    "Everyday goods hit hardest by tariffs, bought at overseas prices by verified travelers, declared at customs, and delivered. Duty paid, always.",
  domain: "declareandcarry.com",
  supportEmail: "hello@declareandcarry.com",
  // Legal entity that operates the brand (Declare & Carry is its DBA).
  legalEntity: "Pugnacity LLC",
};

// Prefix for static assets when deployed under a GitHub Pages subpath.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

// Launch switch. "soon" shows the launching-soon home page and hides the
// catalog (shop, product, cart, orders, traveler checkout); "live" is the full
// store. Fill in the form endpoints (e.g. Formspree or Tally) and the Founding
// Charter payment link before pointing the domain at a "soon" deploy; while
// they're empty, those forms run in demo mode and nothing is collected.
export const launch = {
  mode: "soon" as "soon" | "live",
  date: "2026-10-28", // PLACEHOLDER: confirm the real launch date
  forms: {
    sellerApplication: "", // e.g. https://formspree.io/f/xxxxxxx
    waitlist: "",
  },
  foundingCheckoutUrl: "", // Stripe Payment Link for the $49 Founding Charter
};

export const isSoon = launch.mode === "soon";

export function launchDateLabel() {
  return new Date(launch.date + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
}

// Sends a form to the configured endpoint. Returns "demo" when no endpoint is set.
export async function submitForm(endpoint: string, data: Record<string, unknown>): Promise<"sent" | "demo"> {
  if (!endpoint) return "demo";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Form service returned ${res.status}`);
  return "sent";
}
