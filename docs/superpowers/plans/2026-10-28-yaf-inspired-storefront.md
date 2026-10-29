# YAF-Inspired Green and Gold Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate YAF Perfume's retail storefront structure in the existing React application, branded with Beyond the Space's green and gold and powered by its unchanged catalogue/admin backend.

**Architecture:** Keep Next.js server rendering and the existing repository → private SQLite/seed-data boundary. Add a pure storefront merchandising projection, compose the homepage from focused server components, and use a small client component only for discovery tabs. Reuse product cards, localized routes, catalogue query logic, WhatsApp and analytics rather than introducing a second storefront or backend.

**Tech Stack:** Installed Next.js 16.4.3, React 19.3.1, TypeScript 5.9.3, CSS/CSS Modules, Node SQLite, Vitest 5.0.5, Playwright 1.64.1 with installed Chrome. Node 22.23.4 is the documented tested runtime.

**Spec:** `docs/demo/STOREFRONT_REDESIGN.md`; functional safeguards also come from `docs/demo/SPEC.md`, `docs/demo/CHECKLIST.md` and `README.md`.

## Execution record — 2026-10-28

Implemented inline following the user's explicit “Implement it” authorization. The step checkboxes in the original plan below are preserved as the planning record; this completion checklist and `docs/demo/QA.md` are the execution status.

- [x] Task 1: Real repository projection and eight passing merchandising tests.
- [x] Task 2: Native header search, responsive navigation and scoped catalogue tests.
- [x] Task 3: Green/gold live-product campaign, new H1/metadata and featured grid.
- [x] Task 4: Accessible discovery tabs, real brand directory and gender categories.
- [x] Task 5: Shared logo branding, product presentation, guidance and footer.
- [x] Task 6: Admin-driven featured name/photo updates, real restart persistence and empty database recovery.
- [x] Task 7: Four-width bilingual screenshots, full regression run and updated documentation.

Final checks: 43 unit tests passed; audit/typecheck/lint/build passed; normal browser suite 66 passed and 4 intentional skips; isolated admin suite 2 passed; separate mocked fixture-ID analytics suite 4 passed, followed by restoring the ordinary build. Backend/config/database integrity was checked against a pre-change hash manifest.

Small implementation refinements: `CollectionsBrowser` also accepts `locale` for localized image fallbacks; note tiles choose diverse genuine matches rather than repeating the first matching perfume; chooser miniatures were extracted to `src/components/design-preview.tsx` and `design-preview.module.css` so they reflect the new shared hierarchy without old global layout overrides. No new framework/dependency, backend change, migration or fourth theme was added.

## Global Constraints

- Implementation was authorized; no external-action permission was implied. The user explicitly confirmed React and requested the logo's green and gold, including backgrounds.
- In this Pi session the named `superpowers:*` execution skills are not registered. Do not pretend to invoke them or install tooling. Execute inline with the available `tdd` discipline after approval; delegation requires separate explicit user permission.
- No Git repository is present at `D:/bts-demo` as inspected. Review checkpoints replace commits; do not run `git init`, commits or publication commands without permission.
- Existing Next.js/React backend integration stays. No new dependencies, framework migration, separate API, WordPress, Vite, CMS or database migration.
- Use green/teal `#07363C` and champagne gold `#D4B991` from the supplied logo, ivory `#FBFAF6`, white `#FFFFFF`, pale green `#EAF1ED` and pale gold `#F5EDDF`. Keep the page light; use substantial green campaign backgrounds and visible gold accents/actions. Gold is not small text on white; gold buttons have dark-green text.
- Preserve the logo artwork, local fonts and supplied product photographs; do not copy competitor artwork, branding, reviews, customer media, contact details or source code.
- Recreate YAF's observed hierarchy and interaction patterns, not its unsupported commercial features. See the reference adaptation table in the spec.
- Preserve exactly 100 immutable sample records in seed mode. Runtime database mode may contain additional admin-created products; no hard-coded runtime count.
- Repository reads stay server-only through `getProducts()` / `getProduct()`; no importing seed JSON directly into new UI or shipping SQLite modules to a client component.
- Do not edit `.env.local`, credentials, the operator's database, source data, importer or `D:/perfume-search`. Never reseed the operator's database to test the redesign.
- Preserve private storage configuration, admin authentication/origin checks, immutable IDs/slugs, save persistence and existing revalidation.
- Preserve English/Arabic, RTL, equivalent-page language switching and stable routes.
- Preserve `q`, `brand`, `gender`, `family`, `note`, `sort`, `page` and validated product return-query semantics.
- Exact price labels: **Inquire for prices** / **يرجى الاستفسار عن الأسعار**. No invented prices, stock, best sellers, discounts, ratings, shipping, payment, authenticity or brand-history claims.
- Keep approved WhatsApp configuration, disabled missing/invalid-number behavior, localized messages and consent-gated safe analytics. Do not navigate to external WhatsApp during automated tests.
- Keep existing `atelier`, `gallery`, `linen` design IDs, chooser/persistence and storage-blocked fallback. All get the shared retail composition and green/gold branding; do not create a fourth site or retain duplicated hidden homepages.
- Responsive gates: 360, 390, 768 and 1440 px in both languages; all three theme selections; accessible navigation, 44 px primary targets, visible focus, reduced motion and no horizontal page overflow.
- No recording, deployment, account configuration, repository setup, commits or delegated work is authorized by this plan.

---

## Read first and implementation preflight

Read the spec completely, then `README.md`, `src/features/products/model.ts`, `repository.ts`, `src/features/catalogue/query.ts`, `src/components/language-switch.tsx` and the relevant existing tests. Use the official frontend-design guidance linked in the spec before changing visual code. It was fetched during planning; it emphasizes one intentional focal moment, actual subject content and screenshot critique rather than generic card decoration.

