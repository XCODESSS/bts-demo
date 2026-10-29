# Updated Demo Checklist

Updated: 2026-10-27
Authority: User-supplied 31-item checklist, replacing the earlier 52-item checklist. The existing 100 products satisfy the sample-product item by explicit user confirmation.

**31/31 features implemented and verified at demo/prototype scope.** Live GA4 ingestion is not verified: the owner must supply their own approved measurement ID and account. Admin credentials are owner-selected; the owner has now completed setup, the seed-command import bug is fixed, and the configured database has been initialized. These operational limits are not hidden behind the example report.

## 1. Storefront — 6/6

- [x] S1: Homepage and premium light design
- [x] S2: 40–60 sample products — existing 100 accepted by user
- [x] S3: Product search and filters
- [x] S4: Individual product pages
- [x] S5: Working WhatsApp enquiries
- [x] S6: Mobile responsiveness

## 2. Internationalization — 5/5

- [x] I1: English/Arabic switching
- [x] I2: RTL layout and navigation
- [x] I3: Translated UI text
- [x] I4: Arabic sample product content
- [x] I5: Locale-specific product URLs

## 3. SEO — 5/5

- [x] E1: Dynamic metadata for product pages — localized title/description
- [x] E2: Canonical URLs
- [x] E3: English/Arabic hreflang links
- [x] E4: Product sitemap prototype
- [x] E5: Open Graph previews — absolute metadata/image URLs; no public scraper claim for a local/noindex demo

## 4. Analytics — 4/4

- [x] A1: GA4 integration approach — documented owner setup and consent/tag ownership
- [x] A2: Page-view tracking — implementation verified against mocked Google transport; live property setup pending
- [x] A3: WhatsApp enquiry click events — safe intent payloads verified, no messages sent
- [x] A4: Example analytics reporting view — protected, prominently labelled sample data

## 5. Admin proof of concept — 6/6

- [x] M1: Admin login prototype
- [x] M2: View and search existing products
- [x] M3: Edit a sample product
- [x] M4: Add a sample product
- [x] M5: Demonstrate saving data persistently — verified across a real Next server restart
- [x] M6: Plan bulk CSV import for 1,000 products — document only, as requested

## 6. Testing — 5/5

- [x] T1: TypeScript and ESLint checks
- [x] T2: Vitest for filtering/translation logic
- [x] T3: Playwright customer journey test
- [x] T4: Playwright English/Arabic navigation test
- [x] T5: Mobile and RTL visual checks

## Evidence map

| IDs | Evidence |
| --- | --- |
| S1–S6, I1–I5, T3–T5 | `tests/e2e/journey.spec.ts`, `visual.spec.ts`, reviewed screenshots and `QA.md` |
| E1–E5 | `tests/unit/seo.test.ts`, `tests/e2e/seo.spec.ts`; admin test verifies new-product canonical/sitemap without rebuild |
| A1 | `ANALYTICS.md` |
| A2–A3 | `tests/unit/analytics.test.ts`, `tests/e2e/analytics.spec.ts` in a fixture-ID build; external requests mocked |
| A4 | `/en/admin/analytics`, `tests/e2e/admin.spec.ts`, `artifacts/screenshots/admin-example-report.png` |
| M1–M5 | `tests/unit/session.test.ts`, `product-store.test.ts`, `tests/e2e/admin.spec.ts` |
| M6 | `CSV_IMPORT_PLAN.md` |
| T1–T2 | Typecheck/lint and full 35-test Vitest run; command evidence in `QA.md` |

The configured analytics build passed 51 browser cases with one intentional desktop skip, plus the separate admin restart journey. Without a measurement ID the two consented-analytics cases are intentionally skipped, not falsely described as a real GA connection. The final ordinary build uses the owner's `.env.local`, not the test fixture ID.

No WordPress, production deployment, customer accounts, checkout, live inventory synchronization, working bulk importer, Google reporting API or actual Google-account connection is included. No source-control commit or publication was performed.
