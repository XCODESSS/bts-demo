# Frontend direction — green and gold retail storefront

Updated: 2026-10-30. Implemented and locally verified following the user's authorization. Requirements: [STOREFRONT_REDESIGN.md](STOREFRONT_REDESIGN.md). The old fragrance-journal/single-bottle homepage is superseded; historical videos show that earlier design.

## Direction and reference

Recreate the useful retail hierarchy of YAF Perfume in the existing React/Next.js application, using Beyond the Space branding and its existing backend. The reference was inspected with its lazy images loaded; `artifacts/yaf-reference-loaded.png` records the observed structure.

The user's explicit palette instruction governs: use the supplied logo's deep green/teal and champagne gold throughout, including backgrounds. Keep a light website, truthful product information, Arabic support and WhatsApp enquiries. Follow the official Anthropic frontend-design guidance: one memorable campaign composition, deliberate typography, real perfume content, restrained motion and screenshot critique.

The result is not a pixel-identical competitor clone or an expansion into checkout. Competitor photographs, logos, reviews, discounts, prices, delivery promises and contact details were not copied. Unsupported price bands, reviews, videos, Instagram and blog sections were omitted rather than filled with fabricated content. The user's subsequent request explicitly authorized sample prices/discounts and more visible motion, plus the YAF product-detail template; the display-only pricing and motion changes below supersede the initial no-numeric-prices/restrained-motion direction.

## Tokens

| Role | Colour | Treatment |
| --- | --- | --- |
| Logo green | `#07363C` | Campaign background, headings, readable text, primary controls |
| Logo champagne gold | `#D4B991` | Campaign typography, primary campaign action, image-stage edges, footer separator |
| Ivory | `#FBFAF6` | Default light canvas |
| White | `#FFFFFF` | Product photography and search surfaces |
| Pale green | `#EAF1ED` | Discovery/category cards and Instagram callout |
| Pale gold | `#F5EDDF` | Alternating discovery/category cards |
| Warm gold surface | `#EAD7B9` | Full-width perfume-collections background |

Secondary text is `#56645E`, borders `#DEE7E1`. On the warm-gold collections surface, supporting copy now uses brand ink `#07363C` rather than the former marginal-contrast muted color. Green/gold contrast is approximately **6.96:1**. Gold-on-white small text and white-on-gold buttons are not used. Focus on the green campaign uses gold; focus on light surfaces uses green.

### Typography follow-up — current contract

Bodoni Moda 500/600 replaces Cormorant Garamond for large English editorial headings in Atelier, Linen and Salon. **Modern Gallery deliberately retains Manrope display headings.** Manrope 400/500/600 carries official Latin product/house identities, wordmark, prices/controls and the English admin UI. Noto Sans Arabic 400/600 carries Arabic copy; the editor's Arabic textareas retain their natural RTL script inside the English admin shell. Product titles remain Manrope even in Salon and on Arabic pages.

All three families remain locally bundled through `next/font/local`; only the two editorial WOFF2 files were replaced, with no runtime font-service requests. Shared family/size/leading roles live in `src/styles/typography.css`. Font-size tokens use rem rather than overriding the browser root size. Arabic line height and natural script spacing take precedence over English headline tracking.

| Role | Current default-browser target |
|---|---|
| Product-card names | 16px phone / 18px desktop, complete natural wrapping |
| Supporting product facts, discounts, demo labels and caveats | At least 14px |
| Body copy and input/select text | 16px |
| Card price / product-page price | 20px / 30px |
| Product-page identity | 30–40px; long names can use 26–34px, never clamped |
| Editorial section / campaign headings | 28–40px / 36–56px; Salon hero up to 88px |
| Footer legal/disclosure | 13px; shopping disclosures remain at least 14px |

The only scaled-down mock text is inside the chooser's existing `aria-hidden` decorative miniatures; actual design names, descriptions and actions are at least 14px. Header/search/filter/chooser rows wrap as needed rather than shrinking type. This typography follow-up intentionally changes all previews' type sizes, not their data, palette, routing or merchandising hierarchy. It does not claim to fix the separate photography/homepage/admin-image-preview critique items.

## Shared hierarchy

The diagram describes Gallery/Linen’s retained retail composition. Atelier’s later integration below supersedes its campaign/intro, Notes and phone-card layout; shared sections and data remain.

