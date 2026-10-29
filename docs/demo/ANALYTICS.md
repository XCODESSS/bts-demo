# GA4 integration and example reporting

## Implemented scope

The existing Next.js app has a consent-gated Google tag adapter. It sends one manual `page_view` for the initial public page and each public **pathname** change, including locale changes. Query-only filter/search changes do not count as another view. Admin and unknown routes are excluded.

Enabled WhatsApp links emit `whatsapp_enquiry_click` with `locale`, `enquiry_type` (`product` or `general`) and, for a product enquiry, `product_id`. The event measures click intent, not a delivered message, sale or successful enquiry. It never includes the phone number, full WhatsApp URL or prefilled message.

Page locations/referrers are sanitized to approved public paths without search parameters or fragments. External referrers are omitted and the page title is a fixed brand label. Do not add raw catalogue search text, email addresses, personal names or contact fields to analytics parameters.

## Connect an owner-approved property

1. The owner creates/selects a client-controlled GA4 property and web stream in Google Analytics. Do not share an account password with the agent or put it in this repository.
2. In the stream, turn **Enhanced measurement off** for this prototype, including browser-history page views, outbound clicks and site search. This implementation supplies its own page views and WhatsApp clicks; automatic measurement can duplicate them or capture query/message URLs.
3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to that stream's `G-...` measurement ID in `.env.local`. This public ID is not a secret. Do not use the fixture `G-BTSTEST001` for real traffic.
4. Set `SITE_URL` to the approved site's origin when one exists. Local SEO previews otherwise use `http://localhost:3000`.
5. Rebuild and restart: public Next.js environment variables are embedded at build time.
6. On a public demo page choose **Allow analytics** (Arabic: **السماح بالتحليلات**). No Google tag is loaded before consent. Decline keeps measurement off; **Disable analytics** revokes consent for this browser. A blocked localStorage implementation retains the choice only for the current JavaScript session.
7. Verify controlled page views and enquiry clicks in GA4 Realtime. DebugView requires the owner's debug-enabled browser configuration; do not enable debug traffic by default for all users. Check locale/product parameters and absence of query/contact data. A consented click opens WhatsApp normally, but the automated tests prevent external navigation and never send a message.
8. Register event-scoped `locale`, `enquiry_type` and `product_id` custom dimensions if needed for explorations. Do not represent clicks as sales or delivered enquiries. Configure appropriate internal/test-traffic filters using the property's supported settings before using reports for business decisions.

Owner account setup and actual GA4 ingestion have **not** been performed. Missing/invalid measurement configuration intentionally leaves tracking and the consent control disabled. Existing consent can be cleared with the browser's site-data controls. This prototype consent mechanism is not a legal compliance certification.

## One tag owner

`src/features/analytics/browser.ts` is the only tag loader. It configures `send_page_view: false`, disables Google signals/ad personalization and sends manual events. Do not also add Google Tag Manager, another GA snippet or automatic SPA history tracking. Consent revocation sets Google's disable flag, updates consent and removes the script element; the existing loaded runtime may remain in memory but collection is disabled. Returning from admin re-enables analytics only when the user's stored consent is granted.

## Reporting example

Open `/en/admin/analytics` after admin login. It displays a fixed, clearly labelled fixture: **420 sample page views and 25 sample WhatsApp clicks**, with a stated example week and matching table totals. It is not a GA Data API dashboard and does not claim real visitors. The Arabic route uses the same prototype admin view inside the RTL shell; customer-facing consent controls are translated.

Actual reporting remains in the owner's Google Analytics property. No service-account secret or Google credentials are stored in the app.

## Reproducible tests (no external Google traffic)

Bash/Git Bash:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BTSTEST001 npm run build
BTS_TEST_PORT=3100 npm run test:e2e -- tests/e2e/analytics.spec.ts
```

Tests intercept the external Google script and inspect the adapter's emitted commands. They cover no requests before consent, one page view per navigation, no extra view for query changes, correct enquiry intent, locale changes and disabled tracking after revocation/reload. No test sends real Google events or opens external WhatsApp.

Finally rebuild with the real `.env.local` configuration (or an empty measurement ID) so the fixture ID is not left in your preview build:

```bash
npm run build
```

With no configured measurement ID, the opt-in tracking test is deliberately skipped; the no-consent/no-network case still runs. A mock integration test proves the app's payload and lifecycle contract, not delivery to Google.

## References

- https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications
- https://developers.google.com/analytics/devguides/collection/ga4/events
