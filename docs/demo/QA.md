# Demo QA

Latest results are in the final section. Earlier entries preserve the checks performed during previous iterations.

## Verified

- `npm run data:audit`: PASS — 100 unique bilingual records, 40 houses, all selected photos present, allowlisted public files and no private price/research fields.
- `npm test`: 35 tests passed across ten unit files, including actual seed-CLI execution/idempotency, SQLite reopen/validation, password/session, SEO and analytics payload seams.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS — Next.js production build.
- `BTS_TEST_PORT=3100 npm run test:e2e`: 51 passed, 1 intentionally skipped using a fixture-ID analytics build with the external Google boundary mocked. The skipped case is the mobile-only menu check in the desktop project; it passed on mobile.
- `npm run test:e2e:admin`: 1 passed, proving real login/search/edit/add, process-restart persistence, sample report totals and unauthorized-save rejection on a disposable SQLite database.
- Final unconfigured analytics builds intentionally skip the two opt-in analytics cases; the configured adapter was separately exercised on both viewports.

Installed Google Chrome was used through Playwright, with isolated browser contexts. No new browser was downloaded and no personal browser profile was accessed.

## Browser coverage

- `/` redirects to `/en`; branded light homepage and real collection links.
- 100 results, 12-per-page catalogue, four records on final page, excessive page numbers clamp.
- Search, zero-results recovery, clearing, combined filters, sorting, reload and browser back.
- Product identity, filtered return context and query state survive English/Arabic switching.
- Correct HTML language/direction, real translated labels/notes/descriptions and RTL layout.
- Unknown product recovery and deliberately failed-image fallback.
- Mobile-menu open/Escape/focus restoration.
- 390 and 1440 px projects; 360 and 768 px checks in both languages under reduced-motion preference.
- Home/catalogue/detail images load after scrolling through the whole page. No runtime page/console errors on the six-route visual journey.
- WhatsApp URL/message construction in both languages; invalid/missing configuration fails safely. No external message sent.

## Actual screenshot review

Opened English and Arabic homepages at desktop/mobile widths; English catalogue at desktop/mobile widths; Arabic desktop catalogue; English desktop/mobile details and Arabic mobile details. Also directly inspected cropped desktop/mobile opening screenshots at readable resolution.

Artifacts: `artifacts/screenshots/{desktop,mobile}-{en,ar}.png`, locale catalogue/detail variants, plus `desktop-en-opening.png`, `mobile-en-opening.png` and `desktop-ar-opening.png`.

Corrections made after evidence:

- Removed a useless rotation on a decorative circular halo: its transformed square bounding box caused real 360 px overflow. Did not mask the problem with global overflow clipping.
- Made browser image checks scroll lazy images into view rather than treating legitimate lazy loading as an asset failure.
- Waited for product-route navigation before capturing the route identity in the locale test.
- Improved English hero headline wrapping, product-photo consistency and the niche panel's previously clipped bottle.
- Localized the remaining Arabic footer signature and increased muted-text/placeholder contrast.

The rendered pages are light, consistent, readable and use actual supplied branding. Product images, not decorative gradients/animation, carry the visual character. Reduced-motion controls remain visible.

## Integrated design comparison — October 27

Three distinct light designs share the same application/data/routes: Botanical Atelier, Modern Gallery and Linen Boutique. No separate source/demo files or datasets were created. The floating localized chooser shows named flash cards with layout thumbnails, descriptions and palette samples. Selecting a card changes the actual UI, closes the dialog and preserves the current route/query.

Verified each design on English/Arabic home, catalogue and detail at desktop/mobile sizes, including all 100 records, 12 visible results per catalogue page, loaded visible photos, light page canvases and no runtime console errors. Each also passed 360/768 px homepage overflow checks. Extra tests cover selected-card state, keyboard Escape/focus return, reload/navigation/locale persistence, invalid saved preferences and blocked storage. A root-layout reset on locale navigation was reproduced and fixed by restoring the external design preference before paint.

