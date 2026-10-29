import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { designIds } from "../../src/components/designs";

test("dialogs contain scrolling and restore focus", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en");
  for (const [name, title] of [[d.shippingInfo, d.shippingInfo], [d.allHousesAction, d.brandsTitle]]) {
    const trigger = page.getByRole("button", { name, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: title, exact: true });
    await expect(dialog).toHaveCSS("overscroll-behavior-y", "contain");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.goto("/en/perfumes/diptyque-philosykos-p0170");
  const trigger = page.getByRole("button", { name: d.zoomImage, exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: d.zoomImage });
  await expect(dialog).toHaveCSS("overscroll-behavior-y", "contain");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("touch and safe-gutter defaults remain zoom friendly", async ({ page, isMobile }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveCSS("overscroll-behavior-y", isMobile ? "auto" : "none");
  await expect(page.getByRole("link", { name: getDictionary("en").skip })).toHaveCSS("touch-action", "manipulation");
  expect(await page.locator('meta[name="viewport"]').getAttribute("content")).not.toMatch(/maximum-scale|user-scalable=no/);
});

for (const width of [360, 390, 768, 1440]) {
  test(`${width}px public content fits all designs and locales`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 1000 });
    for (const locale of ["en", "ar"]) {
      for (const route of ["", "/catalogue", "/perfumes/diptyque-philosykos-p0170"]) {
        await page.goto(`/${locale}${route}`);
        for (const design of designIds) {
          await page.evaluate(id => { document.documentElement.dataset.design = id; }, design);
          await page.evaluate(() => document.fonts.ready);
          expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), `${locale}${route}/${design}`).toBeLessThanOrEqual(1);
        }
      }
    }
  });
}

test("320px footer content fits in every registered design", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}`);
    for (const design of designIds) {
      await page.evaluate(id => { document.documentElement.dataset.design = id; }, design);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      const escaped = await page.getByRole("contentinfo").locator("h2,a,button").evaluateAll(elements =>
        elements.filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
        }).map(el => el.textContent));
      expect(escaped).toEqual([]);
    }
  }
});
