# Weekly tariff data update

Instructions for the scheduled agent (or a person) that keeps the "Why prices
rose" chart current. The only file to edit is `src/data/tariff-points.json`.

## 1. Check for new estimates

Look for anything the Budget Lab at Yale has published since the latest point's
`date`:

- State of U.S. Tariffs: https://budgetlab.yale.edu/research/state-us-tariffs
- Trade research listing: https://budgetlab.yale.edu/topic/trade
- Tariff Rate Tracker repo (release notes, MANIFEST): https://github.com/Budget-Lab-Yale/tariff-rate-tracker

Use only the Budget Lab's **average effective tariff rate, pre-substitution**
(before shoppers change what they buy), so the series stays comparable. Do not
mix in other organizations' numbers or the post-substitution figure.

## 2. Add a point only when it's warranted

Add a new point when the Budget Lab publishes a new estimate **and** either
the rate moved by at least 0.5 percentage points or a policy change took
effect (new tariff, ruling, expiration, deal). Skip minor revisions.

Each point:

```json
{
  "date": "YYYY-MM-DD",       // the date the estimate applies to
  "rate": 11.8,               // percent, as published
  "label": "Short event name", // 2–5 words
  "since": "1943",            // only if the report says "highest since <year>"
  "reason": "One or two plain sentences."
}
```

## 3. Write the reason neutrally

- Say what changed and the justification **officials or the court gave**:
  "justified as national security", "the Supreme Court ruled…".
- No opinions, adjectives about motives, party names, or predictions.
  The site's point of view lives elsewhere, and the data must stay credible to
  readers who disagree with it.
- Plain language a non-expert understands. Avoid legal section numbers unless
  necessary.

## 4. Always

- Set `lastChecked` to today's date, even if nothing else changed.
- Add the report's URL to `sources` if it isn't there.
- Run `node scripts/check-tariffs.mjs` and `npm run build`; both must pass.
- Open a pull request titled `Tariff data update (YYYY-MM-DD)` that summarizes
  the new point(s) with source links, or says "No new estimates; updated
  lastChecked". Never push straight to `main`.
