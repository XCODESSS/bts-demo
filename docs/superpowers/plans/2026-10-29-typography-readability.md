# Typography and Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Execution override:** The operator explicitly said **“Dont use sub agents.”** Execute directly, one task at a time; do not delegate. The `superpowers:*` skills named by the generic header are not registered in this environment and are not implementation prerequisites. Use this document's explicit steps and existing repository tools instead. This plan does not authorize commits, pushes, worktree setup, or changes to global skills/settings.

**Goal:** Replace the current English editorial face with locally bundled Bodoni Moda where appropriate, retain readable Manrope/Noto Sans Arabic interfaces, and eliminate the undersized functional text identified in the frontend critique without breaking any of the four designs or bilingual flows.

**Architecture:** Keep the existing `next/font/local` loader in `src/styles/fonts.ts`, add one small shared typography-token stylesheet, and migrate existing CSS Modules to role-based sizes/families. Do not globally apply a serif to every heading: campaign/editorial headings use Bodoni, product identities and controls use Manrope, Arabic copy uses Noto, and Modern Gallery retains its documented sans-serif display direction. Fix original declarations and their responsive/theme overrides rather than appending a competing override stylesheet.

**Tech Stack:** Next.js 16.4.3, React/React DOM 19.3.1, TypeScript 5.9.3, CSS Modules/global CSS, Fontsource 5.3.0 packages, Playwright 1.64.1 using installed Chrome, Vitest 5.0.5, npm/package-lock.json.

**Spec:** There is no separate approved typography specification. Requirements come from the user's request to plan the font/size changes after the frontend critique and the preceding recommendation of Bodoni Moda + Manrope + Noto Sans Arabic. Evidence: `artifacts/critique-frontend/REPORT.md`, `browser-measurements.json`, and `detector-rendered-mobile.json`. Existing design constraints are documented in `docs/demo/DESIGN.md`, `docs/demo/SCENT_SALON.md`, `docs/demo/SPEC.md` (read its dated overrides), and `docs/demo/SHADCN.md`.

## Global Constraints

- Planning only until the operator authorizes implementation; do not install packages or edit application code while preparing this document.
- No subagents. Preserve all pre-existing tracked/untracked work; the checkout is already dirty.
- Keep Atelier as the default. Preserve `atelier`, `gallery`, `linen`, and `salon`, the chooser, persistence, and blocked-storage fallback.
- Keep the site light and retain brand teal `#07363C`, champagne `#D4B991`, and the existing approved logo/product photographs.
- Preserve product data, reference-photo caveats, exact identities, sample AED prices/discounts, truthful demo disclosures, and enquiry-only scope. Do not add checkout/cart/wishlist.
- Keep English/Arabic routes, RTL, query/filter/return state, consent behavior, and WhatsApp message/destination behavior unchanged.
- Official Latin product and house names remain Latin in Arabic pages and retain `translate="no"`/`bdi` semantics.
- Bodoni Moda is for large editorial text, never small controls or shopping facts. Modern Gallery retains sans-serif display; all designs receive the readability corrections.
- Manrope 400/500/600 and Noto Sans Arabic 400/600 remain local. Use only shipped weights; do not request 700/800 or italic files that were not loaded.
- Replace Cormorant with exactly `@fontsource/bodoni-moda@5.3.0`. Do not introduce runtime Google Fonts/CDN requests or migrate the font-loading mechanism.
- Text uses `rem` tokens; do not force `html { font-size: 16px }`, disable zoom, clamp names to hide content, or reduce copy to 9–10px to make a grid fit.
- Functional supporting text is at least 0.875rem (14px at the browser default). Body/input text is 1rem (16px). Full-size card titles are 1–1.125rem (16–18px).
- Only decorative chooser miniatures already inside `aria-hidden="true"` may use scaled-down mock text. Footer copyright/demo disclosure may use 0.8125rem (13px), but product demo prices/caveats remain at least 14px.
- Small normal text must meet 4.5:1 contrast; large text 3:1. A 14px size is a design quality target, not a claimed WCAG minimum-font rule. A 44px target is a comfort target, not proof every smaller control fails WCAG.
- Preserve reduced-motion, keyboard navigation, focus visibility, native dialog semantics, server-rendered content, and font-failure fallbacks.
- Keep the current no-Preflight shadcn/Tailwind integration. No framework/font-service/auth/database migration.
- Read the installed Next.js docs before implementing. Relevant verified paths are listed below; local docs take precedence over remembered APIs.
- Do not rebuild `.next` or occupy ports underneath somebody else's preview/test process. Use a free test port and coordinate before a production build if an existing process is using the same build directory.
- Do not read private credentials or use the live catalogue DB for tests. The admin suite creates isolated credentials/storage and owns port 3101.
- No automatic commit/push; review gates below are local validation checkpoints. If commits are later authorized, stage only these changes, not the existing unrelated edits.

---

## Inspected state and motivation

- `src/styles/fonts.ts` currently exports `manrope`, `cormorant`, and `arabic`, with 3/2/2 WOFF2 files respectively.
- `src/app/[locale]/layout.tsx:2,48` imports those exports and attaches their CSS-variable classes to `<html>`.
- `src/app/[locale]/globals.css:17–18` currently owns `--body` and `--display`. The Arabic rule changes `--body`; Gallery separately changes `--display`.
- Direct `--font-cormorant` references exist in `src/styles/salon.css:31` and `src/components/design-preview.module.css:22,25,30`; changing only `--display` would leave them stale.
- `product.module.css:184–197` reduces brand/action to 10px and metadata/demo label to 9px. Other 9–12px functional text exists in home/discovery/header/footer/chooser and catalogue styles.
- The critique measured 311 repeated undersized-functional-text flags across four rendered mobile pages, not 311 distinct implementation defects.
- `#56645E` text on the collections `#EAD7B9` surface measures 4.4137:1; use the existing darker brand ink there.
- Body styles, component rules, `font:` shorthands, responsive blocks, and higher-specificity Salon/Arabic rules interact. This is not fixed by changing `body { font-size }` alone.
- Existing Salon product titles use a serif even on Arabic pages, and its long-title test assumes at most two lines. The new product-identity rule deliberately makes these Manrope and prioritizes complete readable names over an arbitrary two-line cap.
- Protected admin has an explicit English `lang="en" dir="ltr"` shell inside either locale page. Retain Latin UI typography there while Arabic textareas keep their explicit script styling.

