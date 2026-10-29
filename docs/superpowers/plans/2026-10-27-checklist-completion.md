# Next.js Demo Checklist Completion Implementation Plan

**Execution update — 2026-10-27:** Implemented within the existing Next.js app. `docs/demo/CHECKLIST.md` and `docs/roadmap/STATE.md` contain current completion/evidence; the unchecked recipe steps below are the historical planning sequence, not current status. Local SQLite was authorized through the implementation request. The configured test build passed 34 unit tests, 51 browser cases (one intentional skip), and the separate real admin/process-restart journey. Real operator credential setup and live GA4 connection remain owner-controlled and were not performed. No deployment or commits.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the 14 remaining items in the updated 31-item demo checklist while preserving the existing 17 completed items.

**Architecture:** Extend the existing Next.js application, not a replacement frontend. Add Next.js-native SEO, a consent-aware GA4 client adapter and clearly labelled example reporting, plus a single-admin proof of concept backed by persistent storage. Proposed storage is local SQLite through the installed Node runtime; this choice needs approval before implementation and assumes one long-lived Node server with a persistent local disk, not an ephemeral/serverless filesystem.

**Tech Stack:** Existing Next.js 16.4.3, React 19.3.1, TypeScript 5.9.3, plain CSS/CSS Modules, Vitest, Playwright and Node 22.23.4. Proposed additions use built-in `node:sqlite` and `node:crypto` rather than a new framework or UI library. Node's SQLite API is experimental on the installed runtime; it was verified with an in-memory read/write probe during planning. Do not install or choose an alternative datastore without approval.

**Spec:** `docs/demo/CHECKLIST.md`, copied from the user's updated 31-item checklist. The user accepts the existing 100 products as satisfying the sample-product requirement. This replaces the earlier 52-item checklist and removes the former literal SEO-plugin/Site Kit requirement.

## Global Constraints

- Keep Next.js, React, TypeScript, plain CSS and CSS Modules. No WordPress, headless WordPress, migration or frontend rebuild.
- Preserve all three existing light designs, branding, English/Arabic, RTL, equivalent locale routes, URL filters, pagination, return context and WhatsApp behavior.
- Retain the 100 curated products; no new curation exercise or reduction to 40–60.
- Preserve `Inquire for prices` / `يرجى الاستفسار عن الأسعار`; no numerical prices, checkout, supplier data or invented stock claims.
- Product photos and source materials retain existing safety boundaries; do not modify `D:/perfume-search`.
- The admin is a proof of concept, not production identity management: one environment-configured operator, no customer accounts, reset emails or role-management project.
- Persistent means saved server-side and surviving application/process restart, not just React state, browser localStorage or a rewritten build artifact.
- The CSV deliverable is a plan only. No full importer or 1,000-product population is required.
- Example analytics must visibly say that its numbers are sample data. Live GA4 measurement requires an approved measurement ID and owner access; do not invent credentials or traffic.
- Do not send search queries, enquiry text, phone numbers or full WhatsApp URLs to analytics.
- Staging remains noindex. Creating a sitemap does not authorize indexing or public deployment.
- This request authorizes planning, not deployments, account consent, installs, paid services, commits or delegation. Follow available approved execution workflows; the header does not authorize installing unavailable skills or launching subagents.

---

## Completion baseline

| Section | Complete | Remaining |
| --- | ---: | ---: |
| Storefront | 6/6 | 0 |
| Internationalization | 5/5 | 0 |
| SEO | 1/5 | 4 |
| Analytics | 0/4 | 4 |
| Admin proof of concept | 0/6 | 6 |
| Testing | 5/5 | 0 |
| **Total** | **17/31** | **14** |

E1 currently has dynamic product titles; strengthen descriptions during SEO work rather than counting it twice. Testing is already recorded complete but must be rerun and extended for new behavior. No full application tests were rerun during this planning session.

## Effort and elapsed time

One experienced contributor, one direct execution lane, existing UI retained, local/single-instance proof of concept, credentials available when needed:

| Work package | Focused effort |
| --- | ---: |
| Persistent catalogue + login + admin list/edit/add | 10–15 hours |
| Canonicals, hreflang, sitemap and Open Graph | 3–5 hours |
| GA4 approach, page views, WhatsApp events and example report | 4–6 hours |
| 1,000-product CSV import plan | 1–2 hours |
| Integration/regression tests, visual review and handoff | 3–4 hours |
| **Base engineering effort** | **21–32 hours** |
| **Integration contingency, approximately 20%** | **4–7 hours** |
| **Budget to plan around** | **25–40 focused hours** |

