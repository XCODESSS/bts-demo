# YAF-inspired storefront redesign brief

Date: 2026-10-28
Status: Implemented and locally verified after the user's explicit “Implement it” authorization. See `QA.md` for command results and screenshots; not deployed or published.

## Latest follow-up authority: accurate discovery and stable navigation

The user reported duplicated/mislabeled discovery bottles, inconsistent hover behavior, broken navbar landings, mismatched section edges and the oversized brand table. Discovery now uses original ingredient/family illustrations and real matching-result counts, never perfume photographs under ingredient names. Eight compact house cards open real filters; a searchable modal replaces the expanding table. All semantic section geometry is server-rendered upfront because whole-section placeholder replacement caused measurable anchor drift. Native lazy images and one-time scroll reveals remain. Header/content share gutters, reviews have a full-width background, and clickable cards share one hover-motion module. Existing product data, backend, credentials, pricing disclosure, theme IDs and bilingual routes remain authoritative.

## Earlier follow-up authority: shadcn and scroll-loaded sections

The user subsequently requested the supplied large green/gold feature section, review-card section and expanded dark footer; sections loading as the visitor scrolls; shadcn/ui; removal of the Pause animations button; a green hover treatment/sliding scent-tab indicator; and `https://www.instagram.com/beyond_the_space_perfumes/`. This explicitly authorizes the documented shadcn/Tailwind utility dependencies, superseding the original dependency restriction. Core CSS is not globally reset, and the existing backend remains intact. Sample testimonials are clearly disclosed, the banner uses the actual catalogue count, and unsupported delivery/payment/stock/store-policy claims are not represented as real capabilities. See `SHADCN.md`, `DESIGN.md` and the latest `QA.md` section.

## Follow-up authority: motion, cards and product template

After implementation, the user explicitly requested more visible animations, the YAF perfume-card template, arbitrary sample original/discounted prices, and the product layout at `https://yafperfume.com/product/amouage-decision-42-extrait-de-parfum-100-ml/`. These instructions supersede this brief's initial prohibition of numeric demo prices and its quieter motion treatment. Values are stable display-only samples marked Demo price, not live offers or persisted inventory fields; catalogue enquiry behavior, real product records and the existing backend stay intact. The source product template is adapted without invented stock/reviews, cart, payments, currency exchange or competitor copy. Motion includes a localized pause control and reduced-motion support. Latest evidence is in `QA.md`; this brief's remaining original scope is preserved below as the initial redesign baseline.

## Request and authority

The user reports that the client considers the current website simple and boring, supplied YAF Perfume and French Fragrance as references, requested a plan, then specified: recreate `https://yafperfume.com/` using React with their existing backend.

Interpretation: closely reproduce YAF's **retail information hierarchy, section rhythm and discovery interactions**, rebranded for Beyond the Space Perfume and connected to the backend already in this repository. This is not a claim of pixel-identical reproduction, and it does not authorize migration to WordPress, copying competitor assets or adding transactional commerce.

The user subsequently explicitly requested the logo's green and gold throughout the website, including backgrounds. This is a confirmed brand direction, not an optional palette suggestion.

This brief supersedes the fragrance-journal homepage composition in `docs/demo/DESIGN.md`. It does not supersede functional, bilingual, data-safety or existing admin requirements in `docs/demo/SPEC.md`, `docs/demo/CHECKLIST.md` and `README.md`. The older exclusions of admin and analytics in SPEC describe initial scope; the updated checklist governs their preservation.

## Inspected evidence

- YAF's live desktop page was inspected in Chrome, including scrolling to load lazy images. Reference capture: `artifacts/yaf-reference-loaded.png`. Earlier incomplete capture: `artifacts/yaf-reference.png`; do not use its blank lazy-load areas as design intent.
- The observed YAF order is header → campaign image → centred introduction → tabbed perfume discovery → brands → best sellers → service cards → price bands → gender categories → Instagram → reviews → customer videos → blog → footer.
- French Fragrance blocked automated viewing. The user supplied a desktop screenshot showing a large promotional banner, prominent search/navigation and large product images. It is supporting evidence for product density, not the primary reproduction target.
- The reference sites may change. The saved YAF capture and this brief define the implementation target.

## Desired outcome

Visitors should immediately perceive a substantial perfume retailer: strong campaign imagery, clear catalogue access, rich discovery cards, recognisable fragrance houses and prominent real product photography. The interface remains a light, bilingual **catalogue with WhatsApp enquiries**, not an online checkout.

## Reference adaptation map