### Installed Next.js documentation to consult

- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/font.md` (`src`, `weight`, `fallback`, `adjustFontFallback`, `variable`, `preload`)
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` (CSS ordering and production chunking)
- `node_modules/next/dist/docs/01-app/02-guides/testing/playwright.md`

Verified during planning: npm reports Bodoni package version 5.3.0, and its package manifest lists `files/bodoni-moda-latin-500-normal.woff2` and `files/bodoni-moda-latin-600-normal.woff2`. Sources: `npm view @fontsource/bodoni-moda version dist.tarball --json` and `https://data.jsdelivr.com/v1/package/npm/@fontsource/bodoni-moda@5.3.0/flat`. No dependency was installed for this plan.

## File responsibility map

| File | Responsibility in this change |
|---|---|
| `package.json`, `package-lock.json` | Replace the single editorial-font dependency with a pinned version. |
| `src/styles/fonts.ts` | Register two Bodoni files through the existing local loader; retain Manrope/Noto definitions. |
| `src/styles/typography.css` **new** | Own shared family aliases, font-size roles, line-height roles, script policy and base body text. No component geometry. |
| `src/app/[locale]/layout.tsx` | Apply Bodoni's variable class and load the token stylesheet in a deliberate order. |
| `src/app/[locale]/globals.css` | Use typography roles for shared buttons, headings, footer/chooser and existing Gallery/Arabic rules. |
| `src/styles/salon.css` | Retain Salon geometry while adopting the shared roles; remove its direct Cormorant dependency. |
| `src/features/products/product.module.css` | Product identity, price, metadata, disclosure, detail/accordion/profile typography and responsive reflow. |
| `src/features/catalogue/catalogue.module.css` | Catalogue title, search/filter controls, result counts, chips and pagination typography. |
| `src/components/site-header.module.css` | Readable wordmark/navigation/search/language action, with safe 320px wrapping. |
| `src/features/home/campaign-hero.module.css` | Campaign statement and intro display face, readable supporting copy and bottle captions. |
| `src/features/home/home.module.css` | Shared homepage headings/disclosures and high-contrast collections copy. |
| `src/features/home/collections.module.css` | Readable note/family tabs and labels/counts. |
| `src/features/home/discovery.module.css` | House names/counts, searchable directory and gender-category copy. |
| `src/features/home/home-extras.module.css` | Advice/benefit copy, review labels/copy and Instagram text if these sections still exist at execution time. |
| `src/features/home/scent-spotlight.module.css` | Keep actual product identity in Manrope, not editorial serif. |
| `src/components/design-preview.module.css` | Update decorative thumbnail font references without enlarging its miniature text. |
| `src/components/footer-information.module.css` | Keep dialog UI headings/body on UI-family tokens. |
| `src/features/admin/admin.module.css` | English admin shell and form/table/metric typography; natural Arabic textareas. No form behavior changes. |
| `src/features/analytics/analytics.module.css` | Explicit readable consent copy/control typography if it does not inherit the intended roles. |
| `tests/e2e/helpers/typography.ts` **new** | Small browser assertions for computed family/size and document overflow. |
| `tests/e2e/typography.spec.ts` **new** | Public, rendered typography and script behavior. No source-text snapshots or private CSS-name assertions. |
| `tests/e2e/typography-reflow.spec.ts` **new** | Reflow, text-resize, font-failure and screenshot matrix. |
| `tests/e2e/salon.spec.ts` | Replace obsolete two-line title expectation with complete/non-clipped readable identity checks. Preserve early-enquiry regression. |
| `tests/e2e/interface-semantics.spec.ts` | Extend existing font-failure coverage only where the new suite does not already cover it. |
| `tests/e2e/admin.spec.ts` | Add typography checks inside existing isolated authenticated flow; never use live credentials. |
| `docs/demo/DESIGN.md`, `docs/demo/SCENT_SALON.md`, `docs/demo/QA.md` | Record the current roles, deliberate Gallery exception, targets, evidence and limitations. |

Do not edit data, server actions, routing, `AGENTS.md`, `.env*`, source images, or global agent skills for this typography change. The critique's imagery, homepage restructuring, icon semantics, pluralization and admin image-preview work are outside this plan; completing typography does not mean those other findings are fixed.

## Typography contract

### Families

| Role | Atelier / Linen / Salon | Modern Gallery | Arabic pages |
|---|---|---|---|
| Large editorial headings | Bodoni Moda 500 or 600 | Manrope 600 | Noto Sans Arabic 600 for Arabic copy |
| Product and perfume-house identities | Manrope 500/600 | Manrope 500/600 | Manrope 500/600 for official Latin names |
| Body, links, controls, prices | Manrope 400/500/600 | Manrope 400/500/600 | Noto Sans Arabic 400/600 for Arabic text/numerals |
| English admin UI | Manrope | Manrope | Still Manrope inside the existing English shell |
| Arabic editor textareas | Noto Sans Arabic | Noto Sans Arabic | Noto Sans Arabic, natural RTL |

Use Bodoni only at a rendered size of at least 28px outside decorative miniatures. Header wordmark, footer headings, house cards and product headings do not become tiny Bodoni. No 700/800 synthetic bold or synthetic italic.

### Shared tokens (16px root shown only as an explanation)

Create `src/styles/typography.css` with this initial contract:

```css
:root {
  --font-ui-latin: var(--font-manrope), Arial, sans-serif;
  --font-ui: var(--font-ui-latin);
  --font-editorial: var(--font-bodoni), Georgia, "Times New Roman", serif;
  --body: var(--font-ui);
  --display: var(--font-editorial);
  --type-legal: .8125rem; /* 13px; footer legal/disclosure only */
  --type-label: .875rem; /* 14px; minimum functional supporting text */
  --type-body: 1rem;
  --type-card: 1.125rem;
  --type-price: 1.25rem;
  --type-price-detail: 1.875rem;
  --type-product-title: clamp(1.875rem, 3vw, 2.5rem);
  --type-section: clamp(1.75rem, 2.8vw, 2.5rem);
  --type-page: clamp(2.25rem, 4.5vw, 4rem);
  --type-campaign: clamp(2.25rem, 4vw, 3.5rem);
  --type-salon-hero: clamp(3rem, 6.5vw, 5.5rem);
  --leading-body: 1.65;
  --leading-label: 1.5;
  --leading-display: 1.12;
}
html[lang="ar"] {
  --font-ui: var(--font-arabic), var(--font-manrope), Arial, sans-serif;
  --body: var(--font-ui);
  --display: var(--font-ui);
  --leading-body: 1.85;
  --leading-display: 1.5;
}
html[data-design="gallery"] { --display: var(--font-ui); }
body { font-size: var(--type-body); line-height: var(--leading-body); }
```

