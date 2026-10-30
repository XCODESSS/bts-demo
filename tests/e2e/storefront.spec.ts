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

test("hero has no pause button and its only motion respects reduced-motion preferences", async ({ page }) => {
  const d = getDictionary("en");
  const hero = page.getByRole("region", { name: d.storefrontTitle, exact: true });
  const bottle = () => hero.getByRole("figure").locator("img");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  expect(await bottle().evaluate((el) => getComputedStyle(el).animationName)).toBe("bottle-in");
  await expect(hero.getByRole("button", { name: /Pause animations|Resume animations/ })).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(await bottle().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  expect(await hero.evaluate((el) => el.getAnimations({ subtree: true }).some((a) => a.playState === "running"))).toBe(false);
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

test("the supplied BS logo identifies the brand in the header and footer without retyped artwork", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("banner").locator('img[src*="brand%2Flogo.png"], img[src="/brand/logo.png"]')).toHaveCount(1);
  await expect(page.getByRole("contentinfo").locator('img[src*="brand%2Flogo.png"], img[src="/brand/logo.png"]')).toHaveCount(1);
  await expect(page.getByRole("banner").getByRole("link", { name: "Beyond the Space Perfume — Home", exact: true })).toBeVisible();
});

test("homepage opens and closes on logo green with a warm discovery band between", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en");
  await loadHomeSections(page);
  await expect(page.getByRole("region", { name: d.storefrontTitle, exact: true }))
    .toHaveCSS("background-color", "rgb(7, 54, 60)");
  await expect(page.getByRole("region", { name: d.collectionsTitle, exact: true }))
    .toHaveCSS("background-color", "rgb(237, 228, 211)");
  await expect(page.getByRole("region", { name: d.personalTitle, exact: true }))
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
  const d = getDictionary("ar");
  await page.goto("/ar");
  await page.getByRole("region", { name: d.spotlightLabel, exact: true })
    .getByRole("link", { name: d.spotlightBrowse, exact: true }).click();
  await expect(page).toHaveURL(/\/ar\/catalogue\?note=lemon$/);
  await expect(page.getByTestId("product-card").first()).toBeVisible();
  await page.goto("/ar");
  await revealHomeSection(page, "houses");
  const brands = page.getByRole("region", { name: d.brandsTitle, exact: true });
  await brands.getByText(d.allHousesAction, { exact: true }).click();
  await page.getByRole("dialog", { name: d.brandsTitle, exact: true }).getByRole("link", { name: "Diptyque", exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("brand")).toBe("Diptyque");
  await expect(page.getByTestId("product-card").first()).toContainText("Diptyque");
  await page.goto("/ar");
  await revealHomeSection(page, "for-you");
  await page.getByRole("region", { name: d.categoriesTitle, exact: true })
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
  await header.getByRole("button", { name: "ابحث في الكتالوج", exact: true }).click();
  await expect(page).toHaveURL(/\/ar\/catalogue\?q=$/);
  await expect(page.getByTestId("product-card")).toHaveCount(24);
});

test("hero missing photo fails safely", async ({ page }) => {
  await page.route("**/perfumes/*.webp", (route) => route.abort());
  await page.goto("/en");
  const preview = page.getByRole("region", { name: getDictionary("en").spotlightLabel, exact: true });
  await expect(preview.getByText("Photograph unavailable", { exact: true })).toHaveCount(1);
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
  const d = getDictionary("en");
  await page.goto("/en");
  const collections = page.getByRole("region", { name: d.collectionsTitle, exact: true });
  await expect(collections.getByRole("tab", { name: "Fragrance Note", exact: true })).toHaveAttribute("aria-selected", "true");
  await collections.getByRole("link", { name: "Lemon", exact: true }).click();
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

test("the single design uses the logo green and gold on a light page", async ({ page }) => {
  await page.goto("/en");
  const tokens = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    return { green: style.getPropertyValue("--brand-green").trim(), gold: style.getPropertyValue("--brand-gold").trim() };
  });
  expect(tokens).toEqual({ green: "#07363c", gold: "#d4b991" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(251, 250, 246)");
  await expect(page.getByRole("contentinfo")).toHaveCSS("background-color", "rgb(7, 54, 60)");
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

test("hero uses current products and real counts, and leads to the collection", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(d.storefrontTitle);
  const hero = page.getByRole("region", { name: d.storefrontTitle, exact: true });
  await expect(hero.getByRole("definition")).toHaveText(["100", "40"]);
  const product = hero.getByRole("figure").getByRole("link").first();
  await expect(product).toHaveAttribute("href", /^\/en\/perfumes\//);
  const imageUrl = new URL((await product.locator("img").getAttribute("src"))!, page.url());
  expect(imageUrl.origin).toBe(new URL(page.url()).origin);
  expect(imageUrl.pathname).toMatch(/^\/perfumes\/.+\.webp$/);
  await page.getByRole("main").getByRole("link", { name: d.campaignAction, exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(24);
});
