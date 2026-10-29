# Project State

Updated: 2026-10-27
Current task: Updated 31-item demo checklist implemented and locally verified.
Status: **31/31 prototype features implemented.** Owner admin credentials are now configured, the runtime catalogue is seeded, and the local sign-in form is enabled. Live Google measurement configuration remains an owner-controlled step; no live GA4 ingestion or production readiness is claimed.

## Working

- Existing Next.js/React/TypeScript/plain CSS application retained; no WordPress or frontend replacement.
- Three light designs, remembered chooser, English/Arabic RTL, responsive home/catalogue/detail and approved-number WhatsApp links preserved.
- Accepted 100-record seed across 40 houses; brand/gender/family/note filtering, search/sort/pagination and locale/return-context behavior retained.
- Native metadata: localized product descriptions/titles, canonical/hreflang, Open Graph images and dynamic bilingual sitemap; noindex retained.
- Single-operator admin login/list/search/edit/add under `/en/admin/`; server-side authentication and origin checks on writes; HttpOnly expiring signed sessions and scrypt password verification.
- Optional private SQLite runtime catalogue. Explicit seeding is idempotent; edits/new products survive process restart and appear without a rebuild. Without configured storage, the storefront keeps immutable seed JSON and admin is disabled.
- Consent-gated GA4 adapter for sanitized manual page views and WhatsApp click intent, with no contact/message/query data. Missing measurement ID means no tracking. Admin routes are excluded.
- Protected example report prominently identifies fixed sample data (420 views, 25 clicks), not real GA reports.
- `docs/demo/CSV_IMPORT_PLAN.md` describes the eventual 1,000-record importer; no production importer has been built.

## Current verification evidence

- `npm run data:audit`: pass, 100 unique bilingual seed products and no private-field/document leakage.
- `npm test`: 35 passing tests across ten files, including a regression that runs the actual admin seeding CLI and checks repeated seeding preserves edits.
- `npm run typecheck`, `npm run lint`, production build: passed.
- Fixture-ID build with intercepted Google transport: `BTS_TEST_PORT=3100 npm run test:e2e` passed 51 cases, one intentional desktop skip for the mobile-only menu case.
- `npm run test:e2e:admin`: passed actual login/search/edit/add, complete Next process stop/restart with the same temporary database, saved-content verification, new-product canonical/sitemap, report fixture totals and unauthorized-save rejection.
- No real Google requests or WhatsApp messages were sent by these tests. Fixture credentials and SQLite database were disposable and removed by the test.
- Directly reviewed `admin-example-report.png`, Atelier Arabic mobile detail, Gallery English desktop catalogue and Linen English mobile home after the configured build. All three designs and mobile/RTL regression checks passed.
- Node SQLite emits its documented experimental warning on the tested Node 22.23.4 runtime.

## Checklist

Authoritative current list: `../demo/CHECKLIST.md`.

| Section | Implemented |
| --- | ---: |
| Storefront | 6/6 |
| Internationalization | 5/5 |
| SEO | 5/5 |
| Analytics | 4/4 |
| Admin proof of concept | 6/6 |
| Testing | 5/5 |
| **Total** | **31/31** |

Analytics completion means the implementation/approach/example and mocked transport tests, not a connected live property. The user explicitly accepts 100 products for the 40–60 sample requirement. The older 52-item checklist and literal SEO-plugin/Site Kit requirement are superseded by D-012. Implementation outcome is recorded in D-013.

## Owner setup / next action

1. Owner credential setup is complete; no password was read, printed or changed by the agent. Use the username/password selected during setup.
2. The actual `admin:seed` command initially failed because of a CommonJS named import. Fixed the `@next/env` default import, added a failing-then-passing CLI regression, seeded the existing configured private database with 100 products and restarted the stale preview. Open `/en/admin/login`; browser verification confirms Sign in is enabled and no setup warning remains. Anonymous admin access still redirects to login.
3. If live analytics is wanted, follow `../demo/ANALYTICS.md`: approve the property/stream, disable duplicate automatic measurement, set the real public measurement ID, rebuild/restart, grant consent and verify in the actual Google property.
4. Use `../demo/WALKTHROUGH.md` for storefront/admin/SEO/example-report demonstration. Keep sample-data and illustrative-inventory disclosures visible.

Test ports 3100/3101 isolated verification from the original preview. After the final ordinary build, the confirmed old project preview was restarted on `127.0.0.1:3000` (PID recorded in `artifacts/preview.pid`, output in `artifacts/preview.log`). `/en`, `/en/admin/login` and `/sitemap.xml` returned HTTP 200. After the subsequent seed-CLI fix and restart, login correctly accepts credential entry instead of showing the setup-required warning. The final client build contains no fixture GA ID. `README.md` documents commands and setup boundaries.

## Limits and boundaries

Single local/long-lived Node server with a persistent private disk; not ephemeral serverless storage or production identity management. No customer accounts, roles/password-reset service, uploads, delete workflow, checkout, payments or live inventory. Admin controls are English inside the existing locale shell; customer UI remains bilingual. Arabic content needs client review before production. Chrome emulation is not physical Safari/iOS certification.

Existing source `D:/perfume-search` and seed product data remain unchanged. Photo permission remains user-confirmed, not independent verification of product packaging or stock. No deployment, source-control initialization/commit, recording, purchase, external WhatsApp send or Google-account connection was performed.