No root font-size override. These sizes grow with user defaults/text resizing. Remove superseded `--body`/`--display` definitions from `globals.css`; keep the Gallery exception in one place, not both files. Keep fonts independent of brand color tokens.

### Component targets

| Text | Phone | Desktop | Family/weight |
|---|---:|---:|---|
| Card product name | 16px minimum | 18px | Manrope 600, line-height 1.4–1.5, full name |
| Card brand / size / family / demo label / discount | 14px | 14–16px | UI family 400/600; official names Manrope |
| Card current price | 20px | 20–24px | UI family 600, tabular numerals |
| Original price | 14px | 14–16px | UI family 400 |
| Product-page identity | 30px, long titles 26px minimum | 40px maximum | Manrope 600; no truncation |
| Product-page current price | 30px | 30px | UI family 600 |
| Description / substantive body | 16px | 16px | UI family 400 |
| Caveats / selected notes caption / demo disclaimer | 14px | 14px | UI family 400, generous leading |
| Input/select text | 16px | 16px | UI family 400/500 |
| Button/tab/navigation/filter label | 14px minimum | 14–16px | UI family 500/600; Arabic only shipped 400/600 |
| Result counts / pagination | 14px | 14px | UI family 400/600 |
| Homepage English editorial h2 | 28–36px | up to 40px | `--display`, 500/600 |
| Campaign English statement / intro h1 | 36px minimum | up to 56px | `--display`, 500/600 |
| Salon English hero | 48px | up to 88px | `--display`, 500 |
| Header wordmark | 16–20px | 20px | Manrope 600, allow natural wrapping |
| Brand wordmark subline | 14px | 14px | UI family 400 |
| House names / footer group headings | 18–20px | 18–20px | UI family 500/600, not a small serif |
| Chooser real names/descriptions/actions | 14–18px | 14–18px | UI family; miniature mock text is exempt |
| Footer legal | 13px | 13px | UI family 400 |
| Admin input/table/body | 16px | 16px | Manrope; Arabic textareas Noto |

Do not reduce the root size or add `transform: scale()` to hit these targets. Use natural wrapping and modest spacing adjustments; no wholesale page reordering, image replacement, new persistent toolbar or new theme.

## Validation interfaces and commands

Public test boundaries are the rendered routes, accessible controls, computed typography, font requests, and viewport/document geometry. No tests need a new application API. The admin additions reuse the existing isolated suite.

All commands below run from `D:/bts-demo` using Git Bash. Use one free public test port consistently; examples use 3120. Playwright's existing config starts/stops its own production server with immutable seed data. It will refuse a pre-existing service because `reuseExistingServer` is false. Public commands must not target the live dev database. Admin tests separately own 3101.

Before implementation, record `git status --short`, inspect the existing changes in files being touched, and save baseline screenshots in `artifacts/typography/before/` using fresh browser contexts. No stash/reset/clean. Before any build, check for other Next/test processes that use this checkout's `.next` directory; coordinate with the operator rather than stopping unknown processes.

### Shared browser assertion helper

Create `tests/e2e/helpers/typography.ts` when Task 1 begins:

```ts
import { expect, type Locator, type Page } from "@playwright/test";

export async function expectMinSize(locator: Locator, minimum: number) {
  await expect(locator).toBeVisible();
  expect(await locator.evaluate(el => parseFloat(getComputedStyle(el).fontSize)))
    .toBeGreaterThanOrEqual(minimum);
}

export async function expectFamily(locator: Locator, variable: string) {
  const result = await locator.evaluate((el, name) => {
    const root = getComputedStyle(document.documentElement);
    const first = (value: string) => value.split(",")[0].trim();
    return {
      actual: first(getComputedStyle(el).fontFamily),
      expected: first(root.getPropertyValue(name)),
    };
  }, variable);
  expect(result.expected).not.toBe("");
  expect(result.actual).toBe(result.expected);
}

export async function expectDocumentFits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
}
```

Use registered-font variables such as `--font-manrope`, `--font-bodoni`, and `--font-arabic` in family assertions. Generated Next.js font-family names are hashed; do not hard-code them or require the literal words “Bodoni Moda” in computed styles.

---

### Task 1: Replace the editorial font and establish the shared type contract

**Files:**
- Modify: `package.json`, `package-lock.json`, `src/styles/fonts.ts`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/globals.css`.
- Create: `src/styles/typography.css`, `tests/e2e/helpers/typography.ts`, `tests/e2e/typography.spec.ts`.
- Modify: `src/styles/salon.css:31`, `src/components/design-preview.module.css:22–30` to remove stale direct Cormorant references.

**Interfaces:**
- Consumes: `localFont(options)` from installed `next/font/local`; the current root layout's font-variable class list.
- Produces: `export const bodoni` with `variable: "--font-bodoni"`; CSS contract above; helper functions with exact signatures shown above.

- [ ] **Step 1: Capture the dirty-worktree baseline and read the installed font/CSS documentation.** Record active processes/ports; do not stop or modify them. Existing critique screenshots are useful evidence but do not replace a baseline if the source has changed.
- [ ] **Step 2: Create the helper above and the first failing browser test below.** This asserts a real registered font and body script behavior, not the source text of a loader file.

```ts
import { expect, test } from "@playwright/test";
import { expectFamily } from "./helpers/typography";

