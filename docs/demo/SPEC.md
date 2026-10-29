# Beyond the Space Perfume — Demo Specification

**October 28 follow-up override:** The user authorized a YAF-inspired green/gold storefront, then requested stronger backgrounds, the BS hero logo, visible animation, YAF-style product cards, sample crossed-out/discounted prices and the linked product-detail template. These explicit requests supersede the historical no-numeric-prices and minimal-motion visual rules below. Displayed AED amounts/discounts are clearly labelled **demo pricing**, deterministic in the display layer, not persisted or represented as actual offers. Existing backend, original data, enquiry flow, bilingual support and no-checkout boundaries remain. See `DESIGN.md`, `STOREFRONT_REDESIGN.md` and the latest `QA.md` sections for current implementation/evidence.

Updated: 2026-10-26
Status: Implementation authorized by the user's subsequent request.
Visual override: The user's latest instruction replaces historical frontend rules with only a light-coloured website and the official frontend-design skill. Section 5 is historical guidance, not a mandatory palette/layout. Current direction: `docs/demo/DESIGN.md`. Functional and content requirements below remain.
Checklist update (2026-10-27): The user's updated 31-item checklist in `docs/demo/CHECKLIST.md` supersedes the older 52-item scope. Keep Next.js/CSS, retain the accepted 100 sample products, and finish native SEO, GA4/example reporting and a persistent admin proof of concept. No WordPress, literal SEO plugin or Google Site Kit requirement remains. Historical admin/analytics exclusions below describe the initial demo, not the expanded current checklist. Progress is 17/31 recorded complete; see `docs/roadmap/STATE.md` and the completion plan.
Authority: The user's demo-only clarifications supersede conflicting production scope in `PROJECT_CONTEXT.md`.

## 1. Outcome

Create a distinctive, convincing perfume-boutique website demonstration that helps the developer win the Beyond the Space Perfume project. The primary presentation is a recorded walkthrough; a live walkthrough may follow. This is not a functioning online store or a production delivery.

Core flow: homepage → catalogue → search/filter → perfume details → WhatsApp enquiry. Repeat relevant parts in Arabic and on mobile.

The demo deadline is October 29. The user's preferred build target is today, October 26; do not turn that preference into a guaranteed estimate or spend further planning effort on times/timezones.

## 2. Confirmed scope

- Beyond the Space Perfume branding; preserve the supplied logo artwork.
- Light, premium visual design informed by the logo's teal and champagne colours.
- Exactly 100 curated temporary product records, explicitly not confirmed client stock.
- English and Arabic interface, correct Arabic RTL and equivalent-page language switching.
- Responsive homepage, catalogue and individual product routes.
- Search, brand/gender/fragrance-family filtering, sorting and pagination.
- Product photographs, brand, fragrance name, supplied size, concentration and selected notes where reliable.
- Exact English pricing label: **Inquire for prices**. Arabic: **يرجى الاستفسار عن الأسعار**.
- WhatsApp enquiries to one approved business number, with localized product-specific messages.
- Related products and curated homepage collections from the same dataset.
- Keyboard-accessible navigation and controls, visible focus and reduced-motion support.
- Stable local production build suitable for screen recording.

## 3. Explicit non-goals

No login, customer accounts, admin dashboard, CMS, database, cart, checkout, payment gateway, orders, shipping calculation, contact-form delivery, analytics, full 608/1,000-record import, production handover, domain setup or hosting migration. Public deployment and video production are optional follow-up actions requiring authorization, not demo acceptance dependencies. Do not introduce wishlist, compare, fragrance quizzes or product-management simulations.

No invented testimonials, awards, authorized-dealer/authenticity guarantees, sales counts, stock statuses, discounts, shipping promises, brand history, business address or social handles.

## 4. Source materials and boundaries

Read-only source project: `D:/perfume-search`.

Preferred demo input: `site/data/catalogue.js`, already normalized from the final workbook. Existing photographs: `site/assets/perfumes/`. Use an explicit allowlisted transformation, not a copy of source objects.

Never publish the source project root, workbooks, DOCX documents, editable catalogue archives, research objects, catalogue/online prices, supplier costs, FX calculations or comparison-store links. Do not modify the source project or run its exporter/auditor as part of this demo.

The user confirmed permission to publish the existing product photographs on 2026-10-26. Retain this as user-provided permission, not independently verified licensing evidence. Permission does not establish an exact bottle/packaging match or confirm client stock.

Logo source: `C:/Users/SHREYARTH/OneDrive/ドキュメント/WhatsApp Image 2026-10-26 at 4.10.44 PM.jpeg` (736 × 1600 screenshot). During implementation, crop approximately `(127, 462, 611, 946)` and apply a circular alpha mask. Visually verify the circle is not clipped. Export a transparent PNG without screenshot controls, background or fake vector reconstruction. No new logo is needed. A higher-resolution original can replace it if supplied, without blocking the demo.

## 5. Visual direction — The Teal Atelier

