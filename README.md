# Beyond the Space Perfume — Demo

A light, green-and-gold bilingual perfume storefront built with Next.js, React and TypeScript. Includes 100 curated perfumes across 40 houses, English/Arabic RTL, responsive browsing, URL-backed search/brand/gender/family/note filters, sorting/pagination (24 per page), individual perfume pages and configurable WhatsApp enquiries.

## Open locally

Requires Node 22.23.4 (tested) or a compatible newer Node release, and npm. The optional persistent admin uses built-in `node:sqlite`, which is experimental on Node 22.23.4.

```bash
npm ci
npm run dev
```

Open **http://localhost:3000**. `/` redirects to `/en`; Arabic is `/ar`.

For the production build used in the browser checks:

```bash
npm run build
npm run start
```

## Filter by fragrance note

On the collection page, select **Fragrance note** (Arabic: **النفحة العطرية**). On phones, open **Filters / التصفية** first. The list uses notes actually present in the 100 demo records and translated labels. It combines with search/brand/gender/family filters and persists in pagination, reloads, language switches and return-to-results links. Remove its active chip to keep other filters, or clear all to reset the collection.

## Design

One storefront identity built from the supplied logo: deep green `#07363C`, champagne gold `#D4B991` and warm ivory, with Bodoni Moda display type (Noto Naskh Arabic for Arabic headings) and Manrope / Noto Sans Arabic for interface text. The logo's roundel becomes a recurring lit "aperture" in which each perfume is shown. Full rationale, tokens and limits: [DESIGN.md](docs/demo/DESIGN.md).

The earlier four switchable previews (Botanical Atelier, Modern Gallery, Linen Boutique, Scent Salon) and their footer chooser were consolidated into this single design on the `frontend/complete-redesign-review` branch. Their history is in git and in [SCENT_SALON.md](docs/demo/SCENT_SALON.md).

- **Home**: a green hero ("A space for your scent.") with the live fragrance and house counts and a note selector (Lemon / Rose / Oud / Vanilla) that previews one real matching perfume. The choice is stored in `?scent=` on the home URL, so reload, Back/Forward and language switching keep it; without JavaScript the notes are real filtered catalogue links. Then featured fragrances, note/family discovery tabs, men / women / unisex, a perfume-house index with a searchable directory of all houses, and a closing WhatsApp invitation.
- **Catalogue**: search, house / gender / family / note filters and sort, all in the URL; 24 results per page; removable filter chips; on phones a Filters toggle with the active count and a "Show N fragrances" action.
- **Product**: aperture gallery with zoom, serif name, demo price with disclosure, a full-width WhatsApp enquiry, one facts list, description and notes accordions (each note links to its matching fragrances) and related fragrances. On phones a bottom enquiry bar appears while the in-page button is off screen, when WhatsApp is configured.

## Demo pricing and honesty

Cards and product pages show sample AED prices, crossed-out originals and discounts, always labelled **Demo price**. They are deterministic display-only values from `src/features/products/demo-pricing.ts`, not saved inventory prices or genuine offers. Actual price and availability are confirmed on WhatsApp; no cart, payment or checkout exists. Counts on the homepage come from the live catalogue. The sample-review section was removed in the redesign; no reviews, stock levels, delivery promises or business details are invented. The footer keeps the contact / tracking / shipping / returns information dialogs with their "not yet confirmed" wording and the owner-supplied Instagram link: https://www.instagram.com/beyond_the_space_perfumes/. See `docs/demo/SHADCN.md` for the vendored shadcn/Radix Tabs and Accordion.

## Storefront transitions

Public page content fades in with a steady header and footer; the selected card photograph moves into the product page; phone Filters expand at natural height; the phone menu is interruptible; house, information and photo dialogs share one entrance and exit. Query-only changes do not replay page arrival. The hero bottle fades in when the note changes. There is no continuous animation.