At 6 focused hours/day, allow approximately **5–7 working days**, not a promise of unattended agent runtime. At 8 focused hours/day, approximately 4–5 working days. AI assistance is assumed; estimates still include testing, inspection and fixing integration defects. Google-account access and report-processing delays are separate; labelled example reporting does not need historical GA data.

Confidence: medium for SEO/analytics documentation; medium-low for the new persistence/auth boundary. Re-estimate if durable serverless hosting, production-grade auth, image uploads, live GA Data API reporting or a working CSV importer is requested. These are not hidden parts of the demo checklist.

The recorded October 29 target does not comfortably fit this complete scope at six focused hours/day. Presenting the already working storefront is possible without pretending the remaining admin/analytics features are finished.

## File and responsibility map

Paths marked **Create** are proposed; existing paths were inspected. Keep server persistence/auth separate from client-importable product types.

| File(s) | Change and responsibility |
| --- | --- |
| `src/features/products/model.ts` | Existing `Product` contract; keep public fields allowlisted |
| **Create** `src/features/products/product-store.ts` | SQLite schema, seed, ordered reads, uniqueness and persistent writes |
| **Create** `src/features/products/product-validation.ts` | Runtime validation of explicit editable fields |
| `src/features/products/repository.ts` | Preserve `getProducts`, `getProduct`, `getRelated` synchronous read signatures; use configured store or existing JSON seed |
| **Create** `scripts/seed-admin.ts` | Explicit idempotent initialization of configured runtime database |
| `src/app/[locale]/page.tsx`, `src/app/[locale]/catalogue/page.tsx`, `src/app/[locale]/perfumes/[slug]/page.tsx` | Read fresh managed products; stop treating mutable details as build-only static pages |
| **Create** `src/features/admin/session.ts`, `src/features/admin/product-actions.ts`, `scripts/create-admin-password.ts` | Signed/expiring sessions, authorized validated server mutations and local password-verifier setup |
| **Create** `src/features/admin/product-form.tsx`, `src/features/admin/admin.module.css` | Small accessible edit/add form and plain CSS presentation |
| **Create** `src/app/[locale]/admin/layout.tsx`, `login/page.tsx`, `products/page.tsx`, `products/new/page.tsx`, `products/[id]/page.tsx` under that admin segment | Reuse existing locale root layout; login and protected product-management pages |
| **Create** `src/features/seo/metadata.ts` | Pure locale-aware URL/metadata builders shared by page metadata and sitemap |
| `src/app/[locale]/layout.tsx`, home/catalogue/product pages | Configure metadata base and page-specific canonical/alternates/Open Graph |
| **Create** `src/app/sitemap.ts` | Next.js metadata route listing public English/Arabic product URLs, never admin URLs |
| **Create** `src/features/analytics/events.ts`, `analytics-provider.tsx`, `tracked-enquiry-link.tsx` | Typed safe event payloads, consent-aware GA tag, navigation tracking and enquiry clicks |
| `src/features/enquiry/enquiry-link.tsx` | Retain safe number/message generation; delegate only the enabled anchor to the tracked client wrapper |
| **Create** `src/features/analytics/example-report.ts`, `src/app/[locale]/admin/analytics/page.tsx` | Static labelled example reporting, protected by the admin session |
| **Create** `tests/unit/product-store.test.ts`, `product-validation.test.ts`, `session.test.ts`, `seo.test.ts`, `analytics.test.ts` | New contract and safety tests |
| **Create** `tests/e2e/seo.spec.ts`, `analytics.spec.ts`, `admin.spec.ts`, `playwright.admin.config.ts` | Delivered metadata/tracking checks and isolated persistent-admin journey |
| `playwright.config.ts`, `package.json`, `.gitignore`, `.env.example` | Isolated admin-test command, runtime/test environment and private database exclusions |
| **Create** `docs/demo/ANALYTICS.md`, `docs/demo/CSV_IMPORT_PLAN.md` | Measurement approach and eventual 1,000-product import procedure |
| `README.md`, `docs/demo/QA.md`, `docs/demo/WALKTHROUGH.md`, `docs/demo/CHECKLIST.md`, roadmap files | Operating instructions, evidence and actual completion |

Admin route examples use `/en/admin/...` so no second root `<html>` layout is needed. Prototype admin labels may be English; the existing customer-facing English/Arabic UI remains fully supported. A bilingual admin is not silently added to scope.

