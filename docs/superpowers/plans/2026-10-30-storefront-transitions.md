# Storefront Transitions Implementation Plan

## Execution Record — 2026-10-30

Execution approved by the user's “Implement the transition plan” and “Continue” requests. Implemented inline, without delegation, commits, deployment, dependency/asset changes or operator-data access. The proposal and unchecked detailed steps below remain planning history; this record and [QA.md](../../demo/QA.md#storefront-transitions--2026-10-30) describe actual delivery and limits.

- [x] Task 1: Public route boundaries, steady shell, query isolation and separately typed design crossfade.
- [x] Task 2: Selected-photo continuity on warm desktop card/return navigation; Featured/related coverage, mobile suppression and real-link fallback/history checks.
- [x] Task 3: Natural-height phone filters, inert closed controls, Escape focus return and responsive semantics.
- [x] Task 4: Mounted interruptible mobile menu; closed links inert; pathname-keyed state reset.
- [x] Task 5: Four shared native-dialog treatments, immediate close/focus/history semantics and retained footer topic.
- [x] Task 6: Full public/admin gates, normal-motion recordings, before/after layout comparisons, inline diff review and documentation.

Final gates: data audit passed (100 products/40 houses), **60 unit tests**, typecheck/lint/production build passed, **322 public passes / 16 expected skips / 0 failures**, **5 isolated admin passes**. Evidence: `artifacts/transitions/`. Each phase captured 96 route/design/locale/viewport cases (192 opening/full-page images). All dimensions match; 187/192 comparisons are pixel-identical and the other five differ only by ≤2 RGB levels. Recorded 28 actual motion interactions with WAAPI/RAF observations and desktop/phone videos.

Execution adjustments: active previews required an isolated seed-only production snapshot. Next RSC streams can remain open after delivering route data, so intent-prefetch tests observe the real RSC response and require actual paired motion rather than waiting indefinitely for stream closure. The steady-header assertion uses document position (`headerTop + scrollY`) because the existing header is non-fixed. Resting directory geometry waits for entrance to settle; dedicated tests still require real intermediate entrance/exit frames. The disposable admin empty-catalogue test uses an accessible-role link to exclude the newly mounted hidden menu. No functional assertions were removed.

Physical iOS/Safari/hybrid-pointer and older browsers without discrete-dialog CSS remain unverified. Browser-gesture reverse morphing, campaign/spotlight morphs, result reordering, photo-to-zoom shared motion and all scene/composite work remain excluded. Existing previews and `.env.local` were not modified. No commit/push/deployment is authorized by this execution record.

---

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the recommended first motion set—public page transitions, card-to-detail bottle continuity, an animated mobile filter panel, an animated mobile menu and consistent existing-dialog transitions—without changing the storefront layout or shopping behavior.

**Architecture:** Use the installed React `ViewTransition` integration for route/shared-image transitions, and CSS transitions for local panels/native dialogs. Keep server-rendered pages, real Next links and the existing repository; add small presentation adapters rather than an animation router or a second product store. Separate the existing imperative design-switch transition from route motion so only one motion treatment owns each navigation.

**Tech Stack:** Next.js 16.4.3 App Router, React/React DOM 19.3.1, TypeScript 5.9.3, existing CSS Modules/global CSS, Playwright 1.64.1 with installed Chrome, Vitest 5.0.5. No new package, experimental configuration or font/image dependency.

**Spec:** No separate transition specification exists. Authority is the user's bottle-from-card request and subsequent request to plan the recommended first set across the website. This document fixes that scope explicitly. Existing behavior/design constraints are in `README.md`, `docs/demo/DESIGN.md`, `docs/demo/QA.md`, and `docs/superpowers/plans/2026-10-29-atelier-salon-integration.md`. Planning baseline: commit `be93079` on `main`, clean at inspection on 2026-10-30.

## Global Constraints

- **Plan only.** Do not implement application code, add dependencies, commit, push or deploy until execution is separately approved. The earlier integration commit/push permission has already been fulfilled and is not permission to publish this work.
- The header's generic Superpowers skills are not registered in this harness. Execute inline with the available tools and review checkpoints unless the user explicitly authorizes delegation. No worktree, background implementer or independent reviewer is authorized by this document.
- Preserve all four design IDs and their settled surfaces/typography. This is a shared interaction enhancement for Atelier, Gallery, Linen and Salon, not a fifth design or an Atelier-only rebrand.
- Preserve English/Arabic, natural RTL, complete official names, `translate="no"`/`bdi`, one H1, visible focus, 44px primary targets, pinch/text zoom and contained dialogs.
- Preserve Atelier/Salon's **enquiry-before-gallery mobile layout**. Never auto-scroll to the photograph or move it above the enquiry merely to demonstrate an effect.
- Keep the supplied logo, approved photographs, all photo caveats, labelled sample prices/reviews and exact enquiry-price wording. No compositing, cutout generation, scene-background replacement or primary/secondary-image rollout; that work is still separately paused.
- Preserve catalogue `q/brand/gender/family/note/sort/page`, validated product `return`, `details`, `discovery`, `scent` and `info` URL behavior. No transition query key, local-storage navigation log or overwrite of Next's history state.
- Preserve repository access, admin security/auth/dirty-form behavior, SEO/noindex, WhatsApp validation/messages and consent analytics. Do not put the admin/not-found screens inside public page motion wrappers.
- Never inspect credentials, edit `.env.local`, test against operator SQLite, reseed/reset inventory or modify `D:/perfume-search`. Public tests blank database/admin settings; admin regression uses its existing disposable fixture.
- Motion is progressive enhancement. With unsupported View Transitions, disabled JavaScript, failed images, reduced motion, slow requests or cancelled navigation, real navigation/content must still work. No fake loading delay, click-blocking overlay, page-sized skeleton replacement, cloned interactive image or route-await timeout.
- Use transform/opacity for visual movement; the mobile filter disclosure may use `grid-template-rows` for natural-height expansion. No bounce, elastic movement, full-screen zoom or long stagger. Respect reduced motion on the actual View Transition pseudo-elements, not only normal DOM nodes.
- Native links retain modified-click/new-tab behavior. External WhatsApp/Instagram links are not intercepted. Do not replace navigation with `.click()` simulation, manual `location` changes or custom `popstate` routing.
- Read current touched files and diffs before each task. Treat this plan's code as intended patches against the inspected baseline, not permission to overwrite later work.
- Proposed test seams, subject to execution approval: rendered DOM/accessibility, native routes/history/scroll, browser Web Animations snapshots/computed geometry, and real disposable-fixture public/admin behavior. No mocked Router/repository internals or source/CSS snapshots.