Directly reviewed desktop/mobile chooser screenshots, the new Gallery/Linen English homepages, Linen Arabic desktop homepage, Gallery Arabic mobile homepage, both new desktop catalogues, Linen desktop product details and Gallery Arabic mobile detail. Balanced the Linen homepage and related-product groups so a fourth record is not stranded beneath a three-column row. Evidence: `artifacts/screenshots/design-*`.

The original visual-review notes above are retained as history. No design is claimed to be client-approved before the client chooses.

## Motion polish — October 27

Added one coordinated homepage text/CTA entrance (not repeated scroll animations), native design-change crossfades, animated chooser/backdrop opening and dismissal, mobile-menu entry, RTL-aware link arrows, restrained button lift/press feedback and product-photo hover/focus movement. No animation dependency, separate source files, data or backend changes were introduced.

Normal-motion browser tests observed the actual native `design-fade-in` animation after changing a design. Reduced-motion tests verified immediate switching and zero running animations. A browser with native view-transition support explicitly disabled still switched designs and navigated to the working collection. The full 35-check desktop/mobile browser run, 19 unit tests, data audit, types, lint and production build passed after these changes. The single desktop skip remains the mobile-only menu case.

Snapshots canceled by navigation/hidden tabs are handled; a superseded design callback cannot overwrite a newer selection. Older browsers get a brief opacity fallback instead of losing functionality. The chooser exits immediately before a theme crossfade so it is not captured as a ghost over the new design; ordinary close/Escape uses its short exit transition.

Implementation references: MDN `Document.startViewTransition()` and the `<dialog>` animation guidance (`@starting-style`, discrete display/overlay transitions). Only browser-visible behavior was claimed; no physical iOS/Safari coverage was added.

## Dedicated fragrance-note filter — October 27

Completed the final Product Catalogue checklist item. Note options are derived from the actual retained English/Arabic note pairs; case/punctuation variants are grouped under stable English-derived values. Filtering is exact-note matching, not a substring search (for example Mint is not Peppermint). Unsupported note values are ignored safely. No product records or prices were changed.

The new selector combines with search, brand, gender and family; it resets pagination on changes, persists through pagination/reload/locale switching and product return links, and supports translated active-chip removal and clearing all filters. The five-control layout is responsive in all three designs; sort spans the full mobile filter row rather than leaving a cramped extra column. Directly inspected the updated Gallery English desktop catalogue, Linen Arabic desktop catalogue and expanded Arabic mobile Mint filter (`artifacts/screenshots/notes-filter-mobile-ar.png`).

Observed red-before-green query tests for missing note behavior, then passed the complete 26-test unit suite, type/lint/build/data checks and 43 browser checks (one expected desktop skip). New browser journeys cover the notes control in each design on desktop/mobile, including English→Arabic, reload, product details/return, other-filter preservation, clear/reset, the 13-result Vanilla second page and invalid note URLs. Product Catalogue is now 8/8; overall checklist progress is 29/52.

Historical note: this step used the older checklist. The later user-supplied 31-item checklist superseded its literal plugin/Site Kit requirement; see the completion section below.

## Local preview

Final build was repeated with `.env.local`, all data/unit/type/lint/build checks passed again, and a local production server was started on `127.0.0.1:3000`. `/en` returned HTTP 200. Log: `artifacts/preview.log`. No external deployment was performed.

## Open gate / limitations

The user has supplied WhatsApp configuration. After the final build, inspected English and Arabic Torino21 links in the browser: valid `wa.me` destination format, matching configured recipient and correct product name/ID in each message. No phone number was printed and no external WhatsApp request/message was sent. Business ownership and actual message delivery are not independently verified.

This is Chrome desktop/mobile emulation, not a completed physical-device/Safari/iOS audit. Arabic copy and real inventory/availability need client approval before production. Source images are reference representations under user-confirmed publication permission.

No deployment, source-control commit, video recording, purchase, external WhatsApp send or Google-account connection was performed. Local prototype admin/login/persistence were subsequently implemented as documented below.

## Updated 31-item checklist implementation — October 27

Implemented within the existing Next.js/CSS application; the accepted 100-product seed and all three designs remain intact. No WordPress or platform migration.

