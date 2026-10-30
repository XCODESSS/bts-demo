import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { expectDocumentFits, expectFamily, expectMinSize } from "./helpers/typography";

test("card facts and catalogue controls remain readable on a narrow phone", async ({ page }) => {
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

test("phone filters report the active count and close back onto the results", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const d = getDictionary("en");
  await page.goto("/en/catalogue?brand=Dior&gender=women");
  const toggle = page.locator('button[aria-controls="catalogue-filters"]');
  await expect(toggle).toHaveAccessibleName(d.filters);
  await expect(toggle).toContainText("2");
  await toggle.click();
  const show = page.getByRole("button", { name: `${d.show} 0 ${d.results}`, exact: true });
  await expect(show).toBeVisible();
  await page.getByRole("combobox", { name: d.gender, exact: true }).selectOption("");
  await expect(page.getByRole("button", { name: `${d.show} 1 ${d.resultSingular}`, exact: true })).toBeVisible();
  await page.getByRole("button", { name: `${d.show} 1 ${d.resultSingular}`, exact: true }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await expect(page.getByRole("combobox")).toHaveCount(0);
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale} house index stays readable and leads to real filters`, async ({ page }) => {
    const d = getDictionary(locale);
    await page.goto(`/${locale}#houses`);
    const houses = page.getByRole("region", { name: d.brandsTitle, exact: true });
    await expect(houses.getByRole("listitem")).toHaveCount(12);
    const dior = houses.getByRole("link", { name: /^Dior\b/ });
    await expect(dior).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expectMinSize(dior.locator("bdi"), 24);
    await expectMinSize(dior.locator("span").first(), 14);
    await dior.click();
    await expect.poll(() => new URL(page.url()).searchParams.get("brand")).toBe("Dior");
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await expect(page.getByTestId("product-card")).toContainText("Spice Blend");
  });

  test(`${locale} four-card rows form a two by two tablet grid`, async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto(`/${locale}/perfumes/dior-spice-blend-p0168`);
    const tops = await page.getByRole("region", { name: getDictionary(locale).related, exact: true })
      .getByTestId("product-card")
      .evaluateAll(cards => cards.map(el => Math.round(el.getBoundingClientRect().top)));
    expect(tops).toHaveLength(4);
    expect(new Set(tops).size).toBe(2);
    expect(tops.filter(top => top === tops[0])).toHaveLength(2);
  });

  test(`${locale} phone cards keep complete names in a two-column grid`, async ({ page }) => {
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/${locale}/catalogue`);
      const tops = await page.getByTestId("product-card").evaluateAll(cards =>
        cards.slice(0, 2).map(el => Math.round(el.getBoundingClientRect().top)));
      expect(tops[0]).toBe(tops[1]);
      await expectDocumentFits(page);
      await page.goto(`/${locale}/catalogue?q=powerfully`);
      const longTitle = page.getByTestId("product-card").getByRole("heading");
      await expect(longTitle).toHaveText("Emporio Armani Stronger With You Powerfully");
      expect(await longTitle.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
      expect(await longTitle.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      await expectMinSize(longTitle, 16);
      await expectDocumentFits(page);
    }
  });

  test(`${locale} official product titles stay complete, readable and unclipped`, async ({ page }) => {
    await page.goto(`/${locale}/perfumes/giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042`);
    await page.evaluate(() => document.fonts.ready);
    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toHaveText("Emporio Armani Stronger With You Powerfully");
    for (const width of [320, 360, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expectFamily(title.locator("bdi"), "--font-bodoni");
      await expectMinSize(title, 30);
      const dimensions = await title.evaluate(el => ({
        width: el.clientWidth, contentWidth: el.scrollWidth,
        height: el.clientHeight, contentHeight: el.scrollHeight,
        overflow: getComputedStyle(el).overflow,
      }));
      expect(dimensions.contentWidth).toBeLessThanOrEqual(dimensions.width + 1);
      expect(dimensions.contentHeight).toBeLessThanOrEqual(dimensions.height + 1);
      expect(dimensions.overflow).not.toBe("hidden");
    }
  });

  for (const width of [360, 390]) {
    // Phones lead with the photograph. The enquiry stays one tap away: a bottom bar is in the
    // opening viewport whenever WhatsApp is configured, and hides while the in-page action is visible.
    test(`${locale}/${width} phone product pages keep the enquiry reachable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const d = getDictionary(locale);
      for (const [slug, name] of [
        ["dior-spice-blend-p0168", "Spice Blend"],
        ["giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042", "Emporio Armani Stronger With You Powerfully"],
      ]) {
        await page.goto(`/${locale}/perfumes/${slug}`);
        await page.evaluate(() => document.fonts.ready);
        const article = page.getByRole("article", { name, exact: true });
        await expect(article.getByRole("heading", { level: 1 })).toHaveText(name);
        const photo = article.getByRole("button", { name: d.zoomImage, exact: true });
        await expect(photo).toBeInViewport();
        const link = article.getByRole("link", { name: d.enquire, exact: true });
        if (await link.count()) {
          const bar = page.locator("[data-enquiry-bar]");
          const shortcut = bar.getByRole("link", { name: d.enquireShort, exact: true });
          await expect(shortcut).toBeInViewport({ ratio: 1 });
          expect(await shortcut.getAttribute("href")).toBe(await link.getAttribute("href"));
          await link.scrollIntoViewIfNeeded();
          await expect(bar).toHaveAttribute("data-visible", "false");
          await expect(bar).toHaveAttribute("inert", "");
        } else {
          await expect(article.getByRole("button", { name: d.enquire, exact: true })).toBeDisabled();
          await expect(article.getByText(d.disabled, { exact: true })).toHaveCount(1);
          await expect(page.locator("[data-enquiry-bar]")).toHaveCount(0);
        }
        await expectDocumentFits(page);
      }
    });
  }
}