## Task 1 — Persistent catalogue seam

**Covers:** M5 foundation, M2–M4 dependencies. **Estimate:** 3–5 h of the admin budget.

**Files:** `product-store.ts`, `product-validation.ts`, `repository.ts`, `scripts/seed-admin.ts`, new unit tests, `.env.example`, `.gitignore`, and the three public route pages listed above.

**Interfaces:**

```ts
import type { Product } from "./model";
export type ProductStore = {
  list(): readonly Product[];
  findBySlug(slug: string): Product | undefined;
  findById(id: string): Product | undefined;
  create(product: Product): void;
  update(id: string, product: Product): void;
  close(): void;
};
export function openProductStore(filename: string): ProductStore;
export function validateProduct(input: unknown): Product;
```

Keep repository exports `getProducts(): readonly Product[]`, `getProduct(slug: string): Product | undefined`, and `getRelated(product: Product, limit = 4): readonly Product[]`. Use `BTS_DATABASE_PATH` for the runtime store; absent configuration uses immutable JSON for current tests/reference mode, with admin writes explicitly disabled rather than appearing to save.

- [ ] Confirm the proposed local SQLite/runtime arrangement before adding it. Node 22.23.4 supports the probed `DatabaseSync` API but emits an experimental warning; document that limitation.
- [ ] Write a storage test using a temporary file: create a product, close the store, reopen the same file and assert its localized descriptions and ID remain. Add duplicate-ID/slug and transactional-failure tests.
- [ ] Run `npm test -- tests/unit/product-store.test.ts` and observe the missing-store failure before implementation.
- [ ] Implement parameterized SQLite queries with the following schema; store only validated public `Product` payloads and preserve selection order:

```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL UNIQUE,
  payload TEXT NOT NULL
);
```

- [ ] Seed all existing products in one transaction only when explicitly initializing a new/empty runtime database. Never overwrite admin edits on server startup; rerunning the seed on populated storage is a no-op.
- [ ] Validate unknown/non-object input, unknown keys, nonempty required text, valid gender/family IDs, matching bilingual note counts, unique ID/slug, and an image selected from existing deliberate `/perfumes/` assets. Reject traversal and remote image URLs. Preserve ID/slug/order when editing; new sample records append in a transaction.
- [ ] Wire repository reads to configured storage without placing SQLite in client bundles. Remove the detail page's `generateStaticParams` dependency on mutable products and set the home/catalogue/detail route segments to `export const dynamic = "force-dynamic"` for this prototype so saved changes appear without rebuilding.
- [ ] Run focused storage/validation tests, existing content/query/routing tests, typecheck and build. Keep original JSON fixtures at 100; do not weaken those fixture assertions because an isolated admin test adds its own record.

**Gate:** Data survives store reopen; original seed stays unchanged; dynamic server reads show saved content. This alone is not the full restart demonstration in Task 3.

## Task 2 — Single-admin login and protected reads

**Covers:** M1, M2. **Estimate:** 3–4 h of the admin budget.

**Files:** `session.ts`, admin layout/login/products pages, `session.test.ts`, `.env.example` and admin styles.

**Interfaces:**

```ts
export function createSessionToken(nowMs: number): string;
export function isValidSessionToken(token: string | undefined, nowMs: number): boolean;
export async function requireAdmin(): Promise<void>;
```

Use a server-only environment-configured operator, `ADMIN_USERNAME`, a salted scrypt password verifier (`ADMIN_PASSWORD_HASH`), and an independent high-entropy `ADMIN_SESSION_SECRET`. No `NEXT_PUBLIC_` credential variables. Generate the password verifier with a local interactive helper documented in the executable implementation; do not commit or echo real credentials. The helper belongs in `scripts/create-admin-password.ts`.

- [ ] Write failing tests for incorrect passwords, modified/expired session tokens and missing configuration. Add an authorized admin-list browser test and an anonymous redirect/denial test.
- [ ] Implement a signed HMAC session with an eight-hour expiry, constant-time verification after length checks, and an HttpOnly, SameSite=Lax cookie. Use Secure over HTTPS and clear the cookie on logout. Bind signatures to the token expiry/payload; do not accept arbitrary unsigned timestamps.
- [ ] Authenticate login on the server, return one generic invalid-credentials message, and bound repeated attempts per operator/client in the single-process prototype. Never trust only a hidden UI route.
- [ ] Make login and every protected admin page dynamic and noindex. Guard protected product-list access on the server; allow the login route to render without requiring an existing session. Do not put a blanket redirect on the parent admin layout that loops back to itself.
- [ ] Render real persisted records with ID/brand/name and a server-side search form. Reuse existing product-query normalization for English/Arabic matching where practical; no separate duplicate catalogue dataset.
- [ ] Verify anonymous users cannot read admin data, invalid sessions fail, configured login succeeds, search returns actual records and logout revokes that browser's session.

