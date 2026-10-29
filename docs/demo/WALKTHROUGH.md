# Suggested Demo Walkthrough

Use a local production build at http://localhost:3000. A completed 6:27 walkthrough is available at [`artifacts/video/Beyond-the-Space-Perfume-Demo.mp4`](../../artifacts/video/Beyond-the-Space-Perfume-Demo.mp4), with separate 1:47 videos for Botanical Atelier, Modern Gallery and Linen Boutique in the same directory. These are silent, captioned 1080p recordings, using an isolated temporary catalogue for admin edits. All four MP4s passed full decoding checks; validation results and representative decoded frames are in `artifacts/video/review/`. Hide developer tools and unrelated desktop UI before any new capture.

### Combined recording chapters

- **0:00** — Theme chooser and live design switching.
- **0:18** — Botanical Atelier: homepage, discovery, product details, Arabic and mobile.
- **2:05** — Modern Gallery: the same customer journey.
- **3:52** — Linen Boutique: the same customer journey.
- **5:39** — Isolated admin search, editing and save.
- **6:07** — Example analytics (sample data, not live GA4).
- **6:17** — Closing homepage.

## Before presenting

1. Set the approved business number in `.env.local`, then `npm run build` and restart `npm run start`. Verify the destination and prefilled message without sending it.
2. If the number is not available, explain that the contact action is awaiting connection; do not pretend it sends to a business.
3. Keep the demo disclosure. These are illustrative records, not confirmed client stock.

## Comparing design directions

Open the floating **Design previews** control to show the three named flash cards. Select Botanical Atelier, Modern Gallery or Linen Boutique; the dialog closes and the actual frontend changes immediately. The chooser is also localized into Arabic. Compare the same product or filtered catalogue across designs to demonstrate that the functionality/data stay consistent. The chosen design is remembered locally. Do not claim every option is already approved by the client.

## Optional 90–120-second sequence

1. Open `/en` at a desktop width. Show the logo, headline and real Xerjoff Torino21 bottle composition; briefly scroll to scent discovery and selected fragrances.
2. Select **Explore collection**. Show the 100-fragrance count and product grid.
3. Search **armaf iconic**. Open **Club de Nuit Iconic**, 105 ml (P0028). Show notes and the enquiry-only price label.
4. Show the configured WhatsApp enquiry destination/message without sending it. If not configured, explicitly describe the disabled state.
5. Switch to **العربية** on that same perfume. Point out that product identity is retained while direction, labels, description and notes change.
6. Return to the collection. Clear the search; optionally choose **Burberry** and open **Her** (P0074), then demonstrate returning to the filtered results.
7. At 390 px width, show the mobile menu, catalogue filters and the Arabic/English language action. Do not claim emulator footage proves every physical device is tested.

Alternative featured detail: `/en/perfumes/xerjoff-torino21-p0574`, also available under `/ar`.

This customer sequence demonstrates visual design and discovery/enquiry capability, not checkout or confirmed client stock.

## Admin, SEO and reporting extension

1. Before presenting, run `npm run admin:setup` and `npm run admin:seed`, then restart. Use your own local operator credentials; do not show `.env.local` or password setup in a recording.
2. Open `/en/admin/login`. Sign in and search for **P0028**. Open **Edit Club de Nuit Iconic**, change its demo description in English and Arabic, save, and show the saved public product page.
3. Add a clearly labelled sample product with a unique ID/slug and paired bilingual content using an existing approved image. Avoid claiming the sample represents actual stock. Demonstrate its catalogue search result and English/Arabic URLs.
4. Stop and restart the Node server with the same `BTS_DATABASE_PATH`. Show that the edit and new sample still exist. `npm run test:e2e:admin` verifies this automatically using a separate disposable database, not your actual demo records.
5. Show `/sitemap.xml` and the product page's canonical, hreflang and Open Graph metadata in developer tools. Explain that the demo intentionally remains noindex.
6. Open **Example analytics** from admin navigation. Keep the prominent **sample data, not live GA4 reporting** label visible. Explain page views and WhatsApp click intent without claiming real visitors, messages or sales.
7. If the owner has configured a real GA4 stream, demonstrate consent and inspect the actual property separately. If not, say that the adapter is tested and ready for the owner's configuration; do not pretend the example dashboard is connected.
8. Show `docs/demo/CSV_IMPORT_PLAN.md` as the explicit future 1,000-product workflow, not an already implemented uploader. Sign out after the presentation.

The admin is a local/single-instance proof of concept with persistent data, not production identity management or a final inventory-management deployment.
