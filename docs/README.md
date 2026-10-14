# Print materials

`founding-seller-sheet.template.html` is the one-page Founding Seller handout.
To regenerate the PDF, replace `{{LOGO}}` with the contents of
`public/brand/declare-and-carry-logo.svg` and `{{LAUNCH}}` with the launch date,
then print to PDF (Letter) from Chrome with headers and footers turned off.

Terms on the sheet mirror the site: 12% commission (card fees included), no
listing or monthly fees, weekly Friday payouts, ship within 2 business days,
30-day returns on unopened items, sellers carry their own insurance. Keep the
sheet and `src/app/sell/page.tsx` in sync when terms change.
