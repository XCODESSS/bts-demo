# Atelier Design With Salon Usability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring Salon’s readable information, early mobile enquiry, responsive product layouts and useful scent discovery into Botanical Atelier without replacing Atelier’s visual identity.

**Architecture:** Keep one Next.js storefront, product repository and set of bilingual routes. Reuse Salon’s proven layout rules and existing four-note data model, but scope visual changes to `html[data-design="atelier"]`. Shared components may gain small presentation props/wrappers; they must not become separate storefronts or fetch another catalogue in the browser.

**Tech Stack:** Next.js 16.4.3, React/React DOM 19.3.1, TypeScript 5.9.3, CSS Modules/global CSS, existing local Fontsource fonts, Radix/shadcn, Vitest 5.0.5, Playwright 1.64.1 with installed Chrome. No new dependency.

**Spec:** No separate integration specification exists. Authority is the user’s request to keep the current design they like while integrating Salon’s structural/technical strengths, followed by “Before you do that, create a plan.” This document makes that proposal explicit. Supporting evidence: `artifacts/critique-frontend/REPORT.md`, `.taste-skill/FRONTEND-REVIEW.md`, `docs/demo/SCENT_SALON.md`, and the inspected application source. Existing functional boundaries remain in `README.md`, `docs/demo/SPEC.md`, `docs/demo/STOREFRONT_REDESIGN.md` and `docs/demo/SHADCN.md`.

## Global Constraints

- **Plan only.** Do not change application code, create the bottle composite, install assets, or start implementation until the user approves execution.
- “Current theme” is interpreted as **Botanical Atelier**, the default green/gold three-bottle design. Confirm this interpretation with execution approval if the user identifies another design.
- Keep the supplied logo, green `#07363C`, champagne `#D4B991`, light canvas, three-bottle campaign, arched product framing, rounded actions, and restrained finite motion. Do not transplant Salon’s square buttons, giant headlines or borderless aesthetic wholesale.
- Keep Gallery, Linen and Salon available and visually stable. No registry rename, new default, fifth theme or separate copy of the website.
- Existing security, product persistence, signed sessions, origin checks, private storage, validation, admin feedback/dirty guard, SEO/noindex, consent analytics and WhatsApp validation/messages remain unchanged.
- Never inspect credentials, edit `.env.local`, use the operator database for tests, reseed/reset inventory, or modify `D:/perfume-search`.
- Preserve exact product/house names, image caveats, approved real bottle photographs and `translate="no"`/`bdi`. No invented business policies, testimonials, live prices or inventory claims. Exact **Inquire for prices** / **يرجى الاستفسار عن الأسعار** stays unchanged.
- Preserve catalogue `q/brand/gender/family/note/sort/page`, validated product `return`, discovery `discovery`, information `info` and panel `details` URL contracts. New note-preview state uses one separate allowlisted key, `scent`.
- Keep English/Arabic and natural RTL, visible focus, native controls, 44px primary touch targets, pinch/text zoom, contained dialogs and reduced motion. No global overflow masking, truncation of official names, positive tabindex, autoplay carousel or sticky overlay.
- Use relative type sizes: 1rem running copy/input text, at least .875rem functional supporting text, at least 1rem product-card names. These are quality targets, not a claim that WCAG prescribes a minimum font size. Do not reduce the browser root font size.
- Use Chicago-style Title Case for new English UI actions/headings; Arabic and official product names are not mechanically recased.
- No dependency/font change in this plan. A separate unexecuted proposal exists at `docs/superpowers/plans/2026-10-29-typography-readability.md`; this plan does **not** authorize its Bodoni installation. If that work has executed before implementation, reuse its typography tokens and do not overwrite it.
- Read the current touched files and their existing diffs before every task. The checkout is dirty and now has a Git repository; do not assume the earlier no-Git state still applies. No reset, stash, clean, commit, worktree, push, deployment or publication is authorized.
- The generic header’s Superpowers skills are not registered here. Execute inline with the existing tools and review checkpoints. No delegation is authorized by this document.
- Proposed test seams for execution approval: rendered DOM/computed styles and geometry; keyboard/history/native links; existing pure `getScentSpotlights` and `withSearchValue` interfaces; existing isolated admin fixture for regression only. No private CSS/source snapshots or mocked internal Router/repository modules.

---

## 1. What Is Being Borrowed—and What Is Not