- [ ] Confirm that "my backend" means the current catalogue/admin/SQLite backend in this repository, and that the existing three theme selections should remain.
- [ ] Confirm the test seams below before writing implementation tests. These are proposed seams, not new tests already added.
- [ ] Inspect current files again for intervening user edits; preserve unrelated changes.
- [ ] Capture current local English/Arabic desktop/mobile pages to `artifacts/screenshots/before-retail-*.png` using the already running preview if available. Do not change its data.
- [ ] Check whether an existing process uses `.next`. Obtain approval to stop an owned preview before rebuilding beneath it; do not terminate unknown processes. Use port 3102 for the normal isolated Playwright server and reserve 3101 for the existing admin suite.
- [ ] Run baseline checks: `npm test`, `npm run typecheck`, `npm run lint`. Record failures before modifying application files; do not attribute pre-existing failures to this redesign.

### Proposed public test seams

1. `getStorefrontModel(products, locale)`: deterministic public merchandising output and working catalogue links using real query logic.
2. Browser UI: header search, discovery tabs, card destinations, locale/theme persistence and enquiry availability.
3. Existing isolated admin journey: a real save changes visible storefront content and survives an actual Next process restart.
4. Rendered browser evidence: photo loading, light green/gold presentation, keyboard/reduced-motion behavior and responsive/RTL layout.

Do not mock internal repository, query, image or session modules. Use accepted seed fixtures for pure tests and the existing temporary SQLite/Next process harness for persistent tests. External GA transport can remain mocked at its current boundary.

## File and responsibility map

### Create

| File | Responsibility |
| --- | --- |
| `src/features/home/storefront-model.ts` | Pure projection from current products to bounded hero/featured groups, discovery destinations, brands and gender categories |
| `src/features/home/campaign-hero.tsx` | Original green/gold product campaign, localized single H1 and collection CTA |
| `src/features/home/campaign-hero.module.css` | Campaign/intro composition, typography, responsive bottle staging |
| `src/features/home/collections-browser.tsx` | Accessible client-side Notes/Families tabs over small server-computed groups |
| `src/features/home/collections.module.css` | Discovery tab and image-tile layout/focus states |
| `src/features/home/brand-directory.tsx` | Real current brand links and native expandable full directory |
| `src/features/home/storefront-categories.tsx` | Data-backed men/women/unisex image cards |
| `src/features/home/discovery.module.css` | Brand-directory and category-specific layout |
| `src/components/catalogue-search.tsx` | Server-rendered native GET search form, no separate search service |
| `src/components/site-header.module.css` | Header, search, desktop navigation and mobile-menu presentation |
| `tests/unit/storefront-model.test.ts` | Projection/link behavior, current product values, empty/small catalogues |
| `tests/e2e/storefront.spec.ts` | New retail browser behavior and visual acceptance evidence |

### Modify

| File | Responsibility/change boundary |
| --- | --- |
| `src/features/home/home-page.tsx` | Replace editorial orchestration with one shared retail composition; read repository exactly here |
| `src/features/home/home.module.css` | Replace obsolete ~1,100-line split-hero/theme composition rules with compact page-section, featured-grid, guidance and advice layout |
| `src/components/site-header.tsx` | Integrate real search and catalogue-backed navigation while retaining logo, language switch, menu and chooser |
| `src/components/mobile-menu.tsx` | Same working destinations as desktop, preserved Escape/focus behavior; consume header CSS Module |
| `src/components/site-footer.tsx` | Grouped functional catalogue/discovery/contact links and retained disclosure |
| `src/app/[locale]/globals.css` | Brand tokens/shared controls/product grids/footer/theme surface rules; remove header rules after ownership moves to the CSS Module |
| `src/features/products/product.module.css` | Larger contained product photography and green/gold interactive treatments, including product details |
| `src/i18n/dictionaries.ts` | Paired new retail copy and honest guidance text; retain existing key contracts |
| `src/app/[locale]/page.tsx` | Use new localized storefront intro for homepage metadata; preserve dynamic rendering |
| `tests/e2e/journey.spec.ts` | New H1 assertion and explicit main-search scoping now header search also exists |
| `tests/e2e/admin.spec.ts` | Extend the existing isolated journey to prove featured-product changes reach the homepage and persist |
| `tests/e2e/visual.spec.ts` | Retain all functional visual gates; include green/gold themes without losing current chooser/reduced-motion tests |
| `README.md`, `docs/demo/DESIGN.md`, `docs/demo/QA.md` | Current design, preserved backend and actual new validation evidence; historical recordings labelled as pre-redesign |
| `docs/demo/STOREFRONT_REDESIGN.md` | Update approval/implementation status only after evidence exists |

Do not modify the product schema/store, admin session/actions, enquiry builders, SEO builders, analytics provider, package manifests or Playwright configuration to make a visual redesign easier. If a genuine unrelated defect appears, report it separately.

## Shared public interfaces

Define these in `storefront-model.ts`; use type-only imports in clients:

```ts
import type { Locale } from "../../i18n/config";
import type { Product } from "../products/model";

export type StorefrontTile = {
  id: string;
  label: string;
  href: string;
  product: Product;
};
export type DiscoveryGroup = {
  id: "notes" | "families";
  label: string;
  items: readonly StorefrontTile[];
};
export type StorefrontModel = {
  total: number;
  heroProducts: readonly Product[];
  featuredProducts: readonly Product[];
  brands: readonly { name: string; href: string }[];
  groups: readonly DiscoveryGroup[];
  categories: readonly StorefrontTile[];
};
export function getStorefrontModel(
  products: readonly Product[], locale: Locale,
): StorefrontModel;
```

Component interfaces:

```ts
CampaignHero({ locale, products }: {
  locale: Locale; products: readonly Product[];
});
CollectionsBrowser({ groups, label }: {
  groups: readonly DiscoveryGroup[]; label: string;
});
BrandDirectory({ locale, brands }: {
  locale: Locale; brands: StorefrontModel["brands"];
});
StorefrontCategories({ locale, items }: {
  locale: Locale; items: readonly StorefrontTile[];
});
CatalogueSearch({ locale }: { locale: Locale });
```