Photo continuity covers catalogue, featured and related cards and the return-to-collection link when the photograph is visible and ready. At widths **≤760px** positional photo motion is disabled. Cold, offscreen or failed-photo paths keep normal navigation; Back/Forward keep native history. Reduced motion makes every change immediate; unsupported APIs and no JavaScript keep real links and content. Timings: [DESIGN.md](docs/demo/DESIGN.md); earlier verification evidence: [QA.md](docs/demo/QA.md#storefront-transitions--2026-10-30).

## Connect WhatsApp

Create `.env.local` from `.env.example` if it does not already exist. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the approved international business number, digits only: no `+`, spaces or punctuation. The current development preview has a user-supplied number configured; fresh checkouts still need their own approved setting. Do not substitute an unapproved real number.

Restart development, or **rebuild and restart production**, after changing it. Missing or invalid configuration intentionally shows disabled enquiry buttons and an explanation. Valid configuration enables product-specific English/Arabic messages and a separate general-advice message. The number is a public contact setting, not a secret.

## Admin proof of concept

The existing app now includes a real single-operator catalogue studio. To enable it locally:

```bash
npm run admin:setup
npm run admin:seed
npm run build
npm run start
```

Setup prompts for your chosen username and a hidden password (12–200 characters), writes a salted password verifier and random session secret to private `.env.local`, and retains the existing WhatsApp configuration. It does not print credentials. `admin:seed` initializes `./var/catalogue.sqlite` with the 100 products; rerunning it does not overwrite saved edits. Restart any already-running server after setup.

Open **http://localhost:3000/en/admin/login**. Sign in, search the actual catalogue, edit a product or add a sample with paired English/Arabic content and an existing approved photo. Saves appear on customer pages, metadata and sitemap without rebuilding and survive a server restart. Existing product IDs/slugs are immutable. Missing storage/credentials leave admin login disabled, not a fake successful save. Sign out when finished. Rotating credentials with `admin:setup` revokes existing sessions but does not erase the database.

The protected **Example analytics** page uses visibly labelled sample data, not real visitor counts. Admin labels are English inside the existing locale shell; this is not a separate production CMS or multi-user identity system. Uploaded images, deletion, password-reset email and roles are outside this prototype.

**Storage:** use one long-lived Node server with a private persistent disk. Do not put the database under `public/`, a source checkout intended for publication, or an ephemeral/serverless filesystem. `BTS_DATABASE_PATH` selects the runtime file; without it, the storefront uses immutable seed JSON and admin writes are unavailable. Database files and credentials are ignored by source control. Back up by stopping the server, copying the database to a secure backup location, then restarting. Restore with the server stopped, preserve a copy of the current file, replace it with the verified backup and rerun the customer/admin checks. No production hosting or backup service is configured automatically.

See [CSV_IMPORT_PLAN.md](docs/demo/CSV_IMPORT_PLAN.md) for the future 1,000-product import design. That deliverable is a plan, not a working bulk-upload tool.

## SEO and analytics

Product pages have localized descriptions, canonical URLs, English/Arabic alternatives and Open Graph metadata. Home/catalogue equivalents are also provided. `/sitemap.xml` lists the current public routes in both languages, including new persisted products. Set `SITE_URL` to an approved origin; local fallback is `http://localhost:3000`. The demo stays **noindex**. Correct metadata does not mean a private/local site can be scraped by a public social-preview service.

GA4 is optional and **off unless configured and consented to**. Set your approved `NEXT_PUBLIC_GA_MEASUREMENT_ID`, disable enhanced measurement in the Google stream to avoid duplicate/leaky automatic events, then rebuild/restart. The app emits safe manual page views and WhatsApp click-intent events, never message contents or phone numbers. See [ANALYTICS.md](docs/demo/ANALYTICS.md) for consent behavior, owner setup, testing and the distinction between sample reporting and live Google data. No Google account has been connected or live ingestion verified by this implementation.

## Checks

```bash
npm run data:audit
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run test:e2e:admin
```

Browser tests start a local production server on port 3000; stop any separately running preview on that port first, or use `BTS_TEST_PORT=3100 npm run test:e2e` in Bash/Git Bash. The reference suite explicitly uses immutable seed data. The isolated admin test owns port 3101, creates test-only credentials and a temporary 100-product database, edits/adds a record, restarts the actual Next process and verifies persistence and unauthorized-save rejection; it removes its test database afterward. Do not run another service on port 3101. Analytics transport tests need the fixture-ID build documented in `docs/demo/ANALYTICS.md`; without an ID, the opt-in case is intentionally skipped. They reuse installed Google Chrome via Playwright's `chrome` channel with an isolated test profile. No browser download or personal Chrome profile is used. Run `npm run build` before browser tests. Tests do not send WhatsApp messages or navigate to external WhatsApp.

Screenshots are saved in `artifacts/screenshots/`. See `docs/demo/QA.md` and `docs/demo/WALKTHROUGH.md`.

## Product content

`src/data/products.json` is an explicit allowlisted export. The complete demo works without the original supplier project. Unit tests also work without it.

To refresh the current curated selection on the original development machine:

```bash
npm run data:import
python scripts/prepare-assets.py
npm run data:audit
```

Image preparation requires Python/Pillow, the original supplied logo screenshot and the read-only source at `D:/perfume-search` (or `PERFUME_SOURCE_DIR` in the shell environment). `content/curation.json` controls exactly which 100 IDs are imported. `content/editorial.json` holds bilingual descriptions/featured flags. `content/note-translations.json` supplies reviewed draft note labels. Source photographs remain unchanged; only selected derived assets are prepared.

`scripts/curate-demo.ts` is the initial deterministic selection utility, **not** the routine refresh command: rerunning it regenerates selection/editorial manifests and would replace hand-edited descriptions. `scripts/contact-sheet.py` generates all five image review sheets.

## Scope and design

The October 30 redesign replaces the earlier YAF-inspired retail structure and its four preview variants with one identity derived from the supplied logo (see Design above). The page remains light. `docs/demo/STOREFRONT_REDESIGN.md` records the earlier brief; `docs/demo/DESIGN.md` describes the current implementation. The existing SQLite/admin backend, credentials and saved inventory were not replaced or reset.

This is a sales demo, not a production store. Single-admin login, SQLite persistence, SEO and a consent-gated GA4 adapter are implemented; real GA4 account setup remains owner-controlled. No customer accounts, cart, checkout, payments, stock integration or form-delivery service exists. Product selection/availability is illustrative. Displayed AED prices and discounts are labelled demo samples; real quotes are confirmed through WhatsApp. Official fragrance names stay in Latin in Arabic views; UI, descriptions, family labels, selected notes and messages are translated. Arabic copy needs client review before production.

User confirmed permission to publish the existing product photographs. They remain reference images, not proof of supplied package/edition/size/authenticity or actual client stock. No workbooks, source prices or private source-research objects belong in `public/` or application product data.

A **pre-redesign** local 1080p walkthrough covering the older theme compositions (not this design) is recorded at [`artifacts/video/Beyond-the-Space-Perfume-Demo.mp4`](artifacts/video/Beyond-the-Space-Perfume-Demo.mp4) (6:27, silent with captions). Separate Botanical Atelier, Modern Gallery and Linen Boutique videos are in the same directory. Each includes desktop discovery, product details, Arabic RTL and mobile browsing; the combined video also shows isolated admin editing and example reporting. See [`artifacts/video/README.txt`](artifacts/video/README.txt). Nothing has been deployed, committed or published. The original `D:/perfume-search` materials have not been modified.