| YAF element | Beyond the Space implementation |
| --- | --- |
| Compact header and search | Existing logo, collection navigation, prominent functioning GET catalogue search, language switch and accessible mobile menu |
| Campaign banner | Wide original composition using actual repository product images, rich teal stage and live product links; no competitor bags, models, logo or promotional artwork |
| Centred introduction | One concise localized H1, supporting text and Explore collection action |
| Notes/accords/occasion/concentration tabs | Functional **Fragrance notes / Fragrance families** tabs using existing supported `note` and `family` query parameters; gender discovery appears below |
| Ingredient-image cards | Original ingredient/family SVG illustrations with correctly matched labels, real result counts and working note/family filters; never a perfume bottle under an ingredient name |
| Brands | Eight compact real-house cards with counts and exact filter links; searchable modal for the complete directory, no copied brand-logo collection |
| Best sellers | **Featured fragrances**, controlled by the existing admin Featured product checkbox; no invented sales rank |
| Service promises | Honest catalogue guidance: explore both languages, review fragrance details, ask about price and availability; no shipping/payment/authenticity claims |
| Price bands | Omit: the model contains no prices. Do not imitate them with fake values or unsupported filters |
| Men / women / unisex cards | Large image-led categories linking to existing gender filters; hide any category with no current products |
| Instagram / reviews / videos / blog | Omit until approved real content and working destinations exist; do not leave empty or coming-soon sections |
| Footer | Richer grouped catalogue/discovery links, existing Dubai location copy, WhatsApp through the approved configuration, bilingual demo disclosure; no invented address, phone number or policies |

## Layout contract

```text
Desktop (1440 px)
logo | Collection / Discover / Our approach | search | language
----------------------------------------------------------------
[wide product campaign stage: three actual perfumes, one focal bottle]
             Discover your next fragrance.
          short copy + Explore collection
----------------------------------------------------------------
                  Shop perfume collections
               [Fragrance notes] [Fragrance families]
[image tile] [image tile] [image tile] [image tile]   → filtered results
----------------------------------------------------------------
Shop by perfume house                        Search all perfume houses
[brand] [brand] [brand] [brand]
[brand] [brand] [brand] [brand]
----------------------------------------------------------------
Featured fragrances                                  View collection
[product] [product] [product] [product]
[product] [product] [product] [product]
----------------------------------------------------------------
Explore / Review details / Enquire       (three honest guidance items)
----------------------------------------------------------------
Find a fragrance for you
[Men photograph] [Women photograph] [Unisex photograph]
----------------------------------------------------------------
Personal fragrance advice                     configured WhatsApp CTA
----------------------------------------------------------------
Brand / Collection / Discover / Contact / bilingual demo disclosure
```

Mobile: brand/menu/language row → full-width search → campaign stage → concise introduction → discovery tabs → two-column discovery cards → two-column house cards and searchable modal directory → two-column products → stacked guidance → stacked gender cards → advice/footer. No automatic carousel, horizontal page overflow or hidden scroll-to-reveal content.

## Visual contract

- Match the supplied logo, inspected at `public/brand/logo.png`: deep green/teal `#07363C` and champagne gold `#D4B991`. Preserve the logo artwork unchanged.
- Compact palette: logo green `#07363C`; logo gold `#D4B991`; ivory canvas `#FBFAF6`; white photo surfaces `#FFFFFF`; pale green `#EAF1ED`; pale gold `#F5EDDF`. Body text uses logo green; secondary text uses `#56645E`; borders use `#DEE7E1`.
- Use deep green as a substantial campaign background with champagne details and ivory text. Use gold-filled primary campaign actions with dark-green text, green actions on light backgrounds, and pale-green/pale-gold alternating discovery/advice surfaces. Gold must be visible in the composition, not confined to a tiny border.
- Never use champagne gold for small text on ivory/white or white text on champagne buttons. Check actual contrast; retain visible green focus outlines on light surfaces and gold/ivory focus outlines on green surfaces.
- Green panels are deliberate sections within a light website, not a full dark skin. Do not copy YAF's brighter green as the site's brand colour, add metallic glitter or introduce an unrelated accent palette.
- Retain locally bundled Manrope for UI and the new retail headings; Noto Sans Arabic for Arabic. Existing Cormorant can remain in legacy design treatments and wordmark. No new font or animation dependency.
- Desktop H1 approximately 40–52 px; section headings 30–42 px; body 14–16 px. Arabic uses natural line height, no forced tracking. The point is richer merchandising, not a huge headline consuming the first screen.
- Campaign panel about 360–420 px tall at 1440 px, 250–300 px on phones. Preserve product label visibility and aspect ratios with `object-fit: contain`.
- Default desktop content width up to 1392 px; 24–48 px gutters; 48–72 px section spacing. Mobile gutters 18–20 px and 32–44 px section spacing.
- Full-width discovery cards use distinct tonal fields and substantial photography. Do not repeat identical shadowed white cards throughout the page.
- Follow the official Anthropic frontend-design guidance: `https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md` (read during planning). The explicit YAF reference governs composition; remove unnecessary generic embellishments.

