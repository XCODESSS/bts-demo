# Scent Salon — additional design

**Current typography override:** The later typography plan replaces Cormorant with locally bundled Bodoni Moda 500/600 for editorial display, retains Manrope for official Latin product identities and UI, and retains Noto Sans Arabic for Arabic copy. Functional supporting text is at least 14px; body/inputs are 16px. Long names wrap completely at a readable size instead of being constrained to two lines. Earlier pixel-identical and two-line measurements below describe the original delivery, not the updated font metrics. See `DESIGN.md` and the latest `QA.md` section for current evidence.

## Atelier integration follow-up — 2026-10-30

Salon remains an independent opt-in preview with its existing composition and local hero-note selection. Its usability principles now also improve the default Botanical Atelier: early mobile enquiry, image/text phone cards, 2×2 tablet related products, one actionable three-bottle opening, a compact real-note preview inside Notes and quieter house browsing. Atelier keeps its arches, rounded controls, green/gold identity and honestly labelled sample reviews; Salon’s square framing/oversized hero are not copied.

`ScentSpotlight` now accepts an optional `placement` (`hero` by default). Atelier’s `discovery` placement is backed by allowlisted `scent` query state and lazy photography; Salon’s hero retains local state/eager photography. Both reuse the same bounded four-choice projection and real filtered links. The other themes’ note/family illustrations remain intact.

Final integration run: **260 public cases passed, 16 expected skips; 5 isolated admin cases passed**. All **36** Gallery/Linen/Salon opening comparisons (home/catalogue/product, EN/AR, 390/1440px) are pixel-identical to the fresh pre-integration build. Evidence: `artifacts/atelier-salon/theme-comparison.json`; full checks and limitations: [QA.md](QA.md). No photographs, font dependencies or operator data were changed; the separate bottle-composite/background-image work remains paused. The original delivery record below is preserved as historical evidence.

## Scope and context

The user requests a bolder alternative in the existing design menu, preserving the current designs and green/gold theme. This authorizes a fourth opt-in design, superseding the older brief's three-design limit for this work only. Botanical Atelier remains the default. No backend, credentials, inventory, checkout or deployment changes. The later typography request separately authorizes replacing the editorial-font dependency.

Existing approved context is in DESIGN.md, STOREFRONT_REDESIGN.md and README.md: English/Arabic perfume shoppers browse actual designer/niche products and enquire through WhatsApp; the brand is premium, light, deep green/champagne gold. The previous frontend review supplies the problems to address. Homepage mode: Persuade; catalogue/product browsing remains task-oriented.

Impeccable's official skill and bolder/new-work/craft-floor guidance were read remotely because its local launcher is unavailable. Existing design context is present, so no speculative teach interview or competing global context record is needed. This is an extension of the confirmed visual world, not a rebrand. Work is code-led using existing real product photography, fonts and components. No seed or official detector result is claimed.

## Direction contract

**Thesis:** Beyond the Space becomes a space to find a scent: a working note selector changes a real featured bottle and exposes the matching collection. Refuse the campaign-plus-second-introduction opening.

**Own-world:** Retain logo green, champagne gold, ivory, bundled Bodoni Moda/Manrope and Noto Sans Arabic. Replace soft frames and decorative rings with substantial flat fields, oversized type, generous pictures and quieter supporting UI. Never overlay a headline with a bottle.

**Story:** Understand the offer, choose a real note, see a matching perfume, browse its results, then ask about actual price/availability. No invented proof. Existing sample prices remain explicitly labelled; the alternative omits the sample-review marketing section.

**First viewport:** One large h1 and plain supporting copy/action share a single green campaign composition with a large contained product on a gold-tinted field. Four real notes form the live selector. Phone layout keeps title/action before imagery; product pages put purchase facts/enquiry before the large gallery. Equal outer margins and readable 16px running copy.

**Form:** A perfume salon's personal selection ritual, expressed through scale and real catalogue changes, not decorative imitation. Existing palette/type are pinned; no random draw was available or claimed. Signature interaction: note selection swaps the featured bottle and exact count; real links remain usable without JavaScript and reduced motion removes travel.

**Finish:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Integration boundaries

