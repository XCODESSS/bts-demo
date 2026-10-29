# Beyond the Space Perfume Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a distinctive, responsive English/Arabic perfume-catalogue sales demo with exactly 100 curated records and approved-number WhatsApp enquiries.

**Architecture:** Next.js locale-prefixed routes render local, allowlisted product JSON; small typed dictionaries handle two languages. Pure modules own catalogue querying, locale URLs and enquiry construction; semantic UI consumes those interfaces without databases or external product requests.

**Tech Stack:** Next.js 16.4.3, React 19.3.1, TypeScript 5.9.3, ordinary CSS, Fontsource fonts, Vitest 5.0.5, Playwright 1.64.1, Node 22.23.4.

**Spec:** `docs/demo/SPEC.md`; roadmap: `docs/roadmap/ROADMAP.md`.

## Execution update — 2026-10-26

Latest status (2026-10-27): implementation is complete locally, the configured WhatsApp product links/messages have been inspected without sending, and three integrated light design options with a flash-card chooser have been added to the existing UI. `docs/roadmap/STATE.md` and `docs/demo/QA.md` are the progress/evidence records; the checkboxes below preserve the original implementation recipe, not an assertion that work is still unstarted.

The user's latest frontend instruction supersedes **all** historical visual prescriptions below: only a light-coloured website and following the official frontend-design skill are required. Actual direction is documented in `docs/demo/DESIGN.md`. CSS modules, a shared taxonomy file and a combined image-preparation script were used to keep responsibilities focused. Browser tests use a separately built production server; run `npm run build` before `npm run test:e2e`.

## Global Constraints

- Implementation was separately authorized by the user; no delegation, commits or publication were authorized.
- The superpowers workflows named in the standard header are not installed/available in this harness. Do not try to invoke them or delegate automatically. Compatible execution is direct, task-by-task in this session, with the TDD guidance at `D:/inspect_ai/skills/skills/engineering/tdd/SKILL.md` and review gates below. Delegation needs explicit user authorization.
- Proposed test seams are safe data import, pure catalogue queries, locale URL transformation, enquiry URL construction and browser-visible journeys. Confirm these seams when implementation is authorized; no application tests are written during planning.
- Work in `D:/Bts-demo`; source materials in `D:/perfume-search` are read-only.
- Exactly 100 final curated products; a three-product seed is allowed only during the walking skeleton.
- English pricing copy is exactly “Inquire for prices”; no numerical product prices or price sorting.
- No login/admin/cart/checkout/payment/database/CMS/shipping/contact-form delivery, or speculative wishlist/compare/quiz work.
- Preserve the supplied logo; crop it during implementation, never use the whole screenshot or invent a replacement.
- Visual requirement: light-coloured website following the frontend-design skill. Arabic RTL, responsive desktop/mobile, local images/fonts and accessible controls remain functional quality requirements; the original mandatory palette is superseded.
- Never publish/copy raw workbooks, source pricing/research objects or the old project root into the app/public directory.
- Existing image-publication permission is user-confirmed, not independently verified. Do not imply exact package, authenticity or stock verification.
- One supplied size per demo record; selected notes are not a verified top/heart/base pyramid.
- Arabic UI, families, descriptions and retained notes must be readable; official product and brand names may stay Latin.
- Use one configurable approved WhatsApp number; absent/invalid configuration must fail safely. Do not send a message during testing.
- No dependency/browser/skill installation, asset processing, Git initialization/commits, deployment or recording occurs merely because this plan lists it. Project dependency installation and asset processing become permitted only with implementation approval; commits/publication/delegation remain separate choices.

---

## Read before execution

Read `docs/demo/SPEC.md` completely. Review current official frontend guidance at https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md (already read during planning; no installation needed). Apply its plan → review → build → critique discipline, but treat only the actual user conversation as client facts.

Official references verified during planning:

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/guides/internationalization
- https://nextjs.org/docs/app/api-reference/file-conventions/page
- https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
- https://playwright.dev/docs/browsers

`params` and page `searchParams` are promises. The root layout is `src/app/[locale]/layout.tsx`; do not also create a top-level root layout with nested `<html>` tags. Root `/` is a config redirect. Do not use `next lint` or static export.

## File map and responsibilities

All listed application files are **new**, not existing code to modify.