- SQLite store uses parameterized writes, explicit seed initialization, immutable IDs/slugs and allowlisted bilingual data validation. Admin add/edit is real persistent server-side work, not localStorage or an optimistic-only UI.
- Login uses a salted scrypt password verifier, expiring signed HttpOnly/SameSite session cookie, Secure over HTTPS, same-origin mutation checks and bounded single-process login throttling. Every protected read/mutation checks the session. Credentials must be set by the owner via the interactive setup command; only disposable test credentials were generated during verification.
- Admin browser test edits P0028, creates DEMO001, stops/restarts the actual Next process with the same temporary database and verifies both records through public pages. It checks the new product's sitemap/canonical and rejects an old form submission after cookies are cleared. No production database was populated or user-selected credential invented.
- Next metadata now supplies localized descriptions, canonical/hreflang and absolute Open Graph images for products, plus home/catalogue metadata. Dynamic sitemap reflects runtime records. Noindex remains.
- GA4 adapter was tested with fixture measurement ID `G-BTSTEST001` and mocked Google script transport, including consent, query stripping, one page view per public pathname, locale transitions, product click intent and revocation/reload. No Google traffic or WhatsApp messages were sent. Live GA4 ingestion is still unverified and needs the owner's real configuration.
- Protected analytics example visibly labels its fixed 420 views/25 clicks as sample data. `docs/demo/ANALYTICS.md` documents setup and limits; `docs/demo/CSV_IMPORT_PLAN.md` defines the future importer rather than claiming one exists.

Corrections during integration: exact textarea accessible labels were added after the admin test exposed labels incorporating their initial values; analytics navigation tests now wait for locale navigation before reload; Playwright's Node ESM imports use JSON attributes for the new storage validation seam. No assertions were weakened to accept failed saves or tracking duplicates.

Directly inspected `admin-example-report.png`, `design-atelier-mobile-ar-perfumes-xerjoff-torino21-p0574.png`, `design-gallery-desktop-en-catalogue.png` and `design-linen-mobile-en.png` after the configured build. The reporting disclosure, Arabic consent controls and retained light layouts are visible. Existing tests also cover all three designs and the 360/768/390/1440 px checks. This remains Chrome emulation, not Safari/physical-device certification.

The 31 checklist features are implemented/tested at prototype scope. Owner login setup and real Google measurement configuration are operational setup steps, not performed here; do not describe the app as connected to a live Google property or production-ready.

Final build restored the existing `.env.local` configuration with analytics disabled. A scan confirmed no `G-BTSTEST001` fixture ID in final client assets. Final targeted checks passed six SEO/no-consent cases (two opt-in cases intentionally skipped without an ID), the admin restart journey, lint and typecheck. The confirmed old project preview was restarted on `127.0.0.1:3000`; home, admin login and sitemap returned HTTP 200. The admin login initially displayed its setup-required state.

## Admin sign-in setup fix — October 27

The owner subsequently configured credentials but could not sign in. Safe inspection showed validly configured username/password verifier/session secret, a missing database and the old agent-started preview still on port 3000. Running the actual `npm run admin:seed` exposed a CommonJS/ESM named-export error in the script's `@next/env` import. Earlier store/browser tests had seeded storage through the store API, so they did not cover this entrypoint.

Added `tests/unit/admin-seed.test.ts` to execute the actual CLI against a temporary private path, observe the failure, then verify database creation and preservation of an existing edit on a second seed run. Switched the CLI to the supported default import. The full 35-test suite, typecheck/lint and isolated admin login/edit/add/restart journey pass.

Ran the corrected seed command against the owner's configured database (100 records) and restarted only the confirmed stale project preview. Browser checks at `http://localhost:3000/en/admin/login` confirm the Sign in button is enabled, no setup warning remains and anonymous admin access redirects to login. The owner's password was not requested, printed, guessed or reset; actual sign-in with their chosen password remains for them to confirm.

## Green and gold retail redesign — October 28