---

## 1. Scope and Motion Contract

### Included in this first plan

| Interaction | Intended experience | Timing at normal motion |
|---|---|---|
| Home ↔ catalogue ↔ product route | Old main content fades; new content fades in with at most 8px vertical arrival; header/footer do not slide | exit 120ms; enter 220ms with 40ms overlap/delay |
| Product **card** → detail | Selected photograph scales/repositions into the actual detail photograph; surrounding facts reveal with the page | bottle 400ms, `cubic-bezier(.22,1,.36,1)` |
| Product detail → matching catalogue card via existing return link | Reverse photograph continuity when both endpoints are in the viewport and destination content is ready | 400ms |
| Mobile Filters | Natural-height expansion/collapse; immediate semantic state/focus safety | 220ms |
| Mobile Menu | Small 6px movement with opacity; links usable immediately on opening, inert immediately on closing | 180ms |
| Existing house, footer-information, photo and design dialogs | Consistent gentle backdrop/panel entrance and exit; existing native modal semantics retained | 180ms panel; 160ms backdrop |

“Opens from where I clicked” means continuity from the **clicked card's photograph**, including when the action text is clicked—not a literal page-wide radial wipe from the pointer position.

### Explicit boundaries

- Bottle continuity initially covers the shared `ProductCard` component: catalogue, homepage Featured cards and related-product cards. Campaign-bottle links and note-spotlight product links get the normal page transition, **not another shared bottle participant**. The same perfume appears in these additional homepage placements; not naming them avoids duplicate-name collisions and keeps the first pass bounded. Do not silently enable matching names on every `ProductImage`.
- A product page can contain both its main photograph and several related cards. Only the **clicked product's transition type** may enable sharing, so unrelated matching perfumes do not fly between old/new related grids.
- Browser Back/Forward retain native history/scroll restoration and the normal page transition. They do not carry Next Link transition types. Do not promise a reverse bottle on every browser gesture in this first pass; the typed **existing return link** supplies the explicit reverse path. If the original card is offscreen, filtered out or not yet ready, use the normal page transition.
- At widths ≤760px, disable positional bottle morphing for all designs and use the page reveal. This deterministic fallback preserves the enquiry-first mobile layout. Do not claim that a bottle travels into a visible destination when that destination is below the screen.
- At wider sizes, use browser snapshot clipping and actual geometry; require visible, loaded endpoints in the successful-morph acceptance case. Extremely short windows/offscreen endpoints may degrade to the page reveal. Do not add scroll or artificial delay to force a match.
- React only forms a shared pair when source and destination participate in the same route commit. Warm/ready navigation is the successful-morph path. A cold request that reveals a fallback first uses ordinary page arrival. Prefetch on genuine hover/focus intent; do not fetch the entire catalogue or block navigation waiting for prefetch.
- Defer sorting/reordering/filter-result animation, note-preview crossfades, language-specific choreography, new loading placeholders, changes to anchor scrolling and shared-element photo-to-zoom morphing. The existing photo viewer receives only the consistent dialog treatment.
- Existing accordions, tab indicator, hover effects and finite campaign motion remain; do not add a second entrance effect to those controls.

### Motion is not a redesign

Final resting-state screenshots must retain the integration's layouts, readable text, card shapes, mobile enquiry position, tablet related grid and honest disclosures. Animations must settle completely. Reduced motion uses immediate state changes; do not animate small lingering fades under a setting that previously stopped all decoration.

## 2. Verified Installed APIs and Guides

Read these local guides before executing their corresponding task:

- `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md` — React 19.3 `ViewTransition`, named pairs, `share` plus `default="none"`, cold-route limitation, root/header handling and reduced-motion pseudo-elements.
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/link.md` — `onNavigate`, `prefetch`, `transitionTypes`, scroll behavior and modified clicks.
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md` — intent prefetch through the existing Router API; do not replace native history restoration.
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` — module/global specificity and production ordering.
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` — server-rendered children through focused client adapters.
- `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` — retain intrinsic dimensions, eager detail photo and lazy cards; no deprecated new Next Image `priority` use. The existing `ProductImage.priority` is the app's wrapper prop, which already maps to eager/high scheduling.
- `D:/inspect_ai/skills/skills/engineering/tdd/SKILL.md`, `tests.md`, `mocking.md` — vertical red/green slices at the approved rendered/browser seams.
- `C:/Users/SHREYARTH/.pi/agent/skills/impeccable/reference/motion-design.md` — restrained durations/easing and reduced-motion alternatives. Existing creator-approved design context is in PROJECT_CONTEXT/README/DESIGN; no new font/style direction is needed.

Verified `@types/react/index.d.ts` exports `ViewTransition`, `ViewTransitionProps` and per-transition-type `share` mappings. Installed Next Link documents `transitionTypes`; no experimental flag or upgrade is needed. Do not apply older advice to install `next-view-transitions` or enable an experimental React build.

Current collision to fix: `src/app/[locale]/globals.css` applies `design-fade-in/out` to **every** root View Transition. `src/components/language-switch.tsx` currently calls `document.startViewTransition` for design changes without a type. Adding route transitions without isolating these rules would also animate the entire header/root on navigation.

## 3. File Map and Boundaries