These signatures describe new exports to implement below; no backend API is assumed beyond existing verified functions.

---

### Task 1: Project current backend products into real storefront collections

**Files:**
- Create: `src/features/home/storefront-model.ts`
- Test: `tests/unit/storefront-model.test.ts`

**Interfaces:**
- Consumes: `Product`, `getDictionary(locale)`, taxonomy `families`, `getNoteOptions(products)`, `parseCatalogueQuery(params, products)`, `queryCatalogue(products, query, locale)`.
- Produces: `getStorefrontModel` and the shared types above.

- [ ] **Step 1: Write one failing test for a useful storefront link.**

```ts
import { expect, test } from "vitest";
import products from "../../src/data/products.json";
import { validateProduct } from "../../src/features/products/product-validation";
import { getStorefrontModel } from "../../src/features/home/storefront-model";
import { parseCatalogueQuery, queryCatalogue } from "../../src/features/catalogue/query";
const catalogue = products.map(validateProduct);

test("Lemon discovery opens real lemon results in Arabic", () => {
  const model = getStorefrontModel(catalogue, "ar");
  const lemon = model.groups.find(g => g.id === "notes")!
    .items.find(item => item.id === "lemon")!;
  expect(lemon.href).toBe("/ar/catalogue?note=lemon");
  const params = new URL(lemon.href, "http://localhost").searchParams;
  const result = queryCatalogue(catalogue, parseCatalogueQuery(params, catalogue), "ar");
  expect(result.total).toBeGreaterThan(0);
  expect(result.items.some(p => p.id === "P0574")).toBe(true);
});
```

- [ ] **Step 2:** Run `npm test -- tests/unit/storefront-model.test.ts`. Expected RED: new module/export does not exist.
- [ ] **Step 3:** Implement the types and projection. Use repository order only as an ordering fact, never a sales or arrival claim. Promote later-positioned featured records so a newly created featured product is discoverable even when the existing eight slots are occupied:

```ts
const d = getDictionary(locale);
const featured = products.filter(p => p.featured).slice().reverse();
const ordered = [...featured, ...products.filter(p => !p.featured)];
const featuredProducts = ordered.slice(0, 8);
const heroProducts = featuredProducts.slice(0, 3);
const brands = [...new Set(products.map(p => p.brand))]
  .sort((a, b) => a.localeCompare(b, "en"))
  .map(name => ({ name, href: `/${locale}/catalogue?brand=${encodeURIComponent(name)}` }));
```

Build note options by preferring `lavender`, `lemon`, `amber`, `bergamot`, `oud`, `jasmine`, `vanilla`, `rose`, then appending remaining `getNoteOptions(products)` entries; deduplicate by option value and take eight. These are preferences, not required data. For each option, resolve a genuine matching product through the existing query interface:

```ts
const params = new URLSearchParams({ note: option.value });
const query = parseCatalogueQuery(params, products);
const product = queryCatalogue(products, query, locale).items[0];
// Only emit a tile when product exists.
const item = {
  id: option.value, label: option.label[locale],
  href: `/${locale}/catalogue?${params.toString()}`, product,
};
```

Complete the function using the following projection body (with the existing imports named above and the shared type definitions). This replaces the intermediate fragments rather than duplicating their declarations:

```ts
export function getStorefrontModel(products: readonly Product[], locale: Locale): StorefrontModel {
  const d = getDictionary(locale);
  const featured = products.filter(p => p.featured).slice().reverse();
  const ordered = [...featured, ...products.filter(p => !p.featured)];
  const featuredProducts = ordered.slice(0, 8);
  const options = getNoteOptions(products);
  const preferred = ["lavender", "lemon", "amber", "bergamot", "oud", "jasmine", "vanilla", "rose"];
  const candidates = [...preferred.flatMap(value => options.filter(o => o.value === value)), ...options];
  const seen = new Set<string>();
  const notes = candidates.filter(option => {
    if (seen.has(option.value)) return false;
    seen.add(option.value); return true;
  }).slice(0, 8).flatMap(option => {
    const params = new URLSearchParams({ note: option.value });
    const query = parseCatalogueQuery(params, products);
    const product = queryCatalogue(products, query, locale).items[0];
    return product ? [{ id: option.value, label: option.label[locale],
      href: `/${locale}/catalogue?${params.toString()}`, product }] : [];
  });
  const familyItems = Object.entries(families).flatMap(([id, label]) => {
    const product = products.find(p => p.familyIds.includes(id));
    return product ? [{ id, label: label[locale],
      href: `/${locale}/catalogue?${new URLSearchParams({ family: id })}`, product }] : [];
  }).slice(0, 8);
  const categories = (["men", "women", "unisex"] as const).flatMap(gender => {
    const product = products.find(p => p.gender === gender);
    return product ? [{ id: gender, label: d[gender],
      href: `/${locale}/catalogue?${new URLSearchParams({ gender })}`, product }] : [];
  });
  const groups: DiscoveryGroup[] = [];
  if (notes.length) groups.push({ id: "notes", label: d.noteFilter, items: notes });
  if (familyItems.length) groups.push({ id: "families", label: d.family, items: familyItems });
  return {
    total: products.length, heroProducts: featuredProducts.slice(0, 3), featuredProducts,
    brands: [...new Set(products.map(p => p.brand))]
      .sort((a, b) => a.localeCompare(b, "en"))
      .map(name => ({ name, href: `/${locale}/catalogue?brand=${encodeURIComponent(name)}` })),
    groups, categories,
  };
}
```

Do not mutate input products or substitute copied/stale product names/images.

- [ ] **Step 4:** Run the focused test; expected GREEN.
- [ ] **Step 5:** Add/run these cases one at a time, implementing only a failing case's missing behavior:

```ts
test("an empty catalogue has no fabricated links or campaign products", () => {
  expect(getStorefrontModel([], "en")).toEqual({
    total: 0, heroProducts: [], featuredProducts: [],
    brands: [], groups: [], categories: [],
  });
});

test("current featured edits and appended featured products are visible", () => {
  const changed = { ...catalogue[0], name: "Edited campaign fragrance" };
  const added = { ...catalogue[1], id: "DEMO001", slug: "demo-one", featured: true };
  const model = getStorefrontModel([changed, added], "en");
  expect(model.featuredProducts.map(p => p.id)).toEqual(["DEMO001", "P0574"]);
  expect(model.heroProducts[1].name).toBe("Edited campaign fragrance");
  expect(model.heroProducts[1].image.src).toBe("/perfumes/P0574.webp");
});
```

Also add literal small-catalogue tests: a single nonfeatured product appears once in hero/featured; no men/women card is emitted for a unisex-only input; brand names containing spaces/ampersands round-trip through `URL.searchParams`; every emitted note/family/category link resolves to a nonempty result; input array order remains unchanged. Test through the exported projection and existing query functions, not internal helpers.

- [ ] **Step 6:** Run `npm test`; expected no unit regressions. Review checkpoint: server data is still external to this pure helper. No commit.

### Task 2: Add a prominent real catalogue search and retail navigation

**Files:**
- Create: `src/components/catalogue-search.tsx`, `src/components/site-header.module.css`
- Modify: `src/components/site-header.tsx`, `mobile-menu.tsx`, `src/i18n/dictionaries.ts`, `src/app/[locale]/globals.css`, `tests/e2e/journey.spec.ts`
- Create/extend test: `tests/e2e/storefront.spec.ts`

**Interfaces:**
- Consumes: `Locale`, dictionaries and existing locale switch/mobile menu/design chooser.
- Produces: `CatalogueSearch({ locale })`, a native GET boundary to `/${locale}/catalogue?q=...`.

- [ ] **Step 1:** Add paired copy in `dictionaries.ts`: `headerSearch: "Search the collection" / "ابحث في المجموعة"`, `headerSearchSubmit: "Search the catalogue" / "ابحث في الكتالوج"`. Keep existing `search`/`searchButton` unchanged for the main catalogue.
- [ ] **Step 2:** Write a failing test:

```ts
import { expect, test } from "@playwright/test";

test("header search starts a fresh real catalogue query", async ({ page }) => {
  await page.goto("/en/perfumes/xerjoff-torino21-p0574?return=brand%3DBurberry");
  const header = page.getByRole("banner");
  await header.getByRole("searchbox", { name: "Search the collection", exact: true }).fill("armaf iconic");
  await header.getByRole("button", { name: "Search the catalogue", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue\?q=armaf\+iconic$/);
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expect(page.getByTestId("product-card")).toContainText("Club de Nuit Iconic");
});
```

- [ ] **Step 3:** Build, then run `BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/storefront.spec.ts --grep "header search"`. Expected RED: the new header searchbox is absent. Check the failure reason rather than accepting a startup failure as RED.
- [ ] **Step 4:** Implement a server component with no client search state:

```tsx
export function CatalogueSearch({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return <form action={`/${locale}/catalogue`} method="get" role="search"
    aria-label={d.headerSearch} className={styles.search}>
    <input type="search" name="q" aria-label={d.headerSearch}
      placeholder={d.searchHint} maxLength={200} />
    <button type="submit" aria-label={d.headerSearchSubmit}>
      <Icon name="search" /><span className={styles.searchLabel}>{d.searchButton}</span>
    </button>
  </form>;
}
```

Import the existing `Locale`, `getDictionary`, `Icon` and the new CSS Module. Empty submission safely opens the unfiltered catalogue via existing parsing; do not build an autocomplete service.

- [ ] **Step 5:** Insert search between the logo/navigation and language/menu actions. Desktop: logo, short nav, flexible search, language; mobile: first-row brand/language/menu, full-width second-row search. Desktop and menu destinations: collection, `/${locale}#scents`, `/${locale}#approach`; keep these IDs in Task 3/4. No account/cart icons or public admin-login imitation.
- [ ] **Step 6:** Move header-owned global selectors to the new CSS Module and update imports in both header/menu. Remove old global header/brand/menu rules, including Linen absolute positioning and width overrides, only after their consumers use module classes. Leave language-switch and design-chooser global styling in place. Use module classes `header`, `inner`, `brand`, `wordmark`, `navigation`, `actions`, `search`, `searchLabel`, `mobileMenu`, `mobileNavigation`. Retain `site-header` only as a non-styling identification hook if needed. Base layout patch:

```css
.header { position: relative; z-index: 20; background: var(--canvas); border-bottom: 1px solid var(--line); }
.inner { max-width: 1440px; margin-inline: auto; padding: 18px 32px;
  display: grid; grid-template-columns: auto auto minmax(160px, 1fr) auto; gap: 24px; align-items: center; }
.brand { display: inline-flex; gap: 10px; align-items: center; text-decoration: none; }
.wordmark { font: 600 23px/1 var(--display); }
.wordmark > span { display: block; font: 400 10px/1.6 var(--body); }
.navigation, .actions { display: flex; gap: 16px; align-items: center; }
.navigation a { min-height: 44px; display: inline-flex; align-items: center; text-decoration: none; font-size: 13px; }
.search { display: flex; min-width: 0; min-height: 46px; border: 1px solid var(--line); border-radius: 24px; background: var(--photo); }
.search input { min-width: 0; width: 100%; border: 0; background: transparent; padding: 12px 16px; color: var(--ink); }
.search button { min-width: 44px; border: 0; border-radius: 24px; background: var(--forest); color: white; }
.searchLabel { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
.mobileMenu { display: none; }
.mobileNavigation { position: absolute; top: 100%; inset-inline: 0; display: grid; padding: 16px 20px;
  background: var(--canvas); border-block: 1px solid var(--line); box-shadow: 0 10px 18px #07363c14; }
.mobileNavigation a { min-height: 44px; display: flex; align-items: center; text-decoration: none; }
@media (max-width: 1100px) {
  .inner { grid-template-columns: auto minmax(160px, 1fr) auto; }
  .navigation { display: none; }
  .mobileMenu { display: block; }
}
@media (max-width: 650px) {
  .inner { padding: 14px 18px; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; }
  .search { grid-column: 1 / -1; grid-row: 2; }
  .wordmark { font-size: 19px; }
  .actions { gap: 4px; }
}
```

