import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

test("critical local assets and design canvas colors have discovery hints", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const d = getDictionary("en");
  await page.goto("/en");
  const center = page.getByRole("region", { name: d.spotlightLabel, exact: true }).getByRole("figure").locator("img");
  await expect(center).toHaveAttribute("loading", "eager");
  await expect(center).toHaveAttribute("fetchpriority", "high");
  const theme = page.locator('meta[name="theme-color"]');
  await expect(theme).toHaveAttribute("content", "#fbfaf6");
  const fonts = page.locator('link[rel="preload"][as="font"]');
  expect(await fonts.count()).toBeGreaterThan(0);
  for (const font of await fonts.all()) {
    expect(new URL((await font.getAttribute("href"))!, page.url()).origin).toBe(new URL(page.url()).origin);
  }
  for (const locale of ["ar", "en"]) {
    await page.goto(`/${locale}/catalogue`);
    await expect(theme).toHaveAttribute("content", "#fbfaf6");
  }
  await expect(page.getByTestId("product-card").first().locator("img")).toHaveAttribute("loading", "lazy");
});
