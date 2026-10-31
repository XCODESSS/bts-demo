import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

for (const locale of ["en", "ar"] as const) {
  for (const saved of ["atelier", "gallery", "linen"] as const) {
    test(`${locale} design menu omits retired options with ${saved} saved`, async ({ page }) => {
      const d = getDictionary(locale);
      await page.addInitScript(id => localStorage.setItem("bts-demo-design", id), saved);
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("data-design", saved);
      const trigger = page.getByRole("button", { name: d.chooseDesign, exact: true });
      const savedNames = { atelier: d.designAtelier, gallery: d.designGallery, linen: d.designLinen };
      await expect(trigger).toContainText(savedNames[saved]);
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: d.designTitle, exact: true });
      await expect(dialog.locator(".design-card")).toHaveCount(6);
      for (const name of [d.designGallery, d.designLinen]) {
        await expect(dialog.getByRole("button", { name: `${d.previewDesign} ${name}`, exact: true })).toHaveCount(0);
      }
      for (const name of [d.designAtelier, d.designSalon, d.designGilded, d.designNoir, d.designSouk, d.designVerdant]) {
        await expect(dialog.getByRole("button", { name: `${d.previewDesign} ${name}`, exact: true })).toBeAttached();
      }
      await dialog.getByRole("button", { name: `${d.previewDesign} ${d.designSalon}`, exact: true }).click();
      await expect(dialog).not.toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("data-design", "salon");
      await expect(trigger).toContainText(d.designSalon);
    });
  }
}
