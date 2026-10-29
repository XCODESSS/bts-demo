# Beyond the Space Perfume — Demo Roadmap

Updated: 2026-10-27
Spec: `../demo/SPEC.md`
Current checklist: `../demo/CHECKLIST.md`
Completion plan: `../superpowers/plans/2026-10-27-checklist-completion.md`
Historical storefront plan: `../superpowers/plans/2026-10-26-perfume-demo.md`

## Outcome

A memorable, functional bilingual perfume-boutique demo that can win the client project through a video or live walkthrough. Success is a polished customer journey, not production feature count.

Deadline remains October 29; the user would prefer to build today. This roadmap sequences capability gates rather than promising a same-day completion time. Implementation has since been authorized and completed locally; see `STATE.md` and `../demo/QA.md` for current evidence. WhatsApp configuration is now present and its product links/messages have been inspected without sending. Three integrated light design options are ready for client comparison.

## Scope

**Latest checklist update:** The user's updated 31-item checklist replaces the older 52-item scope. **31/31 prototype features are now implemented and locally verified.** The existing 100 products satisfy the sample-product item by explicit user confirmation. Next.js/CSS is retained; no WordPress or literal SEO-plugin/Site Kit requirement remains. Live Google ingestion and owner admin credential setup are not claimed completed. See `STATE.md` and decisions D-012/D-013.

**In:** supplied branding; a light identity following the official frontend-design skill (historical palette restrictions superseded); 100 curated temporary perfumes; English/Arabic RTL; responsive home/catalogue/detail pages; search and essential filters; real approved-number WhatsApp links; local production build; review screenshots and presentation checklist.

**Implemented checklist additions:** Next.js-native canonical/hreflang/sitemap/Open Graph, consent-gated GA4 adapter/page views/WhatsApp click tracking, labelled example reporting and persistent single-admin add/edit/search, plus the requested CSV import plan. SQLite persistence was verified across an actual server restart. The historical 25–40-hour planning budget is not a measurement of execution time. Public/private staging is not a gate in the updated checklist.

**Still outside this implementation step:** customer accounts/cart/checkout/payments/orders/shipping; live stock integration; full client inventory; production domain and handover; recording/editing a video. Optional preview deployment is not a gate for a video-first demo.

## COMPLETED — M1: One truthful end-to-end bilingual journey

**Outcome:** One seed perfume can be discovered from the homepage, opened, switched into Arabic and used to construct a correct WhatsApp enquiry.

**Evidence required:** safe seed export and import tests; working English/Arabic routes; correct `lang`/`dir`; tested message URL; browser walkthrough on desktop and mobile.

**Dependencies:** implementation authorization, read-only access to existing material, local dependencies when authorized. Actual external WhatsApp destination requires the user's approved number; a disabled configuration state does not block other work.

**Planning uncertainties:** phone configuration, logo extraction and image selection. These have now been addressed: configuration is present, the original logo was cropped and selected images were reviewed. Client taste remains a design-choice question, not an assumed approval.

**Exit:** A three-product seed is imported without prices/private fields; home → catalogue → detail → locale switch works; real-number URL contract passes with a test input and missing configuration fails safely. The configured-number URL/message gate was checked on October 27 without sending a message.

**Implementation tasks:** 1–3 in the implementation plan. One direct execution lane; no delegation assumed.

## COMPLETED — M2: A distinctive, believable 100-product boutique

**Outcome:** Homepage looks specific to this brand; 100 curated products have coherent images, descriptions and translated browse labels.

**Dependencies:** M1. Visual design and curation are both needed; one does not substitute for the other.

**Evidence:** 100-record manifest/import audit, reviewed photo contact sheet, real product hero, desktop/mobile homepage screenshots. No invented brand history, prices or package claims.

**Risks:** screenshot logo resolution, uneven source image backgrounds, editorial work for 100 bilingual records.

**Exit:** Exactly 100 usable records, complete image files, no source-data leakage, readable Arabic content and a visually approved homepage. If image isolation is poor, use an intentional panel instead of delaying for elaborate compositing.

**Implementation tasks:** 4–5. These are sequenced work for one contributor, not assumed parallel effort.

## COMPLETED — M3: Convincing discovery and detail interactions

**Outcome:** A visitor can find a fragrance, refine results, inspect truthful information and enquire without losing context between languages or pages.

**Dependencies:** M2 dataset; M1 routes and enquiry seam.

**Evidence:** combined-search/filter tests; 12-per-page navigation; zero-results recovery; URL persistence; localized details/related products; back-to-results state; equivalent-page switching.

**Risks:** query-state edge cases, RTL mixed-script layout, unsupported data taxonomy slipping into selected records.

**Exit:** Core flow works at desktop and mobile sizes in both languages, with no decorative dead ends. All pricing labels say “Inquire for prices” or the Arabic equivalent.

**Implementation tasks:** 6–7.

## CURRENT — M4: Recording-ready release candidate

Local implementation, production build, automated checks and screenshot review have passed. The configured WhatsApp links/messages were verified without sending. Botanical Atelier, Modern Gallery and Linen Boutique now share a localized flash-card chooser in the existing UI; the client can select a direction without separate demo copies. No video has been recorded.

**Outcome:** The local production build is stable, polished and predictable enough to record or screen-share.

**Dependencies:** M3; approved business number for the final live enquiry gate.

**Evidence:** production build plus type/lint/unit/browser checks; 390/768/1440 px review and 360 px smoke check; English/Arabic screenshots; missing-image/unknown-product recovery; reduced-motion and keyboard checks; working destination/message inspection without sending anything.

**Exit:** No critical failures on the presentation journey. The walkthrough uses real working features and discloses illustrative inventory. Reviewer has examined the actual screenshots, not just test exit codes.

**Implementation task:** 8. Save evidence/checklist; do not automatically publish or record.

## LATER — Only if separately requested

- Shareable preview deployment with a clear demo disclosure and noindex metadata.
- Video capture/editing using the approved walkthrough.
- Additional collections or animation refinement after the core release candidate is stable.
- Production proposal after client interest. Treat CMS, payment gateways and ownership as a separate project decision, not unfinished demo tasks.

## Current critical path

Completed: persistent product reads/writes → login/list/edit/add → SEO metadata/sitemap → GA4 adapter and example reporting → CSV import plan → regression and evidence. Remaining operational path: owner credential setup → initialize private runtime catalogue → optional owner-approved live Google connection/verification.

The historical M1–M4 sections above describe the completed storefront foundation, not completion of the new admin/SEO/analytics scope. Preserve that foundation rather than rebuilding it. Approved site origin and GA4 owner configuration are needed for production-origin metadata/live measurement verification. Public hosting is not a checklist gate. Extra contributors, external review agents and worktrees are not assumed or authorized.

## Scope-pressure rules

If same-day ambition conflicts with quality:

1. Drop optional deployment, video automation and decorative animation.
2. Keep one supplied size per selected perfume; do not invent variants.
3. Use inline mobile filter expansion, not a custom drawer.
4. Use plain brand text instead of collecting 20 brand logos.
5. Use 4 related products, 8 featured products and simple fixed collections.
6. Never quietly drop English/Arabic, the promised 100 records, core discovery, truthful data or safe WhatsApp behavior. Report a conflict before changing those commitments.

## Immediate next action

Follow `README.md` to run `admin:setup` and `admin:seed`, restart the local preview and open `/en/admin/login`. Review the saved admin/reporting demonstration and original bilingual storefront. Configure a real GA4 stream only with owner approval using `../demo/ANALYTICS.md`. No deployment or Google-account connection is authorized or implied by local completion.