Implemented the authorized YAF-inspired React/Next.js storefront plan without replacing the existing backend. New presentation: green/gold campaign, centred introduction, real note/family discovery tabs, expanded perfume-house directory, live featured products, honest catalogue guidance, gender categories and grouped footer. The three existing light theme IDs, persisted selection, language switching and enquiry flow remain. No competitor imagery, fabricated discounts/reviews or checkout was introduced.

### Verification

| Command / boundary | Actual result |
| --- | --- |
| Baseline `npm test`, typecheck, lint | 35 unit tests passed; typecheck/lint passed before redesign |
| `npm run data:audit` | Passed: 100 unique bilingual records, 40 houses, local images, no private fields/documents |
| `npm test` | **43 passed**, 11 files |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed; ordinary owner configuration restored after the fixture analytics check |
| `BTS_TEST_PORT=3102 npm run test:e2e` | **66 passed / 4 intentional skips**, 70 cases across desktop/mobile |
| `npm run test:e2e:admin` | **2 passed**, including real process-restart persistence and an empty persistent catalogue |
| Fixture-ID build + targeted analytics suite | **4 passed**, Google transport mocked; no real property or ingestion claim |

Normal-build skips: two opt-in GA cases because no measurement ID is configured, the desktop-only skip for the mobile menu, and the mobile duplicate of the new test that explicitly covers all four viewport widths. The configured GA cases were separately exercised with build-only `G-BTSTEST001`, then the ordinary build was restored without editing `.env.local`.

Red/green evidence: initial projection import failed before implementation; header search test failed because no searchbox existed; campaign test failed at the old H1; discovery test failed because tabs were absent; brand test failed because green/gold tokens were missing. A later note-variety test caught only five unique representative perfumes across eight tiles and passed after genuine matches were diversified. Browser `src` checks normalize relative/absolute local URLs, and navigation assertions wait for actual route changes rather than racing React navigation.

The isolated admin test creates a featured sample product through the real admin form, observes it on both localized homepages, changes its name/photo, observes the campaign and featured grid updates, searches from an admin route, restarts the actual Next process and verifies the saved values. Existing canonical/sitemap, signed-in analytics example, unauthorized mutation rejection and redirect checks still pass. A separate empty temporary database verifies honest recovery with no invalid product links in both languages. The operator's real catalogue was not used for test writes.

A SHA-256 before/after comparison confirmed these were unchanged: private `.env.local`, `var/catalogue.sqlite`, product model/repository/store, admin save/session code and WhatsApp URL builder. No schema migration, password reset, reseed, dependency addition or source-inventory edit was performed.

### Visual evidence and review

- Before: `artifacts/screenshots/before-retail-{en,ar}-{390,1440}.png`.
- Current default: `artifacts/screenshots/retail-{en,ar}-{360,390,768,1440}.png`.
- Current variants/catalogue/detail: `artifacts/screenshots/design-*`; the existing visual suite regenerated these against the redesign.
- Chooser: `design-chooser-desktop.png` and `design-chooser-mobile.png`, now with retail-layout miniatures.
- Reference: `artifacts/yaf-reference-loaded.png` (lazy assets loaded before capture).

Directly reviewed the final English desktop home, Arabic phone home, Gallery Arabic phone catalogue, Linen English desktop product detail and desktop chooser. Reviewed green/gold usage, large intact bottle labels, grid balance, mixed-direction names and functional section rhythm against the saved reference. Automated checks cover one H1, all visible local photos loaded, no document overflow at four widths, keyboard tabs in both reading directions, reduced motion, storage-blocked theme persistence, menu focus restoration and zero first-party browser console/runtime errors on normal journeys.

Green/champagne contrast measures approximately **6.96:1**. Gold text is on green; gold action surfaces have green text. Light backgrounds remain the page default. No new runtime requests to the reference sites or externally hosted fonts/assets were added.

Limits: this is still a prototype with illustrative inventory, enquiry-only prices and draft Arabic copy; not a production store, verified stock or live GA reporting. Existing videos predate this redesign. Chrome phone emulation is not physical iOS/Safari certification. No deployment, recording, commit or external publication was performed.