A contemporary fragrance boutique, not a SaaS dashboard or discount marketplace. One memorable asymmetric fragrance still life, surrounded by restrained, highly usable product browsing.

### Tokens

| Role | Value | Use |
| --- | --- | --- |
| Ivory | `#FAF7F0` | Main canvas |
| Deep teal | `#07363C` | Logo-derived primary, headings, primary buttons |
| Champagne | `#D4B991` | Logo-informed accent, small decorative details; not small text on ivory |
| Ink | `#252A29` | Body copy |
| Sand | `#E9E1D3` | Quiet image stages and dividers |
| White | `#FFFFFF` | Product-photo surfaces |

Check actual contrast during implementation. Gold is decorative; use teal or ink for readable copy and interactive controls.

### Typography

- English display: Cormorant Garamond, medium; large but readable, no artificially stretched spacing.
- English UI/body: Manrope, regular/semibold.
- Arabic: Noto Sans Arabic, regular/semibold, with generous line height and natural letter spacing.
- Bundle fonts locally through Fontsource. No runtime Google Fonts dependency. Three families support two scripts, not three competing styles on one screen.
- Avoid all-caps micro-labels, random italic emphasis and decorative metadata strings.

### Homepage composition

```text
Desktop
┌──────────────────────────────────────────────────────┐
│ Logo / name       Collection  Our approach   EN / عربي│
├──────────────────────────────────────────────────────┤
│ A scent beyond        Large asymmetric bottle        │
│ the ordinary.         composition on an ivory /       │
│ Short introduction    teal architectural stage        │
│ Explore collection                                  │
├──────────────────────────────────────────────────────┤
│ Discover by scent: Woody / Floral / Citrus / Amber    │
├──────────────────────────────────────────────────────┤
│ Selected fragrances          8 curated product cards  │
├──────────────────────────────────────────────────────┤
│ Niche discoveries       Distinctive supporting layout │
├──────────────────────────────────────────────────────┤
│ Help choosing a fragrance?       WhatsApp action      │
│ Brand / real links / demo disclosure / language       │
└──────────────────────────────────────────────────────┘

Mobile: compact header and accessible menu → headline →
hero composition → CTA → horizontal scent links →
two-column product grid → WhatsApp section → footer.
```

Use permitted real product cutouts and CSS backgrounds/shadows for the hero; no image-generation dependency. If a selected photo cannot be cleanly isolated, use an intentional photographic panel rather than a poor cutout. Preserve bottle labels and proportions; use `object-fit: contain`, never stretch or crop product identification.

Suggested hero copy: “A scent beyond the ordinary.” / “عطر يتجاوز المألوف”. Supporting copy: “Explore designer and niche fragrances, and ask us about the scents that speak to you.” Translate naturally without invented business claims.

Build the homepage with server-rendered content and a small amount of client interaction. No carousel, autoplay video, parallax or scroll hijacking. At most one short hero entrance; prioritize hover/focus and menu feedback. Never wait for animation to access a control.

The supplied brand is the reason for ivory/teal/champagne, not a generic cream-and-serif default. The asymmetric bottle stage is the focal point; do not repeat it as decoration everywhere. Review screenshots against this direction before accepting the visual gate.

## 6. Curating exactly 100 records

Start with a three-product seed to prove the complete flow. Expand to 100 only after that works.

Eligibility: `productType === 'Perfume'`, `matchStatus === 'Exact'`, existing photo, positive single-bottle size, known gender, no quarantined scent evidence and no unresolved identity/concentration/edition warning. Prefer ordinary bottles over testers; do not relabel unknown condition as retail/new. Exclude mixed sets, refills, miniatures, accessories, damaged/leaking bottles and the six photo-gap IDs.

Prefer one size per fragrance/concentration identity. Include recognizable designer fragrances, niche houses and regional brands; target at least 20 men, 20 women and 30 unisex records, and at least 20 brands. These are selection targets, not reasons to invent classifications or include doubtful records. If the stricter pool cannot meet a target, report the actual mix and prioritize truthful records while retaining exactly 100.

Inspect every selected image for wrong fragrance/flanker, logo-only pictures, label clipping, extreme low resolution and mismatched formats. Save selected IDs and editorial decisions in a private manifest. Import must be deterministic and reject duplicate IDs/slugs or missing files.

Descriptions may be short editorial introductions based only on retained source fields. Selected notes are an unordered list: do not invent top/heart/base note pyramids. Quarantined or uncertain notes are omitted. Arabic descriptions, families, note labels and UI copy are drafted for the demo; original official product/brand names may stay Latin. Do not invent official Arabic names. Arabic content still needs client review before production.

Use a short persistent footer disclosure in both languages: “Demo catalogue. Product selection and availability are illustrative.” Product detail also preserves a brief reference-photo caveat when package/size representation is uncertain. Do not display supplier research warnings or source documents wholesale.

## 7. Route and state contract