| File | Responsibility |
|---|---|
| Create `src/styles/transitions.css` | Shared durations/easing; route/bottle pseudo-element rules; reusable native-dialog motion and reduced-motion cancellation |
| Create `src/components/page-transition.tsx` | Public-page-only keyed React transition boundary around server-rendered content, one neutral DOM wrapper |
| Modify `src/app/[locale]/layout.tsx` | Import the shared transition stylesheet after existing base/theme CSS; no public wrapper around the whole locale/admin tree |
| Modify `src/app/[locale]/page.tsx` | Wrap Home content with a route identity containing locale, not query/hash |
| Modify `src/app/[locale]/catalogue/page.tsx` | Wrap catalogue content; same identity across filter/pagination query changes so these do not trigger page arrival |
| Modify `src/app/[locale]/perfumes/[slug]/page.tsx` | Wrap detail content; identity changes with locale/slug, not `return/details` |
| Modify `src/app/[locale]/globals.css` | Remove unconditional root design fades; migrate chooser motion to shared tokens while retaining its geometry, starting-state and instant-close behavior |
| Modify `src/components/language-switch.tsx` | Tag only the existing design switch `design-switch`; add the dialog marker; preserve storage/version/cancellation/theme-color behavior |
| Create `src/features/products/product-transition.tsx` | Small client presentation adapter: real intent-prefetched typed product links and React image transition boundary; no repository/product list |
| Modify `src/features/products/product-image.tsx` | Optional `transition` boolean; wrap only successful images, not the unavailable-photo fallback; no extra layout DOM |
| Modify `src/features/products/product-card.tsx` | Use the typed product-link adapter and opt its photograph into sharing; retain one link per card |
| Modify `src/features/products/product-gallery.tsx` | Opt only the main photograph into sharing; photo-modal image stays unnamed; add the dialog marker |
| Modify `src/features/products/product-detail.tsx` | Type the existing back link for the current product, retaining its validated catalogue destination; no new back/history manager |
| Modify `src/features/catalogue/catalogue-controls.tsx` | Keep filter controls mounted in a disclosure wrapper; semantic hidden/inert state, safe focus and actual phone breakpoint |
| Modify `src/features/catalogue/catalogue.module.css` | Phone-only natural-height expansion; preserve every theme's existing form/grid styling and desktop visibility |
| Create `src/components/use-media-query.ts` | One browser subscription seam for responsive filter semantics, using `useSyncExternalStore` and a safe server snapshot |
| Modify `src/components/mobile-menu.tsx` | Mounted inert closed navigation; existing toggle/Escape/link behavior; remount the state-owning child on pathname change |
| Modify `src/components/site-header.module.css` | Menu opacity/translation/visibility transitions without changing its existing absolute positioning or header layout |
| Modify `src/features/home/brand-directory.tsx` | Add native-dialog motion marker only; retain search/focus/real links |
| Modify `src/components/footer-information.tsx` | Add dialog marker; retain the last visible topic during exit without changing URL/history semantics |
| Create `tests/e2e/helpers/motion-observer.ts` | Browser-only RAF/WAAPI observations around interactions; no production test flags or mocks |
| Create `tests/e2e/transitions.spec.ts` | Route, bottle, fallback, mobile-panel and native-dialog behavior tests |
| Extend `tests/e2e/interface-state.spec.ts` | Footer history/topic stability while closing; preserve its existing assertions |
| Extend `tests/e2e/visual.spec.ts` | Design crossfade isolation/unsupported support regression; do not weaken existing design tests |
| Update `README.md`, `docs/demo/DESIGN.md`, `docs/demo/QA.md` after verification | Actual shipped scope, fallbacks, reproduction commands, evidence and limits |

No new motion provider, central navigation store, source-image clone, custom history serializer, product API, generic modal manager or full-viewport route overlay is required.

### Intended component interfaces

```ts
// page-transition.tsx; receives server-rendered children, never imports page features.
PageTransition(props: {
  routeKey: string;
  children: React.ReactNode;
}): React.ReactNode;

// product-transition.tsx; the only client link adapter in this plan.
ProductNavigationLink(props: {
  productId: string;
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}): React.ReactNode;
ProductImageTransition(props: {
  productId: string;
  children: React.ReactNode;
}): React.ReactNode;

// Backwards-compatible extension of existing ProductImage props.
ProductImage(props: {
  product: Product;
  locale: Locale;
  priority?: boolean;
  className?: string;
  transition?: boolean; // default false; no naming outside explicitly enabled photos
}): React.ReactNode;

// use-media-query.ts
useMediaQuery(query: string): boolean; // server snapshot false; one cleaned-up matchMedia subscription

// tests/e2e/helpers/motion-observer.ts
startMotionObservation(page: Page, options?: {
  targetSelector?: string;
  bottleName?: string;
}): Promise<void>;
readMotionObservation(page: Page): Promise<MotionFrame[]>;
type MotionFrame = {
  names: string[];
  pseudoElements: string[];
  headerTop: number | null;
  target: { height: number; opacity: number; transform: string } | null;
  bottleTransform: string | null;
};
```

`ProductCard`, `ProductGallery`, `ProductDetail`, `CatalogueControls`, `MobileMenu`, `DesignChooser`, `BrandDirectory` and `FooterInformation` otherwise retain their existing public props.

## 4. Execution Protocol

From `D:/bts-demo` in Git Bash:

```bash
git status --short --branch
npm test
npm run typecheck
npm run lint
```

Inspect active Node processes before a production build. Do not kill unknown processes or overwrite another worker's active build; coordinate first if necessary. `.next/dev` is distinct from the production `.next` output, but a running production preview can still depend on files being rebuilt. Check a test port is free; public tests must own their server, never attach to the operator preview.

Before changing application code, capture baseline route openings and record existing gates. Last integration evidence is `artifacts/atelier-salon/`, with 260 public passes/16 expected skips and 5 isolated admin passes; these are historical counts, **not evidence this new plan passes**.

Each changed-application browser slice uses a fresh production build:

```bash
npm run build
BTS_TEST_PORT=3102 npm run test:e2e -- tests/e2e/transitions.spec.ts --project=desktop --grep "public page arrival"
```

For later slices use that task's exact tracer name as the grep, not a new script. 3102 must be confirmed free; use another explicitly owned free port if occupied. Keep admin regression on its fixture-owned 3101. Record actual failures before editing; a server/asset/setup failure is not the intended red.

Approve the rendered/browser seams above with execution approval. Implement **one tracer → one minimum patch → fresh build → green** at a time. Every task ends with an inline review checkpoint, not an automatic commit. No database or `.env.local` changes.

---

### Task 1: Public Page Arrival Without Moving the Header