Use `min-width: 0` on the search's grid child and preserve the logo's aspect ratio. The mobile dropdown remains anchored to the positioned header. Avoid moving shared language-switch or chooser CSS into this module.
- [ ] **Step 7:** Scope every existing catalogue `page.getByRole("searchbox"...)` in `journey.spec.ts` to `page.getByRole("main")...`. Keep header and main input accessible names distinct. The admin search submit remains exactly `Search`; the header submit's accessible name is distinct so the existing admin test stays unambiguous.
- [ ] **Step 8:** Rebuild and rerun the focused browser test, then `BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/journey.spec.ts`. Expected GREEN before the homepage H1 changes in Task 3. Confirm mobile menu Escape restores focus. Review checkpoint; no commit.

### Task 3: Replace the editorial opening with a green/gold campaign and real featured grid

**Files:**
- Create: `src/features/home/campaign-hero.tsx`, `campaign-hero.module.css`
- Modify: `src/features/home/home-page.tsx`, `home.module.css`, `src/i18n/dictionaries.ts`, `src/app/[locale]/page.tsx`, `tests/e2e/journey.spec.ts`
- Test: `tests/e2e/storefront.spec.ts`

**Interfaces:**
- Consumes: `getProducts()`, `getStorefrontModel(products, locale)`, existing `ProductImage`, `ProductCard`, `EnquiryLink`.
- Produces: `CampaignHero({ locale, products })` and the shared storefront section skeleton.

- [ ] **Step 1:** Add paired new dictionary entries (retain legacy keys used elsewhere):

| Key | English | Arabic |
| --- | --- | --- |
| `storefrontTitle` | Discover your next fragrance. | اكتشف عطرك القادم. |
| `storefrontIntro` | Explore designer and niche fragrances by note, perfume house or personal preference. Ask us about prices and availability. | اكتشف العطور الشهيرة والمتخصصة حسب النفحات أو دار العطور أو ذوقك الشخصي. تواصل معنا للاستفسار عن الأسعار والتوفر. |
| `campaignProducts` | Fragrances in focus | عطور تحت الضوء |
| `featuredTitle` | Featured fragrances | عطور مختارة |
| `featuredIntro` | Explore a selection from the collection. | اكتشف تشكيلة مختارة من المجموعة. |
| `cataloguePreparing` | The collection is being prepared. Ask us about a fragrance. | يجري إعداد المجموعة. تواصل معنا للاستفسار عن عطر. |
| `collectionsTitle` | Shop perfume collections | تسوّق مجموعات العطور |
| `brandsTitle` | Shop by perfume house | تسوّق حسب دار العطور |
| `allHousesAction` | View all perfume houses | عرض جميع دور العطور |
| `categoriesTitle` | Find a fragrance for you | اعثر على عطر يناسبك |
| `guideTitle` | Explore. Discover. Enquire. | تصفّح واكتشف واستفسر. |
| `guideExplore` | Browse in English or Arabic | تصفّح بالعربية أو الإنجليزية |
| `guideDetails` | Explore sizes and selected fragrance notes | اكتشف الأحجام والنفحات العطرية المختارة |
| `guideEnquire` | Ask about prices and availability on WhatsApp | استفسر عن الأسعار والتوفر عبر واتساب |
| `campaignAction` | Explore collection | اكتشف المجموعة |

Arabic is a demo draft for client review, not an asserted approved translation. Both dictionary objects must compile under the existing `Dictionary` mapped type.

- [ ] **Step 2:** Write one failing campaign test:

```ts
test("retail campaign uses current products and leads to the collection", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Discover your next fragrance.");
  const campaign = page.getByRole("region", { name: "Fragrances in focus", exact: true });
  await expect(campaign.getByRole("link")).toHaveCount(3);
  for (const link of await campaign.getByRole("link").all()) {
    await expect(link).toHaveAttribute("href", /^\/en\/perfumes\//);
    await expect(link.locator("img")).toHaveAttribute("src", /^\/perfumes\/.+\.webp$/);
  }
  await page.getByRole("main").getByRole("link", { name: "Explore collection", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(12);
});
```

- [ ] **Step 3:** Build/run the focused storefront test with `--grep "retail campaign"`; expected RED at the new H1/campaign, not at server startup.
- [ ] **Step 4:** Implement campaign product links using `ProductImage`, never the hard-coded hero cutout:

```tsx
<section className={styles.stage} aria-label={d.campaignProducts}>
  {products.map((product, index) => <Link key={product.id}
    href={`/${locale}/perfumes/${product.slug}`} className={styles.product}
    aria-label={`${d.view} ${product.name}`}>
    <ProductImage product={product} locale={locale} priority={index === 0}
      className={styles.bottle} />
    <span><bdi>{product.brand} {product.name}</bdi></span>
  </Link>)}
</section>
```

The component also renders one introduction H1, intro copy and one `campaignAction` catalogue CTA outside the named campaign region. If no products, show `cataloguePreparing` plus the catalogue CTA with no invalid links or empty image URLs. A one-/two-product input renders only those actual products.

- [ ] **Step 5:** Style a 360–420 px desktop stage with a green background, gold structural accent and actual image-backed three-product composition. Give the focal bottle more space without stretching it. Supporting bottles remain legible; captions are ivory. On phones use a 250–300 px stage, smaller supporting bottles, wrapping captions and one contained row; do not force a wide scrollable hero. Use gold CTA with green text. No autoplay/carousel, gold small text on white, fake offer text or baked-in image lettering.
- [ ] **Step 6:** Rewrite HomePage orchestration around the model. Read `getProducts()` once here; the projection/components consume its result. Initially compose campaign → featured → existing personal enquiry section; Tasks 4/5 fill in the supported sections:

```tsx
const d = getDictionary(locale);
const model = getStorefrontModel(getProducts(), locale);
return <div className={styles.home}>
  <CampaignHero locale={locale} products={model.heroProducts} />
  {model.featuredProducts.length > 0 && <section className={`${styles.featured} page-width`}
    aria-label={d.featuredTitle}>
    <div className="section-heading"><div><h2>{d.featuredTitle}</h2>
      <p>{d.featuredIntro}</p></div>
      <Link href={`/${locale}/catalogue`} className="text-link">{d.viewAll}</Link></div>
    <div className="product-grid">{model.featuredProducts.map(product =>
      <ProductCard key={product.id} product={product} locale={locale} />)}</div>
  </section>}
  <section id="approach" className={`${styles.personal} page-width`}>
    <h2>{d.personalTitle}</h2><p>{d.personalCopy}</p><EnquiryLink locale={locale} />
  </section>
</div>;
```

Remove the old hard-coded houses, family doodles, single-bottle/niche editorial branches and unused imports; do not keep them hidden beside a second homepage. Rewrite the old home CSS rather than piling a new stylesheet over ~1,100 lines of obsolete overrides. Other themes keep the same semantic composition, with their framing/typographic variations restored in focused new rules.

- [ ] **Step 7:** In `src/app/[locale]/page.tsx`, change homepage metadata description from `d.heroCopy` to `d.storefrontIntro`; keep `dynamic = "force-dynamic"`, route validation and metadata builder. Change the existing journey H1 assertion to the new exact English text. `Explore collection` remains the CTA label, preserving its tested navigation contract.
- [ ] **Step 8:** Rebuild/run focused tests, then `npm run typecheck` and `BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/journey.spec.ts tests/e2e/seo.spec.ts`. Expected GREEN. Review the hero at 390/1440 px against the YAF capture before proceeding.

### Task 4: Build functional note/family discovery, brand directory and gender cards

**Files:**
- Create: `src/features/home/collections-browser.tsx`, `collections.module.css`, `brand-directory.tsx`, `storefront-categories.tsx`, `discovery.module.css`
- Modify: `src/features/home/home-page.tsx`
- Test: `tests/e2e/storefront.spec.ts`

**Interfaces:**
- Consumes: shared `DiscoveryGroup`, `StorefrontTile`, `StorefrontModel` and `ProductImage`; client imports these types using `import type` only.
- Produces: `CollectionsBrowser`, `BrandDirectory`, `StorefrontCategories` with the signatures above.

- [ ] **Step 1:** Add a failing discovery test:

```ts
test("discovery tabs lead to actual note and family results", async ({ page }) => {
  await page.goto("/en");
  const collections = page.getByRole("region", { name: "Shop perfume collections", exact: true });
  const notes = collections.getByRole("tab", { name: "Fragrance note", exact: true });
  await expect(notes).toHaveAttribute("aria-selected", "true");
  await collections.getByRole("link", { name: "Lemon", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue\?note=lemon$/);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
  await page.goto("/en");
  const families = collections.getByRole("tab", { name: "Fragrance family", exact: true });
  await families.click();
  await expect(families).toHaveAttribute("aria-selected", "true");
  await collections.getByRole("link", { name: "Woody", exact: true }).click();
  await expect(page).toHaveURL(/family=woody/);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
});
```

- [ ] **Step 2:** Build/run `--grep "discovery tabs"`; expected RED: collection region/tabs absent.
- [ ] **Step 3:** Implement a real WAI-ARIA tab pair. `useId()` supplies stable unique IDs; selected index starts at zero. Tabs have `role="tab"`, `aria-selected`, `aria-controls`, `tabIndex={selected ? 0 : -1}`; the matching panel has `role="tabpanel"`, `aria-labelledby` and only active content. Use a button-ref array to focus the newly selected tab. One group still works; zero groups return `null`.

```ts
function onTabKey(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
  const rtl = event.currentTarget.closest("[dir]")?.getAttribute("dir") === "rtl";
  let next: number | undefined;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = groups.length - 1;
  if (event.key === "ArrowRight") next = (index + (rtl ? -1 : 1) + groups.length) % groups.length;
  if (event.key === "ArrowLeft") next = (index + (rtl ? 1 : -1) + groups.length) % groups.length;
  if (next === undefined) return;
  event.preventDefault(); setActive(next); buttons.current[next]?.focus();
}
```

Import `type KeyboardEvent` instead of using the `React` namespace if preferred; keep the type consistent. Enter/Space use native button activation. Clicking a tab updates its active state; it is not an inert link.

- [ ] **Step 4:** Each active tile is a `Link` with `aria-label={item.label}`, a local `ProductImage product={item.product}`, a readable label and a green/pale-gold tonal stage. Label the imagery as a perfume associated with the note/family, not as an ingredient photograph. Use four desktop columns, two phone columns, 180–240 px image stages, no excessive repeated shadows. `CollectionsBrowser` gets only the two bounded discovery groups, not all products.
- [ ] **Step 5:** Render brands from `model.brands`: first six visible in a wrapping row; remaining links inside native `<details><summary>{d.allHousesAction}</summary>...</details>`. All brands are already deduplicated/sorted in the projection. Only render `<details>` if more than six brands exist. Brand text remains in `<bdi>`. No auto-moving logo ticker.
- [ ] **Step 6:** Implement gender categories as three large image-led links (one per model item), with full image aspect ratios intact. Render only existing category items. Desktop three columns; mobile one column with a contained bottle/caption rather than a cropped bottle label.
- [ ] **Step 7:** Insert final shared order: campaign → named collections section `id="scents"` → brand directory → featured → guidance (Task 5) → gender categories → personal advice `id="approach"`. Keep both old navigation hash destinations working.
- [ ] **Step 8:** Run the focused test GREEN. Then add/run one keyboard test and one bilingual-category/brand test at a time: Home/End and RTL arrows focus/select the correct tab; Arabic Lemon link uses `note=lemon`; brand links preserve decoded brand values; gender links produce actual results. Use `URL` assertions rather than assuming query-string parameter order. Review checkpoint; no commit.