| Files | Responsibility |
| --- | --- |
| `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, `eslint.config.mjs`, `next.config.ts`, `.gitignore`, `.env.example` | Reproducible app/tooling setup and safe local configuration |
| `vitest.config.ts`, `playwright.config.ts` | Unit/browser execution; installed Chrome, isolated test profile |
| `scripts/import-demo.ts`, `scripts/import-core.ts`, `scripts/audit-demo.ts`, `scripts/prepare-brand.py`, `scripts/contact-sheet.py` | Read-only-source transformation, validation, brand extraction and review sheet |
| `content/curation.json`, `content/editorial.json`, `content/provenance.json` | Selected IDs/order, bilingual editorial overrides and private source/permission notes; never under public |
| `src/data/products.json` | Generated allowlisted application data; no source prices/research objects |
| `public/brand/logo.png`, `public/perfumes/*`, `public/hero/*` | Only selected/processed assets, no source screenshot/workbooks |
| `src/features/products/model.ts`, `repository.ts` | Product types and read-only lookup from local JSON |
| `src/features/catalogue/query.ts` | Parse/normalize/search/filter/sort/paginate; no React or filesystem |
| `src/i18n/config.ts`, `dictionaries.ts`, `routing.ts` | Locale guard, typed labels/taxonomy, equivalent-route/query handling |
| `src/features/enquiry/whatsapp.ts`, `enquiry-link.tsx` | Pure destination construction and safe UI rendering |
| `src/app/[locale]/layout.tsx`, `globals.css`, `not-found.tsx` | Root document, fonts, direction, metadata, shell and recovery |
| `src/app/[locale]/page.tsx`, `src/features/home/home-page.tsx`, `home.module.css` | Brand-specific homepage composition |
| `src/components/site-header.tsx`, `mobile-menu.tsx`, `language-switch.tsx`, `site-footer.tsx`, `site-shell.module.css` | Real navigation, mobile interaction, locale action and disclosure |
| `src/app/[locale]/catalogue/page.tsx`, `src/features/catalogue/catalogue-view.tsx`, `catalogue-controls.tsx`, `catalogue.module.css` | Server query evaluation, interactive query controls and visible results |
| `src/features/products/product-card.tsx`, `product-image.tsx`, `product-detail.tsx`, `product.module.css` | Shared cards, photo fallback, detail/related presentation |
| `src/app/[locale]/perfumes/[slug]/page.tsx` | Product routing, not-found and validated return context |
| `tests/unit/import.test.ts`, `query.test.ts`, `routing.test.ts`, `whatsapp.test.ts` | Behavior at the four pure seams |
| `tests/e2e/skeleton.spec.ts`, `home.spec.ts`, `catalogue.spec.ts`, `product.spec.ts`, `locale-mobile.spec.ts`, `release.spec.ts` | Browser-visible capabilities, not implementation selectors |
| `docs/demo/CONTENT_REVIEW.md`, `QA.md`, `WALKTHROUGH.md`, `README.md` | Reviewed content, release evidence, recording path and run instructions |
| `artifacts/screenshots/*` | Actual reviewed implementation screenshots, created only during execution |

Do not create extra architecture layers, a product API, repository interface with one hypothetical adapter or a generalized translation platform.

## Shared interfaces

Create these definitions in Task 1; subsequent tasks must use the same names and fields.

```ts
// src/i18n/config.ts
export type Locale = 'en' | 'ar';
export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'ar';
}

// src/features/products/model.ts
import type { Locale } from '../../i18n/config';
export type Gender = 'men' | 'women' | 'unisex';
export type LocalizedText = Record<Locale, string>;
export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  sizeLabel: string;
  concentration: LocalizedText;
  gender: Gender;
  familyIds: string[];
  notes: Record<Locale, string[]>;
  description: LocalizedText;
  image: { src: string; caveat: LocalizedText };
  featured: boolean;
};

// src/features/products/repository.ts
// All functions return local, read-only content. No network calls.
export function getProducts(): readonly Product[];
export function getProduct(slug: string): Product | undefined;
export function getRelated(product: Product, limit?: number): readonly Product[];
```

Declarations above are the interface contract, not a request to paste unimplemented declarations into runtime code. Repository implementation imports JSON, checks its shape during the data audit, maps it to `Product[]`, finds by slug and returns up to four other records sharing a family, then fills from manifest order excluding duplicates/current record.

### Task 1: Safe seed content and reproducible tooling

**Files:** Create tooling/configuration files, data/import scripts, product model/repository, locale config, seed curation/editorial/provenance, seed JSON/assets and `tests/unit/import.test.ts` from the map.

**Consumes:** Trusted existing `site/data/catalogue.js` and selected source photos, never the workbook directly.

**Produces:** Three safe products; `getProducts()`, `getProduct()` and `getRelated()`; a reproducible import/audit command.

- [ ] Create `package.json` as a private package and `.gitignore` excluding `node_modules`, `.next`, `.env*` except `.env.example`, test-results, Playwright reports and artifacts. Include content manifests locally; do not put them under `public`.
- [ ] After implementation approval only, install the verified versions and supporting tooling:

```bash
cd /d/Bts-demo
npm install --save-exact next@16.4.3 react@19.3.1 react-dom@19.3.1 @fontsource/cormorant-garamond@5.3.0 @fontsource/manrope@5.3.0 @fontsource/noto-sans-arabic@5.3.0
npm install -D --save-exact typescript@5.9.3 vitest@5.0.5 @playwright/test@1.64.1
npm install -D eslint@^9 eslint-config-next@16.4.3 @types/node@^22 @types/react@^19 @types/react-dom@^19 tsx@^4
```

Lock resolved dependencies in `package-lock.json`; no browser installation command. Set scripts:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "typecheck": "next typegen && tsc --noEmit",
  "lint": "eslint .",
  "test": "vitest run tests/unit",
  "test:e2e": "playwright test",
  "data:import": "tsx scripts/import-demo.ts",
  "data:audit": "tsx scripts/audit-demo.ts"
}
```

- [ ] Set strict TypeScript, ESNext modules, bundler module resolution, JSX preserve, JSON imports and `@/*` → `src/*`. Include `.next/types/**/*.ts` and `.next/dev/types/**/*.ts`. Create `next-env.d.ts` with Next and Next image type references. Configure ESLint with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`, ignoring generated assets/artifacts. Vitest includes only `tests/unit/**/*.test.ts`.
- [ ] First write the parser test in the next checkbox and observe its missing-function failure. Then read the source as data, not executable JavaScript: in `scripts/import-core.ts`, implement the known assignment envelope and JSON parser below. Keep test → failure → minimal implementation → pass order even though the intended implementation is shown first for reference:

```ts
export function parseSource(text: string): unknown[] {
  const match = text.match(/^globalThis\.PERFUME_DATA\s*=\s*(\[[\s\S]*\]);\s*$/);
  if (!match) throw new Error('Unexpected catalogue export format');
  const data: unknown = JSON.parse(match[1]);
  if (!Array.isArray(data)) throw new Error('Catalogue must contain an array');
  return data;
}
```

- [ ] Write one failing import test before implementing mapping. Expose `buildDemoProducts(source: readonly unknown[], selection: readonly string[], editorial: EditorialMap, sourceRoot: string): Product[]` and export `EditorialMap = Record<string, { description: LocalizedText; notesAr: string[]; featured: boolean; caveatAr: string }>` from `import-core.ts`. Runtime validation must reject missing source fields, bad IDs, absent selected editorial data and unsafe image paths.

```ts
import { expect, test } from 'vitest';
import { parseSource } from '../../scripts/import-core';

test('rejects executable content outside the data assignment', () => {
  expect(() => parseSource('globalThis.PERFUME_DATA = []; process.exit();'))
    .toThrow('Unexpected catalogue export format');
});
```

Run `npm test -- tests/unit/import.test.ts`; first failure must identify the absent parser/behavior, not broken package setup. Implement `parseSource`, rerun and expect PASS. Repeat one cycle at a time for duplicate selection, missing source ID, missing image file, duplicate final slug and price-field stripping.

- [ ] Use seed IDs `P0028` (Armaf Club de Nuit Iconic, 105 ml), `P0074` (Burberry Her, 100 ml) and `P0574` (Xerjoff Torino21, 50 ml), inspected during planning as exact perfume matches with no warnings and condition not stated. Review their actual images before retaining them. `content/curation.json` is initially that ordered ID array; `--seed` permits exactly three records, default import requires exactly 100.
- [ ] Create the seed family/concentration English/Arabic mapping in `src/i18n/dictionaries.ts` now so importing content does not depend on Task 2. Expand that same taxonomy in Task 5, rather than creating separate import/UI vocabularies. Map each record by explicit field construction: `id`, stable ASCII slug ending with lowercase source ID, `brand`, `name`, `sizeLabel`, translated concentration, normalized gender/family IDs, retained notes/translations, editorial description, locally renamed image path/caveat and featured flag. Never spread a source record into a product. Resolve source paths under `site/assets/perfumes`, reject traversal/non-image extensions, copy only selected files to `public/perfumes/<id>.<ext>`.
- [ ] Implement `scripts/audit-demo.ts` to reject duplicate IDs/slugs, wrong expected count (`--seed` is 3, otherwise 100), missing images, unrecognized family/concentration labels, unequal English/Arabic note counts, empty translations and unexpected product keys. Explicitly forbid `prices`, `catalogue`, `online`, `sourceDescription`, `evidenceUrls`, `listings`, `cost`, `markup`, `vat` and `fx` keys anywhere in generated product data. Check public files are only selected images, logo and deliberate hero assets, not source documents. Do not treat an unrelated number inside a perfume name as a price leak.
- [ ] Implement the three repository functions using the generated data and no mutation. Test `getRelated` behavior later through the detail browser seam, not private helpers.
- [ ] Run `npm run data:import -- --seed`, `npm run data:audit -- --seed`, then `npm test`. Expect three unique usable records and zero private fields. A full Next build is not expected until Task 2 introduces routes.
- [ ] Review gate: inspect generated JSON and copied files; confirm source files were not changed. No Git command unless separately requested.

### Task 2: Bilingual document, shell and route foundation