**Files:** Create `src/styles/transitions.css`, `src/components/page-transition.tsx`, `tests/e2e/helpers/motion-observer.ts`, `tests/e2e/transitions.spec.ts`; modify the three public `page.tsx` files, locale stylesheet imports, root View Transition CSS and the existing design-switch invocation in `language-switch.tsx`.

**Interfaces:** `PageTransition({ routeKey, children })`; real public Next links; native `document.startViewTransition` for the existing design chooser only. No changes to admin routing or repository calls.

- [ ] Write `startMotionObservation` as a test-only browser RAF sampler using the declared `MotionFrame` interface. Use `page.evaluate`: cancel a previous recorded RAF if present, create an array via `Reflect.set(window, "__btsMotionFrames", [])`, and collect `document.getAnimations()` each frame. For `CSSAnimation`, record `animationName`; for `KeyframeEffect`, record its `pseudoElement` when available. Record the banner's `getBoundingClientRect().top`. When `targetSelector` is supplied, record that element's rectangle height and computed opacity/transform in `target`; otherwise use null. When `bottleName` is supplied, record the computed transform of `::view-transition-group(${bottleName})` in `bottleTransform`; otherwise use null. Keep at most 180 frames; `readMotionObservation` returns the typed array through `Reflect.get`. Do not monkey-patch navigation, snapshots or the repository. A collector observes actual motion; it does not create passing motion.
- [ ] Add the first tracer with these assertions:

```ts
import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { startMotionObservation, readMotionObservation } from "./helpers/motion-observer";

test("public page arrival moves content, not the header", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await page.evaluate(() => document.fonts.ready);
  await startMotionObservation(page);
  await page.getByRole("main").getByRole("link", {
    name: getDictionary("en").campaignAction, exact: true,
  }).click();
  await expect(page).toHaveURL(/\/en\/catalogue$/);
  await expect.poll(async () => (await readMotionObservation(page))
    .some(frame => frame.names.includes("bts-page-enter"))).toBe(true);
  const frames = await readMotionObservation(page);
  expect(frames.some(frame => frame.names.includes("design-fade-in"))).toBe(false);
  expect(frames.filter(frame => frame.headerTop !== null)
    .every(frame => Math.abs(frame.headerTop!) < 1)).toBe(true);
});
```

- [ ] Build/run `--grep "public page arrival"`. Expected red: no `bts-page-enter` on actual navigation, not an import/setup error.
- [ ] Implement the focused boundary as a small client module receiving server-rendered children as a slot. Do not import `HomePage`/`CatalogueView`/`ProductDetail` into that boundary:

```tsx
"use client";
import { ViewTransition, type ReactNode } from "react";
export function PageTransition({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return <ViewTransition key={routeKey} name="bts-public-page"
    default="none" share="bts-page" enter="bts-page" exit="bts-page">
    <div data-public-page>{children}</div>
  </ViewTransition>;
}
```

- [ ] Wrap the existing **returned feature component**, not all of `main`, using `routeKey={`/${locale}`}`, `routeKey={`/${locale}/catalogue`}` and `routeKey={`/${locale}/perfumes/${slug}`}` in their respective pages. Use the actual locale/slug variables already validated there. Leave query/search props and metadata unchanged. The neutral wrapper must not have padding, fixed size, transform, overflow, `contain` or positioning that affects sticky galleries/anchors.
- [ ] Add shared tokens and page rules in the stylesheet; import it from locale layout after `salon.css`. Keep the old page snapshot still and fade it out; move only incoming content:

```css
:root {
  --motion-exit: 120ms;
  --motion-enter: 220ms;
  --motion-bottle: 400ms;
  --motion-panel: 180ms;
  --motion-disclosure: 220ms;
  --motion-backdrop: 160ms;
}
::view-transition { pointer-events: none; }
::view-transition-old(root) { animation: none; opacity: 0; }
::view-transition-new(root) { animation: none; }
::view-transition-group(.bts-page) { animation: none; }
::view-transition-old(.bts-page) { animation: bts-page-exit var(--motion-exit) ease-in both; }
::view-transition-new(.bts-page) { animation: bts-page-enter var(--motion-enter) 40ms var(--motion-ease) both; }
@keyframes bts-page-exit { to { opacity: 0; } }
@keyframes bts-page-enter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*), ::view-transition-new(*), ::view-transition-group(*) {
    animation-duration: 0s !important; animation-delay: 0s !important;
  }
}
```

- [ ] Remove the unconditional root `design-fade-in/out` animation declarations from `globals.css`. Retain the existing keyframes. Scope the old treatment to the existing design switch by changing its native call to the installed DOM options form:

```ts
const transition = document.startViewTransition({
  types: ["design-switch"],
  update: () => {
    if (version === designMotionVersion) applyDesign(id, true);
  },
});
```

  Restore `opacity: 1` and the existing 180ms/400ms `design-fade-out/in` rules only under `:root:active-view-transition-type(design-switch)::view-transition-old(root)` / `::view-transition-new(root)`. Leave its current try/catch, unsupported fallback, version guard, reduced-motion early return, theme-color sync and instant chooser close intact. Do not wrap route navigation in this imperative method.
- [ ] Rebuild/run the tracer green. Then add one test at a time: reduced motion → no positional transition; unsupported `document.startViewTransition` → successful real link navigation; changing `details`, `scent`, `info` or catalogue filters does not produce `bts-page-enter`; admin link/save interactions never produce public route motion.
- [ ] Run `interface-state.spec.ts`, `navigation-basics.spec.ts`, `visual.spec.ts`, `typography-reflow.spec.ts` and the focused tracer. Keep the existing `design-fade-in` and unsupported-design tests unchanged. Check Home/catalogue/detail settled geometry and hash alignment in EN/AR.
- [ ] Review checkpoint: header stays steady, no double root fade, no new initial page-load delay, no page animation on every query update. Stop for diagnosis if the installed React boundary cannot form a normal route transition; do not hide a failed tracer with a CSS mount-only animation.

### Task 2: Selected Card Photograph Continuity and Safe Return

**Files:** Create `src/features/products/product-transition.tsx`; extend `product-image.tsx`; modify `product-card.tsx`, `product-gallery.tsx`, the existing back link in `product-detail.tsx`, shared transition CSS and `tests/e2e/transitions.spec.ts`.

