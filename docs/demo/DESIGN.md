# Frontend direction — "The Aperture"

Updated: 2026-10-30, branch `frontend/complete-redesign-review`. This replaces the four switchable preview designs (Botanical Atelier, Modern Gallery, Linen Boutique, Scent Salon) with one identity. The previous direction and its rationale remain in git history (`docs/demo/DESIGN.md` before commit `3a3c8bf`).

## Idea

The supplied logo is a deep-green roundel with a champagne-gold monogram. The redesign takes that circle literally: every perfume is shown through a lit circular **aperture**, the window "beyond the space". The hero, product cards, the product gallery and the category tiles all use it, so the motif identifies the brand without extra ornament.

Green and gold do the structural work instead of decorating: green opens the site (hero) and closes it (closing invitation and footer); gold marks the one thing to do next (primary action, selected note, active filter count, the wordmark sign-off). Browsing surfaces stay light, as the confirmed brief requires.

## Tokens

| Role | Value | Use |
|---|---|---|
| Logo green | `#07363C` | Hero, closing band, footer, primary buttons, headings |
| Green soft | `#0E4B53` | Hover on green, hero light source |
| Champagne gold | `#D4B991` | Accents on green, primary action on dark, selected states |
| Gold ink | `#7A5C2E` | Gold-family text on light surfaces (~5.9:1 on ivory) |
| Ivory | `#FBFAF6` | Page canvas |
| Paper | `#F3EEE4` | Photo stages |
| Sand | `#EDE4D3` | Discovery band |
| Text / muted | `#29474A` / `#566866` | Body / secondary copy (both AA on ivory) |
| Line / strong line | `#E3DBCC` / `#CBBFA8` | Rules / control borders |

Gold text is never used on light backgrounds; green on gold is ~6.96:1. Focus rings are green on light and gold on dark.

## Type

| Role | Latin | Arabic |
|---|---|---|
| Display (hero, page, section, product name) | Bodoni Moda 400/500, 400 italic for the hero accent only | Noto Naskh Arabic 500/600 |
| UI, body, product names in cards | Manrope 400–700 | Noto Sans Arabic 400/600 |

All fonts are bundled locally through `next/font/local`; Noto Naskh Arabic (`@fontsource/noto-naskh-arabic`) is the one new dependency, added so Arabic headings have a serif counterpart instead of falling back to sans. Official perfume and house names stay Latin in both languages. Sizes are rem-based tokens in `src/styles/typography.css`; product facts, prices, demo labels and caveats stay at or above 14px, controls at 16px.

## Components

- **Buttons**: pill geometry (echoing the roundel). Primary green, light outline, gold on dark, outline on dark. Disabled enquiry buttons stay visibly disabled with their explanation.
- **Product card**: a single link. Aperture stage with a small demo-discount tag, house (gold ink, tracked caps), name, size · family, sample price, struck original and the always-present "Demo price" label. No per-card button: twelve identical dark buttons in a grid competed with the products.
- **Selects**: boxed, labelled, custom chevron that mirrors in RTL; still native `<select>` for accessibility and large house lists.
- **Dialogs**: houses directory, information topics and photo zoom share one quiet panel style over a green backdrop.

## Page structure

**Home** — hero (statement, real counts of fragrances and houses, note selector driving a real perfume in the aperture) → featured fragrances (four on phones) → shop by note or family (tabs; the original illustrations re-toned into the palette, tiles turn green/gold on hover) → for him / her / everyone → perfume-house index plus searchable directory → closing WhatsApp invitation → footer. Removed: the guide strip and feature banner (repetition) and the sample-review cards (labelled fixtures that still read as testimonials).

**Catalogue** — editorial header with the pricing disclosure; full-width search; house / gender / family / note selects with sort set apart; removable filter chips; 24 results per page; labelled pagination. On phones the filters collapse behind a toggle showing the active count and end with "Show N fragrances".

**Product** — sticky aperture gallery beside the details on desktop, first on phones. House link, serif name, concentration · size · gender, price block with disclosure, full-width WhatsApp action with a line on what the prepared message contains, one facts list, description and notes accordions (notes link to every fragrance sharing them), related fragrances. On phones a bottom enquiry bar appears while the in-page button is off screen (only when a WhatsApp number is configured).

## Motion

Purposeful and short: the hero bottle and caption fade in when the note changes; card and tile images lift slightly on hover; tiles change colour on hover/focus; the existing route, shared-photo and dialog transitions in `src/styles/transitions.css` are unchanged. There is no continuous animation. `prefers-reduced-motion` removes all of it.

## Honesty constraints (unchanged)

Prices and discounts are deterministic samples, always labelled. Counts come from the live repository. No reviews, stock, delivery, payment or business details are invented; information dialogs keep their "not yet confirmed" wording; product photos keep their reference caveat.

## Known limits

- Product photos are 223–900px tall; on large retina screens the detail image is soft. Nine photos have opaque backgrounds and show as framed squares inside the aperture. Replacing photography is outside this frontend scope.
- Arabic copy is a reviewed draft, still needing client approval.
