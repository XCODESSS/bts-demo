import { expect, test } from "@playwright/test";
import { expectDocumentFits, expectFamily, expectMinSize } from "./helpers/typography";
import { getDictionary } from "../../src/i18n/dictionaries";
import { designIds } from "../../src/components/designs";

test("editorial font is registered locally while body retains its script", async ({ page }) => {
  const fontRequests: string[] = [];
  page.on("request", request => {
    if (/\.(woff2?|ttf|otf)(?:\?|$)/.test(request.url())) fontRequests.push(request.url());
  });
  for (const locale of ["en", "ar"] as const) {
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    const registered = await page.evaluate(async () => {
      const family = getComputedStyle(document.documentElement)
        .getPropertyValue("--font-bodoni").split(",")[0].trim();
      if (!family) return false;
      await document.fonts.load(`500 40px ${family}`);
      return document.fonts.check(`500 40px ${family}`);
    });
    expect(registered).toBe(true);
    await expectFamily(page.locator("body"), locale === "ar" ? "--font-arabic" : "--font-manrope");
  }
  const origin = new URL(page.url()).origin;
  expect(fontRequests.length).toBeGreaterThan(0);
  expect(fontRequests.every(url => new URL(url).origin === origin)).toBe(true);
});

for (const design of designIds) {
  for (const locale of ["en", "ar"] as const) {
    test(`${design}/${locale} mobile shopping text is readable`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 900 });
      await page.addInitScript(id => localStorage.setItem("bts-demo-design", id), design);
      const d = getDictionary(locale);
      await page.goto(`/${locale}/catalogue`);
      await page.evaluate(() => document.fonts.ready);
      const card = page.getByTestId("product-card").first();
      await expectMinSize(card.getByRole("heading"), 16);
      await expectFamily(card.getByRole("heading").locator("bdi"), "--font-manrope");
      await expectMinSize(card.locator("p").first(), 14);
      await expectMinSize(card.getByText("Xerjoff", { exact: true }), 14);
      await expectMinSize(card.getByTestId("demo-price").locator("small"), 14);
      await expectMinSize(card.getByText(d.viewFragrance, { exact: true }), 14);
      await expectMinSize(page.getByRole("searchbox", { name: d.search, exact: true }), 16);
      const toggle = page.locator('button[aria-controls="catalogue-filters"]');
      if (await toggle.isVisible()) await toggle.click();
      for (const name of ["brand", "gender", "family", "note", "sort"]) {
        await expectMinSize(page.locator(`select[name="${name}"]`), 16);
      }
      await expectDocumentFits(page);
      await page.goto(`/${locale}/perfumes/diptyque-philosykos-p0170`);
      await page.evaluate(() => document.fonts.ready);
      await expectFamily(page.getByRole("heading", { level: 1 }).locator("bdi"), "--font-manrope");
      await expectDocumentFits(page);
    });

    test(`${design}/${locale} editorial hierarchy preserves its script`, async ({ page }) => {
      await page.addInitScript(id => localStorage.setItem("bts-demo-design", id), design);
      await page.goto(`/${locale}`);
      await page.evaluate(() => document.fonts.ready);
      const family = locale === "ar" ? "--font-arabic"
        : design === "gallery" ? "--font-manrope" : "--font-bodoni";
      await expectFamily(page.getByRole("heading", { level: 1 }), family);
      await expectMinSize(page.getByRole("heading", { level: 1 }), locale === "ar" ? 30 : 36);
      for (const paragraph of await page.locator(".section-heading p").all()) {
        await paragraph.scrollIntoViewIfNeeded();
        await expectMinSize(paragraph, 16);
      }
    });
  }
}

test("English admin stays Latin inside the Arabic storefront shell", async ({ page }) => {
  await page.goto("/ar/admin/login");
  await expectFamily(page.getByRole("heading", { name: "Admin Sign In", exact: true }), "--font-manrope");
  await expectMinSize(page.getByLabel("Username", { exact: true }), 16);
  await expectMinSize(page.getByLabel("Password", { exact: true }), 16);
});