**Interfaces:** `ProductNavigationLink`, `ProductImageTransition`, optional `ProductImage.transition`. Keep `ProductCard`'s single real link, existing `href/returnQuery`, photo scheduling, fallbacks and gallery modal.

- [ ] Add a selected-card tracer at 1440×1000. Open `/en/catalogue?brand=Dior`; select the card whose heading is `Spice Blend`, record its image rectangle, then hover/focus its real link, begin the observer and click. This first tracer does not wait for an application-specific prefetch signal, so the baseline fails for absent motion rather than missing setup. Use the actual route commit with this synchronous seed fixture; require the destination H1, the same photo source, unchanged return context and an actual changing bottle-group transform. Add a separate full-intent-prefetch request/response assertion after the adapter exists. The initial motion case is:

```ts
test("selected card photograph moves into its detail position", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/catalogue?brand=Dior");
  const card = page.getByTestId("product-card");
  await expect(card.getByRole("heading")).toHaveText("Spice Blend");
  const photo = await card.locator("img").getAttribute("src");
  await card.getByRole("link").hover();
  await startMotionObservation(page, { bottleName: "bts-bottle-P0168" });
  await card.getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  expect(new URL(page.url()).searchParams.get("return")).toBe("brand=Dior");
  await expect(page.getByRole("button", { name: getDictionary("en").zoomImage, exact: true })
    .locator("img")).toHaveAttribute("src", photo!);
  await expect.poll(async () => new Set((await readMotionObservation(page))
    .map(frame => frame.bottleTransform).filter(value => value && value !== "none")).size)
    .toBeGreaterThan(1);
});
```

  Extend the observer's recorded pseudo-elements to assert at most one **moving bottle** group, not merely a name in markup. If a real cold-navigation fallback prevents pairing, confirm full intent prefetch has completed through a real RSC response in the successful-morph case; retain an independent cold-route navigation/fallback test. Do not make a slow-route failure pass by forcing a route delay or replacing the Router.
- [ ] Build/run `--grep "selected card photograph"`; expected red is no bottle movement. Do not fake passing movement by animating a second DOM image.
- [ ] Implement the client adapter with real Link intent prefetch and per-product transition types. The private string name is shared by the two exports in this file:

```tsx
"use client";
import Link from "next/link";
import { useState, ViewTransition, type ReactNode } from "react";

const identity = (id: string) => `bts-bottle-${id}`;
export function ProductNavigationLink({ productId, href, label, className, children }: {
  productId: string; href: string; label?: string; className?: string; children: ReactNode;
}) {
  const [intentHref, setIntentHref] = useState<string | null>(null);
  const prepare = () => setIntentHref(href);
  return <Link href={href} aria-label={label} className={className}
    transitionTypes={[identity(productId)]} prefetch={intentHref === href}
    onPointerEnter={prepare} onFocus={prepare}>{children}</Link>;
}
export function ProductImageTransition({ productId, children }: { productId: string; children: ReactNode }) {
  const name = identity(productId);
  return <ViewTransition name={name} default="none" enter="none" exit="none" update="none"
    share={{ [name]: "bts-bottle", default: "none" }}>{children}</ViewTransition>;
}
```

  No click prevention, route await or client product import. Link owns prefetch scheduling/failures; a failed prefetch must not cancel the subsequent click. `prefetch={true}` after intent requests the full dynamic route; merely restoring `null`/automatic prefetch can skip this app's force-dynamic detail route. This is why the adapter uses an intent flag rather than manual Router-prefetch internals. Keep it bounded to genuine pointer/focus intent, not every visible card.
- [ ] In `ProductImage`, add `transition = false`. Retain the existing early unavailable-photo return. Assign its current `<Image ... />` to a local `image` node; return `transition ? <ProductImageTransition productId={product.id}>{image}</ProductImageTransition> : image`. This preserves CSS/DOM geometry because the transition boundary adds no image-stage wrapper. The fallback is not a fake moving bottle.
- [ ] In `ProductCard`, replace only its Link import/tag with `ProductNavigationLink`, supplying `productId={product.id}`, `href={href}`, existing class and `label={`${d.view} ${product.name}`}`; enable `transition` on its existing photo. Do not change card facts/actions or add a nested button.
- [ ] In `ProductGallery`, enable `transition` only on the image in the existing zoom trigger. Do **not** enable it on the modal image. In `ProductDetail`, replace only the existing `.back` Link with the typed adapter, passing the current product ID and unchanged validated `returnHref`. Keep breadcrumb links/native back behavior as they are.
- [ ] Add bottle styling. Do not blur bottles or distort their aspect ratios:

```css
::view-transition-group(.bts-bottle) {
  animation-duration: var(--motion-bottle);
  animation-timing-function: var(--motion-ease);
  z-index: 2;
}
::view-transition-image-pair(.bts-bottle) { isolation: isolate; mix-blend-mode: normal; }
::view-transition-old(.bts-bottle), ::view-transition-new(.bts-bottle) {
  height: 100%; width: 100%; object-fit: contain; mix-blend-mode: normal;
}
@media (max-width: 760px) {
  ::view-transition-group(.bts-bottle) { animation: none !important; }
  ::view-transition-old(.bts-bottle) { animation: none !important; opacity: 0; }
  ::view-transition-new(.bts-bottle) { animation: none !important; }
}
```

  Use browser-generated shared-group geometry, not guessed card coordinates. Preserve global reduced-motion cancellation. Inspect photographic-ground blending during the flight: existing assets are photographs, not new transparent bottle cutouts. Remove any dark snapshot halo through snapshot CSS, not source-asset editing.