**Files:** Create `next.config.ts`, `.env.example`, `playwright.config.ts`, locale routing, locale root layout/global styles/not-found, header/footer/mobile menu/language switch, initial homepage/catalogue/product route files, `tests/e2e/skeleton.spec.ts` and `tests/unit/routing.test.ts`; extend the Task 1 dictionary taxonomy with interface labels.

**Consumes:** `Locale`, locale guard and seed repository.

**Produces:** Clean locale-prefixed navigation, correct root HTML attributes and a minimal home → catalogue → product path.

- [ ] Add a temporary `/` → `/en` redirect and `robots: { index: false, follow: false }` metadata. This is a normal Next runtime, not `output: 'export'`.

```ts
// next.config.ts
import type { NextConfig } from 'next';
const config: NextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
  }
};
export default config;
```

- [ ] Configure Playwright with `testDir: './tests/e2e'`, base URL `http://127.0.0.1:3000`, channel `chrome`, one worker, projects named `desktop` (1440 × 1000) and `mobile` (390 × 844), trace on failure. Set `webServer.command` to `npm run build && npm run start -- --hostname 127.0.0.1 --port 3000`, timeout 180000 and `reuseExistingServer: false`. This tests production output, not a stale developer server.
- [ ] Write the failing browser test, run `npm run test:e2e -- tests/e2e/skeleton.spec.ts --project=desktop`, then implement the minimal routes:

```ts
import { expect, test } from '@playwright/test';

test('a visitor can open a perfume from the collection', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
  await page.getByRole('link', { name: 'Explore collection', exact: true }).click();
  await page.getByRole('link', { name: 'View Club de Nuit Iconic', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Club de Nuit Iconic', exact: true })).toBeVisible();
  await expect(page.getByText('Inquire for prices', { exact: true }).first()).toBeVisible();
});
```

- [ ] In root locale layout, await and validate locale; emit the only `<html>`/`<body>` pair, `lang={locale}`, `dir={locale === 'ar' ? 'rtl' : 'ltr'}`, metadata, header, skip link, `<main id="main-content">` and footer. Use `generateStaticParams()` for en/ar. Pages independently validate locale where needed before indexing dictionaries.
- [ ] Build a typed English dictionary and an Arabic dictionary satisfying the same key shape. Include real strings for home/collection/approach/contact, search and filter labels, genders/families/concentrations, result/empty/pagination text, all enquiry/error labels, related/return/navigation labels and demo/reference disclosure. English names may remain Latin inside `<bdi>`; no English-only placeholder paragraph on Arabic pages.
- [ ] Implement `switchLocaleHref(pathname: string, search: string, target: Locale): string` in `routing.ts`. Validate/replace only the initial locale segment, preserve path suffix and query bytes, and return `/${target}` when the incoming pathname has no recognized locale. Use a small client language switch under Suspense for Next navigation hooks. Its action label is `العربية` on English pages and `English` on Arabic pages.

```ts
import { expect, test } from 'vitest';
import { switchLocaleHref } from '../../src/i18n/routing';

test('language change keeps perfume identity and query state', () => {
  expect(switchLocaleHref('/en/perfumes/torino21-p0574', 'return=q%3Dmint', 'ar'))
    .toBe('/ar/perfumes/torino21-p0574?return=q%3Dmint');
});
```

Run `npm test -- tests/unit/routing.test.ts`, implement, rerun. The fixture pathname tests route transformation, not the imported product's generated slug.

- [ ] Initial catalogue renders the seed with explicit `View {name}` links. Initial details use `getProduct(slug)` and Next `notFound()` for unknown slugs. Create localized not-found recovery using the route locale; provide a functioning collection link.
- [ ] Add `.env.example` containing `PERFUME_SOURCE_DIR=D:/perfume-search` and an empty `NEXT_PUBLIC_WHATSAPP_NUMBER=`. Do not copy unknown personal/business contact info from the source project.
- [ ] Run unit tests, `npm run typecheck`, `npm run lint`, `npm run build` and skeleton browser test. Expect correct route/locale behavior. Review gate: no duplicated root layout, unawaited params or accidental server-only imports in client code.

### Task 3: Safe product-specific WhatsApp enquiry

**Files:** Create `src/features/enquiry/whatsapp.ts`, `enquiry-link.tsx`, `tests/unit/whatsapp.test.ts`; extend seed product route and skeleton test.

**Consumes:** `Product`, `Locale`, configured number.

**Produces:** `buildWhatsAppUrl(number: string | undefined, product: Product, locale: Locale): string | null` and `EnquiryLink({ product, locale }: { product: Product; locale: Locale })`.

- [ ] Write one failing test using the actual seed returned by `getProducts()`: invalid/missing number yields null. Run `npm test -- tests/unit/whatsapp.test.ts`, implement the guard and rerun.
- [ ] Add one valid-number test per language, using `14155552671` only as a non-contacted test fixture. Assert hostname, pathname and decoded `text` against literal messages containing the seed's independently known brand/name/size/ID. Never click/send to that fixture from the app or browser.
- [ ] Implement the URL builder with the exact spec messages:

```ts
import type { Product } from '../products/model';
import type { Locale } from '../../i18n/config';

export function buildWhatsAppUrl(number: string | undefined, product: Product, locale: Locale): string | null {
  if (!number || !/^[1-9]\d{6,14}$/.test(number)) return null;
  const message = locale === 'ar'
    ? `مرحباً، أنا مهتم بعطر ${product.brand} ${product.name} بحجم ${product.sizeLabel}. يرجى تأكيد السعر والتوفر. رمز المنتج: ${product.id}.`
    : `Hello, I'm interested in ${product.brand} ${product.name}, ${product.sizeLabel}. Could you please confirm the price and availability? Product: ${product.id}.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
```

- [ ] `EnquiryLink` reads the public configuration, renders a properly labelled link with `target="_blank" rel="noopener noreferrer"` when valid, or a disabled button plus localized configuration explanation when invalid. Share the URL builder for general contact using a selected featured product only when the UI explicitly identifies it; otherwise make general-contact message separate and clearly general, using the same number validator. Do not mislabel a specific-product enquiry as generic contact.
- [ ] For the homepage generic CTA/header contact action, add `buildGeneralWhatsAppUrl(number: string | undefined, locale: Locale): string | null` in the same module, with exact messages `Hello, I would like help choosing a fragrance.` / `مرحباً، أود المساعدة في اختيار عطر.`. Test invalid configuration and each literal message. Reuse the same validation, not a second config setting.
- [ ] Before a number is configured, verify and record the disabled UI state in the browser. Keep the repeatable skeleton test compatible with both configurations: assert exactly one main enquiry action, a disabled action with an explanation when no link is rendered, or a valid `wa.me` destination/message when a link is rendered. Unit tests always cover the missing/invalid-number contract. Do not leave an unconditional disabled-action expectation that would fail after real configuration. Once the user supplies the approved number in `.env.local`, inspect the real link destination and decoded text in both locales without navigating to WhatsApp or sending anything. Public Next configuration is embedded at build, so rebuild after changing the number.
- [ ] Run unit and skeleton checks. **M1 gate:** a complete seed journey works in both languages; configuration absence is explicitly reported, not hidden behind a fake recipient.

### Task 4: Logo-led homepage and responsive navigation

**Files:** Create `scripts/prepare-brand.py`, logo/hero assets, homepage modules/CSS and `tests/e2e/home.spec.ts`; extend root CSS, shell/header/footer/mobile menu.

**Consumes:** Supplied screenshot, safe seed products, dictionaries and enquiry module.

**Produces:** A branded homepage whose visible actions work, plus responsive accessible navigation.

- [ ] Add the logo-preparation script; only run it after execution approval:

```python
from pathlib import Path
from PIL import Image, ImageDraw

