import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { expectDocumentFits, expectMinSize } from "./helpers/typography";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} 200 percent root text preserves catalogue controls`, async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto(`/${locale}/catalogue`);
    await page.evaluate(() => document.documentElement.style.fontSize = "200%");
    await page.evaluate(() => document.fonts.ready);
    await expectMinSize(page.getByTestId("product-card").first().getByRole("heading"), 32);
    await expectDocumentFits(page);
    const toggle = page.locator('button[aria-controls="catalogue-filters"]');
    if (await toggle.isVisible()) await toggle.click();
    for (const name of ["brand", "gender", "family", "note", "sort"]) {
      const control = page.locator(`select[name="${name}"]`);
      await expect(control).toBeVisible();
      expect(await control.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    }
  });
}

{
  for (const locale of ["en", "ar"] as const) {
    test(`${locale} type reflows without clipping`, async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "Explicit multi-width matrix; mobile project separately exercises touch flows.");
      test.setTimeout(120000);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const directory = process.env.BTS_TYPOGRAPHY_ARTIFACTS || "artifacts/typography/after";
      mkdirSync(directory, { recursive: true });
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const [name, route] of [
          ["home", ""], ["catalogue", "/catalogue"],
          ["product", "/perfumes/giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042"],
        ]) {
          await page.goto(`/${locale}${route}`);
          await page.evaluate(() => document.fonts.ready);
          await expectDocumentFits(page);
          const heading = page.getByRole("heading", { level: 1 });
          await expect(heading).toBeVisible();
          if (route.includes("perfumes")) {
            await expect(heading).toHaveText("Emporio Armani Stronger With You Powerfully");
            expect(await heading.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
          }
          if (width === 390 || width === 1440) {
            await page.screenshot({ path: `${directory}/${locale}-${name}-${width}.png`, fullPage: true });
          }
        }
      }
    });
  }
}