- [ ] Rebuild/run the initial tracer green; inspect a recorded slow-motion copy of the real animation. The incoming details reveal with the existing page transition; do not also animate every line of the purchase summary.
- [ ] Add the explicit return tracer: use a one-result Dior catalogue so the matching card is visibly at the top; follow its product link, use the existing return link, assert `/en/catalogue?brand=Dior`, one result, a reverse-moving bottle group and correct resting image. Do not change the back link into `router.back()` or blindly copy detail scroll position to a catalogue.
- [ ] Add one related-product tracer: navigate from one detail's related card to its target, where the previous perfume can also appear among new related cards. Require that only the clicked product's bottle group moves. Check homepage Featured cards separately; campaign/spotlight remain unnamed. Assert named participating card photos are unique in each current public page.
- [ ] Add one fallback slice at a time: 390px and 360px enquiry-first page arrival with **no positional bottle movement**; failed images; cold delayed RSC response; source offscreen/short viewport; direct entry/reload; native Back/Forward; repeated/rapid navigation; Ctrl/Meta click in a new tab. Each must reach the correct real product/results without errors, blocked controls, auto-scroll or a stranded snapshot.
- [ ] Run product/Atelier/Salon/journey/SEO/asset suites. Check shared-name metadata cannot rename a product or affect SEO, there is one image in the actual zoom trigger, and fallback labels remain truthful.
- [ ] Review checkpoint: selected-image continuity is real, no duplicate/multiple moving products, no name clamp, and all unsupported/offscreen/cold paths retain usable navigation. Browser-gesture reverse morphing and campaign/spotlight morphing are still explicitly outside this first delivery.

### Task 3: Natural-Height Mobile Filter Disclosure

**Files:** Create `src/components/use-media-query.ts`; modify `catalogue-controls.tsx`, `catalogue.module.css`; extend `tests/e2e/transitions.spec.ts`.

**Interfaces:** Existing `aria-controls="catalogue-filters"`, native selects and URL-backed filtering. The hook supplies only breakpoint truth; it is not a filter-state store.

- [ ] At 390×844 add this red tracer; the observer samples the actual controlled region height, not CSS source:

```ts
test("mobile filters expand without exposing closed controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/catalogue");
  const toggle = page.locator('button[aria-controls="catalogue-filters"]');
  await startMotionObservation(page, { targetSelector: "#catalogue-filters" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("combobox")).toHaveCount(5);
  const panel = page.locator("#catalogue-filters");
  await expect.poll(async () => {
    const finalHeight = await panel.evaluate(el => el.getBoundingClientRect().height);
    return (await readMotionObservation(page)).some(frame => frame.target &&
      frame.target.height > 2 && frame.target.height < finalHeight - 2);
  }).toBe(true);
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(toggle).toBeFocused();
});
```

  Extend the close slice to focus a select then activate the close path; require focus returned before its controls become inert. A normal instant show/hide must fail the intermediate-height assertion.
- [ ] Build/run `--grep "mobile filters expand"`; expected red is the current `display:none` → `display:grid` jump.
- [ ] Implement the hook with no client/server hydration guess:

```ts
"use client";
import { useCallback, useSyncExternalStore } from "react";
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((notify: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
  }, [query]);
  const read = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, read, () => false);
}
```

- [ ] In `CatalogueControls`, keep the five-label grid mounted inside a new outer `.filterDisclosure` with `id="catalogue-filters"`, `data-expanded={expanded}`, `aria-hidden={isPhone && !expanded}` and `inert={isPhone && !expanded}`, using `useMediaQuery("(max-width: 600px)")`. Move the original ID from the inner grid to that wrapper. Add wrapper/toggle refs. Use `setExpanded(value => !value)` for rapid toggle clicks. Add the following wrapper key handler so a keyboard close from inside a select has a safe focus destination:

```tsx
onKeyDown={event => {
  if (event.key !== "Escape" || !isPhone || !expanded) return;
  event.preventDefault();
  toggle.current?.focus();
  setExpanded(false);
}}
```

  Name the toggle ref `toggle` and attach it to the existing Filters button. Do not disable selected filter values merely because the panel closes.
- [ ] Wrap the current `.filterRow` in a `.filterClip` child with `min-height:0; overflow:hidden`. On desktop, wrapper rows remain `1fr`; on mobile, replace the existing `display:none`/`.expanded` switches with:

```css
.filterDisclosure { display: grid; grid-template-rows: 1fr; }
.filterClip { min-height: 0; }
@media (max-width: 600px) {
  .filterDisclosure { grid-template-rows: 0fr; transition: grid-template-rows var(--motion-disclosure) var(--motion-ease); }
  .filterDisclosure[data-expanded="true"] { grid-template-rows: 1fr; }
  .filterClip { overflow: hidden; }
  .filterRow { display: grid; margin-top: 0; padding-top: 24px; }
  .filterRow select:focus-visible { outline: 2px solid var(--forest); outline-offset: -2px; }
}
```

  Keep all theme-specific select/grid spacing rules and expanded gaps. Ensure no outer fixed height, extra collapsed gap or clipped focus ring in the settled open state. All existing native GET/search/catalogue links must still render server-side; this task does not invent a new no-JavaScript filter-submission feature.
- [ ] Rebuild/run green. Add Arabic, 320px, repeated open/close, reduced motion and 390→768→390 resizing slices. Desktop filters must be visible and not inert even if the phone panel was closed. Check real filtering still preserves other query keys/page reset and `scroll:false` behavior.
- [ ] Run navigation/interface-layout/typography/journey and no-JavaScript catalogue cases. Review checkpoint: natural expansion without inaccessible visible fields, lost values, altered desktop grids or unbounded clipping.

### Task 4: Interruptible Mobile Navigation Entrance and Exit

**Files:** Modify `src/components/mobile-menu.tsx`, `site-header.module.css`; extend `tests/e2e/transitions.spec.ts`.

**Interfaces:** Existing localized menu/close labels, `aria-controls="mobile-navigation"`, native hash links and Next catalogue link; Escape restores focus. No focus trap is added to this non-modal menu.

- [ ] Add this 390px red tracer, then extend it with actual exit frames and keyboard reachability. An existing state change alone is not evidence of animation:

```ts
test("mobile menu is interruptible and closed links are inert", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const d = getDictionary("en");
  await startMotionObservation(page, { targetSelector: "#mobile-navigation" });
  await page.getByRole("button", { name: d.menu, exact: true }).click();
  await expect.poll(async () => (await readMotionObservation(page))
    .some(frame => frame.target && frame.target.opacity > 0 && frame.target.opacity < 1)).toBe(true);
  await page.getByRole("button", { name: d.close, exact: true }).click();
  await expect(page.locator("#mobile-navigation")).toHaveAttribute("inert", "");
  await expect(page.getByRole("navigation", { name: d.menu, exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: d.menu, exact: true }).click();
  await expect(page.getByRole("navigation", { name: d.menu, exact: true })).toBeVisible();
});
```

  Reopen during the sampled exit rather than waiting a fixed sleep; require the final menu state open and interactive.
