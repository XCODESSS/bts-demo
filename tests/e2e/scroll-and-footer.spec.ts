import { expect, test } from "@playwright/test";
import { revealHomeSection } from "./helpers/home-sections";

test("server-rendered sections keep stable geometry while product photographs lazy-load", async ({ page }) => {
  await page.goto("/en");
  await page.evaluate(() => document.fonts.ready);
  const section = page.locator("#customer-experiences");
  const height = await section.evaluate((element) => element.getBoundingClientRect().height);
  await expect(page.getByRole("region", { name: "Customer Experiences", exact: true })).toHaveCount(1);
  await expect(page.locator('#featured img').first()).toHaveAttribute("loading", "lazy");
  await revealHomeSection(page, "customer-experiences");
  expect(Math.abs((await section.evaluate((element) => element.getBoundingClientRect().height)) - height)).toBeLessThan(1);
  await expect(section.locator('[data-slot="skeleton"]')).toHaveCount(0);
  await expect(section.locator('[data-slot="card"]')).toHaveCount(3);
  await expect(section.getByText("Sample review", { exact: true })).toHaveCount(3);
  await expect(section.getByText("Demo testimonials for layout preview only. These are not verified customer reviews.", { exact: true })).toBeVisible();
  await revealHomeSection(page, "approach");
  await expect(page.getByRole("region", { name: "The Best Fragrance Is Personal.", exact: true }).getByRole("heading", { level: 2 })).toContainText("100 fragrances.");
});

test("shadcn scent tabs highlight on hover and smoothly slide the selected green pill in both directions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}`);
    await revealHomeSection(page, "scents");
    const list = page.getByRole("tablist");
    await expect(list).toHaveAttribute("data-indicator-ready", "true");
    const indicator = list.locator('[data-slot="tabs-indicator"]');
    const initial = await indicator.evaluate((element) => element.getBoundingClientRect().x);
    const target = list.getByRole("tab").last();
    await target.hover();
    await expect.poll(() => target.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
    await target.click();
    await expect(target).toHaveAttribute("aria-selected", "true");
    await expect.poll(() => list.evaluate((element) => {
      const pill = element.querySelector('[data-slot="tabs-indicator"]')!;
      const selected = element.querySelector('[data-state="active"]')!;
      return Math.abs(pill.getBoundingClientRect().x - selected.getBoundingClientRect().x);
    })).toBeLessThanOrEqual(1.5);
    expect(Math.abs((await indicator.evaluate((element) => element.getBoundingClientRect().x)) - initial)).toBeGreaterThan(10);
    expect(await indicator.evaluate((element) => getComputedStyle(element).transitionDuration)).toContain("0.38s");
  }
});

test("dark footer links the approved Instagram and opens honest shipping information", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}`);
    const footer = page.getByRole("contentinfo");
    await expect(footer).toHaveCSS("background-color", "rgb(7, 54, 60)");
    await expect(footer.getByRole("link", { name: "@beyond_the_space_perfumes", exact: true }))
      .toHaveAttribute("href", "https://www.instagram.com/beyond_the_space_perfumes/");
    const shipping = footer.getByRole("button", { name: locale === "en" ? "Shipping Information" : "معلومات الشحن", exact: true });
    await shipping.click();
    const dialog = page.getByRole("dialog", { name: locale === "en" ? "Shipping Information" : "معلومات الشحن", exact: true });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(locale === "en" ? "must be confirmed with the store" : "يرجى تأكيد");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(shipping).toBeFocused();
  }
});

test("the complete catalogue remains accessible when JavaScript is disabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/en");
    await expect(page.getByTestId("product-card")).toHaveCount(8);
    await expect(page.getByRole("region", { name: "Customer Experiences", exact: true })).toHaveCount(1);
    await page.getByRole("main").getByRole("link", { name: "View the Collection", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/catalogue$/);
    await expect(page.getByTestId("product-card")).toHaveCount(12);
  } finally { await context.close(); }
});
