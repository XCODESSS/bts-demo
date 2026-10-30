import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { loadHomeSections } from "./helpers/home-sections";

test("the storefront keeps the full bilingual collection on light responsive pages", async ({
  page,
}, testInfo) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const locale of ["en", "ar"]) {
    for (const route of [
      `/${locale}`,
      `/${locale}/catalogue`,
      `/${locale}/perfumes/xerjoff-torino21-p0574`,
    ]) {
      await page.goto(route);
      if (route === "/en" || route === "/ar") await loadHomeSections(page);
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
        .toBeLessThanOrEqual(1);
      // The page canvas stays light; green is reserved for the hero, closing band and footer.
      const background = await page.evaluate(() =>
        getComputedStyle(document.body).backgroundColor.match(/\d+/g)?.map(Number));
      expect(background?.slice(0, 3).every((channel) => channel > 235)).toBe(true);
      for (const image of await page.locator("img:visible").all()) await image.scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator("img:visible").evaluateAll((images) => images.every((image) =>
        image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
      if (route.endsWith("/catalogue")) {
        await expect(page.getByTestId("product-card")).toHaveCount(24);
        await expect(page.getByRole("status")).toContainText(new Intl.NumberFormat(locale).format(100));
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      mkdirSync("artifacts/screenshots", { recursive: true });
      await page.screenshot({
        path: `artifacts/screenshots/storefront-${testInfo.project.name}-${route.slice(1).replaceAll("/", "-")}.png`,
        fullPage: true,
      });
    }
  }
  expect(errors).toEqual([]);
});

test("light bilingual pages have no horizontal overflow or runtime errors", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const route of [
    "/en",
    "/ar",
    "/en/catalogue",
    "/ar/catalogue",
    "/en/perfumes/xerjoff-torino21-p0574",
    "/ar/perfumes/xerjoff-torino21-p0574",
  ]) {
    await page.goto(route);
    if (route === "/en" || route === "/ar") await loadHomeSections(page);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      )
      .toBeLessThanOrEqual(1);
    for (const image of await page.locator("img:visible").all())
      await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator("img:visible")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    const language = route.startsWith("/ar") ? "ar" : "en";
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr",
    );
    mkdirSync("artifacts/screenshots", { recursive: true });
    await page.screenshot({
      path: `artifacts/screenshots/${testInfo.project.name}-${route.slice(1).replaceAll("/", "-")}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("tablet and narrow phone layouts remain usable with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/en",
      "/ar",
      "/en/catalogue",
      "/ar/catalogue?page=5",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth,
          ),
        )
        .toBeLessThanOrEqual(1);
    }
  }
});