| Salon strength / critique evidence | Atelier decision | Task |
|---|---|---|
| 16px running copy and readable shopping facts instead of 9–11px microtype | Adopt role-based sizing and darker supporting copy, keeping Atelier families and surfaces | 1 |
| Product enquiry appears around y=570 instead of y=1054 in the critique’s phone sample | Put the summary/enquiry before the large gallery on phones; preserve the desktop split | 2 |
| Image-beside-information phone cards | Adopt single-column product rows at narrow widths, with Atelier’s rounded framing and actions | 3 |
| Complete long names and a 2×2 tablet related grid | Use sufficient measure/natural wrapping and the correct related grid | 3 |
| One understandable hero opening | Integrate the existing heading/copy/action beside Atelier’s retained three bottles, instead of campaign plus second introduction | 4 |
| Four-note selector previews real perfumes/counts | Reuse it inside the existing Notes tab, styled as a compact rounded Atelier composition | 5 |
| Less repeated container treatment | Make Atelier’s house links lighter/less boxed; do not remove catalogue comparison structure | 6 |
| No sample reviews in Salon | **Not copied automatically.** The user previously requested review-template demonstration; retain honest sample labels/section pending a separate removal decision | Scope boundary |
| Square buttons, oversized type, flat hero blocks | **Not copied.** These are aesthetic choices, not technical improvements | All tasks |

The critique’s measurements are historical review evidence, not fresh measurements from this planning session. Recapture before/after during implementation. The themes already share their backend, accessibility foundations and most logic; this is not a backend migration.

### Imagery Handoff—Separate From This Implementation

The user’s desired card-image direction remains:

1. A subtle primary scene using `C:/Users/SHREYARTH/Downloads/Champagne Silk and Stone Display.png`.
2. A richer secondary photograph using the silk/architectural references at:
   - `C:/Users/SHREYARTH/OneDrive/ドキュメント/perfume-mock-up-2.jpeg`
   - `C:/Users/SHREYARTH/OneDrive/ドキュメント/perfume-mock-up.jpeg`

**The bottle preview was explicitly paused.** This plan does not generate/composite/install these assets, create a second-image database field or wire hover image swapping. Both rich references contain a Dior bottle and cannot be reused unchanged behind other perfumes. A bottle-free master or a correctly composited image per product is needed before that separate rollout.

Keep image stages compatible with that follow-up: rounded clipping, stable dimensions, `object-fit: contain`, product facts outside the photograph. Do not bake a second Dior into every card or apply `mix-blend-mode: multiply` to a complete scene photograph. Existing alpha cutouts such as `public/perfumes/P0168.webp` can support a non-generative preview after authorization; no external image API is implicitly approved.

---

## 2. Repository Map and Responsibilities

### Modify

| File | Responsibility |
|---|---|
| `src/app/[locale]/globals.css` | Atelier-only shared readable buttons/headings/footer and narrow product-grid rules; preserve safe gutters and other designs |
| `src/components/site-header.module.css` | Atelier header/search/navigation sizing and small-screen wrapping |
| `src/features/catalogue/catalogue.module.css` | Atelier search/select/chip/count/pagination sizing and 44px targets |
| `src/features/products/product.module.css` | Atelier card/detail typography, mobile summary ordering, card rows, tablet related grid, long titles |
| `src/features/home/home.module.css` | Atelier supporting-copy contrast, compact Notes panel integration and heading sizes |
| `src/features/home/discovery.module.css` | Atelier house directory/category readability and quieter house-link framing |
| `src/features/home/home-extras.module.css` | Readable Atelier guidance, truthful review disclosures and supporting copy; no section deletion |
| `src/features/home/campaign-hero.tsx` | Neutral wrapper around the existing campaign/intro; keep one H1, three real product links and existing Salon composition |
| `src/features/home/campaign-hero.module.css` | Atelier-only unified campaign arrangement and mobile intro-before-imagery; Gallery/Linen/Salon retain current geometry |
| `src/features/home/home-page.tsx` | Pass four bounded `spotlights` into discovery; keep repository access and all stable section IDs server-side |
| `src/features/home/collections-browser.tsx` | Add optional note-preview slot and Atelier-only wrapper, retaining Radix tabs/family tiles and URL selection |
| `src/features/home/collections.module.css` | Hide only Atelier’s old Notes tiles when a live preview exists; retain family tiles and all other designs |
| `src/features/home/scent-spotlight.tsx` | Reuse the existing real-note interaction with a separate `placement` prop; Atelier discovery selection is URL-backed |
| `src/features/home/scent-spotlight.module.css` | Compact inline Atelier presentation; existing Salon hero presentation remains unchanged |
| `tests/e2e/navigation-basics.spec.ts` | Deliberately replace the default eight-note-tile expectation with the new note-preview contract; retain eight family illustrations/real links |
| `tests/e2e/storefront.spec.ts` | Update only superseded default Notes/Lemon navigation assumptions and hero intro geometry assertions |
| `tests/e2e/salon.spec.ts` | Scope figure checks to the visible semantic figure because hidden theme alternatives may coexist; retain exact Salon product/count/route assertions |
| `README.md`, `docs/demo/DESIGN.md`, `docs/demo/QA.md`, `docs/demo/SCENT_SALON.md` | Document adopted behavior, preserved themes, image-work boundary and actual verification |

### Create

- `tests/e2e/atelier-usability.spec.ts`: public Atelier typography, control sizes, product opening, cards and related grid.
- `tests/e2e/atelier-discovery.spec.ts`: Atelier unified hero, live note preview, history/locale/no-script fallback and empty data behavior where supported by the existing fixture.