The final ordinary preview was restarted on `127.0.0.1:3000` and opened at `http://localhost:3000/en`. English/Arabic home, admin login and sitemap returned HTTP 200. Browser smoke-check confirmed the new H1, analytics still unconfigured, and the existing configured admin Sign in button enabled. A scan confirmed no fixture analytics ID in final client assets and no reference-site runtime URLs in source.

### Follow-up: stronger branded backgrounds and BS hero logo

The user requested more visible green/gold backgrounds, then supplied a crop of the hero and asked to replace its typed brand name with the BS logo. The hero now uses the existing unmodified logo image. Full-width gold collections, champagne guidance, solid-green advice with gold controls, a stronger pale-green footer and a subtle static branded canvas wash make the requested backgrounds more prominent without obscuring product photos.

Two new browser regressions first failed against the old preview (missing hero logo and transparent collections background), then passed after the UI-only changes. Production build and lint passed; the focused storefront/visual run passed **37 cases with 1 intentional duplicate-viewport skip** across desktop/mobile, including all themes and Arabic/RTL. Updated `retail-en-1440.png` and `retail-ar-390.png` were directly inspected. Backend, database, credentials, fonts and logo artwork were not changed.

### Follow-up: animated merchandising, sample discounts and product template

The user requested visible animations, YAF-style perfume cards, arbitrary demonstration original/discounted prices and the linked YAF Amouage product-page layout. The template was inspected in Chrome with loaded imagery and saved as `artifacts/yaf-product-reference.png` / `yaf-product-reference-top.png`. Only the structure was adapted; competitor product descriptions, stock/urgency, reviews, payments and checkout were not copied.

Implemented shared retail cards with discount badges, large photos, product/house metadata, struck-out original AED values, discounted values, Demo price labels and a functioning View fragrance action. The product page now has breadcrumb/return context, a large zoomable left photo, right-hand pricing/enquiry panel, native description/note disclosures, factual details and related cards. The same deterministic price pair is shown in every locale and route; original products/admin schema remain unmodified. Demo prices are not included as actual offers in SEO, enquiry messages or analytics.

Visible motion: independently floating hero bottles, a gold light sweep, a rotating decorative star, intro entrance, one-time viewport reveals and card lift/photo hover. A localized Pause/Resume animations control stops decorative motion, and system reduced motion cancels it. Reveals never rely on initially hidden content. Live preview smoke-check observed five running hero animations and a functional zoom control; the static screen capture is `retail-motion-desktop.png` (not a video).

Verification after these changes:

- Data audit passed: original 100 records/40 houses and approved local images, no private data fields.
- Unit suite: **46 passed** in 12 files, including literal AED 600 → 420 / 30% and AED 900 → 765 / 15% pricing fixtures, positive whole-AED amounts and stable admin-ID samples.
- Typecheck, lint and production build passed.
- Customer/SEO/no-consent/new storefront suites: **60 passed / 4 intentional skips** in 64 cases; visual suite separately **16 passed**. Combined normal browser coverage: **76 passed / 4 skipped** across 80 cases.
- Isolated admin/empty-database suite: **2 passed**, retaining real edits/new records across process restarts and rejecting unauthorized saves.
- New browser cases verify card/detail price agreement in English/Arabic and after reload, demo disclosure, discount badges, active/pause/resume/reduced motion, and image-zoom Escape/focus restoration.

One integration issue was in the visual harness: `scrollIntoViewIfNeeded` waited indefinitely for the now-continuously-floating photo to become stable. Static layout/image-capture cases now explicitly request reduced motion; dedicated normal-motion tests still verify real running animations and pause/resume. No overflow, photo, console-error or functional assertions were removed. After that correction both the visual and remaining browser suites passed.

Directly reviewed current default desktop product detail, Gallery Arabic phone product detail, desktop homepage/card layout and the normal-motion hero capture. Normal static screenshots remain `retail-*` and `design-*`; they intentionally freeze motion for layout inspection. The existing private database, credentials, product model/repository/store, admin actions/session and WhatsApp builder remained byte-for-byte unchanged against the pre-redesign manifest.

