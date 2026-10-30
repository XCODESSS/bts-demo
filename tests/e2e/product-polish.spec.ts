import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

test("footer has no reserved floating-control space and no retired design picker", async ({ page }) => {
  await page.goto("/en");
  const footer = page.getByRole("contentinfo");
  expect(await footer.locator(".footer-bottom").evaluate((element) => parseFloat(getComputedStyle(element).paddingBottom))).toBeLessThanOrEqual(20);
  await expect(footer.getByRole("button", { name: "Choose Design", exact: true })).toHaveCount(0);
});

test("fragrance profile groups labels and values into one factual list", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/perfumes/diptyque-philosykos-p0170`);
    const profile = page.getByRole("region", { name: locale === "en" ? "Fragrance profile" : "بطاقة العطر", exact: true });
    await expect(profile).toBeVisible();
    await expect(profile.locator("dl > div")).toHaveCount(5);
    await expect(profile).toContainText("Diptyque");
    await expect(profile).toContainText("75 ml");
    await expect(profile.getByRole("link", { name: "Diptyque", exact: true })).toHaveAttribute("href", `/${locale}/catalogue?brand=Diptyque`);
  }
});

test("description and selected notes animate on closing as well as opening", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/perfumes/diptyque-philosykos-p0170`);
    await page.evaluate(() => {
      document.addEventListener("animationstart", (event) => {
        if (event.target instanceof HTMLElement && event.target.dataset.slot === "accordion-content")
          document.documentElement.dataset.accordionMotion = event.animationName;
      }, true);
    });
    const article = page.getByRole("article", { name: "Philosykos", exact: true });
    for (const name of [getDictionary(locale as "en" | "ar").details, getDictionary(locale as "en" | "ar").notes]) {
      const trigger = article.getByRole("button", { name, exact: true });
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      const contentId = await trigger.getAttribute("aria-controls");
      await page.evaluate(() => document.documentElement.removeAttribute("data-accordion-motion"));
      await trigger.click();
      await expect(page.locator("html")).toHaveAttribute("data-accordion-motion", /accordion-fade-out/);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator(`[id="${contentId}"]`)).toBeHidden();
      await trigger.click();
      await expect(page.locator("html")).toHaveAttribute("data-accordion-motion", /accordion-fade-in/);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    }
  }
});