- One shared dataset/repository and existing product/filter/WhatsApp routes.
- Fourth persisted ID `salon`, restored before paint and across language/navigation changes, with blocked-storage fallback.
- Theme styling is gated by `html[data-design="salon"]`; previous designs retain their appearance.
- No new shipping raster assets: reuse the existing approved photographs with their existing caveats/provenance. Existing low-resolution assets are not presented as new high-resolution images.
- Verify menu selection, switching back, persistence, keyboard discovery, note destinations/counts, English/Arabic, no-JS links, empty/small data, reduced motion, responsive widths and existing journeys. Check current designs for regressions.

## First visual review and correction batch

The first browser round showed the intended type/colour hierarchy, functioning discovery and preserved original layout. Corrections: enlarge the desktop spotlight photograph; condense the phone opening so a whole bottle can fit with the title/action and note choices; remove cramped tablet note arrows; widen mobile product-name measure and use the bundled Latin UI font for official names in Arabic cards. A content-length gate also caught the longest official product-detail title at three lines: the full title now gets a compact scale only when its actual length needs it, rather than being cut or clamped.

The original Atelier homepage and product opening images were pixel-identical to the prior review at 1440 and 390px before the correction batch; none of that batch changes their visual rules.

## Final verification and verdict

Fresh local preview: **http://localhost:3002/en** → footer **Design previews** → **Scent Salon**. The existing port-3000 process was serving an older build and was left untouched. Verified selecting Salon on the fresh preview with no browser page errors.

**Manual verdict: ready as an alternative demo design.** This is not production business-content approval or an official Impeccable/taste inspector verdict; their launcher/detector packages were unavailable. The final visual review was performed directly, not by an independent reviewer.

- Production build (including TypeScript), repository ESLint and 49 unit tests passed.
- Selected Playwright suites on the final build: **95 passed, 5 expected skips, 0 failures** (`artifacts/salon/final-e2e.log`). Coverage includes all four choices, switching back, reload/locale/query persistence, blocked storage, exact note matches, missing photographs, reduced motion, full long names, navigation, zoom, tabs, footer dialogs, catalogue filtering and existing journeys.
- Captured 28 Salon route/viewport combinations: home/catalogue/Torino21 in English/Arabic at 1440, 768, 390 and 360px, plus the longest seed product name in both locales at 360 and 768px. Captured another 12 legacy combinations for comparison. Data is in `artifacts/salon/final/measurements.json`.
- Salon measurements: **0px overflow, no headings over two lines, no visible image-load failures and no uncaught page errors** in the captured matrix. These are local measurements, not a whole-site accessibility certification.
- Read all 28 Salon full-page contact sheets, representative full-size openings, the four-option picker and additional open-menu/filter/note-change states. Checked legacy design openings; Atelier home/product openings at 1440 and 390px remain pixel-identical to the earlier audit (`artifacts/salon/baseline-comparison.json`).
- Some Chrome cached/blended-image screenshots omitted already-loaded photographs. Verified their actual viewport rendering and re-captured the affected evidence in a fresh browser/full-document viewport. No application content was hidden or changed to obtain a screenshot.
- Phone enquiry visibility improved: Torino21's English action moves from y=1054 to **y=570**, and Arabic from y=1096 to **y=638** in the tested 390 × 844 viewport. Both are fully visible initially. The longest tested name is complete at two lines, with its enquiry also visible on a 360px phone.
- Disabled page-script execution after loading Salon, then used the Rose note link: native navigation reached `/en/catalogue?note=rose` with 14 actual matches. Evidence: `artifacts/salon/fallback-check.json`. Normal no-JavaScript catalogue browsing is also covered by the existing suite.

### Final visual critique

Subjective, non-juror scores: visual craft **7.5/10**, usability **8/10**, distinctiveness **7/10**, content **6.5/10**. The alternative now has a clear large-scale opening, a working subject-specific moment, readable running copy, more varied merchandising, and a deliberately designed close. The original green/gold identity is recognisable rather than replaced.

Still short of a finished client launch: some supplied photos (especially Burberry Her) are low resolution; original business contact/policy information and sample prices require approval; Arabic copy needs owner review. No genuine testimonials, new product photos, video, delivery promises or commercial offers were invented. Protected admin flows, analytics transport, physical devices/Safari and comprehensive performance/accessibility audits were not re-tested in this frontend pass.

No new shipping raster assets, stock licences or image-generation provenance are introduced: all displayed bottles and the logo reuse the existing approved assets and caveats. Original ingredient SVG illustrations remain category illustrations, never claimed as product photography. No seed/draw/redraw result is claimed; palette and typography were pinned to the existing brand. No deployment, commit or publication occurred.
