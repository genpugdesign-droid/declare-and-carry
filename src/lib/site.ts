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
