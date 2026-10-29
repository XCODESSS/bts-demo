# Demo Decisions

Date: 2026-10-26

## D-001 — Sales demo, not a production storefront

Status: accepted by user.

Context: The master brief included production admin/ownership concerns, but the immediate goal is convincing the client.

Decision: Scope the demo to branded bilingual browsing and WhatsApp enquiries. No login, admin, cart, checkout, payments or production backend. Public deployment is optional because the first presentation will probably be a video.

Trade-off: Does not demonstrate production operations or an online transaction.

Revisit if: User explicitly requests a different demonstration goal. Future payment-gateway work is separate scope, not a demo commitment.

## D-002 — Exactly 100 curated products, no numerical prices

Status: accepted by user.

Decision: Use 100 temporary products and the exact English label “Inquire for prices”. Never reuse the prior project's INR pricing or imply final client inventory.

Rationale: Real catalogue breadth matters; commercial price accuracy is unnecessary for this presentation.

Trade-off: No meaningful price filter/sort. Curation and visual review are genuine work even with an existing 608-record export.

Revisit if: Approved client stock/prices replace temporary content.

## D-003 — Reuse existing photos under user-confirmed permission

Status: accepted by user; permission supplied by user, not independently verified.

Decision: Selected existing images may be published. Preserve source project and retain reference-photo caveats where representation is uncertain.

Trade-off: Permission does not establish exact supplied-package representation or fragrance-fact accuracy.

Revisit if: A rights or identity issue is found for a selected asset.

## D-004 — Simple approved-number WhatsApp flow

Status: accepted by user.

Decision: One configurable approved business number, localized product-specific `wa.me` messages. Missing/invalid configuration disables sending; never invent a recipient. Number is not yet supplied.

Trade-off: Availability and price are resolved manually outside the website. No order tracking.

Revisit if: Client later requests formal checkout or another enquiry workflow.

## D-005 — Logo-led light visual system

Status: superseded by D-008. Preserved below as historical rationale, not current frontend constraints.

Decision: Ivory base, sampled deep teal and champagne accents; distinctive asymmetric bottle hero; cropped original logo, not a recreation. Follow Anthropic frontend-design guidance.

Rationale: Satisfies the confirmed light-premium direction while making this brand recognizable.

Trade-off: Screenshot logo limits sharpness; product photography needs consistent staging.

Revisit if: User supplies a brand guide or rejects the first implementation screenshot. Do not block implementation on another design questionnaire.

## D-006 — Lean Next.js implementation, no application infrastructure

Status: accepted for this demo through the subsequent implementation request. Implemented; not a production architecture commitment.

Forces: Existing Next.js proposal, two-language route identity, 100 fixed records, video-first demonstration, same-day ambition, no backend requirement.

Candidates: Next.js with JSON/dictionaries; Vite React client-only app; reuse the vanilla source catalogue.

Choice: Next.js App Router + TypeScript + ordinary CSS + local JSON + typed dictionaries. Use Vitest and Playwright at the data/query/enquiry/browser seams. No Tailwind/shadcn/Motion/next-intl dependency by default.

Why: Preserves the proposed framework and gives clean product/locale routes while removing integrations that do not serve the demo. The old vanilla site is a research catalogue, not the desired brand experience. Vite would also work, but offers no decision-critical advantage requiring a framework switch.

Trade-off: Normal Next runtime, not a double-click HTML file. A small custom dictionary is appropriate only while this remains a fixed two-language demo.

Revisit if: Static-file-only hosting becomes mandatory, localization expands materially or an actual CMS is requested.

## D-007 — Planning only; execution requires separate approval

Status: superseded for implementation permission by D-009. Restrictions on delegation/commits/publication remain in effect.

Decision: This session may create roadmap/specification/implementation-plan documents only. Do not scaffold, install dependencies/skills, generate product data, crop/copy assets, run app tests, deploy, record, initialize Git or commit as a side effect of planning.

Trade-off: No implementation or testing completion is claimed.

Revisit if: User explicitly authorizes implementation. That authorization does not automatically authorize delegation, commits, publishing or paid services.

## D-008 — Two frontend rules only

Date: 2026-10-26
Status: accepted by explicit user instruction; supersedes D-005 and all historical frontend prescriptions.

Decision: Keep the website light-coloured and follow the official frontend-design skill. Do not treat prior context palette, typography, section order or animation suggestions as mandatory. Functional bilingual/catalogue/enquiry requirements remain.

Implementation: A personal scent-wardrobe concept with porcelain/sage/stone surfaces, restrained forest text/actions, expressive display typography and a real product-bottle hero. The supplied logo is preserved as branding, not a rule forcing the site's palette. See `../demo/DESIGN.md` and actual screenshots.

Trade-off: First implementation screenshots, not the old wireframe, are the basis for user visual feedback.

Revisit if: User requests visual changes after reviewing the preview.

## D-009 — Implementation authorized, external actions still excluded

Date: 2026-10-26
Status: accepted by explicit user instruction; supersedes the planning-only portion of D-007.

Decision: Build and locally verify the demo directly. Project dependencies, derived assets, local browser tests and a local preview are within implementation scope. No delegation, Git initialization/commit, external publication/deployment or recording is authorized.

Evidence: Production build, type/lint/data checks, 19 unit tests and 17 browser checks passed. See `../demo/QA.md`. An approved business number is still required to complete real-recipient WhatsApp verification.

