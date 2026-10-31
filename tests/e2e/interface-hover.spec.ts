import { expect, test, type Locator } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

test("header brand text stays un-underlined on hover", async ({ page }) => {
  await page.goto("/en");
  const brand = page.getByRole("banner").getByRole("link", { name: "Beyond the Space Perfume — Home", exact: true });
  await brand.hover();
  const wordmark = brand.getByText("Beyond the Space", { exact: false }).first();
  await expect(wordmark).toHaveCSS("text-decoration-line", "none");
  await expect(wordmark.locator("span")).toHaveCSS("text-decoration-line", "none");
  await brand.focus();
  expect(await brand.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe("none");
});

test("navigation and discovery controls visibly respond to hover", async ({ page, isMobile }) => {
  test.skip(isMobile, "Persistent hover is a fine-pointer interaction.");
  const d = getDictionary("en");
  async function feedback(control: Locator) {
    await control.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    const appearance = () => control.evaluate(el => {
      const s = getComputedStyle(el);
      return [s.backgroundColor, s.borderColor, s.textDecorationLine, s.color].join("|");
    });
    const before = await appearance();
    await control.hover();
    await expect.poll(appearance).not.toBe(before);
  }
  await page.goto("/en");
  await feedback(page.getByRole("banner").getByText("Beyond the Space", { exact: false }).first());
  await feedback(page.getByRole("button", { name: d.headerSearchSubmit, exact: true }));
  await feedback(page.locator(".language-switch").first());
  await feedback(page.getByRole("button", { name: d.allHousesAction, exact: true }));
  await page.goto("/en/catalogue?brand=Dior");
  await feedback(page.getByRole("button", { name: d.searchButton, exact: true }));
  await feedback(page.getByRole("combobox", { name: d.brand, exact: true }));
  await feedback(page.getByRole("button", { name: `${d.remove} Dior`, exact: true }));
  await feedback(page.getByRole("button", { name: d.clear, exact: true }));
  await page.goto("/en/perfumes/diptyque-philosykos-p0170");
  await feedback(page.getByRole("link", { name: d.back, exact: true }));
  await feedback(page.getByRole("navigation", { name: d.breadcrumbs }).getByRole("link").first());
  await feedback(page.getByRole("link", { name: d.additionalInfo, exact: true }));
  await feedback(page.getByRole("button", { name: d.details, exact: true }));
  await feedback(page.getByRole("article", { name: "Philosykos", exact: true }).getByRole("link", { name: "Woody", exact: true }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: d.menu, exact: true }).click();
  await feedback(page.getByRole("banner").getByRole("link", { name: d.collection, exact: true }));
});