- [ ] Build/run `--grep "mobile menu is interruptible"`; expected red is current conditional unmounting.
- [ ] Keep the nav mounted with `data-open={open}`, `aria-hidden={!open}`, `inert={!open}`. Keep the existing localized attributes and link close handlers. Separate the state-owning content into a private component in the same file so pathname navigation resets state through a real component key:

```tsx
export function MobileMenu({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return <MobileMenuContent key={pathname} locale={locale} />;
}
```

  Move the current `useState/useRef/Escape` logic into `MobileMenuContent`. Remove the ineffective `key={pathname}` from its inner div. Do not add an effect that restores an old path's open menu when navigating Back.
- [ ] Preserve the current absolute nav geometry and add motion-only rules:

```css
.mobileNavigation {
  opacity: 0; transform: translateY(-6px); visibility: hidden; pointer-events: none;
  transition: opacity var(--motion-panel) var(--motion-ease),
    transform var(--motion-panel) var(--motion-ease), visibility 0s var(--motion-panel);
}
.mobileNavigation[data-open="true"] {
  opacity: 1; transform: none; visibility: visible; pointer-events: auto;
  transition-delay: 0s;
}
```

  Existing global reduced motion cancels normal-element transitions; confirm the closed state remains hidden without a delayed visibility change. Do not animate header size/position.
- [ ] Rebuild/run green. Add Arabic, Escape/focus return, link click followed by Back, navigation from the header while menu is open, 390↔1440 resizing and rapid toggle slices. The controlled nav may remain in the DOM when closed, but accessible-role queries must not expose its hidden links.
- [ ] Run navigation-basics, interface-hover/layout and storefront keyboard cases. Review checkpoint: no invisible links accepting clicks, no fixed overlay, no stale reopened menu and no slowed anchor navigation.

### Task 5: Consistent Native-Dialog Motion Without Delaying Close Semantics

**Files:** Modify shared transition CSS, chooser CSS in `globals.css`, `language-switch.tsx`, `brand-directory.tsx`, `footer-information.tsx`, `product-gallery.tsx`; extend `transitions.spec.ts`, `interface-state.spec.ts` and existing design regression tests where new motion-specific assertions are needed.

**Interfaces:** Add `data-motion-dialog` to the four existing native `<dialog>` elements only. Retain `showModal()`, `close()`, Escape, backdrop hit-testing, focus restoration, footer `info` history and chooser instant-close behavior.

- [ ] Add this red house-directory tracer at 1440px, then extend it to observe the actual closing frames after Escape:

```ts
test("native dialogs share a gentle entrance and immediate close semantics", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en#houses");
  const d = getDictionary("en");
  const trigger = page.getByRole("button", { name: d.allHousesAction, exact: true });
  await startMotionObservation(page, { targetSelector: 'dialog[aria-labelledby="brand-directory-title"]' });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: d.brandsTitle, exact: true });
  await expect.poll(async () => (await readMotionObservation(page))
    .some(frame => frame.target && frame.target.opacity > 0 && frame.target.opacity < 1)).toBe(true);
  await page.keyboard.press("Escape");
  expect(await page.locator('dialog[aria-labelledby="brand-directory-title"]').evaluate(el =>
    el instanceof HTMLDialogElement && el.open)).toBe(false);
  await expect(trigger).toBeFocused();
});
```

  The closing panel/backdrop cannot intercept pointer events. Repeat the motion assertions for footer-information, photo and chooser surfaces one at a time after the preceding surface passes. Assert native state/focus through the real controls, not a timer.
- [ ] Build/run `--grep "native dialogs share"`; expected red is the unanimated house/footer/photo surfaces, not the chooser that already has motion.
- [ ] Add the marker and shared discrete transitions. Copy no size, radius, color or typography into this shared rule; those remain owned by each existing module:

```css
dialog[data-motion-dialog] {
  opacity: 0; transform: translateY(8px); pointer-events: none;
  transition: opacity var(--motion-panel) var(--motion-ease),
    transform var(--motion-panel) var(--motion-ease),
    overlay var(--motion-panel) allow-discrete, display var(--motion-panel) allow-discrete;
}
dialog[data-motion-dialog][open] { opacity: 1; transform: none; pointer-events: auto; }
dialog[data-motion-dialog]::backdrop {
  opacity: 0;
  transition: opacity var(--motion-backdrop) ease-out,
    overlay var(--motion-backdrop) allow-discrete, display var(--motion-backdrop) allow-discrete;
}
dialog[data-motion-dialog][open]::backdrop { opacity: 1; }
dialog[data-motion-dialog]:not([open])::backdrop { pointer-events: none; }
@starting-style {
  dialog[data-motion-dialog][open] { opacity: 0; transform: translateY(8px); }
  dialog[data-motion-dialog][open]::backdrop { opacity: 0; }
}
dialog[data-motion-dialog][data-instant-close],
dialog[data-motion-dialog][data-instant-close]::backdrop { transition: none !important; }
@media (prefers-reduced-motion: reduce) {
  dialog[data-motion-dialog], dialog[data-motion-dialog]::backdrop { transition: none !important; }
}
```

- [ ] Remove/replace only the chooser's duplicated motion declarations (`opacity/transform/pointer-events/transition`, open/starting-style/backdrop opacity), not its fixed dimensions/scrolling/heading/cards. Its existing `data-instant-close` path must continue to remove the chooser immediately before snapshotting a design change; the shared rule above preserves it. Do not animate a closing chooser inside the website design crossfade.
- [ ] Preserve the last rendered footer topic during close. When Back removes `info=shipping`, the exit must not suddenly display Contact copy. Use guarded render-state adjustment, not mutation of Next's history or a delayed native close:

```ts
const [lastTopic, setLastTopic] = useState<InformationTopic>("contact");
if (topic && topic !== lastTopic) setLastTopic(topic);
const visible = topics[topic || lastTopic];
```

  Add `useState` to its current React imports. Retain `opened.current` for its existing history-close guard; do not replace `onClose` logic. A closed dialog may retain the last topic in hidden DOM without reopening itself.
