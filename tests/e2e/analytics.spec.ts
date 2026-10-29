import { expect, test } from "@playwright/test";

test("consent gates analytics; navigation and enquiry events are safe and single-counted", async ({ page }) => {
  const requests: string[] = [];
  await page.route(/https:\/\/.*(googletagmanager|google-analytics)\.com\//, async (route) => {
    requests.push(route.request().url());
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "/* mocked external GA4 boundary */" });
  });
  await page.goto("/en/catalogue?q=private-contact-text");
  const consent = page.getByRole("button", { name: "Allow analytics", exact: true });
  test.skip(!(await consent.count()), "Build with NEXT_PUBLIC_GA_MEASUREMENT_ID=G-BTSTEST001 to exercise the mocked GA adapter.");
  expect(requests).toHaveLength(0);
  await consent.click();
  const events = () => page.evaluate(() => (window.dataLayer || []).filter((entry) => entry[0] === "event"));
  await expect.poll(async () => (await events()).filter((entry) => entry[1] === "page_view").length).toBe(1);
  expect(JSON.stringify(await events())).not.toContain("private-contact-text");
  // A query-only navigation should not count as another page view.
  await page.getByRole("link", { name: "Clear filters", exact: true }).click();
  expect((await events()).filter((entry) => entry[1] === "page_view")).toHaveLength(1);
  await page.getByRole("link", { name: "View Club de Nuit Iconic", exact: true }).click();
  await expect.poll(async () => (await events()).filter((entry) => entry[1] === "page_view").length).toBe(2);
  const enquiry = page.getByRole("link", { name: "Inquire on WhatsApp", exact: true });
  if (await enquiry.count()) {
    // Prevent external navigation without replacing React's click handler.
    await enquiry.evaluate((anchor) => anchor.addEventListener("click", (event) => event.preventDefault()));
    await enquiry.click();
    const clicks = (await events()).filter((entry) => entry[1] === "whatsapp_enquiry_click");
    expect(clicks).toHaveLength(1);
    expect(clicks[0][2]).toMatchObject({ product_id: "P0028", locale: "en", enquiry_type: "product" });
    expect(JSON.stringify(clicks)).not.toContain("wa.me");
    expect(JSON.stringify(clicks)).not.toContain("text=");
  }
  await page.getByRole("link", { name: "العربية", exact: true }).click();
  await expect.poll(async () => (await events()).filter((entry) => entry[1] === "page_view").length).toBe(3);
  await page.getByRole("button", { name: "إيقاف التحليلات", exact: true }).click();
  const before = (await events()).length;
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/perfumes\//);
  expect((await events()).length).toBe(before);
  await page.reload();
  expect(await page.evaluate(() => window.dataLayer?.length || 0)).toBe(0);
  await expect(page.getByRole("button", { name: "Analytics preferences" })).toBeVisible();
});

test("no Google tags load without consent", async ({ page }) => {
  const google: string[] = [];
  await page.route(/https:\/\/.*(googletagmanager|google-analytics)\.com\//, (route) => { google.push(route.request().url()); return route.abort(); });
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(google).toHaveLength(0);
});