test("editorial font is registered locally while body retains its script", async ({ page }) => {
  const fontRequests: string[] = [];
  page.on("request", request => {
    if (/\.(woff2?|ttf|otf)(?:\?|$)/.test(request.url())) fontRequests.push(request.url());
  });
  for (const locale of ["en", "ar"] as const) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    const registered = await page.evaluate(() => {
      const family = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-bodoni").split(",")[0].trim();
      return family.length > 0 && document.fonts.check(`500 40px ${family}`);
    });
    expect(registered).toBe(true);
    await expectFamily(page.locator("body"), locale === "ar" ? "--font-arabic" : "--font-manrope");
  }
  const origin = new URL(page.url()).origin;
  expect(fontRequests.length).toBeGreaterThan(0);
  expect(fontRequests.every(url => new URL(url).origin === origin)).toBe(true);
});
```

The origin comes from the configured browser page so this remains portable with the existing `BTS_TEST_PORT` setting.

- [ ] **Step 3: Build the current implementation, then demonstrate red.** After coordinating `.next` ownership, run `npm run build`, then:

```bash
BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts --project=desktop
```

Expected: FAIL at `registered === true` because `--font-bodoni` does not exist yet. If the build fails before the test, record the actual baseline failure; do not call that the expected red test.

- [ ] **Step 4: Replace only the editorial dependency.**

```bash
npm install --save-exact @fontsource/bodoni-moda@5.3.0
npm uninstall @fontsource/cormorant-garamond
```

Inspect the manifest/lock diff: keep all unrelated dependency versions unchanged. Do not hand-edit integrity fields or run a broad dependency update.

- [ ] **Step 5: Replace the Cormorant export with the following; keep the existing Manrope/Arabic exports.**

```ts
export const bodoni = localFont({
  src: [
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  preload: true,
  variable: "--font-bodoni",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});
```

- [ ] **Step 6: In `layout.tsx`, import `{ manrope, bodoni, arabic }`, replace `cormorant.variable` with `bodoni.variable`, and import `../../styles/typography.css` after `./globals.css` but before `../../styles/salon.css`.** Preserve all other layout markup/metadata/script behavior.
- [ ] **Step 7: Create the exact token contract above.** Remove duplicate `--body`/`--display` ownership from `globals.css`, including its old Arabic/Gallery family assignments; retain Arabic heading spacing rules. Replace remaining `var(--font-cormorant)` in decorative Salon close/miniature rules with `var(--font-editorial)`; set their line-height to at least 1.08 to avoid Bodoni ascender/descender collisions. Miniatures may remain proportionally scaled because their entire root is already `aria-hidden`.
- [ ] **Step 8: Rebuild, rerun the focused test, then run `npm run typecheck` and `npm run lint`.** Expected: registered Bodoni passes; body still chooses the correct script; local font requests only. Do not claim zero layout shift merely because the loader optimizes fallback metrics.
- [ ] **Step 9: Search `src` for `cormorant`/`font-cormorant`.** Expected: no live references. Read historical docs as history rather than replacing every occurrence in old plans. Review this task's diff directly; checkpoint without committing unless separately authorized.

### Task 2: Make product comparison, details and catalogue controls readable

**Files:**
- Modify: `src/features/products/product.module.css`, `src/features/catalogue/catalogue.module.css`, `src/features/home/scent-spotlight.module.css`.
- Modify: `tests/e2e/typography.spec.ts`, `tests/e2e/salon.spec.ts`.

**Interfaces:**
- Consumes: the shared `--font-ui-latin`, `--body`, `--type-*`, `--leading-*` CSS variables from Task 1; existing product-card/demo-price test IDs and accessible catalogue controls.
- Produces: unchanged product/catalogue DOM/data/routing with readable shopping information, full official Latin names, and usable wrapped controls in every design.

- [ ] **Step 1: Add the following failing test to `typography.spec.ts`; import `getDictionary` and `expectMinSize`/`expectDocumentFits`.** Loop all four design IDs and both locales as separate tests to keep failures isolated. Each test establishes its design before navigation using the current storage key.

```ts
import { getDictionary } from "../../src/i18n/dictionaries";
import { designIds } from "../../src/components/designs";
import { expectDocumentFits, expectMinSize } from "./helpers/typography";

for (const design of designIds) {
  for (const locale of ["en", "ar"] as const) {
    test(`${design}/${locale} mobile shopping text is readable`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.addInitScript(id => localStorage.setItem("bts-demo-design", id), design);
      const d = getDictionary(locale);
      await page.goto(`/${locale}/catalogue`);
      await page.evaluate(() => document.fonts.ready);
      const card = page.getByTestId("product-card").first();
      await expectMinSize(card.getByRole("heading"), 16);
      await expectFamily(card.getByRole("heading").locator("bdi"), "--font-manrope");
      await expectMinSize(card.locator("p").first(), 14);
      await expectMinSize(card.getByText("Xerjoff", { exact: true }), 14);
      await expectMinSize(card.getByTestId("demo-price").locator("small"), 14);
      await expectMinSize(card.getByText(d.viewFragrance, { exact: true }), 14);
      await expectMinSize(page.getByRole("searchbox", { name: d.search, exact: true }), 16);
      const toggle = page.locator('button[aria-controls="catalogue-filters"]');
      if (await toggle.isVisible()) await toggle.click();
      for (const name of ["brand", "gender", "family", "note", "sort"]) {
        await expectMinSize(page.locator(`select[name="${name}"]`), 16);
      }
      await expectDocumentFits(page);
      await page.goto(`/${locale}/perfumes/diptyque-philosykos-p0170`);
      await page.evaluate(() => document.fonts.ready);
      await expectFamily(page.getByRole("heading", { level: 1 }).locator("bdi"), "--font-manrope");
      await expectDocumentFits(page);
    });
  }
}
```

The existing public-test configuration disables persistent data; in that seed fixture the first card is Torino21/Xerjoff. Do not assume this fixture count/name against the live DB.

- [ ] **Step 2: Run the red test against the Task 1 build.**

```bash
BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts --project=desktop --grep "mobile shopping text"
```

Expected: FAIL for 9–13px shopping text. Existing larger Salon fields may pass some assertions already.

- [ ] **Step 3: Edit the original product-module declarations using this selector map, including matching theme/mobile overrides.** Do not add a second set of global overrides that loses to the existing high-specificity selectors.

| Selectors in `product.module.css` | Intended declarations |
|---|---|
| `.cardTitle` and its `<=760px` rule | `font-size: var(--type-card)` desktop; `var(--type-body)` phone; `line-height: 1.45`; retain full wrapping and equal-row flex behavior. |
| `.cardTitle bdi`, `.detailInfo h1 bdi`, `.brand bdi`, `.detailBrand bdi` | `font-family: var(--font-ui-latin)`; weight 500/600 only. |
| `.brand`, `.meta`, `.demoPrice small`, `.discountBadge`, `.detailDiscount`, `.photoLabel` | `font-size: var(--type-label); line-height: var(--leading-label)`; eliminate 9–11px overrides in all themes. |
| `.priceValues del` | `font-size: var(--type-label)`. |
| `.priceValues strong` | `font-size: var(--type-price)`; detail price remains `--type-price-detail`. |
| `.cardAction`, `.back`, `.breadcrumbs`, `.detailsLink`, `.familyList a`, `.variantLine` | At least `--type-label`; `.variantLine` may use `--type-body`; interactive chips/actions get 44px min-height. |
| `.detailInfo h1`, including Salon and `html[lang="ar"]` specializations | `font-family: var(--font-ui-latin); font-weight: 600; font-size: var(--type-product-title); line-height: 1.25; letter-spacing: -.015em`; Latin official names stay Latin. |
| `.detailInfo h1.longTitle` and phone long-title override | `font-size: clamp(1.625rem, 2.6vw, 2.125rem); line-height: 1.3; overflow-wrap: anywhere`; no clamp/ellipsis/max-height. |
| `.description`, `.notes li`, `.accordionTrigger`, `.brandRow` | `font-size: var(--type-body)`; body leading for descriptions; 600 for triggers only. |
| `.pricingDisclaimer`, `.priceConfirmation`, `.caveat`, `.notes small`, `.profileGrid dt` | `font-size: var(--type-label); line-height: var(--leading-body)`. |
| `.profileHeading h2`, `.profileGrid dd`, `.photoDialog > p` | UI family; 24px heading, 18px facts, 16px dialog caption. No small Bodoni. |

Concrete replacement example:

```css
.cardTitle { min-height: 2.9em; font-size: var(--type-card); line-height: 1.45; }
.cardTitle bdi, .detailInfo h1 bdi, .brand bdi, .detailBrand bdi {
  font-family: var(--font-ui-latin);
}
.meta, .brand, .demoPrice small { font-size: var(--type-label); }
@media (max-width: 760px) {
  .cardTitle { font-size: var(--type-body); }
  .meta, .brand, .demoPrice small { font-size: var(--type-label); }
}
```

Merge those values into the actual existing rules, retaining their other declarations. Remove conflicting old values in earlier Salon-specific rules rather than relying on source-order luck.

- [ ] **Step 4: Migrate catalogue selectors.** `.pageHeader h1` uses `--display` and `--type-page`; `.pageHeader p`/`.empty p` use `--type-body`; search input/selects use `--type-body`; filter labels, buttons, chips, result counts, pagination and collection-end copy use `--type-label`. Set search/pagination/chip min-height 44px and pagination min-width 44px. Remove `font-size: 0` on the mobile filter control so “Filters / التصفية” is visibly labelled. At phone widths, allow `.searchRow { flex-wrap: wrap }` and `.searchForm { flex: 1 1 16rem; min-width: 0 }` rather than shrinking the text. Preserve native select behavior, pending status, and query state.
- [ ] **Step 5: Keep the Salon spotlight product `.name` on `--font-ui-latin` at 26–28px, not `--display`.** Retain its actual-product links and selected-note feedback.
- [ ] **Step 6: Replace the obsolete Salon two-line test, not the complete-name requirement.** Rename it to “salon keeps official product titles complete, readable and unclipped.” Keep its exact full-name assertion and widths 360/768/1440. Replace the `lines <= 2` assertion with:

```ts
await expectFamily(title.locator("bdi"), "--font-manrope");
expect(await title.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(26);
const dimensions = await title.evaluate(el => ({
  width: el.clientWidth, contentWidth: el.scrollWidth,
  height: el.clientHeight, contentHeight: el.scrollHeight,
  overflow: getComputedStyle(el).overflow,
}));
expect(dimensions.contentWidth).toBeLessThanOrEqual(dimensions.width + 1);
expect(dimensions.contentHeight).toBeLessThanOrEqual(dimensions.height + 1);
expect(dimensions.overflow).not.toBe("hidden");
```

Import `expectFamily` from the helper. Do not keep a line-count assertion that forces an unreadably small size. Keep the separate existing Salon opening-viewport enquiry tests unchanged; if new typography pushes that short-product action out of view, reduce redundant gaps, not the readable font size.

- [ ] **Step 7: Rebuild and run the focused shopping suite plus existing product/catalogue flows.**

```bash
npm run build
BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts tests/e2e/salon.spec.ts tests/e2e/product-polish.spec.ts tests/e2e/journey.spec.ts
```

Expected: all new readability assertions pass; official names remain complete; existing price/filter/locale/enquiry behavior survives. Visually review card rows with both short and long names before accepting this task. Do not alter business copy or demo prices to satisfy layout tests.

### Task 3: Apply editorial hierarchy without shrinking discovery, header or footer UI

**Files:**
- Modify: `src/app/[locale]/globals.css`, `src/styles/salon.css`, `src/components/site-header.module.css`, `src/features/home/campaign-hero.module.css`, `src/features/home/home.module.css`, `src/features/home/collections.module.css`, `src/features/home/discovery.module.css`, `src/features/home/home-extras.module.css`, `src/components/footer-information.module.css`.
- Modify: `tests/e2e/typography.spec.ts`.

**Interfaces:**
- Consumes: shared typography variables and existing accessible home sections/tabs/links.
- Produces: Bodoni editorial hierarchy in Atelier/Linen/Salon, Manrope Gallery display, readable UI in both scripts and every preview.

- [ ] **Step 1: Add a focused display/script test for each design/locale.** In new tests, set storage before navigation, visit `/en` or `/ar`, await `document.fonts.ready`, and assert the H1 family is `--font-bodoni` for English Atelier/Linen/Salon, `--font-manrope` for English Gallery, and `--font-arabic` for Arabic. Assert the H1 minimum is 36px English / 30px Arabic, except larger Salon sizes may remain. Assert `.section-heading p` nodes are at least 16px after scrolling their sections into view.

Use this core body inside the same design/locale loop as Task 2, but in a separate test:

```ts
await page.addInitScript(id => localStorage.setItem("bts-demo-design", id), design);
await page.goto(`/${locale}`);
await page.evaluate(() => document.fonts.ready);
const expectedFamily = locale === "ar" ? "--font-arabic"
  : design === "gallery" ? "--font-manrope" : "--font-bodoni";
await expectFamily(page.getByRole("heading", { level: 1 }), expectedFamily);
await expectMinSize(page.getByRole("heading", { level: 1 }), locale === "ar" ? 30 : 36);
for (const paragraph of await page.locator(".section-heading p").all()) {
  await paragraph.scrollIntoViewIfNeeded();
  await expectMinSize(paragraph, 16);
}
```

- [ ] **Step 2: Run that test red.** Existing default H1 is Manrope and many supporting paragraphs are 11–12px. Use `BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts --project=desktop --grep "editorial hierarchy"` after naming the added tests `${design}/${locale} editorial hierarchy preserves its script`.
- [ ] **Step 3: Migrate the global and home declarations using the exact target table below.** Touch all corresponding media/theme rules in the same file; do not globally force `h1,h2,h3` to Bodoni.

| File / selectors | Change |
|---|---|
| `globals.css` `.section-heading h2` | `font: 500 var(--type-section)/var(--leading-display) var(--display)`; use modest `letter-spacing: -.015em` for Latin only. |
| `globals.css` `.section-heading p`, `.not-found p` | `font-size: var(--type-body); line-height: var(--leading-body)`. |
| `globals.css` `.button`, `.text-link`, `.language-switch`, `.configuration-note`, `.image-fallback` | At least `--type-label`; controls retain 44px or larger targets. |
| `globals.css` footer body/links/contact/Instagram | `--type-label` or `--type-body`; group headings Manrope/Noto 600 at 18–20px; legal `--type-legal`. Remove phone-only reductions. |
| `globals.css` chooser real headings/description/selected/criteria/trigger labels | At least `--type-label`; dialog h2 24px; real option names 18px. Miniatures remain decorative/exempt. |
| `campaign-hero.module.css` `.statement p`, `.intro h1` | `--display`, `--type-campaign`, 500; Salon `.intro h1` uses `--type-salon-hero`; default intro must no longer force Manrope. |
| `campaign-hero.module.css` `.intro > p`, `.action`, `.caption`, `.caption strong` | Body 16px; action/captions at least 14px. Let bottle captions wrap naturally. |
| `home.module.css` `.demoDisclaimer`, `.collectionsHeading p`, `.guide li` | Disclosures 14px; body/help copy 16px. `.collections :global(.section-heading p)` uses `color: var(--ink)` on gold. |
| `collections.module.css` `.tab`, `.caption h3`, `.caption div > span` | Tab/count 14px; title 16–18px; keep accessible tabs/indicator logic and allow their actual widths to remeasure. |
| `discovery.module.css` `.houseName` | UI Latin family, 18–20px, 500; not small Bodoni. |
| `discovery.module.css` `.houseMeta`, `.houseCount`, `.categoryCaption p` | At least 14px; body intro/directory/search input 16px. |
| `home-extras.module.css` `.promise h2`, `.experiences h2` | Large editorial `--display`; keep Arabic script override. Benefit h3 / cites below 28px use UI family, not Bodoni. |
| `home-extras.module.css` `.promiseIntro`, `.features p`, `.intro`, `.reviewCard blockquote`, `.instagram p` | Body 16px; `.sampleLabel` 14px. Remove synthetic italic on small review cites. |
| `salon.css` `.section-heading h2`, `.salon-close` | New editorial role; existing natural Arabic equivalent. Do not let the final-imported Salon stylesheet restore obsolete families or undersized 13px functional labels. |
| `footer-information.module.css` `.heading h2`, `.dialog > p` | UI heading 24px and body 16px; keep long text wrapping and close-button clearance. |

- [ ] **Step 4: Correct the header rather than reducing its text to fit.** In the original rules, use UI-family wordmark and readable subline. At narrow widths let the brand wrap while retaining language/menu/search targets:

```css
.brand { min-width: 0; }
.wordmark {
  font: 600 clamp(1rem, 1.4vw, 1.25rem)/1.2 var(--font-ui-latin);
  white-space: normal;
  max-width: 12ch;
}
.wordmark > span { font: 400 var(--type-label)/1.5 var(--body); }
.navigation a { font-size: var(--type-label); }
.search input { font-size: var(--type-body); }
@media (max-width: 650px) {
  .brand img { width: 34px; height: 34px; }
  .wordmark { max-width: 12ch; }
}
```

Retain existing search-on-second-row behavior and original logo artwork. Apply equivalent readable `.language-switch` sizes in globals and Salon rules; no hidden language label or zero-size filter text.

- [ ] **Step 5: Allow discovery captions to grow.** If larger note labels/counts crowd an arrow, keep `min-width: 0`, wrap the caption text, and reduce decorative arrow gap/padding. Do not hide counts or clip words. Keep selected-tab indicator measurement and keyboard interactions unchanged.
- [ ] **Step 6: Rebuild and run the focused hierarchy tests plus navigation/discovery suites.**

```bash
npm run build
BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts tests/e2e/navigation-basics.spec.ts tests/e2e/storefront.spec.ts tests/e2e/interface-state.spec.ts tests/e2e/scroll-and-footer.spec.ts
```

Expected: families match the role matrix, note selection and theme persistence work, all original functional controls remain reachable. Review at 320/390/1440px, not just the largest viewport.

### Task 4: Keep admin and consent interfaces readable in the correct script

**Files:**
- Modify: `src/features/admin/admin.module.css`, `src/features/analytics/analytics.module.css`.
- Modify: `tests/e2e/admin.spec.ts`, `tests/e2e/typography.spec.ts`.

**Interfaces:**
- Consumes: existing English admin shell, form field `lang`/`dir` attributes, shared token sheet, isolated authenticated test server.
- Produces: consistent UI-family admin and consent text; no new auth/action/data behavior.

- [ ] **Step 1: Extend the existing public admin-login test coverage with `/ar/admin/login`.** Add this independent test to `typography.spec.ts`:

```ts
test("English admin stays Latin inside the Arabic storefront shell", async ({ page }) => {
  await page.goto("/ar/admin/login");
  const heading = page.getByRole("heading", { name: "Admin Sign In", exact: true });
  await expectFamily(heading, "--font-manrope");
  await expectMinSize(page.getByLabel("Username", { exact: true }), 16);
  await expectMinSize(page.getByLabel("Password", { exact: true }), 16);
});
```

- [ ] **Step 2: Demonstrate red against the preceding build.** Expected: the English admin heading currently inherits the page's Arabic font; input size may already pass. Use `BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts --project=desktop --grep "English admin"`.
- [ ] **Step 3: Make the English admin type explicit while respecting Arabic input fields.**

```css
.shell {
  font-family: var(--font-ui-latin);
  font-size: var(--type-body);
  line-height: 1.65;
}
.shell h1, .shell h2 { font-family: var(--font-ui-latin); font-weight: 600; }
.form label, .form input, .form textarea, .form select,
.search input, .table th, .table td, .notice, .nav {
  font-size: var(--type-body);
}
.form textarea[lang="ar"] {
  font-family: var(--font-arabic), Arial, sans-serif;
  line-height: 1.85;
  letter-spacing: normal;
}
```

Merge with original selectors, keeping form borders, field errors, unsaved-change hooks and pending state. English `[lang="en"]` textareas inherit Manrope. Consent `.consent` uses `--type-body` / `--leading-body` and buttons `--type-label` or larger. Do not enable analytics merely to see the consent fixture.

- [ ] **Step 4: In the existing isolated admin test, immediately after opening the P0028 editor, add these assertions.** Import `expectFamily`/`expectMinSize`; do not create a second credential mechanism.

```ts
await expectFamily(page.getByLabel("English description", { exact: true }), "--font-manrope");
await expectFamily(page.getByLabel("Arabic description", { exact: true }), "--font-arabic");
await expectMinSize(page.getByLabel("English description", { exact: true }), 16);
await expectMinSize(page.getByLabel("Arabic description", { exact: true }), 16);
```

For the helper's family lookup to work on Noto, the font variable remains attached to root even though the admin shell uses English UI. Existing `lang="ar" dir="rtl"` on the textarea must stay intact.

- [ ] **Step 5: Rebuild, run the focused login test, then run the admin suite.**

```bash
npm run build
BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts --grep "English admin"
npm run test:e2e:admin
```

Expected: English admin labels stay Manrope on either route; Arabic editor copy is Noto; the existing isolated login/save/error/persistence tests still pass. If 3101 is occupied, stop and coordinate; do not kill the unknown process. This test mutates only its own temporary database.

### Task 5: Prove reflow, text resizing and font-failure behavior; document evidence

**Files:**
- Create: `tests/e2e/typography-reflow.spec.ts`.
- Modify: `tests/e2e/interface-semantics.spec.ts` only if necessary to avoid redundant coverage.
- Modify: `docs/demo/DESIGN.md`, `docs/demo/SCENT_SALON.md`, `docs/demo/QA.md`.
- Generated evidence only: `artifacts/typography/after/`, `artifacts/typography/detector/`.

**Interfaces:**
- Consumes: completed type contract and helper assertions; current design registry and public routes; local production browser server.
- Produces: regression proof, before/after images, documented exceptions and remaining non-typography critique items.

- [ ] **Step 1: Add a failing text-resize regression before making any remaining fit adjustments.** Include these imports and this test in `typography-reflow.spec.ts`:

```ts
import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { designIds } from "../../src/components/designs";
import { expectDocumentFits, expectMinSize } from "./helpers/typography";

test("200 percent root text size preserves catalogue controls and complete content", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto("/en/catalogue");
  await page.evaluate(() => document.documentElement.style.fontSize = "200%");
  await page.evaluate(() => document.fonts.ready);
  await expectMinSize(page.getByTestId("product-card").first().getByRole("heading"), 32);
  await expectDocumentFits(page);
  const toggle = page.locator('button[aria-controls="catalogue-filters"]');
  if (await toggle.isVisible()) await toggle.click();
  for (const name of ["brand", "gender", "family", "note", "sort"]) {
    const control = page.locator(`select[name="${name}"]`);
    await expect(control).toBeVisible();
    expect(await control.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
});
```

This is **text-size scaling**, not proof of actual browser zoom or physical-device WCAG compliance. Run it for Arabic too by extracting its body into two locale-specific tests with `page.goto('/ar/catalogue')`; keep the exact same assertions and width. If it already passes, keep the regression and proceed rather than manufacturing a failure.

- [ ] **Step 2: Add a per-design/per-locale reflow matrix using the same imports.** Keep each test independent and set a 90-second timeout:

```ts
for (const design of designIds) {
  for (const locale of ["en", "ar"] as const) {
    test(`${design}/${locale} type reflows without clipping`, async ({ page }) => {
      test.setTimeout(90000);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(id => localStorage.setItem("bts-demo-design", id), design);
      mkdirSync("artifacts/typography/after", { recursive: true });
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const [name, route] of [
          ["home", ""], ["catalogue", "/catalogue"],
          ["product", "/perfumes/giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042"],
        ]) {
          await page.goto(`/${locale}${route}`);
          await page.evaluate(() => document.fonts.ready);
          await expectDocumentFits(page);
          await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
          if (route.includes("perfumes")) {
            await expect(page.getByRole("heading", { level: 1 }))
              .toHaveText("Emporio Armani Stronger With You Powerfully");
          }
          if (width === 390 || width === 1440) {
            await page.screenshot({
              path: `artifacts/typography/after/${design}-${locale}-${name}-${width}.png`,
              fullPage: true,
            });
          }
        }
      }
    });
  }
}
```

Do not use screenshots alone as assertions; the geometry and identity checks must remain.

- [ ] **Step 3: Extend the existing font-failure test rather than duplicating it.** In `tests/e2e/interface-semantics.spec.ts`, import `expectDocumentFits` from `./helpers/typography`. Inside its existing `for (const locale of ["en", "ar"] as const)` loop, insert the following immediately before the catalogue navigation:

```ts
await page.goto(`/${locale}`);
await expect(page.getByRole("heading", { level: 1 }))
  .toHaveText(getDictionary(locale).storefrontTitle);