```text
Logo / navigation / actual catalogue search / language
------------------------------------------------------
Green campaign: gold statement + three live product photographs
Centred localized H1 / short introduction / gold collection action
------------------------------------------------------
Shop perfume collections
[Fragrance note] [Fragrance family]
[original category illustration + note/family name + real result count] × up to eight
------------------------------------------------------
Perfume houses / eight compact cards / searchable modal directory
------------------------------------------------------
Featured fragrances / eight live cards / view collection
------------------------------------------------------
Pale-gold catalogue guidance: browse / review details / enquire
------------------------------------------------------
Men / Women / Unisex image-led categories
------------------------------------------------------
Green/gold live-count feature banner / four factual features / WhatsApp
------------------------------------------------------
Sample customer-experience cards / approved Instagram link
------------------------------------------------------
Dark green footer / information dialogs / shop / store / demo disclosure
```

The user's follow-up requested more visible gold/green backgrounds and the BS logo instead of the typed hero brand name. The campaign now displays the original `/brand/logo.png` (rounded, without modifying its artwork). Collections have a full-width warm-gold background, the guidance strip uses logo champagne gold, advice uses solid logo green with gold headings/actions, and the footer uses solid logo green. A subtle static green/gold wash carries the brand into the remaining light canvas; product photography remains on clean surfaces.

Desktop uses four-column discovery/product/brand groups and three gender categories. Mobile puts search below the brand/language/menu row, uses two discovery/product columns, wraps brands and stacks gender cards. Bottles use `object-fit: contain`, preserving proportions and labels. Campaign photos sit on intentional light photographic stages inside green; no unreliable background removal or image-generation dependency was added.

## Data and module boundaries

- `home-page.tsx` reads the existing repository once and composes focused server components. No second catalogue, external API or client-only storefront was introduced.
- `storefront-model.ts` projects current products into three campaign products, eight featured products, supported note/family links, real brands and available gender categories. Later-positioned featured records are promoted so newly created featured products remain visible; this is not described as sales rank or arrival date.
- Note/family tiles represent categories, not products: original SVG illustrations match their labels and real result counts use existing catalogue query matching. Their data shape deliberately has no representative product/photo, preventing ingredient labels being paired with unrelated bottle names.
- Product names and photos, including campaign photos, come from records. There is no hard-coded Torino21 image attached to an unrelated fallback product.
- `CollectionsBrowser` is a small client boundary receiving bounded category links/counts and locale for original accessible illustrations. Tabs support click, native Enter/Space, roving focus, Home/End and RTL-aware arrows.
- Header search is a native GET form. It starts a fresh catalogue query; the main catalogue search continues to combine existing filters. No autocomplete backend was added.
- Brand browsing shows eight compact actual-house cards and a searchable native modal directory. Search normalizes accents/case; Escape, backdrop dismissal and focus restoration work. It never expands a giant table into the page. Every category/brand/tile links to a supported catalogue filter.
- Existing `ProductImage`, `ProductCard` and `EnquiryLink` preserve safe fallbacks, exact enquiry-price wording and consent-gated click analytics.

## Retained light presentations and an opt-in alternative

The original designs keep their IDs, appearance, chooser, persistence, blocked-storage fallback and product/filter/locale state. The user's subsequent request authorizes a fourth alternative, without replacing these:

- **Botanical Atelier (`atelier`)**: ivory, green/gold campaign, arched campaign stages and crisp product surfaces.
- **Modern Gallery (`gallery`)**: white, sans-serif display, squared campaign/product frames. Primary identity stays green/gold, not the old blue palette.
- **Linen Boutique (`linen`)**: warm linen surfaces and softer arch/product framing. Catalogue retains three desktop columns; home/related groups use balanced four-column groups. Primary identity stays green/gold, not the old brown palette.

The design picker is now inline in the footer's bottom row, not a fixed overlay. Its old reserved 96 px footer-bottom gap is removed; the footer uses 16 px vertical padding with the control, disclosure and copyright occupying the row. Light dialogs retain green focus outlines even though they live inside the dark footer.

One shared semantic homepage, not duplicated storefront routes or datasets. The chooser's decorative miniatures are isolated in `design-preview.tsx`/its CSS Module. The later **Scent Salon (`salon`)** addition is opt-in and uses the same approved palette, fonts, repository and routes. Its bounded note spotlight is a separate client island; shared server components continue to supply the rest of the page. A shared `designs.ts` registry keeps pre-paint restoration and picker validation aligned. See [SCENT_SALON.md](SCENT_SALON.md) for its direction, scope and verification.

