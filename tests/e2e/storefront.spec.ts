import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { getDictionary } from "../../src/i18n/dictionaries";
import { loadHomeSections, revealHomeSection } from "./helpers/home-sections";

test("cards show stable, clearly labelled demo discounts that match product details", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/catalogue`);
    const card = page.getByTestId("product-card").first();
    const price = card.getByTestId("demo-price");
    await expect(price.getByText(locale === "en" ? "Demo price" : "سعر تجريبي", { exact: true })).toBeVisible();
    const original = await price.locator("del").innerText();
    const discounted = await price.locator("strong").innerText();
    expect(original).not.toBe(discounted);
    await expect(card.getByText(locale === "en" ? "−30%" : "−٣٠٪؜", { exact: true })).toBeVisible();
    const productName = await card.getByRole("heading").innerText();
    const photograph = await card.locator("img").getAttribute("src");
    await card.getByRole("link").click();
    await expect(page.getByRole("article", { name: productName, exact: true }).getByRole("button", {
      name: locale === "en" ? "Enlarge Product Photograph" : "تكبير صورة العطر", exact: true,
    }).locator("img")).toHaveAttribute("src", photograph!);
    const detailPrice = page.getByRole("article", { name: productName, exact: true }).getByTestId("demo-price");
    await expect(detailPrice.locator("del")).toHaveText(original);
    await expect(detailPrice.locator("strong")).toHaveText(discounted);
    await expect(page.getByText(locale === "en"
      ? "Sample prices and discounts for this demo only. Confirm the actual price and availability on WhatsApp."
      : "الأسعار والخصومات المعروضة تجريبية فقط. يرجى تأكيد السعر الفعلي والتوفر عبر واتساب.", { exact: true })).toBeVisible();
    await page.reload();
    await expect(detailPrice.locator("strong")).toHaveText(discounted);
  }
});

test("hero motion has no pause button and respects reduced-motion preferences", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const campaign = page.getByRole("region", { name: "Fragrances in Focus", exact: true });
  const running = () => campaign.evaluate((element) => element.getAnimations({ subtree: true }).some((animation) => animation.playState === "running"));
  await expect.poll(running).toBe(true);
  await expect(campaign.getByRole("button", { name: /Pause animations|Resume animations/ })).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(running).toBe(false);
  await expect(campaign.getByRole("button", { name: "Pause animations", exact: true })).toHaveCount(0);
});

test("product photograph zoom supports Escape and focus restoration in both languages", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/perfumes/xerjoff-torino21-p0574`);
    const name = locale === "en" ? "Enlarge Product Photograph" : "تكبير صورة العطر";
    const trigger = page.getByRole("button", { name, exact: true });
    await trigger.click();
    await expect(page.getByRole("dialog", { name, exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name, exact: true })).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
});

test("campaign displays the supplied BS logo instead of a typed brand name", async ({ page }) => {
  await page.goto("/en");
  const campaign = page.getByRole("region", { name: "Fragrances in Focus", exact: true });
  await expect(page.getByRole("main").locator('img[src="/brand/logo.png"]:visible'))
    .toHaveCount(1);
  await expect(campaign.getByText("Beyond the Space", { exact: true })).toHaveCount(0);
});

test("homepage uses substantial gold and green section backgrounds", async ({ page }) => {
  await page.goto("/en");
  await loadHomeSections(page);
  await expect(page.getByRole("region", { name: "Shop Perfume Collections", exact: true }))
    .toHaveCSS("background-color", "rgb(234, 215, 185)");
  await expect(page.getByRole("region", { name: "Explore. Discover. Enquire.", exact: true }))
    .toHaveCSS("background-color", "rgb(212, 185, 145)");
  await expect(page.getByRole("region", { name: "The Best Fragrance Is Personal.", exact: true }))
    .toHaveCSS("background-color", "rgb(7, 54, 60)");
});