await expectDocumentFits(page);
```

Keep its existing `page.route("**/*.woff2", route => route.abort())`, catalogue H1/twelve-card assertions, product click and readable-product H1 checks. Each test receives a fresh context; default Atelier is intentional here. Font-failure fallback must work for both the new home display role and the existing shopping UI.
- [ ] **Step 4: Fix only the measured reflow failures.** At 200% text size, use auto heights, `min-width: 0`, flex wrapping and existing responsive grids. Header/nav may wrap or collapse earlier; product rows may become one column if two columns cannot remain readable. Native select option popups may have their own scrolling; the assertion concerns the visible control/document, not the browser's popup. Do not clip labels, shrink token sizes, use `overflow-x: hidden` to conceal document overflow, or truncate the official product name.
- [ ] **Step 5: Run broader automated checks against the final production build.**

```bash
npm test
npm run typecheck
npm run lint
npm run build
BTS_TEST_PORT=3120 npx playwright test tests/e2e/typography.spec.ts tests/e2e/typography-reflow.spec.ts tests/e2e/interface-layout.spec.ts tests/e2e/interface-semantics.spec.ts tests/e2e/salon.spec.ts tests/e2e/product-polish.spec.ts
BTS_TEST_PORT=3120 npm run test:e2e
npm run test:e2e:admin
```

Expected: all applicable tests pass. Record any genuine pre-existing failure separately with the command/error; do not delete assertions or silently claim a clean suite. Existing analytics tests may intentionally skip unconfigured measurement scenarios; report the actual skip count rather than enabling a real measurement ID.

- [ ] **Step 6: Rerun the same detector methodology as the critique.** Confirm port 3121 is free, then use these two terminal commands after browser tests finish. Do not change `.env.local`.

Terminal A (owned foreground preview):

```bash
mkdir -p artifacts/typography/detector
BTS_DATABASE_PATH='' ADMIN_USERNAME='' ADMIN_PASSWORD_HASH='' ADMIN_SESSION_SECRET='' NEXT_TELEMETRY_DISABLED=1 npm run start -- --hostname 127.0.0.1 --port 3121
```

Terminal B (scan while Terminal A is running):

```bash
DO_NOT_TRACK=1 npx --yes impeccable@4.8.0 detect --json --viewport 390x900 \
  http://127.0.0.1:3121/en \
  http://127.0.0.1:3121/en/catalogue \
  http://127.0.0.1:3121/en/perfumes/dior-spice-blend-p0168 \
  http://127.0.0.1:3121/ar/catalogue \
  > artifacts/typography/detector/rendered-mobile.json \
  2> artifacts/typography/detector/stderr.txt