Do not create a new data repository, theme store, image gallery API, catalogue query parser, font loader or admin server. Reuse the current `getStorefrontModel`, `getScentSpotlights`, `ProductCard`, `EnquiryLink`, `readDiscoveryTab`, `withSearchValue` and design chooser.

### Verified Interfaces

```ts
// src/features/home/scent-spotlights.ts
getScentSpotlights(
  products: readonly Product[],
  groups: readonly DiscoveryGroup[],
  locale: Locale,
): ScentSpotlight[];
// Result: { id, label, href, count, product }, bounded at four real matches.

// src/features/home/collections-browser.tsx — intended backwards-compatible extension
CollectionsBrowser(props: {
  groups: readonly DiscoveryGroup[];
  label: string;
  locale: Locale;
  notePreview?: React.ReactNode;
}): React.ReactNode;

// src/features/home/scent-spotlight.tsx — intended backwards-compatible extension
ScentSpotlight(props: {
  choices: readonly Spotlight[];
  locale: Locale;
  placement?: "hero" | "discovery"; // default "hero", preserving Salon callers
}): React.ReactNode;

// Existing interfaces, unchanged
withSearchValue(href: string, key: string, value: string | null): string;
ProductCard({ product, locale, returnQuery?, headingLevel? });
EnquiryLink({ product?, locale, className?, compact? });
```

Use `ReactNode`/`React.ReactNode` consistently with each file’s imports. Never pass the whole catalogue to a new client component: the existing bounded four-choice result is sufficient.

## 3. Execution Protocol

Run from `D:/bts-demo` in Git Bash. First inspect `git status --short` and the diffs of touched files. The previous remediation includes uncommitted working code; it must not be replaced with an older baseline.

Before code, read these installed guides:

- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`: CSS Module/global order and production CSS.
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`: preserve the server/client boundary.
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`: dimensions, lazy/eager scheduling and deprecated Next Image `priority`.
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`: native History API integration.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-search-params.md`: query state and Suspense.
- `D:/inspect_ai/skills/skills/engineering/tdd/SKILL.md`, `tests.md`, `mocking.md`: behavior tests at agreed seams, one red→green slice at a time.

Start with `npm test`, `npm run typecheck` and `npm run lint`, recording pre-existing failures. Check active Next processes before building. Do not stop unknown processes; coordinate if another worker is building the same `.next` output. The dev preview uses `.next/dev`; a separate production preview may still use `.next`.

Every browser red/green cycle needs a fresh production build when application code changed:

```bash
npm run build
BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/atelier-usability.spec.ts --project=desktop
```

If 3102 is occupied, use another confirmed free `BTS_TEST_PORT`; never attach to an unknown server. Admin regression owns 3101 and uses the existing disposable database fixture. Public test config already blanks operator database/admin settings and uses installed Chrome.

No passing plan check is evidence of implemented behavior. Review each slice, then continue; commits require separate authorization.

---

### Task 1: Borrow Salon’s Readability Without Changing Atelier’s Character

**Files:** Create `tests/e2e/atelier-usability.spec.ts`; modify the owning global/header/catalogue/product/home/discovery/home-extras CSS files in the map. No markup or data changes in this task.

**Interfaces:** Rendered `getDictionary(locale)` accessible names, `data-testid="product-card"`, `.page-width` and native controls. Existing theme selection can be initialized through the registered local-storage key for isolated tests; use actual chooser clicks for theme-switch regression.

- [ ] Capture before screenshots for Atelier home/catalogue/detail in EN/AR at 320/390/768/1440, plus comparison openings for the other three designs. Save under `artifacts/atelier-salon/before/`; do not overwrite existing evidence.
- [ ] Add one first red tracer:

```ts
import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

