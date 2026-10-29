import { expect, test } from "@playwright/test";

test("footer has no reserved floating-control space and its design picker stays inline", async ({ page }) => {
  await page.goto("/en");
  const footer = page.getByRole("contentinfo");
  expect(await footer.locator(".footer-bottom").evaluate((element) => parseFloat(getComputedStyle(element).paddingBottom))).toBeLessThanOrEqual(20);
  const chooser = footer.getByRole("button", { name: "Choose design", exact: true });
  await expect(chooser).toHaveCount(1);
  await expect(chooser).not.toHaveCSS("position", "fixed");
  await chooser.click();
  await expect(page.getByRole("dialog", { name: "Choose a design", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(chooser).toBeFocused();
});

test("fragrance profile groups labels and values into compact factual tiles", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/perfumes/diptyque-philosykos-p0170`);
    const profile = page.getByRole("region", { name: locale === "en" ? "Fragrance profile" : "بطاقة العطر", exact: true });
    await expect(profile).toBeVisible();
    await expect(profile.locator("dl > div")).toHaveCount(4);
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
    for (const name of locale === "en" ? ["About this fragrance", "Selected notes"] : ["عن هذا العطر", "نفحات مختارة"]) {
      const trigger = article.getByRole("button", { name, exact: true });
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      const contentId = await trigger.getAttribute("aria-controls");
      await page.evaluate(() => document.documentElement.removeAttribute("data-accordion-motion"));
      await trigger.click();
      await expect(page.locator("html")).toHaveAttribute("data-accordion-motion", /accordion-up/);
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await expect(page.locator(`[id="${contentId}"]`)).toBeHidden();
      await trigger.click();
      await expect(page.locator("html")).toHaveAttribute("data-accordion-motion", /accordion-down/);
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    }
  }
});