### Task 5: Carry logo green/gold through shared UI, product presentation and honest footer

**Files:**
- Modify: `src/app/[locale]/globals.css`, `src/features/home/home.module.css`, `src/features/products/product.module.css`, `src/components/site-footer.tsx`, `src/features/home/home-page.tsx`
- Test: `tests/e2e/storefront.spec.ts`, existing `tests/e2e/visual.spec.ts`

**Interfaces:**
- Consumes: existing shared CSS variables, three design IDs, existing `EnquiryLink({ locale })`, paired dictionary copy from Task 3.
- Produces: consistent branded retail presentation without a schema or backend change.

- [ ] **Step 1:** Add a failing branded-presentation test:

```ts
test("all three designs keep the logo green and gold on a light page", async ({ page }) => {
  await page.goto("/en");
  for (const name of ["Botanical Atelier", "Modern Gallery", "Linen Boutique"]) {
    await page.getByRole("button", { name: "Choose design", exact: true }).click();
    await page.getByRole("button", { name: `Preview ${name}`, exact: true }).click();
    const tokens = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      return { green: s.getPropertyValue("--brand-green").trim(), gold: s.getPropertyValue("--brand-gold").trim() };
    });
    expect(tokens).toEqual({ green: "#07363c", gold: "#d4b991" });
    await expect(page.getByRole("region", { name: "Fragrances in focus", exact: true }))
      .toHaveCSS("background-color", "rgb(7, 54, 60)");
  }
});
```

- [ ] **Step 2:** Build/run focused test; expected RED at missing brand tokens or unbranded stage.
- [ ] **Step 3:** Add shared tokens and explicit brand aliases; preserve body-script selection:

```css
:root {
  --brand-green: #07363c;
  --brand-gold: #d4b991;
  --canvas: #fbfaf6;
  --photo: #fff;
  --sage: #eaf1ed;
  --stone: #f5eddf;
  --forest: var(--brand-green);
  --ink: var(--brand-green);
  --muted: #56645e;
  --accent: var(--brand-gold);
  --line: #dee7e1;
}
html[data-design="gallery"], html[data-design="linen"] {
  --forest: var(--brand-green);
  --ink: var(--brand-green);
  --accent: var(--brand-gold);
}
```

Keep Gallery white and Linen light warm surfaces; set their old blue/brown primary overrides to the logo aliases. Audit every current `var(--accent)` consumer: links/body text on white must use green rather than newly becoming low-contrast gold. Use gold for borders/surfaces/highlights or on green. Default retail headings use `var(--body)` at deliberate 30–52 px scale; preserve Arabic line height and local font families.

- [ ] **Step 4:** Make primary shared controls green on light surfaces, with a gold-filled `CampaignHero` action and green text. Add high-contrast focus outlines specific to the green stage. Do not apply a global gold text colour to `.text-link` or small metadata. Keep reduced-motion disabling animation/transforms.
- [ ] **Step 5:** Increase product image occupancy without cropping: `.cardImage` around 84% width / 86% height within the existing aspect-ratio image stage, `object-fit: contain`; retain `ProductImage` fallback and all card accessible names. Default home four columns/tablet three/mobile two; existing Linen framing may remain but homepage must not strand the eighth item in a three-column group. Keep catalogue page size 12 and all detail/enquiry information visible.
- [ ] **Step 6:** Add the honest guidance strip as a simple semantic list, not commercial service badges:

```tsx
<section className={`${styles.guide} page-width`} aria-label={d.guideTitle}>
  <h2>{d.guideTitle}</h2>
  <ul><li>{d.guideExplore}</li><li>{d.guideDetails}</li><li>{d.guideEnquire}</li></ul>
</section>
```

Use pale gold here and pale green for personal advice so the requested brand colours are visible in backgrounds. No extra claims, numeric metrics or fake trust marks.

- [ ] **Step 7:** Rework footer into logo/location + collection links + discovery links + existing configured WhatsApp action; keep demo disclosure/copyright. Links may point to catalogue, the supported gender filters and `#scents`/`#approach`. Reuse `EnquiryLink` rather than constructing an unvalidated phone link. Do not add nonfunctional policy/social/contact routes. Keep footer on a pale-green light surface, with green text and gold separators.
- [ ] **Step 8:** Run branded test GREEN, then existing visual suite with `BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/visual.spec.ts`. Inspect actual screenshots; a token assertion is not a substitute for visual approval. Check all designs, Arabic and empty/missing-image behavior. Review checkpoint; no commit.

### Task 6: Prove the redesigned storefront still uses the real persistent backend

**Files:**
- Modify: `tests/e2e/admin.spec.ts`
- Extend: `tests/e2e/storefront.spec.ts`
- Run unchanged: `tests/unit/product-store.test.ts`, `tests/unit/session.test.ts`, `tests/e2e/seo.spec.ts`, `tests/e2e/analytics.spec.ts`

**Interfaces:**
- Consumes: existing isolated temp database / actual Next start-stop harness and real admin form.
- Produces: browser evidence that admin saves, persistence and public rendering still agree.

- [ ] **Step 1:** Extend the existing admin journey, not a second test with a conflicting beforeAll database harness. Before saving its newly created `DEMO001` product, set its existing `Featured product` checkbox:

```ts
await page.getByLabel("Featured product", { exact: true }).check();
```

After the existing save/detail checks, add:

