import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} information supports direct entry and history without losing filters`, async ({ page }) => {
    const d = getDictionary(locale);
    await page.goto(`/${locale}/catalogue?brand=Dior&info=shipping`);
    const dialog = page.getByRole("dialog", { name: d.shippingInfo, exact: true });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect.poll(() => new URL(page.url()).searchParams.get("info")).toBeNull();
    expect(new URL(page.url()).searchParams.get("brand")).toBe("Dior");
    const trigger = page.getByRole("contentinfo").getByRole("button", { name: d.shippingInfo, exact: true });
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.goBack();
    await expect(dialog).not.toBeVisible();
    await page.goForward();
    await expect(dialog).toBeVisible();
    await page.getByRole("button", { name: d.closeInformation, exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await page.goto(`/${locale}?info=invalid`);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test(`${locale} discovery selection survives history, reload and language switching`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const d = getDictionary(locale);
    await page.goto(`/${locale}?discovery=families#scents`);
    const families = page.getByRole("tab", { name: d.family, exact: true });
    const notes = page.getByRole("tab", { name: d.noteFilter, exact: true });
    await expect(families).toHaveAttribute("aria-selected", "true");
    await notes.click();
    await expect(notes).toHaveAttribute("aria-selected", "true");
    expect(new URL(page.url()).searchParams.has("discovery")).toBe(false);
    const top = await page.evaluate(() => scrollY);
    await page.goBack();
    await expect(families).toHaveAttribute("aria-selected", "true");
    expect(Math.abs(await page.evaluate(() => scrollY) - top)).toBeLessThan(3);
    await page.goForward();
    await expect(notes).toHaveAttribute("aria-selected", "true");
    await families.click();
    await page.reload();
    await expect(families).toHaveAttribute("aria-selected", "true");
    await page.getByRole("link", { name: locale === "en" ? "العربية" : "English", exact: true }).click();
    const other = getDictionary(locale === "en" ? "ar" : "en");
    await expect(page.getByRole("tab", { name: other.family, exact: true })).toHaveAttribute("aria-selected", "true");
    await page.goto(`/${locale}?discovery=invalid#scents`);
    await expect(notes).toHaveAttribute("aria-selected", "true");
    await notes.focus();
    await page.keyboard.press("End");
    await expect(families).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(notes).toHaveAttribute("aria-selected", "true");
  });
}
