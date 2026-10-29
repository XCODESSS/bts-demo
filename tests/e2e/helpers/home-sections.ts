import { expect, type Page } from "@playwright/test";

/** Scroll real, server-rendered sections into view; never force application state. */
export async function revealHomeSection(page: Page, id: string) {
  const section = page.locator(`[data-scroll-section][id="${id}"]`);
  await section.evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(section).toBeInViewport();
}

export async function loadHomeSections(page: Page) {
  for (const section of await page.locator("[data-scroll-section]").all()) {
    await section.evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "start" }));
    await expect(section).toBeInViewport();
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
}