- `/` redirects to `/en`.
- `/en`, `/ar`: equivalent homepages.
- `/[locale]/catalogue`: all 100 records with URL-backed query state.
- `/[locale]/perfumes/[slug]`: one stable product identity in either locale.
- Unsupported locales and unknown product slugs return a safe not-found experience; valid-locale unknown products have localized recovery links.
- Homepage “Our approach” goes to a real section; no separate About/Contact pages are necessary. Contact action opens WhatsApp, not an undeliverable form.

Catalogue parameters: `q`, `brand`, `gender`, `family`, `note`, `sort`, `page`. The dedicated note selector uses retained note data, localized labels and stable normalized English-derived values. Case/punctuation variants share an option; matching is exact-note, not substring. Unknown notes are ignored. The selected note combines with all other filter groups and survives language changes, pagination and product return context. One selected value per filter group; AND across groups. Trim/case-fold English text and normalize Arabic diacritics/tatweel. Search every term across brand, official name, size, translated family labels and retained notes; terms combine with AND. Unknown enum/filter values are ignored. Unknown sort becomes `featured`; invalid page becomes 1; oversized page clamps to the final page.

Sorts: `featured` (manifest order), `name-asc`, `name-desc`. No price sorting. Page size 12, giving nine pages for 100 records. Updating search/filter/sort resets page to 1. Search submits on Enter or its labelled button; filters/sort apply on change. Mobile filters expand inline with an accessible button, avoiding a custom focus-trapping drawer. Clear filters resets all query state.

Switching language preserves pathname identity, query parameters and selected size (one supplied size per selected demo record). Product back-to-results links retain the catalogue query through a validated `return` parameter. Accept only a catalogue-relative query, never an arbitrary external redirect. Browser back/forward and reload preserve catalogue state.

## 8. WhatsApp contract

Single setting: `NEXT_PUBLIC_WHATSAPP_NUMBER`, international digits only, no `+`, spaces or punctuation; validate `^[1-9]\d{6,14}$`. It is a public contact setting, not a secret. Number has not yet been supplied. Do not invent one, use somebody else's number, or copy a number from unrelated source files.

URL: `https://wa.me/<number>?text=<encoded message>`.

English message: `Hello, I'm interested in {brand} {name}, {size}. Could you please confirm the price and availability? Product: {id}.`

Arabic message: `مرحباً، أنا مهتم بعطر {brand} {name} بحجم {size}. يرجى تأكيد السعر والتوفر. رمز المنتج: {id}.`

Do not imply confirmed price or inventory. When configuration is absent or malformed, show a disabled action with a localized explanation. This safe state allows the rest of the demo to be built but does not satisfy the final live-enquiry gate. Verify destination/message without sending a message or automating the external WhatsApp application.

## 9. Observable acceptance

1. Production build starts locally and `/` opens the English homepage.
2. All 100 IDs/slugs are unique; all selected images load; no raw source/private price data is copied to public assets or generated product JSON.
3. Homepage has one convincing, logo-specific hero and working collection/scent/WhatsApp links.
4. Catalogue count is 100 unfiltered; page 1 has 12 cards and page 9 has 4. Empty search has a clear reset action.
5. Search plus brand/gender/family filters and each sort work together. Query state survives reload, back/forward and locale changes.
6. Cards open the right perfume; detail shows truthful retained data, reference caveats where needed, related records and a working return-to-results link.
7. Every card/detail uses “Inquire for prices” or its Arabic equivalent; no INR/AED prices, fake discounts or unavailable checkout controls.
8. English/Arabic route identity is preserved; `<html lang>` and `dir` are correct; Arabic labels, forms, notes, pagination and mobile navigation are translated and readable.
9. Valid configured WhatsApp links carry the exact product, size and localized message; invalid/missing configuration cannot navigate to an invented recipient.
10. At 390, 768 and 1440 px: no horizontal overflow, clipped names, hidden actions or awkward photo cropping. Also smoke-check 360 px. Browser-based phone emulation is not proof of physical iOS/Safari compatibility.
11. Keyboard navigation, skip link, mobile-menu focus, Escape/close behavior, labelled controls, 44 px primary touch targets and visible focus work. Reduced-motion mode removes entrance animations.
12. Zero first-party runtime console errors or broken first-party requests along the demonstration journey. Images/fonts are local and the walkthrough does not depend on third-party services until the user chooses WhatsApp.
13. Save reviewed desktop/mobile/Arabic screenshots and a concise walkthrough/checklist. No recording, deployment, commits or external publication without separate authorization.

## 10. Recommended implementation choices

Next.js App Router, TypeScript, React, ordinary CSS custom properties and semantic HTML; local product JSON; small typed English/Arabic dictionaries; Vitest for pure seams; Playwright using installed Chrome for browser behavior.

Do not add Tailwind, shadcn/ui, Motion or next-intl just because the historical brief proposed them. For this fixed, two-language demo, CSS and small dictionaries are enough. Revisit localization infrastructure only if routing/translation complexity materially grows. Normal `next build`/`next start`; no static-export detour or deployment work required.

Implementation authorization, WhatsApp configuration and actual test results remain separate from this plan.