test("discovery tabs support keyboard selection in English and Arabic", async ({ page }) => {
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}`);
    const tabs = page.getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("End");
    await expect(tabs.last()).toBeFocused();
    await expect(tabs.last()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press(locale === "ar" ? "ArrowRight" : "ArrowLeft");
    await expect(tabs.first()).toBeFocused();
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await page.keyboard.press("Home");
    await expect(tabs.first()).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel").getByRole("link").first()).toBeFocused();
  }
});

test("Arabic notes, brand directory and gender cards open real filtered results", async ({ page }) => {
  await page.goto("/ar");
  await page.getByRole("region", { name: "تسوّق مجموعات العطور", exact: true })
    .getByRole("link", { name: "الليمون", exact: true }).click();
  await page.getByRole("link", { name: "استكشف العطور المطابقة", exact: true }).click();
  await expect(page).toHaveURL(/\/ar\/catalogue\?note=lemon$/);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
  await page.goto("/ar");
  await revealHomeSection(page, "houses");
  const brands = page.getByRole("region", { name: "تسوّق حسب دار العطور", exact: true });
  await brands.getByText("عرض جميع دور العطور", { exact: true }).click();
  await page.getByRole("dialog", { name: "تسوّق حسب دار العطور", exact: true }).getByRole("link", { name: "Diptyque", exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("brand")).toBe("Diptyque");
  await expect(page.getByTestId("product-card").first()).toContainText("Diptyque");
  await page.goto("/ar");
  await revealHomeSection(page, "for-you");
  await page.getByRole("region", { name: "اعثر على عطر يناسبك", exact: true })
    .getByRole("link", { name: "نسائي", exact: true }).click();
  await expect(page).toHaveURL(/gender=women/);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
});

test("Arabic header search and empty search keep safe catalogue routes", async ({ page }) => {
  await page.goto("/ar");
  const header = page.getByRole("banner");
  await header.getByRole("searchbox", { name: "ابحث في المجموعة", exact: true }).fill("armaf iconic");
  await header.getByRole("button", { name: "ابحث في الكتالوج", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  const catalogue = page.getByRole("main");
  await catalogue.getByRole("searchbox", { name: getDictionary("ar").search, exact: true }).fill("");
  await catalogue.getByRole("button", { name: getDictionary("ar").searchButton, exact: true }).click();
  await expect(page).toHaveURL(/\/ar\/catalogue$/);
  await expect(page.getByTestId("product-card")).toHaveCount(12);
});

test("campaign missing photos fail safely", async ({ page }) => {
  await page.route("**/perfumes/*.webp", (route) => route.abort());
  await page.goto("/en");
  const campaign = page.getByRole("region", { name: "Fragrances in Focus", exact: true });
  await expect(campaign.getByText("Photograph unavailable", { exact: true })).toHaveCount(3);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("green and gold storefront is responsive, bilingual and usable with reduced motion", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "This case explicitly covers four viewport widths.");
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  mkdirSync("artifacts/screenshots", { recursive: true });
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const locale of ["en", "ar"]) {
      await page.goto(`/${locale}`);
      await loadHomeSections(page);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      for (const image of await page.locator("img:visible").all()) await image.scrollIntoViewIfNeeded();
      await expect.poll(() => page.locator("img:visible").evaluateAll((images) => images.every((image) =>
        image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `artifacts/screenshots/retail-${locale}-${width}.png`, fullPage: true });
      await expect.poll(() => page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === "running").length)).toBe(0);
    }
  }
  expect(errors).toEqual([]);
});

test("discovery tabs lead to actual note and family results", async ({ page }) => {
  await page.goto("/en");
  const collections = page.getByRole("region", { name: "Shop Perfume Collections", exact: true });
  await expect(collections.getByRole("tab", { name: "Fragrance Note", exact: true })).toHaveAttribute("aria-selected", "true");
  await collections.getByRole("link", { name: "Lemon", exact: true }).click();
  await collections.getByRole("link", { name: "Explore Matching Fragrances", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue\?note=lemon$/);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
  await page.goto("/en");
  const families = collections.getByRole("tab", { name: "Fragrance Family", exact: true });
  await families.click();
  await expect(families).toHaveAttribute("aria-selected", "true");
  await collections.getByRole("link", { name: "Woody", exact: true }).click();
  await expect(page).toHaveURL(/family=woody/);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
});

test("all three designs use logo green and gold on a light page", async ({ page }) => {
  await page.goto("/en");
  for (const name of ["Botanical Atelier", "Modern Gallery", "Linen Boutique"]) {
    await page.getByRole("button", { name: "Choose Design", exact: true }).click();
    await page.getByRole("button", { name: `Preview ${name}`, exact: true }).click();
    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return { green: style.getPropertyValue("--brand-green").trim(), gold: style.getPropertyValue("--brand-gold").trim() };
    });
    expect(tokens).toEqual({ green: "#07363c", gold: "#d4b991" });
    const campaign = page.getByRole("region", { name: "Fragrances in Focus", exact: true });
    await expect(name === "Botanical Atelier" ? campaign.locator("..") : campaign)
      .toHaveCSS("background-color", "rgb(7, 54, 60)");
  }
});

test("header search starts a fresh real catalogue query", async ({ page }) => {
  await page.goto("/en/perfumes/xerjoff-torino21-p0574?return=brand%3DBurberry");
  const header = page.getByRole("banner");
  await header.getByRole("searchbox", { name: "Search the Collection", exact: true }).fill("armaf iconic");
  await header.getByRole("button", { name: "Search the Catalogue", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue\?q=armaf\+iconic$/);
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expect(page.getByTestId("product-card")).toContainText("Club de Nuit Iconic");
});

test("retail campaign uses current products and leads to the collection", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Discover Your Next Fragrance.");
  const campaign = page.getByRole("region", { name: "Fragrances in Focus", exact: true });
  await expect(campaign.getByRole("link")).toHaveCount(3);
  for (const link of await campaign.getByRole("link").all()) {
    await expect(link).toHaveAttribute("href", /^\/en\/perfumes\//);
    const imageUrl = new URL((await link.locator("img").getAttribute("src"))!, page.url());
    expect(imageUrl.origin).toBe(new URL(page.url()).origin);
    expect(imageUrl.pathname).toMatch(/^\/perfumes\/.+\.webp$/);
  }
  await page.getByRole("main").getByRole("link", { name: "Explore Collection", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(12);
});
