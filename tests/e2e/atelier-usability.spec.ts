import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { expectDocumentFits, expectMinSize } from "./helpers/typography";

test("Atelier card facts and catalogue controls remain readable on a narrow phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  const d = getDictionary("en");
  await page.goto("/en/catalogue?brand=Burberry");
  const card = page.getByTestId("product-card").first();
  await expectMinSize(card.getByRole("heading"), 16);
  await expectMinSize(card.getByTestId("demo-price").locator("small"), 14);
  await expectMinSize(page.getByRole("searchbox", { name: d.search, exact: true }), 16);
  const filter = page.locator('button[aria-controls="catalogue-filters"]');
  await expectMinSize(filter, 14);
  await filter.click();
  for (const control of await page.getByRole("combobox").all()) await expectMinSize(control, 16);
  for (const control of [filter, page.getByRole("button", { name: d.searchButton, exact: true }), page.getByRole("button", { name: `${d.remove} Burberry`, exact: true })]) {
    const box = await control.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
  await expectDocumentFits(page);
});

for (const locale of ["en", "ar"] as const) {
  test(`Atelier ${locale} houses stay readable and lead to real filters`, async ({ page }) => {
    const d = getDictionary(locale);
    await page.goto(`/${locale}#houses`);
    const houses = page.getByRole("region", { name: d.brandsTitle, exact: true });
    await expect(houses.getByRole("link")).toHaveCount(8);
    const dior = houses.getByRole("link", { name: "Dior", exact: true });
    await expect(dior).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expectMinSize(dior.locator("bdi"), 20);
    await expectMinSize(dior.locator("span").first(), 14);
    await dior.click();
    await expect.poll(() => new URL(page.url()).searchParams.get("brand")).toBe("Dior");
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await expect(page.getByTestId("product-card")).toContainText("Spice Blend");
  });

  test(`Atelier ${locale} related products form a two by two tablet grid`, async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto(`/${locale}/perfumes/dior-spice-blend-p0168`);
    const tops = await page.getByRole("heading", { name: getDictionary(locale).related, exact: true })
      .locator("xpath=ancestor::section[1]").getByTestId("product-card")
      .evaluateAll(cards => cards.map(el => Math.round(el.getBoundingClientRect().top)));
    expect(tops).toHaveLength(4);
    expect(new Set(tops).size).toBe(2);
    expect(tops.filter(top => top === tops[0])).toHaveLength(2);
  });

  test(`Atelier ${locale} phone cards put full names beside their photographs`, async ({ page }) => {
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/${locale}/catalogue`);
      const card = page.getByTestId("product-card").first();
      const image = await card.locator("img").boundingBox();
      const heading = await card.getByRole("heading").boundingBox();
      expect(image).not.toBeNull();
      expect(heading).not.toBeNull();
      if (locale === "en") expect(image!.x + image!.width / 2).toBeLessThan(heading!.x);
      else expect(image!.x + image!.width / 2).toBeGreaterThan(heading!.x + heading!.width);
      expect(heading!.y).toBeLessThan(image!.y + image!.height);
      await expectDocumentFits(page);
      await page.goto(`/${locale}/catalogue?q=powerfully`);
      const longTitle = page.getByTestId("product-card").getByRole("heading");
      await expect(longTitle).toHaveText("Emporio Armani Stronger With You Powerfully");
      expect(await longTitle.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
      await expectMinSize(longTitle, 16);
      await expectDocumentFits(page);
    }
  });

  for (const width of [360, 390]) {
    test(`Atelier ${locale}/${width} exposes complete product enquiries before the large gallery`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      for (const [slug, name] of [
        ["dior-spice-blend-p0168", "Spice Blend"],
        ["xerjoff-torino21-p0574", "Torino21"],
        ["giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042", "Emporio Armani Stronger With You Powerfully"],
      ]) {
        await page.goto(`/${locale}/perfumes/${slug}`);
        await page.evaluate(() => document.fonts.ready);
        const article = page.getByRole("article", { name, exact: true });
        const d = getDictionary(locale);
        await expect(article.getByRole("heading", { level: 1 })).toHaveText(name);
        const action = article.getByRole("link", { name: d.enquire, exact: true }).or(article.getByRole("button", { name: d.enquire, exact: true }));
        await expect(action).toBeInViewport({ ratio: 1 });
        const photo = article.getByRole("button", { name: d.zoomImage, exact: true });
        expect(await action.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(await photo.evaluate(el => el.getBoundingClientRect().top));
        await expectDocumentFits(page);
      }
    });
  }
}