test("Atelier card facts remain readable on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/catalogue");
  const card = page.getByTestId("product-card").first();
  const title = card.getByRole("heading");
  expect(await title.evaluate(el => parseFloat(getComputedStyle(el).fontSize)))
    .toBeGreaterThanOrEqual(16);
  const demo = card.getByText(getDictionary("en").demoPrice, { exact: true });
  expect(await demo.evaluate(el => parseFloat(getComputedStyle(el).fontSize)))
    .toBeGreaterThanOrEqual(14);
});
```

- [ ] Build/run the tracer with `--grep "card facts"`; expected red is the current 13px title/9px demo label, not a server/setup failure.
- [ ] Add an explicit Atelier block in `product.module.css`, after conflicting base/mobile declarations. Reuse separate module classes rather than selecting all small text globally:

```css
:global(html[data-design="atelier"]) .cardTitle { font-size: 1.125rem; line-height: 1.4; }
:global(html[data-design="atelier"]) .brand,
:global(html[data-design="atelier"]) .meta,
:global(html[data-design="atelier"]) .demoPrice small,
:global(html[data-design="atelier"]) .priceValues del,
:global(html[data-design="atelier"]) .discountBadge,
:global(html[data-design="atelier"]) .caveat,
:global(html[data-design="atelier"]) .pricingDisclaimer,
:global(html[data-design="atelier"]) .notes small { font-size: .875rem; line-height: 1.6; }
:global(html[data-design="atelier"]) .description,
:global(html[data-design="atelier"]) .notes li { font-size: 1rem; }
:global(html[data-design="atelier"]) .cardAction { font-size: .875rem; min-height: 44px; }
:global(html[data-design="atelier"]) .priceValues strong { font-size: 1.25rem; }
:global(html[data-design="atelier"]) .purchasePrice .priceValues strong { font-size: 1.875rem; }
```

Keep `var(--body)` and `var(--display)` roles; do not change installed fonts. If separate typography tokens now exist, use their equivalent roles instead of duplicating literal sizes. Preserve current rounding, borders, palette and hover states.

- [ ] Rebuild/run the same test green. Then add one browser slice per surface: header/search input at least16px; catalogue search/select at least16px; filter labels/results/chips at least14px; actual submit/pagination/chip targets at least44px in both dimensions where standalone.
- [ ] Use explicit Atelier overrides for `.searchForm button`, `.pagination a`, `.activeFilters button` and `.filterToggle`; give the mobile filter its readable 14px label instead of the current `font-size:0`. Let search rows wrap at 320px rather than shrinking text/targets.
- [ ] Add high-contrast/readable homepage supporting copy. In `home.module.css` use this scoped rule for the actual shared heading paragraph, not only the unused `.collectionsHeading` class:

```css
:global(html[data-design="atelier"]) .collections :global(.section-heading p) {
  color: var(--ink);
  font-size: 1rem;
  line-height: 1.65;
}
```

Raise house-directory/category descriptions, footer links, campaign captions and required disclosures to the role floors in their owning stylesheets. Limit changes to Atelier; no blanket `small { font-size:... }` affecting decorative chooser thumbnails.

- [ ] Rebuild/run `atelier-usability.spec.ts`, `interface-layout.spec.ts`, `interface-hover.spec.ts` and `navigation-basics.spec.ts`. Review computed text sizes, 320px wrapping, full names and contrast on green/gold surfaces. A larger font without a fitting layout is not accepted.
- [ ] Review checkpoint: retain other designs’ baseline appearance, visible focus and safe gutters. No commit.

### Task 2: Bring Product Enquiry Into the First Mobile Screen

**Files:** Modify `src/features/products/product.module.css`; extend `tests/e2e/atelier-usability.spec.ts`. Keep `product-detail.tsx`’s current summary/gallery/body source structure unless a named wrapper is needed for tests; it already has `.purchaseSummary` before `ProductGallery` in DOM order.

**Interfaces:** The article’s name/size, `EnquiryLink`, source image and `details`/`return` queries remain unchanged.

- [ ] Add a tracer in both locales, starting at390×844:

```ts
for (const locale of ["en", "ar"] as const) {
  test(`Atelier ${locale} exposes product enquiry before the large gallery`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/perfumes/dior-spice-blend-p0168`);
    await page.evaluate(() => document.fonts.ready);
    const article = page.getByRole("article", { name: "Spice Blend", exact: true });
    const d = getDictionary(locale);
    const link = article.getByRole("link", { name: d.enquire, exact: true });
    const action = await link.count() ? link : article.getByRole("button", { name: d.enquire, exact: true });
    await expect(action).toBeInViewport({ ratio: 1 });
    const photo = article.getByRole("button", { name: d.zoomImage, exact: true });
    expect(await action.evaluate(el => el.getBoundingClientRect().bottom))
      .toBeLessThan(await photo.evaluate(el => el.getBoundingClientRect().top));
  });
}
```

- [ ] Build/run `--grep "exposes product enquiry"`; expected red is the current image-first phone layout.
- [ ] Reuse Salon’s existing row assignments, scoped to Atelier:

```css
@media (max-width: 760px) {
  :global(html[data-design="atelier"]) .purchaseSummary { grid-row: 1; }
  :global(html[data-design="atelier"]) .gallery { grid-row: 2; margin-block: 24px 28px; }
  :global(html[data-design="atelier"]) .detailBody { grid-row: 3; }
  :global(html[data-design="atelier"]) .imageButton { min-height: 300px; padding: 24px; }
  :global(html[data-design="atelier"]) .detailImage { height: 260px; }
  :global(html[data-design="atelier"]) .productTopBar { padding-block: 12px; }
  :global(html[data-design="atelier"]) .detailInfo h1 { margin-block: 8px 14px; }
  :global(html[data-design="atelier"]) .variantLine { margin-block: 12px; font-size: 1rem; }
  :global(html[data-design="atelier"]) .familyList { margin-bottom: 16px; }
}
```

Keep rounded image stages/gold buttons. Do not copy Salon’s serif product identity or zero-radius overrides.

- [ ] Rebuild/run the tracer green. Add360×844, Torino21 and the long `giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042` fixture one at a time. All names must remain complete. Allow more than two lines when necessary rather than hiding names.
- [ ] If readable full copy makes the long phone opening exceed844px, use a scoped flex ordering of summary’s **noninteractive** disclaimer after the existing actions; keep the visible Demo Price label before the action and the full disclaimer immediately below it. Do not hide/delete it or change interactive focus order. Use this exact ordering only on phones: brand, H1, demo price, variant, families, actions, price confirmation, full disclaimer. Use the existing named classes, scoped to the phone query:

```css
:global(html[data-design="atelier"]) .purchaseSummary { display: flex; flex-direction: column; }
:global(html[data-design="atelier"]) .detailBrand { order: 0; }
:global(html[data-design="atelier"]) .detailInfo > h1 { order: 1; }
:global(html[data-design="atelier"]) .purchasePrice { order: 2; }
:global(html[data-design="atelier"]) .variantLine { order: 3; }
:global(html[data-design="atelier"]) .familyList { order: 4; }
:global(html[data-design="atelier"]) .purchaseActions { order: 5; }
:global(html[data-design="atelier"]) .priceConfirmation { order: 6; }
:global(html[data-design="atelier"]) .pricingDisclaimer { order: 7; margin-block: 12px 0; }
```

Verify the screen-reader/source order still contains all disclosure text and no duplicate buttons.
- [ ] Rebuild/run product-polish, Salon and product-return journey tests. Check desktop still has the photo/details split, the original full photograph opens in the modal, and disabled enquiries remain honestly disabled.
- [ ] Review checkpoint: opening action is fully visible at tested phone sizes, without a sticky bar, text shrinkage or changed WhatsApp message. No commit.

### Task 3: Give Phone Cards and Tablet Related Products Sufficient Room

**Files:** Modify `src/app/[locale]/globals.css`, `src/features/products/product.module.css`; extend `tests/e2e/atelier-usability.spec.ts`.

**Interfaces:** Existing single product link per card, contextual H2/H3, price/disclosure content and validated return context remain unchanged. No nested image-switch button is introduced.

- [ ] Add one red test at390px: the first card’s image and heading must share the row, with image centre physically left of text in English and right of text in Arabic. At this point the card is still vertically stacked, so this geometry assertion should fail. Use one test per locale and initialize a390px viewport:

```ts
const card = page.getByTestId("product-card").first();
const image = await card.locator("img").boundingBox();
const heading = await card.getByRole("heading").boundingBox();
expect(image).not.toBeNull();
expect(heading).not.toBeNull();
const imageCentre = image!.x + image!.width / 2;
const headingCentre = heading!.x + heading!.width / 2;
if (locale === "en") expect(imageCentre).toBeLessThan(heading!.x);
else expect(imageCentre).toBeGreaterThan(heading!.x + heading!.width);
expect(heading!.y).toBeLessThan(image!.y + image!.height);
expect(headingCentre).not.toBe(imageCentre);
```
- [ ] Implement Atelier-only row cards using Salon’s layout principle, not its visual styling:

```css
/* globals.css */
@media (max-width: 600px) {
  html[data-design="atelier"] .product-grid { grid-template-columns: minmax(0, 1fr); }
}
/* product.module.css */
@media (max-width: 600px) {
  :global(html[data-design="atelier"]) .cardLink {
    display: grid;
    grid-template-columns: minmax(0, .85fr) minmax(0, 1.3fr);
    column-gap: 16px;
    align-items: center;
  }
  :global(html[data-design="atelier"]) .imageStage { height: 220px; aspect-ratio: auto; }
  :global(html[data-design="atelier"]) .cardBody { min-width: 0; padding-block: 8px; }
  :global(html[data-design="atelier"]) .cardTitle { font-size: 1rem; min-height: 0; }
}
```

Retain current card radius, green rounded View Fragrance action, image aspect preservation and champagne accents. A tall complete card is preferable to clipped names.

- [ ] Rebuild/run that row test green. Extend it to320/360px and long official names; assert no document overflow and no truncated/hidden name text.
- [ ] Add a tablet red tracer on the product page at768px: obtain related cards from the section containing `d.related`; collect rounded top coordinates and require exactly2 rows with2 cards each.

```ts
const tops = await page.getByRole("heading", { name: d.related, exact: true })
  .locator("xpath=ancestor::section[1]").getByTestId("product-card")
  .evaluateAll(cards => cards.map(el => Math.round(el.getBoundingClientRect().top)));
expect(tops).toHaveLength(4);
expect(new Set(tops).size).toBe(2);
expect(tops.filter(top => top === tops[0])).toHaveLength(2);
```

- [ ] Add `:global(html[data-design="atelier"]) .related :global(.product-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }` inside the existing max900px query, retaining the max600px single-column row rule. Rebuild/run green; verify four-across desktop remains.
- [ ] Run journey, visual and Salon suites. The default grid changes on phones are deliberate; do not update inventory/count assertions. This task increases card height for readability; Task5 reduces redundant note-tile scrolling, rather than shrinking card text again.
- [ ] Review checkpoint: readable details, accurate bottles, intact single-link semantics and correct RTL row direction. No commit.

### Task 4: Unify Atelier’s Opening While Keeping the Three-Bottle Campaign

**Files:** Modify `src/features/home/campaign-hero.tsx`, `campaign-hero.module.css`; create `tests/e2e/atelier-discovery.spec.ts`.

**Interfaces:** Keep `CampaignHero({ locale, products, spotlights })`, three current repository products, one H1 and the existing `ScentSpotlight` call for Salon. No fetched/generated hero assets.

- [ ] Add a red390px test requiring the main Explore Collection action to precede the first campaign photograph and be fully in the first844px viewport. Scope the action under `main`, not footer links. Add an independent desktop assertion of exactly3 campaign product links and exactly1 H1.
- [ ] Wrap the current `.stage` and `.intro` siblings in a new neutral `<div className={styles.campaign}>`; leave `ScentSpotlight` as the next child of `.hero`. Set `.campaign { display: contents; }` by default so the other themes preserve their current geometry. The neutral wrapper must not carry an ARIA region whose semantics depend on `display:contents`.
- [ ] Add a decorative local-logo Image at the start of `.intro`, class `.introLogo`, `alt=""`, existing local dimensions and modern eager/high attributes. Default `.introLogo { display:none }`; it is visible only in Atelier. The existing statement/logo stays intact for Gallery/Linen. Avoid duplicate visible logos/headings.
- [ ] Implement this Atelier structure, adapting original padding/spacing rather than adopting Salon’s rectangular split hero:

```css
:global(html[data-design="atelier"]) .campaign {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.3fr);
  align-items: center;
  gap: 28px;
  padding: 32px;
  border-radius: 10px;
  background: var(--brand-green);
  color: var(--white);
}
:global(html[data-design="atelier"]) .stage {
  grid-column: 2; grid-row: 1;
  grid-template-columns: minmax(0, 1fr);
  min-width: 0; min-height: 0;
  background: transparent;
  padding: 24px 0;
}
:global(html[data-design="atelier"]) .statement { display: none; }
:global(html[data-design="atelier"]) .intro {
  grid-column: 1; grid-row: 1;
  margin: 0; min-width: 0; text-align: start;
}
:global(html[data-design="atelier"]) .introLogo { display: block; margin-bottom: 20px; border-radius: 50%; }
:global(html[data-design="atelier"]) .intro h1 { color: var(--brand-gold); font-size: clamp(2rem, 3.3vw, 3rem); }
:global(html[data-design="atelier"]) .intro > p { color: var(--white); font-size: 1rem; }
@media (max-width: 650px) {
  :global(html[data-design="atelier"]) .campaign { grid-template-columns: minmax(0, 1fr); padding: 24px 16px; gap: 16px; }
  :global(html[data-design="atelier"]) .intro { grid-column: 1; grid-row: 1; }
  :global(html[data-design="atelier"]) .stage { grid-column: 1; grid-row: 2; padding-block: 8px; }
}
```

The retained three arched `.photo` elements provide the preferred visual identity. The duplicated generic campaign sentence is hidden only in Atelier, not deleted from other themes. Keep actual heading font roles and Arabic line heights; do not force giant Salon type.

- [ ] Rebuild/run red tracer green. Test empty products: no invalid product links; single heading/action still rendered; existing `#scents`/`#houses` recovery anchors stay available.
- [ ] Run interface motion/assets/layout and Salon tests. Keep the finite3.2s decorative bottle sequence and reduced-motion cancellation; do not restore Pause or add a new loop. Verify Gallery/Linen’s old campaign+intro and Salon’s hero/spotlight layout against their baseline screenshots.
- [ ] Review checkpoint: one Atelier introduction, immediately actionable, three bottles retained, same green/gold/arches. No commit.

### Task 5: Reuse Salon’s Live Note Preview Inside Atelier’s Existing Discovery

**Files:** Modify `home-page.tsx`, `collections-browser.tsx`, `collections.module.css`, `scent-spotlight.tsx`, `scent-spotlight.module.css`; extend `tests/e2e/atelier-discovery.spec.ts` and update the deliberately superseded assertions named in the file map. Existing `getScentSpotlights` stays unchanged.

**Interfaces:** Extend `CollectionsBrowser` with `notePreview?: ReactNode`; extend `ScentSpotlight` with `placement?: "hero" | "discovery"`, default `"hero"`. URL key `scent` applies only to the discovery placement and accepts IDs in the current bounded `choices`; absent/unknown values select the first actual choice. Empty choices render nothing. Salon hero retains its current local-state behavior.

- [ ] Write a red test: open `/en#scents`, select Notes, require4 note links and exactly1 visible perfume preview. Activating Rose must preview **Pour Homme**, show **14** real matches, and expose `/en/catalogue?note=rose`. Use the following public behavior slice, rather than asserting a class name or recomputing the expected count:

```ts
test("Atelier Notes previews an actual matching fragrance", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en#scents");
  await page.getByRole("tab", { name: d.noteFilter, exact: true }).click();
  const preview = page.getByRole("region", { name: d.spotlightLabel, exact: true });
  const notes = preview.getByRole("navigation", { name: d.spotlightLabel, exact: true });
  await expect(notes.getByRole("link")).toHaveCount(4);
  await notes.getByRole("link", { name: "Rose", exact: true }).click();
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await expect(preview).toContainText("14 fragrances with Rose");
  await expect(preview.getByRole("link", { name: d.spotlightBrowse, exact: true }))
    .toHaveAttribute("href", "/en/catalogue?note=rose");
});
```

Import `test`/`expect` from `@playwright/test` and `getDictionary` from `../../src/i18n/dictionaries` into the new test file.
- [ ] Pass the already computed bounded choices through a server-rendered slot:

```tsx
<CollectionsBrowser groups={model.groups} label={d.discover} locale={locale}
  notePreview={spotlights.length ? <ScentSpotlight choices={spotlights} locale={locale} placement="discovery" /> : undefined} />
```

Import `ScentSpotlight` into `home-page.tsx`. Do not pass all products, add an API route or duplicate merchandising queries.

- [ ] In `CollectionsBrowser`’s Notes panel, render the optional slot in `.atelierNotePreview` and wrap the existing tile grid with a named `.legacyNoteTiles` class **only when a slot exists**. Default preview wrapper is hidden. In Atelier show it and hide that panel’s old Notes grid. Family tiles and every other design’s grids remain as they are. If no valid previews exist, keep the actual existing tiles rather than leaving an empty panel.
- [ ] Give the discovery instance a stable semantic wrapper: `data-placement="discovery"`, `role="region"`, `aria-label={d.spotlightLabel}`. Retain the existing links/nav and live product caption. Add `placement` to the class selection; the hero remains the default.
- [ ] Implement allowlisted query state with the existing helper. Inside `ScentSpotlight`, call hooks unconditionally, derive discovery state from `useSearchParams`, and retain `useState` for the hero instance:

```ts
const search = useSearchParams();
const [localSelected, setLocalSelected] = useState(choices[0]?.id);
const requested = placement === "discovery" ? search.get("scent") : localSelected;
const current = choices.find(choice => choice.id === requested) || choices[0];

function choose(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (placement === "hero") { setLocalSelected(id); return; }
  if (!choices.some(choice => choice.id === id)) return;
  const value = id === choices[0]?.id ? null : id;
  const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const next = withSearchValue(href, "scent", value);
  if (next !== href) window.history.pushState(null, "", next);
}
```

Default-destructure `placement = "hero"`. Import the existing helper and `useSearchParams`. Existing homepage is force-dynamic; retain it. If a new consumer is static, add a local Suspense boundary, not a whole-section geometry-changing placeholder.

- [ ] Style the Atelier discovery instance as a compact rounded composition: note chips44px tall; desktop photo and factual caption side-by-side; photograph about220px tall; phone photograph160–180px with readable caption, stacking only when needed. Use the same green/gold tokens, rounded chips and borders as Atelier. No giant second hero or dark rectangular Salon copy. Set `ProductImage priority={placement === "hero"}` so the below-fold discovery photo is lazy.
- [ ] Build/run the initial preview test green. Then add one slice at a time for: `?scent=rose` direct entry/reload; Back/Forward; Arabic equivalent route with selected ID retained; unknown key→first choice; changing `discovery=families` and back preserves `scent`; preserve `info` and hash when choosing a note. No scroll jump from native History API updates.
- [ ] Test native fallback independently in a no-JavaScript context: Notes links navigate to real catalogue results rather than attempting an in-place swap. Modified clicks must remain native links. Existing unit tests already prove empty/small catalogues and counts; run `npm test -- tests/unit/scent-spotlights.test.ts` without replacing their assertions.
- [ ] Update old default Notes tests consciously: Atelier Notes now has4 interactive previews, while Families still has8 distinct category illustrations. Keep Gallery/Linen’s8-note tile behavior. Scope hover-lift tests to a retained family tile rather than requiring a removed Atelier Lemon tile. In `salon.spec.ts`, replace broad `page.locator("figure")` with visible semantic `page.getByRole("figure")` or the visible spotlight region; retain exact Salon names/counts/destinations.
- [ ] Run atelier-discovery, interface-state, navigation-basics, storefront, scroll-and-footer and Salon suites. Require exactly1 visible spotlight per design; no duplicated accessible note controls or lost server-rendered catalogue links.
- [ ] Review checkpoint: live discovery helps selection instead of creating an extra marketing section; other themes retain their composition. No commit.

### Task 6: Lighter House Browsing, Integration Evidence and Handoff

**Files:** Modify `src/features/home/discovery.module.css`; extend `atelier-usability.spec.ts`; update README/DESIGN/QA/SCENT_SALON docs only after verified behavior.

**Interfaces:** Existing8 featured house links, actual per-house counts, full searchable40-house directory, native modal focus/Escape and catalogue URLs stay unchanged. No new brand data or invented logos.

- [ ] Add a browser regression requiring8 house links with complete names/readable counts and a working Dior filter in each locale. Add one style assertion for Atelier’s lighter treatment and retain visible arrow/hover/focus feedback. A focused tracer is:

```ts
test("Atelier houses stay readable and lead to real filters", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en#houses");
  const houses = page.getByRole("region", { name: d.brandsTitle, exact: true });
  await expect(houses.getByRole("link")).toHaveCount(8);
  const dior = houses.getByRole("link", { name: "Dior", exact: true });
  await expect(dior).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await dior.click();
  expect(new URL(page.url()).searchParams.get("brand")).toBe("Dior");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expect(page.getByTestId("product-card")).toContainText("Spice Blend");
});
```
- [ ] Build/run red against the current white boxed cards. Adapt Salon’s principle, not all of its values:

```css
:global(html[data-design="atelier"]) .brandCard {
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
  padding: 16px 0;
}
:global(html[data-design="atelier"]) .houseName { font-size: clamp(1.25rem, 2vw, 1.75rem); }
:global(html[data-design="atelier"]) .houseMeta { font-size: .875rem; color: var(--ink); }
:global(html[data-design="atelier"]) .brandCard:hover .houseName { text-decoration: underline; text-underline-offset: 4px; }
```

Keep green rounded directory trigger/arrow controls and equal outer gutters. Do not restyle form fields/admin tables as borderless marketing content.

- [ ] Rebuild/run focused green and existing directory keyboard/focus tests. Review both locales, especially long house names at320px.
- [ ] Run all non-browser gates sequentially:

```bash
npm run data:audit
npm test
npm run typecheck
npm run lint
npm run build
```

Expected audit remains100 unique bilingual seed products/40 houses/no private fields. Record actual test counts instead of copying previous runs.

- [ ] Run the complete public suite, then the existing isolated admin suite:

```bash
BTS_TEST_PORT=3102 npm run test:e2e
npm run test:e2e:admin
```

Update only consciously superseded visual/Notes assumptions; do not remove product-data, route, inventory-count, auth, consent, enquiry or no-JavaScript assertions. Optional analytics requires the existing documented fixture-ID build and intercepted external transport; restore the ordinary build afterward without changing `.env.local`.

- [ ] Capture `artifacts/atelier-salon/after/`: Atelier home/catalogue/detail in EN/AR at320/360/390/768/1440; long title; open filters/directory/photo; chosen Rose preview and Families tab. Include comparison openings for Gallery/Linen/Salon using the actual design chooser, not merely mutating `data-design` while leaving `DesignText` stale.
- [ ] Review full-size screenshots, not only sheets. Check legibility, actual bottle/contact framing, early actions, complete labels and matching tablet rows. No card background asset change should appear in this pass.
- [ ] Verify keyboard tab order, native links, Escape/focus return, rapid note/tab switching, reduced motion, blocked storage, missing photographs, fonts failing and no-JavaScript catalogue access. Check200% zoom/text resize without turning it into a fixed two-line-name requirement. Physical iOS/Safari/hybrid-pointer checks remain explicitly unverified unless actually performed.
- [ ] Append results to `docs/demo/QA.md` and update README/DESIGN/SCENT_SALON with: what was borrowed, what stayed Atelier-specific, the phone-card tradeoff, `scent` contract, other-theme regression evidence, and the separately paused primary/secondary-image work. Preserve dated historical evidence.
- [ ] Final review checkpoint: all six borrowed strengths map to executed tests/screenshots or an explicit unresolved item; operator data is untouched; the existing preview remains available. No commit/deployment.

---

## Acceptance Checklist

- [ ] Atelier still looks like the preferred green/gold, arched, rounded three-bottle design—not Salon with a different name.
- [ ] Product facts/disclosures are readable; controls have practical touch targets; no shrink-to-fit microtype or official-name truncation.
- [ ] At tested360/390px phone sizes, real product enquiry is fully visible before the large gallery, including the selected long-name fixture and both locales.
- [ ] Phone cards use image/text rows; tablet related products are2×2; desktop comparison grids remain useful.
- [ ] Atelier has one coherent hero introduction and3 real campaign products, with native links and finite/reduced motion retained.
- [ ] Atelier Notes has a compact, real four-note perfume preview; Families remains available; chosen state survives history/reload/locale navigation.
- [ ] Other3 designs retain their intended composition, typography direction, chooser persistence and native behavior.
- [ ] Empty/small data, missing photos, long names, keyboard operation and no-JavaScript access work honestly.
- [ ] Sample price/review disclosures remain visible; no unsupported claims or commercial functionality are introduced.
- [ ] All project gates run with actual recorded evidence; protected runtime data/configuration is untouched.
- [ ] The paused bottle composite/card-image rollout is clearly separate; no image API, asset replacement or all-product compositing has been silently authorized.

## Planning Handoff

This is the proposed integration scope, not a claim of completion. Execute inline only after the user approves the plan. Keep a review checkpoint after each task. If the preferred theme is not Botanical Atelier, correct the target before making any application changes.