Salon retains `#07363C` / `#D4B991` / `#FBFAF6`, the existing pale gold `#EAD7B9`, pale green `#EAF1ED`, and a photo ground `#F1F3EE`. It now uses Bodoni Moda editorial display at up to 88px, Manrope UI/running copy at 16–18px, and naturally spaced Noto Arabic. Official Latin product titles use Manrope, not the editorial face; long names wrap completely without the older two-line compression requirement. The main opening is one combined headline/action and working note-selection composition rather than the original campaign plus centred introduction. Four real notes swap the displayed matching product and exact collection count; every selector is also a real filter link. The original sample-review fixture is omitted in this alternative, not represented as genuine proof. Product rows on phones give full names more measure; related products use two columns on tablets. Product summary/gallery/body wrappers preserve the original layouts while allowing Salon's mobile enquiry to precede the large gallery. All visual overrides are scoped to `html[data-design="salon"]`, apart from the necessary four-option picker layout.

## Atelier–Salon usability integration — 2026-10-30

Botanical Atelier remains the default green/gold, arched, rounded presentation, not a renamed Salon. It borrows layout behavior while reusing the already-installed typography roles:

- A neutral `display: contents` wrapper leaves Gallery/Linen/Salon geometry intact. In Atelier it combines the localized H1, intro and collection action with the same three campaign bottles; phones place the action before photography. One decorative supplied logo is visible in that intro. The cropped decorative ring was removed only from Atelier’s product stage; finite bottle/sweep motion and reduced motion remain.
- Mobile product summary/enquiry precedes the gallery below 760px, retaining desktop photo/details columns, truthful price disclosures and the original photo dialog. Enquiries fit at 360/390×844 in both languages for Spice Blend, Torino21 and the long Powerfully fixture without shrinking or hiding names/disclosures.
- Below 600px, product cards become single-column image/text rows with rounded frames and green actions. This deliberately increases catalogue height to give complete names and facts room. Related products form a 2×2 grid at tablet widths; desktop remains four across.
- Notes replaces only Atelier’s legacy tile grid with a compact rounded preview from the same bounded four real note matches Salon uses. Families retains eight category illustrations; Gallery/Linen/Salon retain their legacy Notes tiles. The optional server-rendered slot falls back to tiles when no preview exists. No whole-catalogue client fetch or new repository is introduced.
- Discovery placement uses allowlisted `scent` IDs from current choices. Missing/unknown values select the first actual choice; choosing it removes the key. Native History updates preserve other queries/hash and scroll; reload, Back/Forward, tabs and locale keep selection. Note links remain real catalogue links without script or on modified clicks. Salon’s hero retains local selection and eager image scheduling; Atelier’s below-fold preview is lazy.
- Eight featured house links become a quiet transparent index with readable counts, bottom rules and retained green rounded arrow/directory controls. The 40-house searchable modal, keyboard dismissal and real brand filters are unchanged.

Sample reviews remain explicitly labelled in Atelier. No dependency/font, product data, primary/secondary image, image API or composite was added. The separate photographic-background work is still paused. All integration styling is Atelier-scoped; comparison openings for the other three designs are pixel-identical in the tested matrix. Actual gates/evidence and limits are recorded in [QA.md](QA.md).

## Motion, accessibility and critique

At the user's request, the homepage now has three gently floating hero bottles, a moving gold light sweep, a slow decorative-star turn, an introductory entrance and one-time section reveals. Card hover lifts the card and enlarges the photo, while the full-width action changes from green to gold. The user subsequently requested removal of the Pause/Resume animations button; it is now absent. System reduced motion still disables decorative motion; existing chooser crossfades retain their reduced-motion/fallback behavior.

`storefront-motion.tsx` exports `ScrollSection`: all semantic sections/links and their real geometry are server-rendered. Product photographs use native lazy loading; `tw-animate-css` adds one-time viewport reveals without replacing page-sized placeholders. Explicit hash destinations skip entry movement, and unsupported IntersectionObserver leaves content visible. The earlier whole-section deferral caused an approximately 83 px anchor drift and is superseded by this stable layout. The complete homepage is now present without JavaScript, not just a catalogue fallback. Reduced motion disables entry/indicator transitions.

Header and content share `--page-max` / `--page-gutter`. Reviews use a full-width white section with an aligned inner container, rather than a narrow white slab. In-page navigation uses native anchors with a 24 px scroll offset appropriate to the non-fixed header; `HashNavigation` corrects destination alignment after fonts settle. Product, discovery, brand and gender cards share `card-motion.module.css` for the same hover lift, visual zoom and green-to-gold action feedback.

