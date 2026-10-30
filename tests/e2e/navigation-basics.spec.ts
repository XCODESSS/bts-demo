import { expect, test, type Locator } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

for (const locale of ["en", "ar"] as const) {
  test(`${locale} navbar destinations start correctly and do not drift after loading`, async ({ page, isMobile }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const d = getDictionary(locale);
    for (const destination of [
      { label: d.discover, hash: "scents" },
      { label: d.approach, hash: "approach" },
      { label: d.collection, hash: "" },
    ]) {
      await page.goto(`/${locale}/perfumes/diptyque-philosykos-p0170`);
      const header = page.getByRole("banner");
      if (isMobile) await header.getByRole("button", { name: d.menu, exact: true }).click();
      await header.getByRole("link", { name: destination.label, exact: true }).click();
      if (!destination.hash) {
        await expect(page).toHaveURL(new RegExp(`/${locale}/catalogue$`));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
        await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
      } else {
        await expect(page).toHaveURL(new RegExp(`/${locale}#${destination.hash}$`));
        const heading = page.locator(`#${destination.hash} h2`).first();
        await page.evaluate(() => document.fonts.ready);
        const top = () => heading.evaluate((el) => el.getBoundingClientRect().top);
        await expect.poll(top).toBeGreaterThanOrEqual(0);
        await expect.poll(top).toBeLessThan(180);
        const initial = await top();
        // Catch the reported late section-replacement drift, not just the first scroll frame.
        await page.waitForTimeout(800);
        expect(Math.abs((await top()) - initial)).toBeLessThan(3);
      }
      if (isMobile) await expect(header.getByRole("button", { name: d.close, exact: true })).toHaveCount(0);
    }
  });
}

test("discovery tiles are illustrated categories with real counts, never mislabelled bottles", async ({ page }) => {
  await page.goto("/en#scents");
  const section = page.getByRole("region", { name: getDictionary("en").collectionsTitle, exact: true });
  for (const tab of ["Fragrance Note", "Fragrance Family"]) {
    await section.getByRole("tab", { name: tab, exact: true }).click();
    await expect(section.locator('img[src*="/perfumes/"]')).toHaveCount(0);
    const cards = section.getByRole("tabpanel").getByRole("link");
    await expect(cards).toHaveCount(8);
    const ids = await section.locator("[data-scent]").evaluateAll((els) => els.map((el) => el.getAttribute("data-scent")));
    expect(new Set(ids).size).toBe(8);
    for (const card of await cards.all()) {
      await expect(card.getByRole("img")).toHaveAccessibleName(await card.getAttribute("aria-label") || "");
      await expect(card).toContainText(/\d+ fragrances?/);
    }
  }
});

test("perfume houses use a typographic index and a searchable, keyboard-dismissible directory", async ({ page, isMobile }) => {
  await page.goto("/en#houses");
  const brands = page.getByRole("region", { name: getDictionary("en").brandsTitle, exact: true });
  await expect(brands.getByRole("listitem")).toHaveCount(12);
  await expect(brands.getByRole("link", { name: /^Dior\b/ })).toContainText(/1 fragrance$/);
  await expect(brands.locator("details")).toHaveCount(0);
  const trigger = brands.getByRole("button", { name: "View All Perfume Houses", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: getDictionary("en").brandsTitle, exact: true });
  const search = dialog.getByRole("searchbox", { name: "Search Perfume Houses", exact: true });
  if (isMobile) await expect(dialog.getByRole("button", { name: getDictionary("en").closeHouses })).toBeFocused();
  else await expect(search).toBeFocused();
  await page.evaluate(() => document.fonts.ready);
  // Compare resting search geometry, not two frames of the dialog entrance.
  // Actual entry/exit motion has dedicated normal-motion browser coverage.
  await expect.poll(() => dialog.evaluate(el => getComputedStyle(el).transform)).toBe("none");
  const fieldTop = await search.evaluate((el) => el.getBoundingClientRect().top);
  await search.fill("__not_a_house__");
  expect(Math.abs((await search.evaluate((el) => el.getBoundingClientRect().top)) - fieldTop)).toBeLessThan(1);
  await expect(dialog.getByText("No perfume houses match your search.", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Clear Search", exact: true }).click();
  await expect(search).toBeFocused();
  await expect(dialog.getByRole("link")).toHaveCount(40);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await search.fill("stephane");
  await expect(dialog.getByRole("status")).toHaveText("1 perfume house");
  await expect(dialog.getByRole("link")).toHaveCount(1);
  await dialog.getByRole("link", { name: /Stéphane Humbert Lucas/ }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("brand")).toBe("Stéphane Humbert Lucas");
  await expect(page.getByTestId("product-card").first()).toContainText("Stéphane Humbert Lucas");
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});

test("header and hero share aligned gutters while the hero spans the full width", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1880, 1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/en");
    const brand = page.getByRole("banner").getByRole("link", { name: "Beyond the Space Perfume — Home", exact: true });
    const hero = page.getByRole("region", { name: getDictionary("en").storefrontTitle, exact: true });
    const left = (locator: Locator) => locator.evaluate((el) => el.getBoundingClientRect().left);
    expect(Math.abs((await left(brand)) - (await left(hero.getByRole("heading", { level: 1 }))))).toBeLessThan(2);
    expect(await hero.evaluate((el) => Math.abs(el.getBoundingClientRect().width - innerWidth))).toBeLessThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("product cards lift their photograph and discovery tiles turn brand green on hover", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch has no persistent hover interaction.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const product = page.locator("#featured").getByTestId("product-card").first().getByRole("link");
  await product.hover();
  await expect.poll(() => product.locator("img").evaluate((el) => {
    const transform = getComputedStyle(el).transform;
    return transform === "none" ? 0 : new DOMMatrix(transform).m42;
  })).toBeLessThan(-3);
  await page.mouse.move(0, 0);
  await page.getByRole("tab", { name: "Fragrance Family", exact: true }).click();
  const tile = page.getByRole("region", { name: getDictionary("en").collectionsTitle, exact: true }).getByRole("link", { name: "Woody", exact: true });
  await tile.hover();
  await expect.poll(() => tile.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(7, 54, 60)");
});