## Preserved behavior and backend boundaries

- Remain on installed Next.js 16.4.3 / React 19.3.1 / TypeScript 5.9.3 and ordinary CSS/CSS Modules. No Vite rewrite, Tailwind migration, WordPress, WooCommerce or new API service.
- `getProducts()` / `getProduct()` in `src/features/products/repository.ts` remain the only storefront data entry points. `BTS_DATABASE_PATH` selects the existing private SQLite store; absent configuration uses accepted seed JSON.
- No migrations, inventory resets, changes to credentials, new admin privileges or edits to private `.env.local` / `var/catalogue.sqlite`.
- Read current product image paths and names from product records, including campaign images. Do not continue pairing a hard-coded `/hero/torino21.png` image with a different fallback product.
- Keep homepage server-rendered and dynamically reading the repository. Pass only the small rendered discovery groups to client tab components, not the entire database or server-only imports.
- Use existing `featured` flag, canonical product slugs, supplied images, note normalization and catalogue filters. Do not add unsupported fields such as price, stock, rating, occasion or shipping.
- Keep search/filter/sort/pagination contracts, localized product metadata/sitemap and validated product return state intact.
- Exact price labels remain **Inquire for prices** and **يرجى الاستفسار عن الأسعار**.
- Keep WhatsApp validation, disabled missing-configuration state, localized messages, safe click-intent analytics and consent behavior. Do not copy YAF contact information.
- English/Arabic equivalent-page switching and correct RTL remain mandatory.
- Keep the existing three design IDs, chooser, persistence, keyboard behavior and storage-blocked fallback. All designs adopt the new shared retail section structure; the old homepage screenshots are not a promise to retain the rejected composition. Existing typography/product framing and light surface treatments continue to differentiate them, but all three must use the approved green/gold action and accent colours rather than the old blue or brown primary palettes. No fourth design or parallel storefront copy is needed.

## Non-goals

No cart, checkout, customer account, wishlist, compare, fake discounts, price filter, fabricated reviews, rating badges, best-selling claim, shipping guarantee, payment icons, Instagram embed, autoplay video, blog scaffolding, quiz, new CMS or production deployment. This is a frontend redesign on the existing backend, not an expansion of commercial scope.

## Acceptance gates

1. Visually compare the rendered default homepage against the saved YAF reference: recognisable campaign/intro/discovery/brands/products/category/footer rhythm, not another editorial split-hero reskin.
2. Every visible action has a working destination or action. Selected discovery tabs show only the relevant group; zero unsupported placeholder controls.
3. Notes, family, brand and gender cards land on nonempty correctly filtered catalogue results in both locales. An empty database renders a helpful catalogue link and no invalid product links.
4. Header search works from home, product and admin routes; it intentionally starts a fresh catalogue search and does not merge stale page/filter/return parameters. Main catalogue search retains its existing combined-filter behavior.
5. Admin-created featured products and edited product names/images appear on the homepage on the next request, survive a real server restart and require no rebuild. Verify with an isolated test database, never the operator's database.
6. Existing catalogue and product journeys, admin authorization, sitemap/metadata, analytics consent and WhatsApp safe states still pass their regression suites.
7. Inspect English/Arabic at 360, 390, 768 and 1440 px, including all three design selections, with visible focus, 44 px primary controls, readable captions, intact product labels and no page overflow.
8. Discovery tabs work using click, Tab, Enter/Space, Home/End and direction-aware arrow keys; focus and selected state stay synchronized. Reduced motion disables nonessential motion.
9. No first-party browser exceptions, broken local assets or newly introduced runtime dependency on either reference website.
10. Save new screenshots and record actual check outcomes; do not describe this plan or existing historical recordings as completed redesign evidence.

## Approval assumptions

The plan assumes "my backend" means the working catalogue/admin/SQLite backend in `D:/bts-demo`; no different API contract has been supplied. It also assumes retention of the existing design chooser while changing the shared homepage structure. The user's implementation approval was applied to these assumptions and the proposed public test seams. The existing backend, credentials and database were preserved; no separate backend contract was introduced. No additional account, infrastructure, delegation, commit or publication authorization is implied.