The user explicitly authorized shadcn/ui, superseding the earlier no-new-dependencies restriction. Actual official registry Card, Skeleton and Radix Tabs components are vendored under `src/components/ui`; source/license and exact dependency setup are documented in [SHADCN.md](SHADCN.md). Tailwind utilities are added without Preflight, so existing CSS Modules, fonts, admin forms and brand tokens are not globally reset. No framework or backend migration occurred.

Scent tabs now have a green hover wash and a measured selected pill that moves/resizes smoothly between triggers. Physical offsets handle different label widths and RTL; Radix supplies focus/keyboard semantics. The original manual tabs and root motion/pause context were removed.

## Added feature, experience and footer sections

The green/gold feature banner follows the supplied large-display/four-column composition. It uses the actual live catalogue count (100 in seed mode), not an unsupported claim of 1,000 available products or worldwide delivery. Its four factual features cover designer/niche discovery, English/Arabic, direct enquiries and fragrance details. The existing WhatsApp action remains functional.

Three shadcn review cards match the supplied warm cards/gold-star treatment but explicitly say Sample review / Sample customer, with a section-wide statement that they are not verified customer reviews. No rating schema or invented identities are emitted. A linked Instagram callout and the dark footer use the exact owner-supplied profile URL; no Instagram embed or third-party tracking loads before a click.

The footer now uses solid logo green, gold serif headings, grouped real catalogue destinations, store-contact guidance and native information dialogs for Contact us / Track my order / Shipping / Returns. Unknown business address/email/hours and policies remain honestly unconfirmed; tracking explains the existing manual WhatsApp flow instead of simulating a backend. Dialogs support Escape, close buttons, backdrop dismissal and focus restoration.

## Product-card and detail templates

The linked YAF product page was inspected and captured at `artifacts/yaf-product-reference.png` / `yaf-product-reference-top.png`. Its hierarchy was adapted to local records: breadcrumb/back navigation, substantial left-hand photo, compact right-hand title/pricing/action panel, brand link, expandable description/selected notes, full-width factual details and related products. Original YAF copy, stock/urgency claims, quantity/cart/payment controls, reviews and payment marks were not copied.

The old wide, sparse details table has been replaced with a compact Fragrance profile panel: four grouped green/gold factual tiles for house, bottle size, concentration and audience, each with adjacent label/value and a small domain icon. It becomes a two-by-two grid on phones. The existing details jump-link still targets it, and the house value opens the real brand filter.

Description and selected notes now use the official shadcn/Radix Accordion rather than instant native `details` toggles. Both start open, can close independently, and animate their measured content height and chevron on opening **and closing** over 320 ms. Reduced-motion settings remove the animation. No fragrance data or note hierarchy was invented.

Cards use a cleaner retail frame: discount pill, large contained photo, detail affordance, product name followed by house, compact metadata, struck-out original amount, stronger discounted amount and a working full-width View fragrance link. They share the same component on home, catalogue and related products; no inert wishlist/cart button was added. Photography can be enlarged through a native dialog with Escape and focus restoration.

`demo-pricing.ts` generates stable sample AED amounts from product IDs; `DemoPrice` renders the same pair on cards and detail pages in the correct locale. Original values range from AED 300–1,100 with illustrative 15–30% reductions. Every price block says Demo price, and home/catalogue/detail/footer explicitly disclose that these are not actual offers. Example: Torino21 displays AED 600 crossed out and AED 420, a 30% sample reduction. No stored product fields, supplier prices, real inventory values, SEO offers or enquiry/analytics payloads were changed. Actual price/availability is still requested through the existing WhatsApp builder.

Before/after review replaced the rejected split-editorial opening with a campaign/intro/merchandising sequence. Earlier reviews diversified bottle representatives; the latest correction removes representative bottles from note/family discovery entirely, making category labels and visuals unambiguous. Obsolete home composition rules and global header/miniature overrides were removed rather than layered beneath the new design.

The final browser suite checks local images, one H1, no page overflow and zero first-party console/runtime errors. English/Arabic captures at 360/390/768/1440 px are `artifacts/screenshots/retail-*.png`; theme/catalogue/detail captures retain the `design-*` names. See [QA.md](QA.md) for actual checks and limits. These are Chrome desktop/emulated-phone checks, not physical Safari/iOS certification. Arabic draft copy and genuine business content still need client review before production.
