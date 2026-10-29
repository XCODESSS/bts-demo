# Web Interface Compliance Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve every finding in the website-wide Web Interface Guidelines review without breaking the bilingual storefront, existing designs, catalogue persistence, or enquiry flow.

**Architecture:** Keep the existing Next.js application, CSS Modules, Radix primitives, Server Actions, product repository, and private SQLite boundary. Fix shared presentation centrally; introduce small pure helpers only for URL state, formatting, admin pagination, and structured form feedback. Verify user-visible behavior through the existing Vitest and installed-Chrome Playwright suites.

**Tech Stack:** Next.js 16.4.3, React/React DOM 19.3.1, TypeScript 5.9.3, CSS Modules, Fontsource, Radix UI 1.8.1, existing Tailwind/shadcn utilities, Vitest 5.0.5, Playwright 1.64.1, Node 22.23.4.

**Spec:** The user's website-wide review, verdict, and request to plan fixes in this conversation supply the remediation requirements; no separate remediation specification existed. The complete coverage map below carries those requirements with this plan. Preserve current functional requirements in `README.md`, `docs/demo/SPEC.md`, `docs/demo/STOREFRONT_REDESIGN.md`, and `docs/demo/SHADCN.md` except for the explicitly listed behavior changes.

## Global Constraints

- This is a plan, not implementation authorization. Do not change application code until the user approves execution.
- Harness compatibility: the named Superpowers execution skills in the template header are not registered in this Pi session. Do not install them or treat that header as delegation authorization. Execute inline using the available tools after approval; use Pi subagents only if the user separately authorizes delegation.
- No git repository was present at inspection (`git status` reports “not a git repository”). Do not initialize one, create worktrees, or commit. Each task ends in a review checkpoint instead of an unauthorized commit.
- Preserve the installed framework/library versions. Add no runtime dependency or test package for this work.
- Preserve the existing backend, signed sessions, origin checks, rate limiting, immutable product IDs/slugs, approved image allowlist, and persisted records. Form feedback may change; authorization and validation must not weaken.
- Never edit `.env.local`, reseed/reset the operator database, modify `D:/perfume-search`, or print credentials/contact settings. Admin browser tests use their existing temporary databases and owned port 3101.
- Preserve approved logo artwork, real product photographs, truthful demo-price/review disclosures, WhatsApp recipient validation, translated messages, noindex metadata, and consent-gated analytics.
- No cart, checkout, payment, fabricated business policies, new inventory fields, public deployment, publication, or external WhatsApp send.
- Preserve English/Arabic route identity, natural RTL, URL-backed catalogue filters, validated product return queries, no-JavaScript catalogue access, and server-rendered section geometry.
- Preserve all designs in `src/components/designs.ts`, not just the three in the original audit. At planning time the registry contains `atelier`, `gallery`, `linen`, and newly added `salon`. Salon/spotlight files were changing during inspection: re-read touched files before implementation and do not overwrite another worker's changes.
- Keep native keyboard behavior, visible focus, labelled controls, permitted zoom, reduced-motion handling, and 44px primary touch targets. Do not add redundant keyboard handlers to native buttons/links.
- Use Chicago-style Title Case for English UI headings/buttons, neutral/second-person action copy, curly prose punctuation, `…` for pending labels/placeholders, and non-breaking number/unit pairs. Do not title-case official product names, Arabic, paragraphs, IDs, or URLs.
- Pre-existing exact pricing copy **Inquire for prices** / **يرجى الاستفسار عن الأسعار** remains unchanged; it is contract copy, not a button/heading to mechanically recase.
- Do not hide overflow globally to make tests pass. Fix the actual overflowing content and verify long values.
- Run one red → green slice at a time. Test seams proposed below must be accepted with execution approval; do not write tests at additional seams without agreement.

---

## 1. Evidence, decisions, and compatibility

### Verified during planning

- Source guidelines freshly fetched on 2026-10-29: <https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md>.
- Seed data: 100 products; catalogue is already paginated at 12, so do **not** virtualize the public catalogue. The brand modal currently contains 40 links, below the guideline's >50-item threshold. The admin table renders all products and needs pagination.
- Earlier browser review observed 320px English overflow: Gallery footer heading reached ~323px; Linen WhatsApp action reached ~332px. Do not assume fixing one theme fixes all.
- Rendered public catalogue/product pages skip H2 before card/accordion H3 headings.
- Rendered documents lacked font preload links and `theme-color`.
- Browser tooling uses installed Chrome (`channel: "chrome"`). Default bundled Chromium is absent; no browser download is necessary.
- The dev preview owns port 3000. Public production checks should use `BTS_TEST_PORT=3102`; admin checks own 3101. Do not terminate unknown processes or build while another worker is using the same `.next` output.

### Resolve conflicts before coding

1. **No Pause button:** historical user instructions explicitly removed it. Resolve the motion finding by changing decorative hero loops to one finite sequence ending within 4 seconds, not by reintroducing that control. Hover/entry feedback remains.
2. **Accordion closing motion:** preserve animated opening/closing, but animate opacity on the Radix content rather than measured height. Layout changes once at the presence boundary; do not promise smooth height interpolation.
3. **Tab indicator:** preserve smooth movement. Its measured size changes immediately; only translation animates. This intentionally replaces layout-property interpolation.
4. **Root locale:** `/` remains English with absent/unsupported preferences, but Arabic-preferring requests redirect to `/ar`. This is the one deliberate change to the older always-English root contract. Explicit `/en` and `/ar` never redirect based on headers.
5. **CSS colors/shadows:** keep visible hover color/border/shadow changes, but apply paint-property changes immediately; animate only transform/opacity. Finite presence transitions for native dialogs may still use discrete `display`/`overlay` switching.
6. **Native scroll offsets:** the app already has `scroll-padding-top: 24px`; retain the stable-anchor behavior. Do not add a second 24px offset indiscriminately.
7. **Transient preferences:** design selection stays in the existing local-storage/session mechanism. URL persistence applies to shareable discovery tabs, information topics, and product disclosure panels; it does not require URL parameters for image failures, pending states, or menu visibility.
8. **Auth errors:** invalid credentials stay non-enumerating; associate the shared message with both inputs and focus Username. Never identify which credential was incorrect.

### Documentation to consult at execution

Relevant installed guides were inspected; resolve these under `node_modules/next/dist/docs/`:

- `01-app/01-getting-started/13-fonts.md` and `01-app/03-api-reference/02-components/font.md`: local file paths, CSS variables, `display`, `preload`.
- `01-app/03-api-reference/02-components/image.md`: Next 16 deprecates `priority`; use eager loading/fetch priority without also setting `preload`.
- `01-app/02-guides/forms.md`: serializable `useActionState` results, validation, pending feedback, action authorization.
- `01-app/03-api-reference/02-components/link.md`: supported navigation prevention; no imaginary App Router blocker API.
- `01-app/03-api-reference/04-functions/use-search-params.md`, `use-router.md`, and `01-app/01-getting-started/04-linking-and-navigating.md`: URL state, Suspense, native History API integration.
- `01-app/03-api-reference/04-functions/generate-viewport.md`: `themeColor` belongs in `Viewport`, not `Metadata`.
- `01-app/02-guides/internationalization.md` and `01-app/03-api-reference/03-file-conventions/proxy.md`: `src/proxy.ts` convention and root-only matcher.
- `D:/inspect_ai/skills/skills/engineering/tdd/SKILL.md`, `tests.md`, and `mocking.md`: test public behavior, real temporary storage, no mocks of internal modules.

## 2. Complete finding-to-task map