source = Path('C:/Users/SHREYARTH/OneDrive/ドキュメント/WhatsApp Image 2026-10-26 at 4.10.44 PM.jpeg')
logo = Image.open(source).convert('RGBA').crop((127, 462, 611, 946))
mask = Image.new('L', logo.size, 0)
ImageDraw.Draw(mask).ellipse((0, 0, logo.width - 1, logo.height - 1), fill=255)
logo.putalpha(mask)
Path('public/brand').mkdir(parents=True, exist_ok=True)
logo.save('public/brand/logo.png')
```

Run `python scripts/prepare-brand.py`; open the output using the image read tool and adjust the crop only if the logo circle/text is clipped. Keep the original screenshot outside public. Do not enlarge it into a giant pixelated hero.

- [ ] Write the failing homepage browser test for visible hero heading, logo accessible name, working scent link and eight featured-card slots once the final dataset exists; during seed development assert all three seed cards without inventing extra products. Run the focused test before building visual modules.
- [ ] Add the six tokens from the spec to `globals.css`; import the regular/semibold body fonts and medium display font from installed Fontsource packages. English uses Manrope, English headings Cormorant Garamond and Arabic uses Noto Sans Arabic. Prefer CSS modules for feature layout; reserve global styles for reset/tokens/type/focus.
- [ ] Build the spec wireframe exactly in this order: header; asymmetric product hero; four scent links; selected fragrances; niche discoveries; approach paragraph; general WhatsApp CTA; footer/demo disclosure. Use real selected product images on quiet white/sand stages. Link scent controls to actual family query values. No nonfunctional search/cart/social/newsletter icons.
- [ ] Hero source stays a permitted product photo. If creating a cutout would damage bottle labels, use the original photo as a deliberate framed panel. Do not add an AI image dependency.
- [ ] Mobile menu button exposes `aria-expanded` and `aria-controls`; a non-modal expandable navigation closes after navigation or Escape, restores focus to its trigger on Escape, and does not trap focus. Filter expansion will follow the same non-modal pattern in Task 6.
- [ ] Apply logical CSS and responsive grid behavior:

```css
:root { --ivory: #faf7f0; --teal: #07363c; --champagne: #d4b991; --ink: #252a29; --sand: #e9e1d3; --white: #fff; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--ivory); color: var(--ink); }
:focus-visible { outline: 3px solid var(--teal); outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
```

Feature CSS sets a centered 1280 px content limit, fluid 20–64 px inline gutters, 2/3/4-column product grid at phone/tablet/desktop widths, minimum 44 px primary controls and `min-width: 0` for long product text. Do not hide overflow to disguise a layout bug.

- [ ] Capture 1440 px English, 390 px English and 390 px Arabic homepage screenshots; inspect them directly. Check text contrast, actual logo legibility, product labels, hierarchy and spacing. The intentional focal point is the hero composition, not decorative animation. Save first visual findings in `docs/demo/QA.md`.
- [ ] Run home/skeleton browser checks plus type/lint/build. Review gate: a recognizable brand-specific direction, all existing routes/buttons real, mobile menu keyboard behavior sound.

### Task 5: Curate and localize exactly 100 products

**Files:** Expand curation/editorial/provenance manifests, generated products/assets; create contact-sheet script and `docs/demo/CONTENT_REVIEW.md`; extend import audit tests.

**Consumes:** Existing 608-record source, import/audit modules, spec eligibility and taxonomy.

**Produces:** Exactly 100 stable safe records, bilingual editorial fields, 8 featured selections and reviewed image coverage.

- [ ] Add a final-content test asserting `expect(getProducts()).toHaveLength(100)` and run it before curating: it must fail against the three-record seed. The existing audit already rejects a three-record dataset in default mode and accepts it in seed mode; do not pretend that already-implemented behavior is a new failing test. The final-content test turns green only after the full import.
- [ ] Generate an eligible candidate list using the spec filters. Exclude quarantined IDs `P0417`, `P0428`, `P0445`, `P0463`, `P0537` and photo gaps `P0166`, `P0167`, `P0261`, `P0367`, `P0412`, `P0502`. Review warnings case by case; exact-match status alone is insufficient. Unstated condition is not a guarantee of retail packaging.
- [ ] Select 100 IDs in fixed featured/editorial order, with one size per fragrance/concentration where possible. Prefer 20+ brands and the spec gender/diversity targets, but never overwrite an uncertain classification to meet a quota. Retain seed records only if they pass visual review.
- [ ] Map every selected source family to canonical IDs and translated labels in `dictionaries.ts`: aquatic, woody, aromatic, citrus, amber, fruity, gourmand, floral, musky, spicy, green, oud, leather and chypre. Reject unmapped values. Concentrations get explicit English/Arabic mappings; do not silently display English concentration labels on Arabic pages.
- [ ] Write concise bilingual descriptions from retained product facts, natural Arabic note translations, and reference-photo caveats. Copy no retailer price comparisons or supplier claims. If a notes claim remains doubtful, omit it in both languages and state the notes are not supplied rather than inventing a pyramid. Set exactly eight `featured` flags and a deliberate niche group using existing brands, not invented product classifications.
- [ ] Implement `scripts/contact-sheet.py` to read generated JSON and make sheets of 20 labelled thumbnails in 4 × 5 grids with ID/name. Save beneath `artifacts/content/`. Open **every** sheet; record each accepted/replaced ID in `CONTENT_REVIEW.md` and keep provenance outside public. The inspection checks identity/flanker, crop, legibility and reference representation, not merely file existence.
- [ ] Run `npm run data:import`, `npm run data:audit`, `npm test`; expect exactly 100 unique records and no missing/unsafe fields or files. Re-run homepage test with its final eight-featured-card expectation. Refresh homepage/hero choices if the seed photographs were weaker than later candidates.
- [ ] **M2 gate:** actual 100-record audit, complete image review and desktop/mobile visual review pass. Do not count a generated contact sheet as a reviewed one.

### Task 6: URL-backed catalogue discovery

**Files:** Create `src/features/catalogue/query.ts`, catalogue view/controls/CSS and `tests/unit/query.test.ts`, `tests/e2e/catalogue.spec.ts`; extend catalogue page/cards.

**Consumes:** Product repository, dictionaries, stable locale routes.

**Produces:** Pure query interface and a responsive functional collection.

```ts
import type { Gender, Product } from '../products/model';
import type { Locale } from '../../i18n/config';
export type CatalogueQuery = {
  q: string; brand: string; gender: Gender | ''; family: string;
  sort: 'featured' | 'name-asc' | 'name-desc'; page: number;
};
export type CatalogueResult = {
  items: readonly Product[]; total: number; page: number; totalPages: number;
};
export function parseCatalogueQuery(params: URLSearchParams, products: readonly Product[]): CatalogueQuery;
export function queryCatalogue(products: readonly Product[], query: CatalogueQuery, locale: Locale): CatalogueResult;
```

- [ ] Start with a literal fixture that gives independent expectations, rather than recomputing the implementation:

```ts
import { expect, test } from 'vitest';
import { getProducts } from '../../src/features/products/repository';
import { parseCatalogueQuery, queryCatalogue } from '../../src/features/catalogue/query';

test('search terms combine across brand and fragrance name', () => {
  const products = getProducts();
  const query = parseCatalogueQuery(new URLSearchParams('q=armaf+iconic'), products);
  expect(queryCatalogue(products, query, 'en').items.map(p => p.id)).toEqual(['P0028']);
});
```

Run `npm test -- tests/unit/query.test.ts`, see a missing-function failure, implement only the first query behavior and rerun. Retain P0028 or revise the literal fixture against a deliberately chosen final product before locking tests; never silently keep a test dependent on a removed seed.

- [ ] Add independent red/green cycles for AND across filter groups, case/Arabic-normalized search, unknown values, stable name sorting, invalid page and empty results. Use `PAGE_SIZE = 12`; return `totalPages = Math.max(1, Math.ceil(total / 12))`. Page 9 of unfiltered final data has four records.
- [ ] Search normalization lowercases, removes Arabic combining marks U+064B–U+065F and U+0670, removes tatweel and normalizes common alef forms. Build searchable text from official names/brands/sizes, family translations and note translations. Do not let raw supplier descriptions/prices enter a client bundle for search.
- [ ] Parse each supported URL parameter using its first value; trim text, ignore invalid brand/gender/family values and default invalid sort/page. In the server page convert awaited searchParams to `URLSearchParams`, preserving only supported keys, then call the pure query functions.
- [ ] Catalogue controls accept `{ locale, query, products }` and change URL state with Next router navigation. Search uses an explicit form submission; filter/sort changes apply immediately. Every new query resets page to 1. Pagination preserves other parameters and bounds itself using the result. Clear filters navigates to the locale collection with no query.
- [ ] Render result count, labelled brand/gender/family controls, active-filter removal, sort, 12-card grid, pagination and localized empty/reset state. Mobile filters use an inline expand button, not a modal drawer. Avoid fake loading delays and unnecessary “show all” mode.
- [ ] Card links carry `return=<encoded catalogue query string>` to detail. Use a reusable `ProductImage` with contained proportions, dimensions and a localized on-error fallback that does not shift card layout. Keep brand/product text in bidi isolation where needed.
- [ ] Browser tests: all-count/pages (100, 12, 4), name/brand search, combined filters, clear reset, empty result, reload/back/forward, image fallback, card destination. Test visible text/roles and hrefs, not private React state. Use `data-testid="product-card"` only for ambiguous repeated-card counting.
- [ ] Run query tests and catalogue browser tests on desktop/mobile. Review gate: all promised controls visibly alter the real dataset; no price filter, dead icon or horizontal-overflow workaround.

### Task 7: Rich details, related products and Arabic context preservation

**Files:** Complete product detail/card/image/CSS, locale routing helpers, locale not-found page; create `tests/e2e/product.spec.ts`, `locale-mobile.spec.ts`; extend routing tests and dictionaries.

**Consumes:** Full dataset, query parser, locale URLs, WhatsApp builder.

**Produces:** Truthful detail pages, retained return context, polished RTL and mobile behavior.

- [ ] Add failing routing tests for return context safety. Expose `catalogueReturnHref(locale: Locale, raw: string | null, products: readonly Product[]): string`: interpret `raw` only as a query string, pass through `parseCatalogueQuery`, serialize supported normalized parameters and prefix `/${locale}/catalogue`. Reject absolute URLs, `//` prefixes, `javascript:` and embedded pathnames by falling back to the collection. Never call router navigation on a supplied arbitrary URL.
- [ ] Write the product browser test: filter to a specific brand, open a card, switch to Arabic and back, then use return-to-results and verify the filter remains. Assert same product slug and correct `lang`/`dir`. Run focused tests before implementing missing behavior.
- [ ] Complete detail layout: breadcrumb/return action; contained large image; brand/name; one supplied size; translated concentration/gender/families; pricing label; concise description; unordered selected notes or localized unavailable state; brief caveat; prominent WhatsApp CTA; four related records excluding the current product. Do not render size selectors when only one size exists.
- [ ] Unknown slug invokes localized recovery; image load failure leaves the product name and enquiry usable. Link related records within the current locale and keep validated return context where appropriate.
- [ ] Audit every dictionary surface: controls, result counts, filters, sort options, empty state, pagination, detail labels, notes, reference caveat, enquiry messages, disabled states, menu names, error/recovery and footer. Use normal Arabic line height/letter spacing; official names remain isolated Latin, not a translated identity guess.
- [ ] Use CSS logical margins/padding/text-align/start and flow-aware layout. Mirror directional arrows only; do not mirror bottle photos, logo or WhatsApp icon. Mark mixed-script names and numeric sizes with `<bdi>`.
- [ ] Mobile/keyboard browser checks: open/close menu with Escape, keyboard tab through search/filters/cards/CTA, switch language on a filtered catalogue, switch on detail, keep selected query/page, and verify 390 px layout plus 360 px smoke. Add `expect(await page.locator('html').getAttribute('dir')).toBe('rtl')` for Arabic.
- [ ] **M3 gate:** complete discovery/detail/enquiry flow in both locales, correct context recovery, truthful product information and no navigation reset when changing language.

### Task 8: Production-build review and recording-ready evidence

**Files:** Create `tests/e2e/release.spec.ts`, `docs/demo/QA.md`, `docs/demo/WALKTHROUGH.md`, `README.md`, reviewed screenshots; update roadmap state only with actual results.

**Consumes:** Integrated demo and the user's approved WhatsApp setting for the final live-link gate.

**Produces:** A locally runnable release candidate with reproducible checks and a short presentation path. Does not deploy or record a video.

- [ ] Add failing browser tests for zero horizontal overflow at 390/768/1440 px, missing-photo fallback, not-found recovery, reduced-motion visibility and broken first-party images. Iterate one behavior at a time. Capture console/page errors and failed first-party requests on the core journey; ignore no application errors just to make the test green.
- [ ] Audit public assets and generated JSON again; ensure only selected assets and explicit allowlisted fields exist. Check repository/source paths and screenshot UI were not accidentally included in public files. Verify the 100 count after all content changes.
- [ ] Run the release commands from the project root:

```bash
npm run data:audit
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

Expected: every command exits 0, production server starts for browser checks, no missing first-party assets or runtime errors on the tested journey. If the approved number is still missing, all non-contact tests can pass but the final live-enquiry gate must be marked blocked, not fully complete. No test is a substitute for visual inspection.

- [ ] In a clean local production session, inspect the approved destination/message for two products in English and Arabic without opening external WhatsApp or sending anything. Rebuild if the public number changed. Confirm `Inquire for prices` everywhere; no numerical prices/checkout controls.
- [ ] Capture and directly review home, filtered catalogue and detail at desktop/mobile widths, plus Arabic home/catalogue/detail. Save representative PNGs under `artifacts/screenshots/`; note actual inspected filenames, defects and corrections in `QA.md`. Check 768 px tablet and a 360 px phone even if only desktop/mobile screenshots are kept.
- [ ] Manually review keyboard focus visibility/order, skip link, menu behavior, contrast, reduced motion, image labels, line wraps and touch targets. Report browser coverage honestly: installed Chrome desktop/emulation is not a completed Safari/iOS audit.
- [ ] Write `WALKTHROUGH.md` with this optional 90–120-second path: (1) home/hero, (2) collection and recognizable search, (3) a brand/family filter, (4) detailed product and enquiry link destination, (5) Arabic on the same product, (6) mobile collection/navigation. Select actual final product names/IDs and verify this exact sequence. Do not perform video capture automatically.
- [ ] Write `README.md` with Node requirement, `npm ci`, `.env.local` configuration, `npm run dev`, production `npm run build && npm run start`, data commands, tests, demo-only limitations and source boundaries. Explain that changing `NEXT_PUBLIC_WHATSAPP_NUMBER` requires a rebuild.
- [ ] Self-review spec coverage, data safety and screenshots. Update `docs/roadmap/STATE.md` with actual command evidence and any blocked gate. **M4 gate:** recording-ready local build, not a claim of production readiness.

## Coverage and scope-pressure checklist

| Required capability | Owning tasks |
| --- | --- |
| Safe data, 100 records, photo permission/representation, no private prices | 1, 5, 8 |
| Correct locale root/routes, translated labels and RTL | 2, 7 |
| Logo, distinctive light homepage, local fonts/images, responsive shell | 4, 8 |
| Product search/filter/sort/pagination and URL persistence | 6, 7 |
| Detail, selected notes, related records, safe missing/unknown states | 3, 7, 8 |
| Approved-number WhatsApp and safe absent configuration | 3, 8 |
| Equivalent-page switching and preserved return context | 2, 6, 7 |
| Mobile/keyboard/reduced motion, visible focus and visual review | 4, 7, 8 |
| Local build and presentation checklist; no automatic publication | 8 |

If build scope exceeds the available appetite, remove optional deployment/video automation/decorative motion first. Do not quietly reduce the promised 100 products, remove Arabic or fake the enquiry flow. See roadmap scope-pressure rules.

## Execution handoff

Plan and roadmap are complete as planning artifacts; no application code exists yet. The next action is explicit implementation approval, including the proposed test seams. Direct inline execution is the available default; subagent execution, commits, deployment and recording are not authorized. The approved WhatsApp number may be supplied during implementation and is required only before the final live-enquiry gate.