```

Exit 2 means completed with findings; exit 1 means a scan failed. Stop Terminal A's owned preview with Ctrl+C after scanning. If executing through tools rather than interactive terminals, launch an explicitly owned process with an equivalent environment, retain its PID/handle, and close that process only; never kill by process name or broad port range.

Acceptance: no undersized-functional-text flags on actual UI copy; no tiny-body-text on product caveats/disclosures; the collections-intro low-contrast flag is resolved. Decorative miniatures may still be tiny internally and may produce detector false positives; document their `aria-hidden` boundary rather than weakening real UI tests. Hero accent-border and other non-typography aesthetic flags may remain and must not be reported as fixed by this plan.

- [ ] **Step 7: Manually review the generated images at native scale.** Compare Before/After for Atelier and Salon first, then Gallery/Linen; read Arabic lines rather than checking direction alone. Review 320px header, long house/product names, 14px demo disclosures, price wrapping, tab indicator alignment after fonts load, footer chooser text, blocked-font fallbacks and keyboard focus outlines. Use real 200% browser zoom as an additional manual check; emulated phone/text-scale tests do not certify physical Safari/iOS rendering.
- [ ] **Step 8: Record loading evidence without inventing performance improvements.** Confirm fonts are served from the app origin, no Google/CDN font requests occur, and removed Cormorant assets are not requested by the current build. Confirm two Bodoni weight files replace the old two editorial files rather than adding a fourth family. Observe heading/caption positions during a throttled reload and record any visible shift; do not state “zero CLS” without measuring it.
- [ ] **Step 9: Update documentation in place.** In `DESIGN.md`, replace the current typography paragraph and add the role/size table plus the explicit Gallery exception. In `SCENT_SALON.md`, replace current Cormorant/product-serif claims with Bodoni editorial + Manrope identities; do not rewrite historical plans. In `QA.md`, add exact commands, outcomes, screenshot/report paths, skip counts, blocked cases and physical-device/performance limitations. State that other critique fixes remain separate work.
- [ ] **Step 10: Self-review the full implementation diff without delegation.** Check every changed CSS `font:` shorthand for accidentally resetting family/weight/line-height, every Arabic/theme/mobile override for obsolete small sizes, every local-font reference for a stale variable, and every dependency diff for unrelated updates. Confirm this plan's files are distinguishable from the pre-existing dirty changes. Do not commit or push without separate authorization.

## Completion checklist

- [ ] Bodoni Moda 500/600 are bundled locally; Cormorant has no active source/dependency references.
- [ ] Manrope remains the product/control/English-admin face; Noto remains Arabic copy/editor face.
- [ ] Atelier/Linen/Salon editorial headings use Bodoni; Gallery's intentional sans display is preserved.
- [ ] Functional supporting copy is at least 14px; body/inputs 16px; card identities 16–18px at default browser text size.
- [ ] Product names are complete without two-line compression, ellipsis, hidden overflow or rasterized text.
- [ ] Demo prices, reference caveats and availability disclaimers are readable and unchanged in meaning.
- [ ] Collections helper copy reaches 4.5:1 contrast on its gold surface.
- [ ] Real header/footer/dialog/chooser controls are readable; only decorative miniature text is exempt.
- [ ] No document overflow at 320/390/768/1440 in all design/locale/route samples; 360px remains covered by the existing layout suite.
- [ ] 200% text scaling and blocked-font fallbacks retain usable content/navigation; manual zoom check is recorded separately.
- [ ] Short-product Salon enquiry still fits its opening viewport in the existing regression test.
- [ ] Unit/type/lint/build/public/admin checks and detector outcomes are recorded honestly.
- [ ] Before/after evidence is under `artifacts/typography/`; docs reflect the actual implementation.
- [ ] No unrelated redesign, data/auth/storage change, global skill edit, delegation, commit or push occurred.

## Implementation handoff

This is a five-task **direct-execution** plan. Begin Task 1 only after the operator asks to implement it. Pause after each task for a local review checkpoint; preserve the existing worktree and report any blocker rather than switching workflows or invoking subagents.