Locations identify the audited symbols, not immutable line numbers; current Salon additions have shifted lines.

| Finding family and audited locations | Resolution |
| --- | --- |
| `globals.css`: fine-pointer overscroll, manipulation touch behavior, safe areas, footer overflow | Task 1 |
| Three scrollable dialogs: footer information, brands, product photo | Task 1 |
| `globals.css`: heading wrapping; product/admin number comparisons | Task 3 |
| Header wordmark and product/brand identifiers lack translation protection | Task 2 |
| Header brand/search/mobile links, language link, brand-directory trigger, catalogue controls, product links/accordion, analytics buttons lack hover feedback | Task 2 |
| Header/catalogue/admin searches lack autocomplete; filter selects lack names | Task 2 |
| Brand search lacks name/autocomplete/example placeholder; mobile focus is forced | Task 2 |
| Product card H3 and Radix accordion H3 skip hierarchy | Task 2 |
| Product ID/slug/username spellcheck; product placeholder units/ellipsis | Tasks 2, 3 |
| English sentence-case headings/buttons, first-person labels, generic search example | Task 3 |
| Raw discount percentages and admin counts; hardcoded example date range | Task 3 |
| Font preloads, theme-color, prominent center hero image lazy loading | Task 4 |
| Shared shadow/border interpolation, `transition-all`, height/width animations, read/write interleaving | Task 5 |
| Continuous hero animation without pause/stop | Task 5; finite <=4s sequence |
| Discovery tab not URL-backed | Task 6 |
| Footer topics not deep-linkable | Task 7 |
| Product disclosures not deep-linkable | Task 8 |
| Product/server validation has only global errors, no error focus | Task 9 |
| Login error association/focus, pending spinners/live messages | Task 10 |
| Product form missing dirty-navigation warning | Task 10 |
| Admin product list: >50 rows, raw count, no useful empty state | Task 11; count formatter from Task 3 |
| Root hardcodes English instead of reading preferences | Task 12 |
| Full compliance, existing journeys, privacy/storage boundaries | Task 13 |

## 3. File and responsibility map

### Existing files to modify

- `src/app/[locale]/globals.css`: shared layout, safe gutters, typography, touch/hover defaults, presence/pending styles. Keep changes grouped by responsibility.
- `src/styles/salon.css`: preserve opt-in overrides; use the shared display-font variable and ensure narrow/RTL behavior remains correct.
- `src/app/[locale]/layout.tsx`: local font variables, viewport declaration, existing pre-paint design restoration.
- `src/components/designs.ts`, `src/components/language-switch.tsx`: typed design canvas colors and meta-color synchronization through all existing restore/apply/storage paths.
- `src/components/site-header.tsx`, `site-header.module.css`, `catalogue-search.tsx`, `mobile-menu.tsx`: identity semantics, header interaction feedback, search attributes.
- `src/components/site-footer.tsx`, `footer-information.tsx`, `footer-information.module.css`: protected brand text, information URL state and existing modal behavior.
- `src/components/card-motion.module.css`, `ui/tabs.tsx`, `ui/accordion.tsx`: compositor-safe transitions, configurable heading level, presence behavior.
- `src/features/home/brand-directory.tsx`, `discovery.module.css`: search semantics, device-aware initial focus, scroll containment, trigger feedback.
- `src/features/home/campaign-hero.tsx`, `campaign-hero.module.css`: critical image scheduling and finite decorative motion; preserve current `spotlights` props/Salon composition.
- `src/features/home/collections-browser.tsx`, `collections.module.css`: URL-selected tabs, batched measurement, transform-only indicator movement.
- `src/features/home/scent-spotlight.tsx`, `scent-spotlight.module.css`: only shared identity/copy/animation consistency where necessary; do not replace the new Salon feature.
- `src/features/catalogue/catalogue-controls.tsx`, `catalogue-view.tsx`, `catalogue.module.css`: field names/autocomplete/hover, contextual card heading level.
- `src/features/products/product-card.tsx`, `product-detail.tsx`, `product-gallery.tsx`, `product-image.tsx`, `product.module.css`: contextual headings, protected names, localized percentages, URL disclosure integration, critical/lazy images, contained photo dialog.
- `src/features/products/product-validation.ts`: typed field-addressable validation errors while retaining `validateProduct(input: unknown): Product` and all store checks.
- `src/features/admin/product-form.tsx`, `product-actions.ts`, `login-form.tsx`, `login-actions.ts`, `admin.module.css`: accessible action state, dirty state, pending feedback; no authentication/storage redesign.
- `src/app/[locale]/admin/products/page.tsx`, `admin/analytics/page.tsx`, `admin/layout.tsx`, `admin/login/page.tsx`, `admin/products/new/page.tsx`, `admin/products/[id]/page.tsx`, `src/features/admin/admin-nav.tsx`: bounded list, formatted report, explicit English admin content, title-cased headings/actions.
- `src/features/analytics/example-report.ts`, `analytics-provider.tsx`, `analytics.module.css`: structured dates, neutral labels, consent-button feedback without changing transport.
- `src/i18n/dictionaries.ts`: explicit reviewed UI copy and example placeholders, not blanket title-casing of all strings.
- `next.config.ts`: remove only the unconditional root redirect after its replacement is tested.
- Existing affected tests under `tests/e2e/`: update changed English accessible names and deliberately superseded animation assertions without weakening behavioral coverage.
- `README.md`, `docs/demo/QA.md`, `docs/demo/SHADCN.md`, `docs/demo/STOREFRONT_REDESIGN.md`, `docs/demo/SPEC.md`: document only implemented behavior/evidence, retain historical entries.

### New narrowly scoped files

- `src/lib/interface-state.ts`: pure allowlisted URL-state parsing/serialization.
- `src/lib/format.ts`: deterministic locale-aware discount/count/date formatting.
- `src/styles/fonts.ts`: local font definitions using already-installed files, no remote fetch.
- `src/features/products/product-details-accordion.tsx`: controlled URL-backed product accordion; consumes server-rendered panel content.
- `src/features/admin/product-form-state.ts`: serializable form field/state types and safe submitted-value extraction.
- `src/features/admin/use-unsaved-changes.ts`: form-scoped dirty/unload/normal-link/submission protection.
- `src/features/admin/products-query.ts`: pure search and 25-row pagination over repository products.
- `src/i18n/preferred-locale.ts`, `src/proxy.ts`: quality-weighted English/Arabic negotiation and root-only HTTP redirect.
- `tests/e2e/interface-layout.spec.ts`, `interface-semantics.spec.ts`, `interface-assets.spec.ts`, `interface-state.spec.ts`, `interface-motion.spec.ts`, `interface-hover.spec.ts`: browser-visible compliance regressions.
- `tests/unit/interface-state.test.ts`, `format.test.ts`, `admin-products-query.test.ts`, `preferred-locale.test.ts`: pure public seams.
- Extend `tests/e2e/admin.spec.ts` for form/list behavior using its existing real isolated server. Do not create a second independent admin fixture/server on 3101.
- Extend `tests/unit/product-store.test.ts` to prove field-aware errors do not weaken product persistence validation.

## 4. Execution and test protocol

Proposed seams for approval: pure format/URL/locale/admin-query functions; real browser DOM/keyboard/history behavior; public product-validation/store interfaces; real admin actions against disposable storage. No private-hook snapshots or mocked repository/Router internals.

Start with `npm test`, `npm run typecheck`, and `npm run lint`; record existing failures separately. Before each browser red/green run rebuild sequentially:

```bash
npm run build
BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/interface-layout.spec.ts --project=desktop
```