**Gate:** A real protected login/list/search loop works. It is explicitly not a production multi-user identity service.

## Task 3 — Edit, add and demonstrate restart persistence

**Covers:** M3, M4, M5. **Estimate:** 4–6 h of the admin budget.

**Files:** admin product form/new/edit pages, `product-actions.ts`, `product-validation.ts`, `tests/e2e/admin.spec.ts`, `playwright.admin.config.ts`, `package.json`, `playwright.config.ts`.

**Interfaces:** Authorized server actions accept `FormData`, construct an explicit `Product` input, validate it, then call the store's `create`/`update`. Each mutation calls `requireAdmin()`; reject invalid origins and do not rely solely on page protection. Preserve immutable ID/slug for edits. Use existing model fields rather than introducing prices or stock.

- [ ] Write one failing edit browser journey and one failing add journey. Assert the persisted values in a second fresh page request, not just an optimistic success label.
- [ ] Expose name, brand, supplied size, approved concentration/gender/families, English/Arabic description/notes and an existing-image selector. The add form also collects a unique ID/slug. Keep reference caveats and explicit public-field mapping; no file-upload project is required.
- [ ] Implement server actions with authentication, field-level error feedback and duplicate-record feedback. Keep names/descriptions safely escaped by React and use parameterized storage writes.
- [ ] Demonstrate editing an existing sample description, viewing it in both locale product pages, adding one uniquely identified sample and finding it in the real catalogue. Missing Arabic required data must fail validation, not silently copy English.
- [ ] Add an isolated admin Playwright config and package script `"test:e2e:admin": "playwright test --config=playwright.admin.config.ts"` using a temporary seeded database. Exclude `admin.spec.ts` from the existing fixture-based browser run so its exact 100-product assertions remain meaningful. Use non-real test credentials only in isolated test configuration.
- [ ] Stop and restart the local production application against the same dedicated demo database, then verify the edit and new record still appear. Record evidence of the actual process restart, not only a browser reload.
- [ ] Rerun the customer locale/filter/WhatsApp journeys against a clean seed. Ensure newly added products get working bilingual URLs without a rebuild.

**Gate:** Login → search → edit → add → server restart → same saved data works. Delete, uploads, password recovery, roles and publishing workflows are not added unless separately requested.

## Task 4 — Canonical URLs, hreflang, sitemap and Open Graph

**Covers:** E2, E3, E4, E5; strengthens existing E1. **Estimate:** 3–5 h.

**Files:** `src/features/seo/metadata.ts`, locale layout/home/catalogue/detail pages, `src/app/sitemap.ts`, `seo.test.ts`, `tests/e2e/seo.spec.ts`, `.env.example`.

**Interfaces:**

```ts
import type { Metadata } from "next";
import type { Product } from "../products/model";
import type { Locale } from "../../i18n/config";
export function buildProductMetadata(product: Product, locale: Locale, siteOrigin: string): Metadata;
```

Configure an approved `SITE_URL`; use explicit localhost origin only for local previews/tests. Do not advertise an invented production domain. Keep canonical/hreflang free of `return` and tracking/filter query strings.

- [ ] Add a failing unit test using the existing P0028 product and `https://example.com` as a non-contacted test origin. Assert Arabic canonical `/ar/perfumes/armaf-club-de-nuit-iconic-p0028`, both en/ar alternatives, Arabic description and an absolute image URL. Confirm the exact seed slug from `src/data/products.json` before writing the literal fixture.
- [ ] Implement the metadata result with these exact Next.js keys:

```ts
const path = `/${locale}/perfumes/${product.slug}`;
const absolute = (value: string) => new URL(value, siteOrigin).toString();
return {
  title: `${product.brand} ${product.name}`,
  description: product.description[locale],
  alternates: {
    canonical: absolute(path),
    languages: {
      en: absolute(`/en/perfumes/${product.slug}`),
      ar: absolute(`/ar/perfumes/${product.slug}`),
    },
  },
  openGraph: {
    type: "website",
    title: `${product.brand} ${product.name}`,
    description: product.description[locale],
    url: absolute(path),
    locale: locale === "ar" ? "ar_AE" : "en_US",
    alternateLocale: locale === "ar" ? ["en_US"] : ["ar_AE"],
    images: [{ url: absolute(product.image.src), alt: `${product.brand} ${product.name}` }],
  },
};
```

