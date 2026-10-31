import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

test("one catalogue search fits all designs and responsive widths", async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const design of ["Botanical Atelier", "Modern Gallery", "Linen Boutique", "Scent Salon"]) {
    await page.goto("/en");
    await page.getByRole("button", { name: "Choose Design", exact: true }).click();
    await page.getByRole("button", { name: `Preview ${design}`, exact: true }).click();
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const locale of ["en", "ar"]) {
        await page.goto(`/${locale}/catalogue`);
        await expect(page.getByRole("searchbox")).toHaveCount(1);
        await expect(page.getByRole("banner").getByRole("searchbox")).toHaveCount(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      }
    }
  }
});

test("one catalogue search is shown without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/en/catalogue");
    await expect(page.getByRole("searchbox")).toHaveCount(1);
    await expect(page.getByRole("banner").getByRole("searchbox")).toHaveCount(0);
    await page.goto("/en");
    await expect(page.getByRole("banner").getByRole("searchbox")).toHaveCount(1);
  } finally {
    await context.close();
  }
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale} catalogue has one search and preserves filter context`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const d = getDictionary(locale);
    await page.goto(`/${locale}/catalogue?brand=Dior`);
    await expect(page.getByRole("banner").getByRole("searchbox")).toHaveCount(0);
    await expect(page.getByRole("searchbox")).toHaveCount(1);
    const search = page.getByRole("main").getByRole("searchbox", { name: d.search, exact: true });
    await search.fill("Spice Blend");
    await page.getByRole("button", { name: d.searchButton, exact: true }).click();
    await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe("Spice Blend");
    expect(new URL(page.url()).searchParams.get("brand")).toBe("Dior");
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await page.getByTestId("product-card").getByRole("link").click();
    await expect(page.getByRole("banner").getByRole("searchbox", { name: d.headerSearch, exact: true })).toBeVisible();
    await page.getByRole("link", { name: d.back, exact: true }).click();
    await expect(page.getByRole("banner").getByRole("searchbox")).toHaveCount(0);
    await expect(search).toHaveValue("Spice Blend");
    await page.getByRole("banner").locator(`a[href="/${locale}"]`).click();
    await expect(page.getByRole("banner").getByRole("searchbox", { name: d.headerSearch, exact: true })).toBeVisible();
  });
}