- [ ] Rebuild/run the surface tracer green after each marker/behavior slice. Add `info=shipping` direct entry → Back → Forward, exit with a non-Contact topic, Escape/focus return, immediate reopen, actual house-link navigation while modal closes, reduced motion and unsupported discrete CSS fallback. Unsupported CSS must still close natively even if no exit animation plays.
- [ ] Run scroll-and-footer, navigation-basics, product-polish, interface-state, visual and Atelier/Salon suites in EN/AR at 320/390/768/1440px. Do not weaken exact names/counts/URLs or the modal containment/focus assertions.
- [ ] Review checkpoint: all four existing dialogs feel related, native semantics happen immediately, and neither animation completion nor a timer controls URL changes, focus return or save/navigation behavior.

### Task 6: Integrated Verification, Evidence and Documentation

**Files:** Extend `tests/e2e/transitions.spec.ts`; update README/DESIGN/QA only after verification. No standalone production motion inspector or new application feature in this task.

**Interfaces:** Rendered pages, native links, actual animation snapshots, existing design chooser and isolated admin fixture. Evidence goes under `artifacts/transitions/` without overwriting integration evidence.

- [ ] Add a final integration tracer following this real sequence: Home → Featured card → detail → photo viewer → close → return catalogue → open Filters → select Dior → open/close house directory via Home → choose another design → navigate again. Record runtime/console errors; require zero first-party errors, preserved exact destinations and no stranded transition/dialog overlays. Run it in EN/AR and normal/reduced motion with one case per combination.
- [ ] Extend motion observations to rapid interactions and confirm no route is blocked waiting for an animation. Sample settled layout, not only the final URL. At 360/390px re-run the first-viewport enquiry assertions for Spice Blend, Torino21 and long Powerfully; at 768px retain the 2×2 related grid; verify full official names and no overflow at 320px.
- [ ] Add this explicit unsupported-API regression, then retain real Back/Forward scroll restoration, query state, modified clicks, failed photographs/fonts and no-JavaScript public links in the broader set. Browser-back fallback is an accepted plain page transition, not a failed promised bottle effect. Do not assert an invented scroll position on the existing explicit catalogue link.

```ts
test("unsupported motion never blocks product navigation or history", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(document, "startViewTransition", {
    configurable: true, value: undefined,
  }));
  await page.goto("/en/catalogue?brand=Dior");
  await page.getByTestId("product-card").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/catalogue\?brand=Dior$/);
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});
```
- [ ] Run gates sequentially with fresh production output and write actual logs:

```bash
npm run data:audit
npm test
npm run typecheck
npm run lint
npm run build
BTS_TEST_PORT=3102 npm run test:e2e
npm run test:e2e:admin
```

  The audit must still report 100 unique bilingual seed products/40 houses/no private fields. Unit/public/admin counts must be recorded from this run, not copied from `be93079`. Leave intentionally unconfigured analytics opt-in cases skipped; do not change `.env.local` or enable real external transport to make them pass.
- [ ] Capture normal-motion videos or sequential frames at start/middle/end of: public page arrival, selected-card flight, explicit reverse path, filter expansion/collapse, menu interruption and all four dialogs. Capture the **actual animation**, not only screenshots taken after Playwright has fast-forwarded/cancelled animations.
- [ ] Save reduced-motion settled Home/catalogue/detail EN/AR screenshots for all four designs at 320/390/768/1440px. Compare them to fresh baseline captures: no unintended geometry/palette/type changes, apart from inert mounted elements that are not visible. Use the real chooser so `DesignText` stays in sync.
- [ ] Directly review full-size screenshots and videos: bottle proportions/photo ground, one moving image, steady header, readable early enquiry, no flicker during cold navigation, correct RTL and no sudden footer-topic swap during exit. Explicitly label physical iOS/Safari/hybrid-pointer checks unverified unless actually performed; Chrome emulation is not that certification.
- [ ] Update `README.md` with the five shipped behaviors and normal/reduced/unsupported/cold/offscreen fallbacks. Update `DESIGN.md` with timings, scope, root-design isolation and what remains unchanged. Append `QA.md` with actual commands/counts, browser versions, motion evidence paths and remaining limits. State that campaign/spotlight morphs, browser-gesture reverse choreography, result reordering and photo-to-zoom shared motion were not included in this first plan.
- [ ] Inline final review: inspect the full diff for accidental data/config/font/image changes, duplicated transition names, removed functional assertions and links intercepted beyond their scope. `git diff --check` must pass. No commit/push/deployment until separately authorized.

## Acceptance Checklist

- [ ] Public routes feel connected; header/footer do not slide; query-only updates do not replay page arrival.
- [ ] Warm desktop/tablet card navigation shows one genuine shared-image movement into the correct detail photo, not a second clone or an entire card flying.
- [ ] Existing return link reverses that movement when its matching catalogue card is visible/ready; browser Back/Forward remain native and correct without a false guarantee of a morph.
- [ ] Mobile preserves enquiry-first ordering and uses a restrained page reveal, never an offscreen bottle chase or forced scroll.
- [ ] Mobile Filters and Menu animate open/closed, remain interruptible and expose no hidden focusable/clickable controls.
- [ ] Four existing native dialogs share timing/arrival without delaying close, breaking focus/history or corrupting chooser design snapshots.
- [ ] Reduced motion, unsupported APIs, cold routes, failed images/fonts, direct entry, modified clicks and no-JavaScript navigation degrade honestly.
- [ ] All four designs and both locales keep their settled layout, truthful copy/data and security/analytics/enquiry contracts.
- [ ] Actual gates, sampled motion and visual evidence are recorded; no deployment or image-work expansion is implied.

## Planning Handoff

This file is an implementation proposal, not an implementation or passing verification result. Only this Markdown file is created during planning. On approval, execute inline task-by-task with the available tools and review gates. The generic skill names in the header do not authorize unavailable tools, delegation, worktrees or commits. If the desired first scope instead includes campaign/spotlight morphs or a guaranteed bottle reversal on browser gestures, resolve that larger navigation-identity requirement before implementation rather than silently extending this plan.