Revisit if: User separately requests publication, recording, source-control operations or delegated work.

## D-010 — Adopt the expanded demo checklist, one task at a time

Date: 2026-10-27
Status: accepted by explicit user instruction; supersedes D-001's narrow-demo exclusions for the newly requested management/SEO/analytics tasks.

Decision: Work through the user's 52-task checklist incrementally. Complete Product Catalogue first by adding the missing dedicated notes filter. Actual SEO plugins and Google Site Kit must be included in later tasks; custom look-alike dashboards are not substitutes. Keep the current frontend/platform differences aside during this step rather than using them to remove requirements.

Evidence: Product Catalogue is now 8/8, overall 29/52 complete and 23 remaining. Dedicated notes filtering passed across three designs, two languages and desktop/mobile; 26 unit tests and 43 browser checks passed. See `../demo/QA.md`.

Trade-off: The current application remains Next.js with local product data. No WordPress/plugin installation or Google account connection is claimed. Their setup/integration decisions belong to the corresponding later tasks, with project-specific setup approval as needed.

Revisit if: User changes the checklist or selects the backend/platform setup for the management and plugin tasks.

Platform clarification: D-011 rules out WordPress. Scope update: D-012 supersedes this historical 52-item checklist and resolves the former literal-plugin conflict with the user's updated 31-item checklist.

## D-011 — Keep Next.js and CSS; no WordPress

Date: 2026-10-27
Status: accepted by explicit user instruction.

Context: A completion plan incorrectly proposed migrating the existing Next.js application to WordPress to accommodate earlier plugin wording. The user rejected that assumption and explicitly stated that WordPress is not being used.

Decision: Retain and extend the existing Next.js, React, TypeScript and CSS application. No WordPress, headless WordPress, PHP migration or frontend replacement. Preserve the existing designs and working customer-facing functionality.

Planning correction: The migration-based plan and 72–120-hour estimate are withdrawn. The corrected completion plan is `../superpowers/plans/2026-10-27-checklist-completion.md`. Estimate incremental Next.js work only after recovering the exact remaining checklist and confirming storage/authentication requirements.

Requirement conflict at the time: Earlier literal SEO-plugin/Google Site Kit wording required clarification within the no-WordPress constraint. Subsequently resolved by D-012: the user supplied an updated checklist without those requirements.

Revisit if: The user explicitly changes the confirmed platform constraint. Do not ask for WordPress approval as the default next step.

## D-012 — Adopt the updated 31-item Next.js demo checklist

Date: 2026-10-27
Status: accepted by explicit user instructions; supersedes D-010's older checklist scope and resolves D-011's historical plugin-wording conflict.

Decision: Use the user's updated 31-item checklist, recorded verbatim apart from stable IDs/status annotations in `../demo/CHECKLIST.md`. The user explicitly confirmed the existing 100 products satisfy the 40–60 sample-product item. Recorded progress is 17/31 complete and 14 remaining.

Remaining scope: four SEO outputs, GA4 approach/page views/WhatsApp clicks/example reporting, and six single-admin proof-of-concept items including persistent edit/add and a bulk CSV import plan. Example reporting may use clearly labelled sample data. The CSV requirement is planning only, not a working 1,000-record importer.

Architecture constraint: Keep the existing Next.js/CSS application and all working designs/customer journeys. The new checklist does not require WordPress, literal SEO plugins or Google Site Kit. Public/private staging is not an acceptance gate in this checklist.

Planning: `../superpowers/plans/2026-10-27-checklist-completion.md` estimates 25–40 focused hours including reserve, assuming one contributor and local/single-instance prototype scope. Proposed built-in SQLite persistence is not yet approved; no datastore, credential, deployment or live Google connection is claimed implemented.

Revisit if: The user expands prototype scope to production auth/hosting, live analytics API reporting, uploads or an implemented CSV importer.

## D-013 — Implement the 31-item prototype in the existing Next.js application

Date: 2026-10-27
Status: accepted by the user's “Implement it” and subsequent “Continue” instructions; locally implemented and verified.

Decision: Implement the proposed private local SQLite storage, single-operator admin and Next-native SEO/analytics approach without replacing the frontend. Use built-in Node SQLite/crypto and existing CSS/test tooling; no new runtime framework or dependency was installed. The application remains suitable for a local/single-instance prototype, not an ephemeral serverless filesystem or production multi-user identity system.

Evidence: 34 unit tests, type/lint/build/data checks, 51 customer/SEO/analytics browser cases with one intentional desktop skip, and a separate real process-restart persistence/admin-authorization journey passed. Current checklist implementation is 31/31 at prototype scope; see `../demo/QA.md` and `STATE.md`.

Operational boundary: Interactive `admin:setup` lets the owner choose credentials; no real credentials were invented. GA transport was mocked using a fixture measurement ID for tests; no live Google property/account was connected. Example reports are prominently labelled sample data. The final ordinary build must use owner configuration rather than the fixture ID.

Trade-offs: Node 22.23.4 reports SQLite as experimental. The login throttle is single-process, passwords have no recovery workflow, and sessions are signed tokens with an eight-hour expiry; rotating credentials revokes them. Image selection is from the approved existing asset set; new uploads and CSV execution are outside scope. The CSV deliverable is a detailed plan.

Revisit if: The demo is to be deployed publicly/at scale, storage must be serverless, real multi-user operations are required, or analytics/legal requirements demand a production consent and reporting solution.
