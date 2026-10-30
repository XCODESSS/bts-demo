import { expect, type Locator, type Page } from "@playwright/test";

export async function expectMinSize(locator: Locator, minimum: number) {
  await expect(locator).toBeVisible();
  expect(await locator.evaluate(el => parseFloat(getComputedStyle(el).fontSize)))
    .toBeGreaterThanOrEqual(minimum);
}

/** Compare resolved Next font families, whose generated names are build-specific. */
export async function expectFamily(locator: Locator, variable: string) {
  const result = await locator.evaluate((el, name) => {
    const first = (value: string) => value.split(",")[0].trim().replace(/^["']|["']$/g, "");
    return {
      actual: first(getComputedStyle(el).fontFamily),
      expected: first(getComputedStyle(document.documentElement).getPropertyValue(name)),
    };
  }, variable);
  expect(result.expected).not.toBe("");
  expect(result.actual).toBe(result.expected);
}

export async function expectDocumentFits(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
}
