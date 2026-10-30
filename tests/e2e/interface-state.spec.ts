import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

test("root negotiation preserves queries and explicit routes remain authoritative", async ({ request }) => {
  for (const [language, expected] of [["ar-AE,ar;q=0.9,en;q=0.5", "ar"], ["en-US", "en"], ["fr-FR", "en"], ["", "en"]]) {
    const response = await request.get("/?discovery=families", { headers: { "accept-language": language }, maxRedirects: 0 });
    expect(response.status()).toBe(307);
    const target = new URL(response.headers().location, response.url());
    expect(target.pathname).toBe(`/${expected}`);
    expect(target.searchParams.get("discovery")).toBe("families");
    expect(response.headers().vary).toContain("Accept-Language");
    expect(response.headers()["cache-control"]).toBe("private, no-store");
  }
  for (const route of ["/en/catalogue", "/ar", "/brand/logo.png", "/en/admin/login"]) {
    const response = await request.get(route, { headers: { "accept-language": "ar" }, maxRedirects: 0 });
    expect(response.status()).toBe(200);
  }
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale} product disclosures preserve return context, history and locale`, async ({ page }) => {
    const d = getDictionary(locale);
    await page.goto(`/${locale}/perfumes/diptyque-philosykos-p0170?return=note%3Dvanilla&details=notes`);
    const description = page.getByRole("article", { name: "Philosykos", exact: true }).getByRole("button", { name: d.details, exact: true });
    await expect(description).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("button", { name: d.notes, exact: true })).toHaveAttribute("aria-expanded", "true");
    await description.click();
    await page.goBack();
    await expect(description).toHaveAttribute("aria-expanded", "false");
    await page.goForward();
    await expect(description).toHaveAttribute("aria-expanded", "true");
    await page.reload();
    await expect(description).toHaveAttribute("aria-expanded", "true");
    expect(new URL(page.url()).searchParams.get("return")).toBe("note=vanilla");
    await description.click();
    await page.getByRole("link", { name: locale === "en" ? "العربية" : "English", exact: true }).click();
    const other = getDictionary(locale === "en" ? "ar" : "en");
    await expect(page.getByRole("button", { name: other.details, exact: true })).toHaveAttribute("aria-expanded", "false");
  });

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
    // Closed DOM retains its last topic throughout CSS exit, not Contact copy.
    await expect(page.locator("#footer-information-title")).toHaveText(d.shippingInfo);
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