A production Playwright run does not reflect source edits until rebuilt. Existing development port 3000 can remain available unless it conflicts with the shared `.next` build output; coordinate before changing its lifecycle. Run public and admin suites sequentially. Do not use the real admin credentials to speed up tests.

Each numbered task below is independently reviewable. Each checkbox is a small action; larger file lists are split into explicit slices. After each slice: one test red, minimum implementation, same test green. A review checkpoint means inspect the changed files plus focused test result; do not silently commit.

---

### Task 1: Narrow layouts, safe areas, touch behavior, and modal scrolling

**Files:** Modify `src/app/[locale]/globals.css`, `src/components/site-header.module.css`, `src/components/footer-information.module.css`, `src/features/home/discovery.module.css`, `src/features/products/product.module.css`, and only conflicting safe-area overrides in `src/styles/salon.css`. Create `tests/e2e/interface-layout.spec.ts`.

**Interfaces:** Existing `.page-width`, `.footer-main`, `.footer-bottom`, native `<dialog>`, `designIds`, and `getDictionary(locale)` remain the public seams. No new application API.

- [ ] Add the first regression, targeting the actual footer rather than a clipped document:

```ts
import { expect, test } from "@playwright/test";
import { designIds } from "../../src/components/designs";

test("320px footer content fits in every registered design", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}`);
    for (const design of designIds) {
      await page.evaluate(id => document.documentElement.dataset.design = id, design);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const escaped = await page.getByRole("contentinfo").locator("h2,a,button").evaluateAll(elements =>
        elements.filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
        }).map(el => el.textContent));
      expect(escaped).toEqual([]);
    }
  }
});
```

- [ ] Build/run `BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/interface-layout.spec.ts --project=desktop`. Expected red: Gallery/Linen content escapes at 320px.
- [ ] Replace unconstrained fractional footer tracks with `minmax(0, …)` tracks. Below 380px use a one-column footer, retaining Salon's existing one-column presentation. Add `max-width:100%`, `min-width:0`, wrapping/overflow-wrap to footer links/actions/headings; do not truncate actionable text.
- [ ] Re-run the focused test after rebuilding. Expected green for all current registry entries in both locales.
- [ ] Add a second browser case opening each information/brand/photo dialog and checking `overscroll-behavior-y: contain`, Escape dismissal, and focus return. Use `getDictionary` for accessible names; keep the chooser's already-correct containment.
- [ ] Apply `overscroll-behavior: contain` to `.dialog`, `.brandDialog`, and `.photoDialog`; retain body-scroll locking. Rebuild/run the modal case; expected green.
- [ ] Add and verify shared CSS:

```css
:where(button, a, input, select, textarea, summary) { touch-action: manipulation; }
@media (pointer: fine) { html { overscroll-behavior: none; } }
h1, h2, h3, h4, h5, h6 { overflow-wrap: anywhere; }
.page-width {
  padding-left: max(var(--page-gutter), env(safe-area-inset-left, 0px));
  padding-right: max(var(--page-gutter), env(safe-area-inset-right, 0px));
}
.footer-bottom { padding-bottom: max(16px, env(safe-area-inset-bottom, 0px)); }
```

Apply equivalent physical safe gutters to header `.inner`, which currently owns independent padding. Check mobile overrides do not replace them. Coarse-pointer root overscroll must remain `auto`; never set `touch-action:none` or disable pinch zoom.
- [ ] Expand the layout case to widths 360/390/768/1440 and home/catalogue/product routes in both locales, splitting tests to stay within normal timeouts. Review gate: no clipped controls, no global overflow masking, safe-gutter declarations and keyboard focus remain intact.

### Task 2: Semantic headings, control attributes, identity protection, and visible interaction states

**Files:** Header/search/menu/footer files; `brand-directory.tsx`; catalogue controls/view; product card/detail/gallery; `ui/accordion.tsx`; corresponding CSS; `analytics.module.css`; product/admin forms for attributes only. Create `tests/e2e/interface-semantics.spec.ts` and `interface-hover.spec.ts`.

**Interfaces:** Add `ProductCard` prop `headingLevel?: 2 | 3` (default 3) and `AccordionTrigger` prop `headingLevel?: 2 | 3` (default 3). Existing call sites remain compatible. Catalogue passes 2; featured/related sections retain 3; product disclosure triggers pass 2.

- [ ] Add this catalogue browser regression in `interface-semantics.spec.ts`; run it against the production build and observe the current zero count:

```ts
import { expect, test } from "@playwright/test";
test("catalogue product headings do not skip a level", async ({ page }) => {
  await page.goto("/en/catalogue");
  await expect(page.getByTestId("product-card").getByRole("heading", { level: 2 })).toHaveCount(12);
});
```
- [ ] Render `const Heading = headingLevel === 2 ? "h2" : "h3"` in ProductCard and style `.cardTitle` rather than `.cardBody h3` (including the mobile rule). CatalogueView passes `headingLevel={2}`. Rebuild/run; expected 12 H2 cards, unchanged featured/related H3.
- [ ] Add a detail-page test expecting “About this fragrance”/“Selected notes” as H2 headings containing buttons. Use `AccordionPrimitive.Header asChild` around the chosen Heading; keep Radix IDs/ARIA and keyboard behavior. Rebuild/run; expected no H1→H3 skip.
- [ ] Add attribute assertions for header search, catalogue search/selects, brand-modal search, admin searches, Product ID/slug, and Username. Implement:
  - Search inputs: meaningful existing names plus `autoComplete="off"`.
  - Filter selects: `name="brand"`, `gender`, `family`, `note`, `sort`.
  - Brand search: `name="houseQuery"`, autocomplete off, `placeholder={d.searchHousesHint}`; add paired dictionary keys, e.g. English `Dior…`, Arabic `ديور…`.
  - Product form: `autoComplete="off"` on the form; ID/slug add `spellCheck={false}` and `autoCapitalize="none"`.
  - Username: keep auth autocomplete, add spellcheck false/autocapitalize none. Do not turn auth autocomplete off or block paste.
- [ ] Add desktop/mobile brand-dialog focus cases: desktop opens on search, coarse-pointer mobile opens on its close button. Change only the explicit focus call:

```ts
if (window.matchMedia("(pointer: fine)").matches) input.current?.focus();
```

Preserve explicit Clear Search focus after the user has already interacted with the input. Update the old navigation-basics assertion to require initial search focus only on desktop.
- [ ] Add `translate="no"` on the header wordmark, footer brand/name/handle, product/house name containers, campaign captions, detail breadcrumb identity, gallery caption, and Salon spotlight identities. Keep `<bdi>` and locale-specific descriptive prose. For official brand phrases in prose use a small protected span, not `translate="no"` on entire translated sections. Verify those rendered identity containers carry the attribute.
- [ ] Add hover cases comparing actual background/border/text-decoration or transform before/after hover (not just class names). Cover header brand/search/mobile navigation, language switch, all-houses action, catalogue search/filter/chips/clear, product breadcrumbs/back/families/details/accordion, and analytics consent controls when configured.
- [ ] Add immediate contrast-increasing CSS states. For example:

```css
/* Header module */
.brand:hover .wordmark { text-decoration: underline; text-underline-offset: 4px; }
.search button:hover { background: #1e392f; }
.mobileNavigation a:hover { text-decoration: underline; background: var(--sage); }
/* Product module */
.familyList a:hover, .detailsLink:hover { background: var(--sage); border-color: var(--forest); }
.accordionTrigger:hover { background: var(--sage); }
.breadcrumbs a:hover, .back:hover { text-decoration: underline; }
```

Use equivalents in the other owning stylesheets. Do not animate colors, remove focus outlines, or make gold-on-white small text. Native hover states are not substitutes for keyboard focus.
- [ ] Rebuild/run both new files and `navigation-basics.spec.ts`; review gate: native semantics, accessible names, and focus restoration work in English/Arabic and Salon is unchanged structurally.

### Task 3: Typography, explicit UI copy, and locale-aware formatting

**Files:** Create `src/lib/format.ts`, `tests/unit/format.test.ts`. Modify dictionaries, globals, `salon.css`, product card/gallery/CSS, admin report/list/CSS, `example-report.ts`, admin headings/actions, and analytics button copy. Update exact-English test expectations alongside the relevant UI change.

**Interfaces:** Export `formatDiscount(percent: number, locale: Locale): string`, `formatCount(count: number, locale: Locale): string`, and `formatExamplePeriod(start: string, end: string, locale: Locale): string`. Example report replaces `period` with ISO `periodStart`/`periodEnd` (date-only UTC inputs).

- [ ] Write the first unit tests:

```ts
import { expect, test } from "vitest";
import { formatDiscount, formatExamplePeriod } from "../../src/lib/format";

test("discounts use localized signed percent formatting", () => {
  expect(formatDiscount(30, "en")).toBe("−30%");
  expect(formatDiscount(30, "ar")).toContain("٣٠");
});
test("example periods are deterministic date ranges", () => {
  expect(formatExamplePeriod("2026-10-19", "2026-10-25", "en")).toBe("19\u2009–\u200925 October 2026");
});
```

- [ ] Run `npm test -- tests/unit/format.test.ts`; expected red: helper module absent. Implement the formatting boundary:

```ts
import type { Locale } from "../i18n/config";
export function formatDiscount(percent: number, locale: Locale): string {
  return `−${new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(percent / 100)}`;
}
export function formatCount(count: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(count);
}
export function formatExamplePeriod(start: string, end: string, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ar-AE", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
  return formatter.formatRange(new Date(`${start}T00:00:00Z`), new Date(`${end}T00:00:00Z`));
}
```

The supported Node runtime was checked: en-GB formatRange emits U+2009 thin spaces around the en dash, as asserted above. Keep Arabic bidi marks intact and do not normalize them away merely to satisfy a test.
- [ ] Use formatDiscount in cards and gallery. Use formatCount for admin totals/cells and pagination labels; existing currency formatting stays unchanged. Replace example-report period with dates and render `Example Week: {formatExamplePeriod(...)}`. Add `font-variant-numeric: tabular-nums` to price values and admin metrics/numeric cells, not every paragraph.
- [ ] Add global `:where(h1,h2,h3,h4,h5,h6) { text-wrap: balance; }`, retaining Arabic line heights. Use `text-wrap: pretty` for longer supporting paragraphs where appropriate. Keep long brand names wrappable; do not non-break entire long product titles.
- [ ] Replace placeholders with actual examples: `Torino21, Dior, vanilla…` / `تورينو 21، ديور، فانيليا…`; bottle size `100\u00a0ml…`. This changes only form hint text, not stored `sizeLabel` or product data.
- [ ] Explicitly edit English heading/action dictionary values, including the new Salon values. Examples: `Customer Experiences`, `Featured Fragrances`, `Shop Perfume Collections`, `Shop by Perfume House`, `Choose a Design`, `Explore Collection`, `View Fragrance`, `Fragrance Profile`, `About This Fragrance`, `Selected Notes`, `Save Product`, `Sign In`, `Sign Out`. Replace `Track my order` with `Track Your Order`, `Visit our Instagram` with `Visit Instagram`, `Our approach` with `Your Fragrance Guide`, and `Our selection` with `Featured Selection`. Change `Three/Four light directions` counts only if the current registry requires it. Do not apply a generic runtime title-case transform.
- [ ] Use Title Case for hardcoded admin headings/nav/buttons as well. Mark the English-only admin shell with `lang="en" dir="ltr"` while leaving Arabic textareas explicitly Arabic/RTL; full admin translation is outside the existing spec. Keep descriptive sentences sentence case.
- [ ] Update the existing tests' changed English accessible-name literals in `journey`, `storefront`, `navigation-basics`, `product-polish`, `scroll-and-footer`, `visual`, `admin`, and SEO tests where applicable. Prefer `getDictionary` for UI identity while retaining independent literal expectations for substantive product/count/price data. Replace the Arabic-incompatible `/−\d+%/` assertion with locale-aware literal percent expectations; do not remove the discount check.
- [ ] Run `npm test -- tests/unit/format.test.ts`, typecheck, lint, build, and focused storefront/product/admin report tests. Review gate: actual currency/discount data unchanged; English and Arabic use appropriate numerals and no timezone-dependent date shift.

### Task 4: Critical fonts, image scheduling, and matching browser theme color

**Files:** Create `src/styles/fonts.ts` and `tests/e2e/interface-assets.spec.ts`; modify locale layout/globals, `salon.css`, `designs.ts`, `language-switch.tsx`, ProductImage, campaign hero, and above-fold logo Image props.

**Interfaces:** Preserve `ProductImage`'s existing `priority?: boolean` caller contract, but implement it with modern Next Image `loading`/`fetchPriority`. Export typed `designCanvas: Record<DesignId, string>` next to the design registry.

- [ ] Add this asset browser regression. Extend it with actual chooser clicks and expected canvas colors for every registered design, rather than mutating the root attribute to bypass application behavior. Rebuild/run; expected red against the audited behavior:

```ts
import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
test("critical local assets have discovery hints", async ({ page }) => {
  await page.goto("/en");
  const center = page.getByRole("region", { name: getDictionary("en").campaignProducts, exact: true })
    .getByRole("link").nth(1).locator("img");
  await expect(center).toHaveAttribute("loading", "eager");
  await expect(center).toHaveAttribute("fetchpriority", "high");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#fbfaf6");
  const fonts = page.locator('link[rel="preload"][as="font"]');
  expect(await fonts.count()).toBeGreaterThan(0);
  for (const font of await fonts.all()) {
    expect(new URL((await font.getAttribute("href"))!, page.url()).origin).toBe(new URL(page.url()).origin);
  }
});
```
- [ ] Define fonts using already-installed files, with static paths relative to `src/styles/fonts.ts`:

```ts
import localFont from "next/font/local";
export const manrope = localFont({
  src: [
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: true, variable: "--font-manrope",
});
```

Add Cormorant Latin 500/600 under `--font-cormorant`, and Noto Sans Arabic Arabic-subset 400/600 under `--font-arabic`. Those exact filenames were verified in their installed `files/` directories. For the Arabic-only family use `adjustFontFallback:false`, then explicitly fall back to Manrope in the Arabic body stack. Do not download fonts or import `next/font/google`.
- [ ] Remove the seven duplicate Fontsource CSS imports, apply all font variable classes to `<html>`, and replace hardcoded family usages with variables. Examples: `--body: var(--font-manrope), sans-serif`; `--display: var(--font-cormorant), Georgia, serif`; Arabic `--body: var(--font-arabic), var(--font-manrope), sans-serif`; Gallery display uses `--font-manrope`. Update Arabic language-switch and Salon's explicit Cormorant rule too. Confirm Arabic glyphs and Latin product names render, not just that preload tags exist.
- [ ] Add the supported viewport export:

```ts
import type { Viewport } from "next";
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: "#fbfaf6", colorScheme: "light",
};
```

Do not add maximumScale or disable userScalable.
- [ ] Add `designCanvas` values: Atelier/Salon `#fbfaf6`, Gallery `#ffffff`, Linen `#fcf9f3`. In the existing pre-paint script and every design-application/storage-restore path update the existing `meta[name="theme-color"]` content using this map. Preserve the existing invalid-storage/session fallback and avoid duplicate meta elements. Verify locale navigation also reapplies the selected color.
- [ ] Inside ProductImage replace deprecated Next `priority` with `loading={priority ? "eager" : "lazy"}` and `fetchPriority={priority ? "high" : undefined}`. In the classic hero make all three bounded above-fold photos eager/high; keep below-fold cards and modal-only photos lazy. Preserve width/height, unoptimized source behavior, fallback, and current Salon spotlight priority.
- [ ] Rebuild/run asset tests across both locales and all designs; run existing failed-image and design-persistence tests. Review gate: no duplicated font sources, font-display swap, no reference-site/CDN dependency, matching theme color after reload/storage/locale changes, lazy below-fold photos retained.

### Task 5: Finite, compositor-safe, interruptible motion

**Files:** `campaign-hero.module.css`, `collections-browser.tsx`, `collections.module.css`, `card-motion.module.css`, `ui/tabs.tsx`, `ui/accordion.tsx`, `globals.css`, product CSS, and current spotlight CSS where it animates paint. Create `tests/e2e/interface-motion.spec.ts`; update `product-polish.spec.ts`, `scroll-and-footer.spec.ts`, `storefront.spec.ts`.

**Interfaces:** Keep Radix selection/presence and card-hover behavior. New content animation names: `accordion-fade-in` and `accordion-fade-out`. No pause API/control.

- [ ] Add this browser regression. Confirm failure against infinite loops. Retain separate assertions that there is no Pause button and reduced motion yields no running motion:

```ts
import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
test("decorative campaign motion ends without a pause control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const stage = page.getByRole("region", { name: getDictionary("en").campaignProducts, exact: true });
  await expect.poll(() => stage.evaluate(el => el.getAnimations({ subtree: true })
    .some(animation => animation.playState === "running"))).toBe(true);
  // A timed wait is intentional: the requirement is a maximum autoplay duration.
  await page.waitForTimeout(4500);
  expect(await stage.evaluate(el => el.getAnimations({ subtree: true })
    .some(animation => animation.playState === "running"))).toBe(false);
  await expect(stage.getByRole("button", { name: /Pause|Resume/ })).toHaveCount(0);
});
```
- [ ] Use one finite sequence: bottle float 3.2s once, star turn 3.2s once, light sweep 3.2s once, with nonnegative delays <=0.3s. Replace negative stagger delays. The latest finishing decoration must finish by 3.5s; retain <=0.75s entrance. The star/light end state must be intentional, not a stuck bright strip. Use `both` only where the final keyframe represents the desired resting state.
- [ ] Add a normal/reduced-motion accordion close/open test for retained content visibility, aria-expanded, focus, and actual fade animation. Replace `animate-accordion-up/down` with CSS content-state opacity animations:

```css
@keyframes accordion-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes accordion-fade-out { from { opacity: 1; } to { opacity: 0; } }
[data-slot="accordion-content"][data-state="open"] { animation: accordion-fade-in 160ms ease-out; }
[data-slot="accordion-content"][data-state="closed"] { animation: accordion-fade-out 120ms ease-in; }
```

Keep the Radix content element mounted through its close animation; verify actual hidden state after completion. Remove the product-specific 320ms override. The existing global reduced-motion rule must still cancel these animations. Reopen mid-close in a test and require final open state.
- [ ] Replace both `transition-all` utilities with explicit transform/opacity transitions. Remove interpolated colors/background/border/shadow from touched shared CSS; preserve immediate hover state changes and transform lift. Do not remove visible hover feedback added in Task 2. Discrete native-dialog display/overlay transitions can remain.
- [ ] Batch measurements before the first write:

```ts
const metrics = {
  x: trigger.offsetLeft, y: trigger.offsetTop,
  width: trigger.offsetWidth, height: trigger.offsetHeight,
};
element.style.setProperty("--pill-x", `${metrics.x}px`);
element.style.setProperty("--pill-y", `${metrics.y}px`);
element.style.setProperty("--pill-width", `${metrics.width}px`);
element.style.setProperty("--pill-height", `${metrics.height}px`);
```

Change the pill's transition list to transform only, retaining the measured width/height as instantaneous geometry. Test unequal labels and RTL, including rapid End/Home/arrow selection.
- [ ] Move the animated accordion chevron rotation to an inner `<g>` with `transform-box:fill-box; transform-origin:center`, leaving the SVG box stable. Remove unnecessary animated translation of bare decorative SVGs in shared links, or animate a span wrapper instead. Keep static RTL direction correction.
- [ ] Run motion tests plus existing hover, keyboard-tab, reduced-motion, and stable-anchor tests. Review gate: no continuous autoplay >5s, no layout-property animation, no generic transition-all, and controls remain responsive mid-animation.

### Task 6: URL-backed discovery selection

**Files:** Create `src/lib/interface-state.ts`, `tests/unit/interface-state.test.ts`, `tests/e2e/interface-state.spec.ts`; modify `collections-browser.tsx` and only necessary Suspense boundaries in its server parent.

**Interfaces:** Export `type DiscoveryTab = "notes" | "families"`, `readDiscoveryTab(search: string): DiscoveryTab`, and `withSearchValue(href: string, key: string, value: string | null): string`. The latter accepts app-relative hrefs only and preserves other query keys/hash; it never accepts a navigation origin from user input. Query key is `discovery`; default notes omits it.

- [ ] Write the pure seam tests:

```ts
import { expect, test } from "vitest";
import { readDiscoveryTab, withSearchValue } from "../../src/lib/interface-state";
test("discovery state is allowlisted and preserves unrelated URL context", () => {
  expect(readDiscoveryTab("discovery=families")).toBe("families");
  expect(readDiscoveryTab("discovery=invalid")).toBe("notes");
  expect(withSearchValue("/en?info=shipping#scents", "discovery", "families"))
    .toBe("/en?info=shipping&discovery=families#scents");
});
```

Run `npm test -- tests/unit/interface-state.test.ts`; expected missing-module failure.
- [ ] Implement allowlisted parsing and the small URL helper using `URLSearchParams`, rejecting non-relative hrefs. Do not reuse catalogue serialization: it intentionally drops unrelated UI keys. Re-run unit tests green.
- [ ] Add a browser test: open `/en?discovery=families#scents`, expect Families selected, switch to Notes, reload, Back/Forward, switch locale, and expect the corresponding state each time without a document scroll jump. Add an invalid-value fallback test and a keyboard case in Arabic.
- [ ] Replace local tab useState with selection derived from `useSearchParams()`. On Radix value change use the installed Next native History API integration:

```ts
const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
window.history.pushState(null, "", withSearchValue(href, "discovery", value === "notes" ? null : value));
```

No document reload, no duplicated effect writing state back to the URL, and no raw external strings passed to router navigation. If the requested group is absent in an empty/bounded catalogue, use the first actual group. Preserve existing server-rendered content and fallback. Wrap the consumer in Suspense if the build requires it; do not replace sections with height-changing placeholders.
- [ ] Rebuild/run the state test plus `navigation-basics` and `scroll-and-footer`; review gate: click/keyboard state, direct links, history, locale changes, and stable geometry all work.

### Task 7: Deep-linkable footer information without focus/history regressions

**Files:** `src/lib/interface-state.ts`, `src/components/footer-information.tsx`, `site-footer.tsx`, their existing tests plus `interface-state.spec.ts`.

**Interfaces:** Add `type InformationTopic = "contact" | "tracking" | "shipping" | "returns"` and `readInformationTopic(search: string): InformationTopic | null`. Query key `info` works on existing localized routes; invalid values do not open a modal.

- [ ] Add pure tests for all four valid values, missing value, and `info=https://example.com`. Run red, add the parser, run green.
- [ ] Add this direct-entry case to `interface-state.spec.ts`, then a separate click→Back→Forward case and an Arabic equivalent. Existing imports of test/expect in that file are reused:

```ts
import { getDictionary } from "../../src/i18n/dictionaries";
test("shipping information is shareable without losing catalogue filters", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en/catalogue?brand=Dior&info=shipping");
  const dialog = page.getByRole("dialog", { name: d.shippingInfo, exact: true });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get("info")).toBeNull();
  expect(new URL(page.url()).searchParams.get("brand")).toBe("Dior");
  await expect(page.getByRole("contentinfo").getByRole("button", { name: d.shippingInfo, exact: true })).toBeFocused();
});
```
- [ ] Derive the topic from `useSearchParams`, push `info` on button activation with the Task 6 helper/native history API, and synchronize `showModal()/close()` in an effect. Register the current trigger before writing the URL. On direct loading, use the corresponding topic button as the focus-return fallback.
- [ ] On Escape/close/backdrop click, remove only `info` with `history.replaceState`; do not append a new closing entry. In `onClose`, read the **current** URL before clearing: a Back-driven close must not overwrite a newer URL or destroy Forward history. Call showModal only when `!dialog.open` and close only when open.
- [ ] Add a small Suspense boundary around FooterInformation in SiteFooter for useSearchParams. Preserve the rest of the server-rendered footer; avoid making the entire layout client-only.
- [ ] Rebuild/run new state cases and existing footer tests; review gate: topics are shareable, close preserves catalogue/discovery/product queries, no duplicate dialogs/history loop, native Escape/backdrop/focus behavior retained.

### Task 8: URL-backed product panels with server-rendered content

**Files:** Create `src/features/products/product-details-accordion.tsx`; modify product detail, interface-state helper/tests, and product-polish/state browser tests.

**Interfaces:** Add `type DetailPanel = "description" | "notes"`, `readDetailPanels(search: string): DetailPanel[]`, `serializeDetailPanels(panels: readonly DetailPanel[]): string | null`. Query key `details`: absent = both; `none` = neither; `description`, `notes`, or canonical `description,notes` = corresponding set (both serializes to omitted default); wholly invalid input = both.

- [ ] Unit-test absent/both/none/one/duplicates/unknown tokens; run red, implement canonical allowlisted helpers, run green.
- [ ] Add this browser tracer to `interface-state.spec.ts`; extend with Back/Forward and English→Arabic switching as separate slices:

```ts
test("product panels restore their URL state and keep the return query", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en/perfumes/diptyque-philosykos-p0170?return=note%3Dvanilla&details=notes");
  const article = page.getByRole("article", { name: "Philosykos", exact: true });
  const description = article.getByRole("button", { name: d.details, exact: true });
  await expect(description).toHaveAttribute("aria-expanded", "false");
  await expect(article.getByRole("button", { name: d.notes, exact: true })).toHaveAttribute("aria-expanded", "true");
  await description.click();
  await page.reload();
  await expect(description).toHaveAttribute("aria-expanded", "true");
  expect(new URL(page.url()).searchParams.get("return")).toBe("note=vanilla");
});
```
- [ ] Extract only the accordion's client control shell:

```ts
export function ProductDetailsAccordion(props: {
  descriptionLabel: string; notesLabel: string;
  description: React.ReactNode; notes: React.ReactNode;
}): React.ReactNode;
```

ProductDetail still renders the real descriptions/notes on the server and passes those nodes. The shell derives `value` from search params, updates `details` through native history, uses `type="multiple"`, and passes H2 trigger levels from Task 2. Keep both initially open when no parameter exists.
- [ ] Rebuild/run disclosure state and fade/presence tests from Task 5, plus product-return journeys. Review gate: no entire-product client data fetching, no hydration mismatch, URL controls panel state without losing return parameters or keyboard focus.

### Task 9: Field-addressable product errors and preservation of entered values

**Files:** Create `src/features/admin/product-form-state.ts`; modify product validation, product action/form, admin CSS; extend `tests/unit/product-store.test.ts` and `tests/e2e/admin.spec.ts`.

**Interfaces:** Preserve `validateProduct(input: unknown): Product`. Add exported `ProductValidationError extends Error` carrying `fields: readonly ProductFormField[]`. Define serializable state in a separate client-safe file:

```ts
export type ProductFormField =
  | "id" | "slug" | "brand" | "name" | "sizeLabel" | "concentration" | "gender"
  | "familyIds" | "descriptionEn" | "descriptionAr" | "notesEn" | "notesAr"
  | "image" | "caveatEn" | "caveatAr" | "featured";
export type ProductFormValues = Record<Exclude<ProductFormField, "familyIds">, string> & { familyIds: string[] };
export type ProductFormState = {
  attempt: number;
  message: string;
  fieldErrors: Partial<Record<ProductFormField, string>>;
  values: ProductFormValues | null;
};
export const initialProductFormState: ProductFormState = {
  attempt: 0, message: "", fieldErrors: {}, values: null,
};
```

`saveProduct(locale, existingId, previousState, form): Promise<ProductFormState>` returns this state on failure; successful writes retain the existing redirect outside the catch.

- [ ] Extend existing unit store/validation tests with this field-feedback tracer, then unsupported-image→`image` and missing-family→`familyIds` slices. Reuse/import `validateProduct` and the existing seed fixture, without mocks:

```ts
test("mismatched notes identify the paired form controls", () => {
  let failure: unknown;
  try {
    validateProduct({ ...products[0], notes: { en: ["Vanilla"], ar: [] } });
  } catch (error) { failure = error; }
  expect(failure).toMatchObject({ fields: ["notesEn", "notesAr"] });
});
```

Here `products` is the imported immutable seed fixture (add `import products from "../../src/data/products.json" with { type: "json" };` if the existing test uses another name). Run red. Do not weaken existing store rejection assertions.
- [ ] Replace applicable generic validation throws with ProductValidationError, assigning explicit form keys at validation sites. Text helper accepts a field key; localized helper maps `description`→descriptionEn/Ar and `image.caveat`→caveatEn/Ar. ID and slug syntax errors identify each offending field; notes length/pairing and families identify their real controls. Unknown whole-object/storage errors remain form-level. Keep all limits, enum checks, photo allowlist, duplicate checks, and immutable-ID behavior.
- [ ] In saveProduct keep requireAdmin and verifyActionOrigin **before** parsing/validation. Extract submitted values to a serializable plain object, increment `attempt`, map typed field errors directly, and return safe actionable text. Unique ID/slug conflict: `Choose a different Product ID or URL Slug; that identifier is already in use.` On edit these fields are immutable, so treat unexpected uniqueness errors as form-level instead of asking to edit readonly controls. Do not expose SQL/paths or blindly return arbitrary exception messages.
- [ ] In the real isolated admin test submit mismatched bilingual notes; expect inline errors at both fields, the first error focused, and all typed text/checkboxes retained. Follow with corrected notes and a real successful save; verify the public product page. Rebuild/run `npm run test:e2e:admin`; initial failure must be the missing field feedback, not credentials/setup.
- [ ] Render labels separately with stable IDs, `aria-invalid`, and `aria-describedby`; label checkbox-group errors from a fieldset and focus its first checkbox. Render a persistent `aria-live="polite"` summary and per-field messages. After each failed attempt focus the first invalid field in DOM order; for a form-level error focus a `tabIndex={-1}` summary.
- [ ] Preserve values across React action resets by rendering failed-submission defaults from `state.values` and keying the form body by `state.attempt`. For `familyIds` use membership; for `featured` store `"on"`/`""`. Do not let a failed save silently restore the original product values. On create a duplicate-ID failure must leave the proposed slug, descriptions, notes, and selected image visible.
- [ ] Run the whole unit suite and isolated admin suite, including unauthorized save after cookies are cleared and process-restart persistence. Review gate: field feedback improves without accepting previously rejected products or leaking server details.

### Task 10: Pending feedback, auth recovery, and unsaved-change protection

**Files:** Create `src/features/admin/use-unsaved-changes.ts`; modify product/login forms, login action messaging, admin CSS; extend the existing isolated admin browser suite.

**Interfaces:** `useUnsavedChanges(form: RefObject<HTMLFormElement | null>): boolean` returns the current dirty state and owns only form-associated listeners. It retains the original normalized default-value baseline for this product across failed-action body remounts; key ProductForm by product identity at route call sites if necessary. Pending feedback is driven by existing useActionState. Do not add an unsupported Router blocker.

- [ ] Add an admin test: wrong credentials keep the response generic, associate the message with Username/Password, and focus Username. Update the action copy to `Check your username and password, then try again.`; preserve setup/rate-limit guidance. Keep correct credential autocomplete, clear the password after failure, and retain Username through cheap controlled local state. Focus with an effect depending on `[error, pending]` when `error && !pending`, so a repeated identical failed response refocuses correctly.
- [ ] Add a real action request delay at the browser network boundary only: delay requests with the `next-action` header to the admin save/login routes by 400ms, then continue the unmodified request. Expect the submit action disabled **only during** the request, an aria-hidden spinner, `aria-busy`, and a persistent `role="status" aria-live="polite"` message (`Saving…` / `Signing in…`). Do not mock Server Actions or touch their internals.
- [ ] Implement a reusable `.pending-spinner` style using border styling plus transform rotation, hidden from assistive technology. In reduced motion use a static indicator with the same text. Do not add an unlabeled status node or read both a duplicate alert and status aloud.
- [ ] Add this test inside the existing `admin.spec.ts` fixture (the test-only `password` constant and server already exist). Then add dismissed-beforeunload, unchanged-form, failed-save, and successful-save cases in that same isolated suite:

```ts
test("cancelling dirty-form navigation preserves entered text", async ({ page }) => {
  await page.goto("/en/admin/login");
  await page.getByLabel("Username", { exact: true }).fill("test-operator");
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.goto("/en/admin/products/P0028");
  const description = page.getByLabel("English description", { exact: true });
  await description.fill("Unsaved interface-regression draft.");
  page.once("dialog", dialog => dialog.dismiss());
  await page.getByRole("link", { name: "View Storefront", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/products\/P0028$/);
  await expect(description).toHaveValue("Unsaved interface-regression draft.");
});
```

The action names follow Task 3's casing pass; descriptive form labels retain their existing accessible names. This test intentionally cancels rather than saving a fixture edit.
- [ ] Implement dirty comparison using an initial normalized FormData snapshot rather than “any input event means dirty forever”. Store the initial string in a hook ref before the first edit; recompute on input/change and after action completion without replacing the baseline on a failed attempt. The form element stays mounted; only the Task 9 field body remounts. Use this normalization:

```ts
function snapshot(form: HTMLFormElement): string {
  return JSON.stringify([...new FormData(form).entries()]
    .filter(([name]) => !name.startsWith("$ACTION_"))
    .map(([name, value]) => [name, String(value)] as const)
    .sort(([a, av], [b, bv]) => a.localeCompare(b) || av.localeCompare(bv)));
}
```

Family membership is order-independent; textarea content is not trimmed, so whitespace edits are retained accurately. Reverting all edits clears dirty state. Do not capture a failed submission as a new clean baseline.
- [ ] While active register native `beforeunload`:

```ts
function beforeUnload(event: BeforeUnloadEvent) {
  event.preventDefault();
  event.returnValue = "";
}
```

Also capture ordinary same-tab anchor clicks leaving the form route and submissions of other navigation/logout forms, confirming `You have unsaved product changes. Leave without saving?`. Cancellation prevents default/propagation. Ignore modified/new-tab/download clicks, same-document hash-only jumps, the product form's own submission, and links that cannot discard this page. Remove every listener on unmount/clean state. No synthetic history entries or patching private Next router methods.
- [ ] Explicit support boundary: native beforeunload covers document exits; the capture guard covers normal links/forms. App Router same-document browser Back/Forward has no stable blocking API here and is **not claimed protected** by this implementation. Keep the visible warning `Unsaved changes` while dirty; if full Back/Forward draft recovery is later required, scope an approved session-draft feature rather than promising a broken popstate veto. This satisfies the guideline's documented beforeunload option without changing router internals.
- [ ] Preserve dirty state after failed validation, do not allow an error to clear it, and suppress success-redirect warnings only after the actual save path succeeds. Do not permanently suppress warnings just because the user clicked Save. Test the framework action reset behavior from Task 9.
- [ ] Rebuild/run isolated admin checks; review gate: normal save/login/expiry paths still work, no auth enumeration, meaningful pending feedback, no accidental data loss on tested navigation seams.

### Task 11: Bounded admin browsing and useful zero-results recovery

**Files:** Create `src/features/admin/products-query.ts`, `tests/unit/admin-products-query.test.ts`; modify admin products page/CSS and `tests/e2e/admin.spec.ts`.

**Interfaces:** Export `ADMIN_PAGE_SIZE = 25` and `queryAdminProducts(products: readonly Product[], params: URLSearchParams): { items: readonly Product[]; total: number; page: number; totalPages: number; q: string }`. Preserve current search coverage over ID, brand, name, Arabic description and reuse existing normalizeSearch. Invalid/negative page→1; oversized page clamps; search terms combine with AND.

- [ ] Write a pure regression using the immutable seed fixtures:

```ts
import { expect, test } from "vitest";
import seed from "../../src/data/products.json" with { type: "json" };
import { validateProduct } from "../../src/features/products/product-validation";
import { queryAdminProducts } from "../../src/features/admin/products-query";
const products = seed.map(validateProduct);
test("admin browsing is bounded and searches real product identities", () => {
  const result = queryAdminProducts(products, new URLSearchParams());
  expect(result.total).toBe(100);
  expect(result.items).toHaveLength(25);
  expect(result.totalPages).toBe(4);
  expect(queryAdminProducts(products, new URLSearchParams("q=P0028")).items.map(p => p.id)).toEqual(["P0028"]);
  expect(queryAdminProducts(products, new URLSearchParams("q=__not_a_product__")).total).toBe(0);
});
```

- [ ] Run `npm test -- tests/unit/admin-products-query.test.ts`; implement bounded search/page slicing, then re-run green. Add negative/NaN/very-large page and multi-term tests one at a time.
- [ ] Render only `result.items` after requireAdmin. Search is GET with `name="q"` and no hidden current page, so new searches start page 1. Add semantic Previous/Next and numbered Link navigation preserving only q/page; mark aria-current and use formatCount for all labels.
- [ ] If total is zero, do not show an empty tbody: render `No Products Match Your Search`, `Try a different Product ID, brand, or name.`, and a real `Clear Search` link. Correct singular/plural count, e.g. `1 product`; preserve the existing `saved=1` redirect query but do not propagate it to every pagination link. Update the old isolated-test literal `1 products` to `1 product`.
- [ ] Extend the real admin browser test: first page has <=25 rows, next page URL/reload works, searching from page 2 resets it, absent search has recovery, clearing returns the real list. Keep the existing edit/add/restart/authorization journey intact.
- [ ] Rebuild/run pure tests and `npm run test:e2e:admin`; review gate: no dropped products, state survives reload, bounded DOM, truthful totals, no access before requireAdmin.

### Task 12: Initial language negotiation at the root only

**Files:** Create `src/i18n/preferred-locale.ts`, `src/proxy.ts`, `tests/unit/preferred-locale.test.ts`; modify `next.config.ts` and add HTTP cases to `interface-state.spec.ts`.

**Interfaces:** `preferredLocale(header: string | null): Locale`. Proxy matches exactly `/`, constructs a same-origin redirect from request.nextUrl, preserves the existing query, and sets `Vary: Accept-Language` plus `Cache-Control: private, no-store`. It never inspects IP or fetches geo data.

- [ ] Add independent fixtures before implementation:

```ts
expect(preferredLocale(null)).toBe("en");
expect(preferredLocale("ar-AE,ar;q=0.9,en;q=0.8")).toBe("ar");
expect(preferredLocale("en-US,en;q=0.9,ar;q=0.2")).toBe("en");
expect(preferredLocale("fr-FR,ar;q=0.7")).toBe("ar");
expect(preferredLocale("ar;q=0,en;q=0.5")).toBe("en");
expect(preferredLocale("ar;q=bad,en;q=0.5")).toBe("en");
expect(preferredLocale("fr-FR")).toBe("en");
```

- [ ] Run `npm test -- tests/unit/preferred-locale.test.ts`; implement a bounded two-locale parser: split ranges, validate q 0..1, discard malformed/zero q, reduce regional tags to supported base languages, select highest q with input-order ties, English fallback. For `*` choose a non-excluded supported language, English first; explicitly test `en;q=0,*;q=0.5`→Arabic. Do not introduce a general locale library for two languages.
- [ ] Add the narrow Next 16 proxy:

```ts
import { NextResponse, type NextRequest } from "next/server";
import { preferredLocale } from "./i18n/preferred-locale";
export function proxy(request: NextRequest) {
  const target = request.nextUrl.clone();
  target.pathname = `/${preferredLocale(request.headers.get("accept-language"))}`;
  const response = NextResponse.redirect(target, 307);
  response.headers.set("Vary", "Accept-Language");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: "/" };
```

Remove only the unconditional `/` entry from next.config redirects; preserve other current config added by other work.
- [ ] Add this HTTP tracer to `interface-state.spec.ts`, then missing/English preferences, explicit locale routes, assets, and admin matching cases:

```ts
test("the root negotiates Arabic and preserves query state", async ({ request }) => {
  const response = await request.get("/?discovery=families", {
    headers: { "accept-language": "ar-AE,ar;q=0.9,en;q=0.5" }, maxRedirects: 0,
  });
  expect(response.status()).toBe(307);
  const target = new URL(response.headers().location);
  expect(target.pathname).toBe("/ar");
  expect(target.searchParams.get("discovery")).toBe("families");
  expect(response.headers().vary).toContain("Accept-Language");
});
```

Explicit `/en/catalogue` must not redirect with Arabic headers; verify no redirect loops.
- [ ] Build/run unit and HTTP tests plus existing route/SEO/return-link tests. Review gate: root preference detection works without changing explicit locale routes, cookie policy, auth, or canonical URLs.

### Task 13: Integration evidence, fresh guideline review, and handoff

**Files:** All affected tests and docs listed above; no new application abstractions.

**Interfaces:** Existing npm scripts are the acceptance boundary. Every original finding must have an implemented fix and observed evidence or an explicitly explained disposition; this plan alone does not close a finding.

- [ ] Run the placeholder/type/signature review on the implemented changes and compare every row in the finding map to the actual code. Re-fetch the guideline source for the final review; distinguish newly discovered issues from the original scope.
- [ ] Run the full non-browser gate sequentially:

```bash
npm run data:audit
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: seed audit remains 100 accepted records/40 houses with no private fields; all tests/types/lint/build pass. Do not claim old counts as new execution evidence.
- [ ] Run the complete public production suite on the non-preview port, then the isolated admin suite:

```bash
BTS_TEST_PORT=3102 npm run test:e2e
npm run test:e2e:admin
```

Expected skips remain only documented configuration/device-specific cases. If the outer command deadline requires batches, record each batch and complete aggregate coverage; never describe a timed-out unfinished suite as passed.
- [ ] For optional analytics, use only the existing documented fixture-ID build and mock external Google transport as described in `docs/demo/ANALYTICS.md`; restore the ordinary build afterward without changing `.env.local`. Verify consent hover/pending/copy changes did not alter events or payload privacy.
- [ ] Capture/review screenshots under a new `artifacts/screenshots/interface-*` prefix: all registry designs in English/Arabic at 320/390/768/1440; home, catalogue, detail, open dialogs, error/pending admin states. Existing Salon intentionally hides classic reviews; do not fail it for a deliberately different composition or silently unhide it.
- [ ] Manually inspect keyboard focus, tab order, Escape/return focus, 200% zoom, long names/IDs, empty catalogue, invalid UI query parameters, rapid disclosure/tab toggling, reduced motion, font failure fallback, and no-JavaScript catalogue navigation. Actual iOS/Safari safe-area/hybrid-pointer/swipe behavior requires a physical/manual check; mark unperformed checks as unverified, not passed.
- [ ] Update README and append a new QA section with actual commands/results, screenshots, known browser-Back dirty-state support boundary, font changes, finite-motion decision, URL parameter contracts, pagination size, and locale negotiation behavior. Update SHADCN's outdated height-animation description and the latest brief/spec notes without rewriting historical evidence.
- [ ] Final review gate: map all original findings to results, report unresolved items plainly, preserve all concurrent Salon changes, and leave the website preview available if it was running. No deployment, reset, credential access, commit, or publication.

## Acceptance checklist

- [ ] Every original review finding is covered by the task map and a verified result.
- [ ] No document/control overflow at 320px, either locale, any registered design.
- [ ] Native semantics, visible focus, contained modals, hierarchy, protected brand identities, appropriate field attributes, and visible hover feedback are retained/improved.
- [ ] Hero motion ends within 4 seconds without restoring the removed Pause button; reduced motion stays still.
- [ ] Transition lists are explicit; motion changes transform/opacity, not layout/paint properties.
- [ ] Tab/topic/disclosure URL state supports direct entry, reload, history, and locale switching without contaminating catalogue return validation.
- [ ] Failed product submissions show actionable field errors, preserve entries, and focus the first error; pending actions have spinner/status feedback.
- [ ] Dirty forms warn on the documented unload/normal-navigation seams; unimplemented Router Back blocking is not misrepresented.
- [ ] Admin rows are bounded and empty search has recovery; sample numeric/date values use Intl with deterministic timezone behavior.
- [ ] Critical local fonts/images and per-design theme color are correct; below-fold images remain lazy.
- [ ] Root negotiation follows Accept-Language; explicit locale URLs remain authoritative.
- [ ] Public journeys, real isolated admin authorization/persistence, SEO, consent privacy, WhatsApp behavior, all designs, and no-JavaScript catalogue checks pass.
- [ ] No protected operator data/configuration changed and no production-readiness claim exceeds the executed evidence.