```ts
await page.goto("/en");
const featured = page.getByRole("region", { name: "Featured fragrances", exact: true });
await expect(featured.getByRole("link", { name: "View Sample Fragrance", exact: true })).toBeVisible();
await expect(featured.getByTestId("product-card").first()).toContainText("Sample Fragrance");
await page.goto("/ar");
await expect(page.getByRole("region", { name: "عطور مختارة", exact: true })
  .getByRole("link", { name: "عرض Sample Fragrance", exact: true })).toBeVisible();
```

Repeat the English homepage visibility assertion after the test's **existing** `stop(); start();` pair. Keep canonical/sitemap, unauthorized-save rejection and sample-report assertions.

- [ ] **Step 2:** Run `npm run test:e2e:admin`. These new visibility assertions may already be GREEN because Tasks 1/3 deliberately use the real repository and promote later-positioned featured records. Treat this as a regression gate, not a reason to introduce an artificial defect. For test-first execution, add the new homepage assertion before implementing Task 3, capture its genuine missing-region RED, then keep it throughout implementation. The test must own only its temporary database and port 3101.
- [ ] **Step 3:** Extend the same real form journey to edit `DEMO001`'s name to `Updated Sample Fragrance` and choose `/perfumes/P0574.webp` via the existing `Approved reference image` selector. Save, request `/en`, and assert the featured card's accessible name and image `src` use the new values. Persist that expectation after restart too. This catches stale names and a hard-coded hero/photo mismatch without mocking the repository.
- [ ] **Step 4:** Add/run a storefront missing-image test by aborting `**/perfumes/*.webp` (external boundary) and asserting `Photograph unavailable` in the campaign without crashing. The existing product image fallback remains authoritative. Add a header-search-from-admin test only inside the isolated admin journey if needed; do not attach to the operator's real admin server.
- [ ] **Step 5:** Preserve existing conditional WhatsApp behavior: inspect `wa.me` destinations and product messages without navigating there; absent/invalid number stays disabled. Do not modify `.env.local` to force a result.
- [ ] **Step 6:** Run `npm test`, `BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/journey.spec.ts tests/e2e/seo.spec.ts tests/e2e/analytics.spec.ts`, then `npm run test:e2e:admin` serially. Analytics opt-in tests can intentionally skip when no measurement ID exists; report that honestly rather than configuring a real property. Review checkpoint; no commit.

### Task 7: Responsive reference review, complete regression run and documentation

**Files:**
- Extend: `tests/e2e/storefront.spec.ts`
- Modify: `README.md`, `docs/demo/DESIGN.md`, `docs/demo/QA.md`, `docs/demo/STOREFRONT_REDESIGN.md`
- Evidence: `artifacts/screenshots/retail-*.png`

**Interfaces:**
- Consumes: final rendered UI, actual check results and saved YAF reference capture.
- Produces: reviewed screenshots and an accurate handover; not deployment or a new recording.

- [ ] **Step 1:** Add a focused screenshot/overflow test with a 120-second timeout. For each locale and width `[360, 390, 768, 1440]`, visit the homepage, await `document.fonts.ready`, scroll visible images into view to load them, then assert no more than 1 px document overflow and all visible images have `naturalWidth > 0`. Return to top and capture `artifacts/screenshots/retail-${locale}-${width}.png`. Create the directory with `mkdirSync(..., { recursive: true })` as existing visual tests do.
- [ ] **Step 2:** For every theme selection, verify the same route/locale state and green/gold stage survive reload and language switching. Retain current theme chooser's three cards, keyboard dismissal/focus restoration, view-transition fallback and blocked-storage tests.
- [ ] **Step 3:** In reduced-motion mode, verify tabs remain functional, important content is visible and there are no perpetual animations. Use native click/keyboard navigation; avoid testing CSS class names as functionality.
- [ ] **Step 4:** Compare screenshots with `artifacts/yaf-reference-loaded.png`: campaign/banner → centred introduction → image-led tabs → brands → substantial product grid → category merchandising → grouped footer. Reject a result that merely recolours the old editorial split hero. Confirm gold is actually visible in the banner/button and pale-gold section, not just present as an unused token.
- [ ] **Step 5:** Manually inspect product labels, long names, Arabic mixed-direction brand names, focus indicators and all new interactive targets. Inspect home, filtered catalogue and product details at phone/desktop sizes. Confirm one H1 per homepage, no hidden duplicate homepages, no copied competitor claims and no first-party errors/broken requests. Current Chrome emulation does not certify physical Safari/iOS behavior.
- [ ] **Step 6:** Run final commands in order, after approved handling of any old preview sharing `.next`:

```bash
npm run data:audit
npm test
npm run typecheck
npm run lint
npm run build
BTS_TEST_PORT=3102 npm run test:e2e
npm run test:e2e:admin
```

Expected: audit succeeds, all unit/type/lint/build checks succeed, browser tests pass except documented existing configuration-dependent skips, and isolated admin persistence/authorization succeeds. Record actual counts and skips rather than copying old QA counts. Do not run normal and admin browser suites concurrently.

- [ ] **Step 7:** Update `docs/demo/DESIGN.md` to the accepted retail composition and green/gold token system; state that all three existing design IDs now share this storefront hierarchy. Update README's design descriptions and note that the existing walkthrough videos predate this redesign. Append actual command outcomes, screenshot filenames, review observations and unresolved owner-content items to QA. Update this spec's status only to the state actually achieved.
- [ ] **Step 8:** Final self-review against every acceptance gate in the spec. Check that no backend source/config/data was modified unintentionally and no competitor asset/runtime URL entered public code. Present the local preview route and concise result summary; list any unresolved real-content or environment limits. No commit, deployment or new recording.

## Definition of done and scope boundaries

The deliverable is one working, light green/gold React/Next.js catalogue storefront that visibly follows YAF's retail hierarchy and reads the existing backend. Real product links, discovery, search, Arabic, WhatsApp, metadata, theme persistence and admin save/restart behavior are verified. It is not a checkout system, a pixel-identical competitor clone, a new backend, a production launch or a claim that temporary inventory is actual client stock.