- [ ] Validate locale/product in `generateMetadata`, call the helper and set `metadataBase` at the locale root. Add page-specific home/catalogue equivalents, rather than letting a root canonical incorrectly identify every child page as the homepage.
- [ ] Build a Next.js `MetadataRoute.Sitemap` from current public product reads for both locales, including language alternatives. Do not include admin routes, arbitrary catalogue query URLs, fake modification dates or source paths. Set dynamic behavior so added products appear without rebuilding.
- [ ] Check rendered `<link rel="canonical">`, language alternatives, `og:title`, `og:description`, `og:image`, `og:url` and `/sitemap.xml` in Playwright. Verify the OG image loads locally; no external social scraper is contacted automatically.
- [ ] Preserve inherited staging noindex. A private/noindex demo cannot honestly promise public social-card scraping; this item proves correct preview metadata and assets.

**Gate:** All four remaining SEO items have actual rendered-output checks in both languages, including one newly saved admin product.

## Task 5 — GA4 approach, navigation views and WhatsApp clicks

**Covers:** A1, A2, A3. **Estimate:** 3–4 h of the analytics budget.

**Files:** analytics events/provider/tracked link modules, existing locale layout/enquiry component, `analytics.test.ts`, `tests/e2e/analytics.spec.ts`, `docs/demo/ANALYTICS.md`, `.env.example`.

**Event contract:**

```ts
export type EnquiryEvent = {
  event: "whatsapp_enquiry_click";
  locale: "en" | "ar";
  enquiry_type: "product" | "general";
  product_id?: string;
};
```

- [ ] Document the approved environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`, client-owned GA4 property/web stream, consent approach, one tag-injection path, event names and verification procedure.
- [ ] Write failing tests for sanitized page locations, correct product/general event parameters, no events before consent, and no tracking when ID is missing/invalid. Test no phone number, href, free-text query or enquiry text appears in emitted event payloads.
- [ ] Add an analytics provider under Suspense where navigation hooks require it. Load the tag only after granted analytics consent; no consent means no GA network calls. Use a minimal accessible consent control with a way to revoke it. Check persisted consent before script loading.
- [ ] Disable GA's automatic page view with `send_page_view: false` and disable enhanced-measurement history-based page views in the GA stream. Send one manual `page_view` on initial page load and each actual pathname change, with sanitized origin+pathname and safe referrer/title handling. Do not count filter-query-only changes as extra page views in this prototype. Do not automatically leak query strings or user-entered search text through page location/referrer/title defaults.
- [ ] Exclude admin routes from customer analytics. Consent first granted after navigation should send one current-page view, not replay the user's entire browsing history.
- [ ] Keep `EnquiryLink`'s server-side number/message generation; wrap only its enabled anchor with a small client tracking component. Emit the typed event without blocking the link or sending the WhatsApp message. Invalid-number disabled buttons must not emit click events.
- [ ] In Playwright stub the analytics transport/script and inspect its commands; prevent any real test traffic or external WhatsApp navigation. Verify initial/client-navigation/locale page views are not duplicated and that click events reference the right product.
- [ ] If an approved measurement ID/account is supplied, have the owner verify controlled events in GA4 DebugView/Realtime. Otherwise record integration verified with mocks and live-service verification pending; do not invent an ID or claim live data.

**Gate:** Documented integration approach and deterministic page/click events pass tests; real-service verification status is explicit. Missing owner credentials do not block implementing the adapter or example view.

## Task 6 — Clearly labelled example reporting view

**Covers:** A4. **Estimate:** 1–2 h of the analytics budget.

**Files:** `example-report.ts`, protected `/[locale]/admin/analytics/page.tsx`, admin styles and analytics/browser tests.

- [ ] Define a literal sample fixture with a fixed displayed example date range, page-view counts by public route and enquiry-click counts by product/locale. Do not generate numbers from supposed live traffic.
- [ ] Write a browser test requiring an admin session and asserting the visible label **“Example analytics — sample data, not live GA4 reporting.”** Assert totals match fixture rows and anonymous access is denied.
- [ ] Render a small accessible table and summary metrics using plain CSS, plus instructions linking to the owner's real GA4 reporting location when configured. Do not add GA Data API credentials or a chart library to satisfy a sample-view item.
- [ ] Show the distinction between product click intent and enquiries/messages actually received. Retain the example-data label in screenshots and the walkthrough.

**Gate:** A real navigable example reporting page exists and cannot be confused with live analytics.

## Task 7 — Plan the 1,000-product CSV import

**Covers:** M6. **Estimate:** 1–2 h.

**File:** `docs/demo/CSV_IMPORT_PLAN.md`.

- [ ] Specify a UTF-8 CSV schema aligned with `Product`, including stable ID/slug, brand/name/size, concentration labels, gender, family IDs, English/Arabic descriptions, English/Arabic note arrays, image asset mapping, caveats and featured flag. Define arrays as JSON-encoded cells with standard CSV quoting rather than an ambiguous delimiter.
- [ ] Include one valid bilingual example derived from existing safe demo data, and invalid examples for duplicate IDs/slugs, missing Arabic text, unknown family, unequal note counts and unsafe/missing images. Do not copy supplier price fields.
- [ ] Define preview/dry-run validation, row-numbered errors, explicit create/update modes, backup, transactional batches, resumable job/checkpoint approach for 1,000 records, idempotency by stable ID and a rollback/reconciliation procedure. Existing edited records must not be silently overwritten.
- [ ] Describe image preparation separately, approved photo rights and eventual replacement of temporary inventory. For spreadsheet error/export files, neutralize formula-leading text rather than producing executable spreadsheet cells.
- [ ] Define future importer acceptance: 1,000 valid unique records, repeat-run no duplicates, failed-batch rollback, bilingual search/route checks, and progress/error counts matching accepted/rejected rows. Mark the document as an import plan, not an implemented tool.

**Gate:** An engineer can implement the later importer from an explicit schema, examples and execution/recovery procedure. No 1,000-product population is attempted now.

## Task 8 — Regression release and evidence

**Covers:** Retains T1–T5 and verifies all new items. **Estimate:** 3–4 h.

- [ ] Run the existing clean-seed reference checks from `D:/Bts-demo` after stopping any separate preview on port 3000:

```bash
npm run data:audit
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

