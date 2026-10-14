# Declare & Carry storefront

Next.js 15 marketplace for everyday goods that cost far less overseas: skin care,
chargers, batteries, shoes and bags, and filters. Verified travelers buy at
authorized stores abroad, **declare everything at customs**, and earn 15% of
the item price. Every price is shown all-in: shelf price + duty + traveler
share + 8% service & protection fee (waived for Charter members, $7.99/mo or $59/yr), compared with the typical US price.
US-stock sellers pay a 12% commission, card fees included.

Pricing constants and the price breakdown live in `src/lib/catalog.ts`.
Per-category carry rules (FAA lithium limits, no sunscreens, authentic-only)
are in the same file and shown on every product page.

All products, sellers and travelers in `src/lib/catalog.ts` are **sample data**.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```

Brand name, tagline and email: `src/lib/site.ts` (plus `public/manifest.webmanifest`).
Colors: CSS tokens at the top of `src/app/globals.css`.

## Deploy to GitHub Pages

1. Create a GitHub repo and push this folder to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Until a custom domain is attached, set the repo variable **Settings → Secrets and
   variables → Actions → Variables → `BASE_PATH` = `/<repo-name>`**.
4. Custom domain: `declareandcarry.com` (registered at GoDaddy) is already in `public/CNAME`, so leave
   `BASE_PATH` empty. In GoDaddy DNS add four A records for `@` (185.199.108.153, 185.199.109.153,
   185.199.110.153, 185.199.111.153) and a `www` CNAME to `<github-username>.github.io`, then set the
   domain in Settings → Pages and enable HTTPS.

The workflow is `.github/workflows/deploy.yml`.

## App

- **Now:** it's an installable PWA (manifest + icons). On a phone, use "Add to Home Screen".
- **App stores:** wrap the static build with Capacitor (`@capacitor/ios`, `@capacitor/android`,
  `webDir: "out"`). Apple requires more than a wrapped website, so add native value
  first (push reminders before each filter swap, a barcode scanner for model numbers).

## Not built yet

- Checkout and payments. GitHub Pages is static, so use Stripe Payment Links or Stripe
  Checkout behind a serverless function, or move hosting to Vercel for API routes.
- Seller/traveler accounts, escrow (Stripe Connect), ID verification and the request backend.

## "Less than Amazon" badge

Each product has `amazon: { cents, checked }` in `src/lib/catalog.ts`. The badge only shows
while that check is under 30 days old (as of the build) and our single-pack, non-member price
is actually lower. The current values are **samples**. Before launch, screenshot each Amazon
listing (same item, same pack size), enter the real price and date, and re-check monthly. The
weekly rebuild hides any badge whose check has gone stale.