The preview was restarted at `http://localhost:3000/en` and opened with the updated ordinary build. Actual Torino21 detail shows a labelled sample AED 600 crossed out / AED 420, not a verified price or offer. Production prices, stock, genuine promotions and owner content still need client approval; no checkout, deployment, recording, commit or new dependency was introduced in that iteration.

### Follow-up: shadcn scroll loading, supplied sections, tab motion and Instagram

Implemented the user's supplied feature-banner/review/footer compositions, progressive scroll loading, explicit shadcn/ui request, removal of Pause animations, sliding green scent tabs and the approved Instagram profile.

- Added official shadcn registry Card, Skeleton and Radix Tabs source. `docs/demo/SHADCN.md` records source URLs, MIT notice and exact installed dependencies. Tailwind theme/utilities are included without Preflight; UI colour tokens are namespaced to avoid changing the existing body/brand CSS variables. The framework, backend and product schema remain unchanged.
- Home sections mount within 240 px of the viewport, first showing shadcn Skeletons, then entering using `tw-animate-css`. Below-fold photo requests are consequently delayed until their content mounts. No different backend API is invented. Persistent wrapper anchors support navigation before loading. A no-JavaScript fallback links to the fully server-rendered catalogue; unsupported IntersectionObserver falls back to loading content.
- Added a green/gold large-type four-feature banner using the **actual current catalogue count**, not fictitious available stock or worldwide-delivery/payment guarantees. Added three explicitly labelled sample review cards, not verified customers or ratings. The dark footer includes functioning information dialogs, genuine catalogue destinations and contact guidance rather than fake policies/order tracking.
- Linked `https://www.instagram.com/beyond_the_space_perfumes/` in the footer and experience-section callout. No Instagram embed, account access or automatic third-party request was introduced.
- Replaced manual discovery tabs with shadcn/Radix Tabs plus a measured green hover/selection indicator. It smoothly moves/resizes in either reading direction, retains keyboard behavior and disables movement with reduced motion.
- Removed the Pause/Resume button and its context/unused strings/styles at the user's request. Decorative hero motion still respects the operating-system reduced-motion preference.

Final results: **46 unit tests passed**, data audit/typecheck/lint/production build passed, full normal browser suite **84 passed / 4 intentional skips** across 88 cases, and the isolated admin/empty-database suite **2 passed**. Four skips remain the configuration-dependent GA opt-in pair, desktop mobile-menu case and duplicate mobile four-width capture case.

New browser coverage verifies pending Skeleton → loaded shadcn cards on actual scrolling; three sample-review labels/disclaimer; actual seed count in the feature banner; hover and moving pill geometry in English/Arabic; exact Instagram destination; dark footer; shipping-dialog Escape/focus restoration; no Pause control; and successful catalogue navigation with JavaScript disabled. Existing admin checks now scroll to the real deferred featured section before asserting saved content; no application state is forced in tests. Screenshot helpers likewise exercise the actual scroll observer before inspecting all local images/layouts.

Reviewed `retail-en-1440.png` and `retail-ar-390.png` with the new sections and dark footer. The visual suite regenerated theme/catalogue/product captures, checked phone/tablet/desktop overflow, image loading, root script direction, keyboard behavior and first-party console/runtime errors. Existing configured admin saves/new featured products still survive an actual Next process restart. Test writes remain confined to temporary private databases.

The user-authorized dependencies are the deliberate exception to the earlier no-new-dependencies baseline; npm reported zero known vulnerabilities when installed. No backend, credentials, operator database, source inventory, SEO pricing offers, real reviews, real checkout or live analytics integration was altered. A final hash check confirmed the protected backend/config/database files were unchanged. The preview was reopened at `http://localhost:3000/en`; live smoke-check observed seven initially deferred sections becoming fully loaded after scrolling, three sample review cards, the exact Instagram destination, zero Pause buttons and the existing configured admin Sign in button enabled.

### Follow-up: compact footer, rebuilt fragrance profile and closing animations

Addressed the three supplied screenshots:

1. Removed the unused **96 px** footer-bottom reserve; padding is now **16 px**. Moved the design chooser into that row as a compact inline control, so it no longer floats over content or needs a blank zone. Theme selection, persistence, locale changes, dialog focus restoration and all three designs still pass their existing checks. Focus in light footer-hosted dialogs remains green.
2. Replaced the sparse two-column full-width facts table with a grouped **Fragrance profile** panel: four compact icon/label/value tiles in pale green/gold, changing to two-by-two on phones. All values still come from the real product record; the house value links to the real brand filter. The existing details anchor is preserved.
3. Replaced instant native description/note disclosures with the official shadcn/Radix Accordion component. Both independently open and close with measured-height animations and rotating chevrons over 320 ms. Reduced motion disables animation. A local SVG avoids adding any new dependency.

The new footer regression first observed 96 px padding and failed before the correction. The final new browser cases verify the compact inline footer picker, four profile facts and actual `accordion-up` **and** `accordion-down` animation-start events for both Description and Selected notes in English and Arabic, on desktop/mobile. Tests also wait for closed panels to become hidden and verify reopening.

Results: lint/typecheck/build passed; data audit passed; **46 unit tests passed**; full normal browser suite **90 passed / 4 intentional skips** across 94 cases; isolated admin/empty-database suite **2 passed**. No existing layout, image, enquiry, search, locale, no-JavaScript, pricing or authorization assertion was removed. Reviewed the regenerated default English desktop and Gallery Arabic phone product-detail screenshots, including the rebuilt profile and tightly fitted footer. Backend/config/data were not changed. The ordinary preview was restarted and opened on the Philosykos product page. Final crops `fragrance-profile-polished.png` and `footer-polished.png` were inspected; live checks confirmed 16 px footer-bottom padding, four profile facts and both accordion panels initially open. The protected backend/config/database hash comparison remained unchanged.

### Follow-up: accurate discovery, rebuilt brands and stable navigation — October 29

Diagnosed the reported basics before changing the UI:

- The eight family tiles contained only six distinct bottles: Torino21 and Her appeared twice. Note tiles placed ingredient names over differently named products (for example Jasmine over Vanilla 28). The accepted catalogue itself had no repeated brand/name/size identities; no inventory records were deleted or renamed.
- Cold navigation to `#approach` placed its heading around **247 px** from the viewport top; preloading the same sections first placed it around **165 px**. Replacing whole-section placeholders changed the heights above the destination. The original live reproduction now lands around **94 px**, with no late drift.
- The supplied screenshots also showed the obsolete floating picker. Fresh-document checks confirm the actual current picker remains inline.

Corrections:

- Discovery entries now contain category IDs, localized labels, real match counts and filter destinations, not representative products. Original SVG ingredient/family illustrations match those labels; no perfume bottle is labelled Lavender, Lemon or Jasmine. Product cards still bind their actual names/photos to the same record. Card/detail photo agreement is now asserted alongside price agreement.
- Product, discovery, brand and gender cards share one hover-motion stylesheet: the same lift, visual zoom and green-to-gold action feedback. Reduced motion remains supported.
- Replaced the sprawling six-column expandable brand table with eight compact real-house cards and a searchable native modal. Accent-insensitive search, real filter links, no-results recovery, clear-search focus, Escape/focus return and a non-shifting search field are covered. Singular counts read correctly.
- `ScrollSection` keeps actual section geometry and links server-rendered. Images remain lazy-loaded; entry animation enhances paint without replacing page-sized placeholders. Explicit hash destinations do not animate out of position. Native hash links and font-settled alignment use the non-fixed header's 24 px offset.
- Shared header/content gutter tokens, tighter section rhythm and a full-width review background remove mismatched container edges. The footer remains compact.
- Empty catalogues show one honest campaign recovery message, omit the empty featured section, and keep scent/house navigation anchored to that message. The isolated empty-database test exercises these destinations in both languages.

Verification:

| Check | Actual result |
| --- | --- |
| Unit suite | **46 passed**, 12 files |
| Data audit | **100 unique bilingual products / 40 houses**, local photos present, no private source fields |
| Typecheck / lint / production build | Passed |
| Journey, analytics, navigation, product-polish, scroll/footer and SEO batch | **58 passed / 4 intentional skips**, 62 cases |
| Storefront and visual batch | **43 passed / 1 intentional skip**, 44 cases |
| Final focused navigation/layout/directory rerun | **11 passed / 1 intentional touch-hover skip**, 12 cases |
| Isolated admin save/restart and empty-catalogue suite | **2 passed** |
| Protected-file SHA-256 comparison | All **eight** original backend/config/database files unchanged |

Normal browser coverage totals **101 passed / 5 intentional skips** across 106 cases, exercised in batches. Skips are the two unconfigured GA opt-in cases, desktop mobile-menu case, duplicate mobile four-width capture, and touch-only hover case. The original combined run exceeded its outer harness deadline and was split. The last 44-case batch printed its complete passing summary and wrote `test-results/.last-run.json` with `status: passed`; the outer 240-second command deadline then fired after that summary. Process inspection confirmed no leftover test server or Playwright runner. No failed test was treated as passed.

During integration, the Arabic directory test caught count text contaminating exact brand link names; explicit brand accessible names fixed it. The empty-database test caught duplicated recovery copy exposed by full server rendering; the redundant empty featured section was removed rather than weakening the test.

Reviewed current desktop/phone English/Arabic captures, plus readable Modern Gallery evidence at a **1480×800 CSS viewport / 1.25 device scale**:

- `artifacts/screenshots/discovery-corrected.png`
- `artifacts/screenshots/brand-browsing-redesigned.png`
- `artifacts/screenshots/brand-directory-search.png`
- `artifacts/screenshots/navigation-approach-corrected.png`
- `artifacts/screenshots/footer-layout-corrected.png`
- Regenerated `retail-*` and `design-*` captures.

The ordinary preview runs on `http://localhost:3000/en`. English/Arabic home, admin login and sitemap returned HTTP 200; the configured Sign in button remains enabled. Credentials, catalogue, backend and WhatsApp builder are unchanged. Chrome emulation/device scaling is not physical Safari/iOS certification. No deployment, commit, publication, external message or production-content approval was performed.

## Scent Salon alternative — 2026-10-29

The user's later request authorizes a fourth opt-in design in the existing picker, while retaining the current default and other three designs. See [SCENT_SALON.md](SCENT_SALON.md) for the Impeccable-guided context, direction, visual critique and limitations.

Final checks for this addition (not a replacement for the broader historical coverage above):

- Production build/TypeScript and ESLint passed; **49 unit tests passed**.
- Final selected browser run: **95 passed / 5 expected skips**, 100 cases. Suites: journey, navigation-basics, product-polish, salon, storefront and scroll-and-footer. Log: `artifacts/salon/final-e2e.log`.
- 28 Salon captures across English/Arabic and 1440/768/390/360px, including the longest seed product name at phone/tablet sizes: no horizontal overflow, no over-two-line headings, no visible image-load failures or uncaught page errors in the captured matrix. Screenshots/contact sheets: `artifacts/salon/final/`; readings: `measurements.json` there.
- Reviewed the final full-page Salon sheets and live/open states. Re-captured isolated Chrome cached-image paint omissions rather than treating a loaded image as missing application content.
- Atelier home and product openings at 1440/390px are pixel-identical to the previous review; Gallery/Linen remain available and their openings were checked. Four-option persistence, switching back, locale/query state, blocked storage and actual note results pass.
- Actual 390px phone enquiry position: English y=570 and Arabic y=638, versus y=1054/y=1096 before. The action is fully visible in the initial 844px viewport.
- With page script execution disabled after loading Salon, the Rose selector performs native navigation to the real 14-result filtered catalogue. No WhatsApp message was sent.

No new dependency, shipping image, business claim, backend/config/database edit, migration or publication was introduced. Admin persistence, analytics transport, physical-device and exhaustive accessibility/performance checks were not rerun in this visual pass. The official Impeccable/taste launcher and detector were unavailable; no official detector pass or independent-review verdict is claimed.