- [ ] Add and run the `npm run test:e2e:admin` script defined in Task 3 against its isolated database. Keep real admin credentials, runtime SQLite files, WAL/SHM files and test artifacts outside `public/` and source control.
- [ ] Verify homepage/catalogue/detail in both languages and all three designs at desktop/mobile widths; include 360 px smoke, 768 px tablet, keyboard focus and reduced motion. Inspect actual screenshots, not just exit codes.
- [ ] Verify product edit/add persists through a real process restart and appears in customer pages, metadata and sitemap without a rebuild. Check unauthenticated mutation rejection and no client credential leaks.
- [ ] Verify no GA requests before consent and no external WhatsApp messages from tests. Record the owner-dependent live GA validation status separately from the sample-report demonstration.
- [ ] Update `README.md` with storage initialization, login setup, backup/restore, Node SQLite experimental/runtime limitations and no-serverless-local-disk caveat. Update QA, walkthrough and checklist with evidence for each remaining ID.

**Gate:** All 31 checklist items have verified evidence under their agreed prototype scope; no critical regression in the original customer journey. Do not mark unchecked live integrations complete solely from a sample report.

## Dependencies, approvals and handoff

Execution order for one contributor: storage → login → edit/add → SEO → GA4 adapter → example view → CSV plan → full regression. SEO/analytics can be prepared independently, but the estimate does not assume parallel contributors. Approve local SQLite before storage work; require different persistence planning if deployment must use ephemeral serverless storage.

Needed from the owner: approved site origin for absolute public metadata, and approved GA4 property/measurement ID plus account access for live verification. These can be requested before implementation without collecting passwords in chat. No WordPress/plugin clarification is required: the updated checklist resolved that issue.

Planning did not install dependencies, modify product code, run full test suites, deploy, connect Google accounts, initialize Git or send WhatsApp messages. The only runtime probe created an in-memory SQLite table and closed it.

## Sources checked during planning

- Current repository product model/repository, locale layout/detail route, enquiry component, unit tests and browser tests/config.
- https://nextjs.org/docs/app/api-reference/functions/generate-metadata — canonical/alternates and Open Graph metadata APIs.
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap — metadata sitemap route and language alternatives.
- https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications — SPA page-view measurement and debug verification.
- https://developers.google.com/analytics/devguides/collection/ga4/events — custom event emission.
