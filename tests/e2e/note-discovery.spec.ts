import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { expectDocumentFits } from "./helpers/typography";

// The hero note selector previews one real matching perfume; its choice lives in ?scent=.

test("hero note selector previews an actual matching fragrance", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en");
  const preview = page.getByRole("region", { name: d.spotlightLabel, exact: true });
  const notes = preview.getByRole("navigation", { name: d.spotlightLabel, exact: true });
  await expect(notes.getByRole("link")).toHaveCount(4);
  await expect(preview.getByRole("figure")).toContainText("Torino21");
  const rose = notes.getByRole("link", { name: "Rose", exact: true });
  await rose.focus();
  await page.keyboard.press("Enter");
  await expect(rose).toHaveAttribute("aria-current", "true");
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await expect(preview).toContainText("14 fragrances with Rose");
  await expect(preview.getByRole("link", { name: d.spotlightBrowse, exact: true })).toHaveAttribute("href", "/en/catalogue?note=rose");
  await preview.getByRole("link", { name: d.spotlightBrowse, exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue\?note=rose$/);
  await expect(page.getByRole("status")).toContainText("14 fragrances");
});

test("note state survives history, reload, tabs and language without scroll jumps", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en?scent=rose#scents");
  const preview = page.getByRole("region", { name: d.spotlightLabel, exact: true });
  const notes = preview.getByRole("navigation");
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await page.reload();
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await page.getByRole("tab", { name: d.family, exact: true }).click();
  expect(new URL(page.url()).searchParams.get("scent")).toBe("rose");
  await page.getByRole("tab", { name: d.noteFilter, exact: true }).click();
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await notes.getByRole("link", { name: "Oud", exact: true }).scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await notes.getByRole("link", { name: "Oud", exact: true }).click();
  await expect(preview.getByRole("figure")).toContainText("Haltane");
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThan(2);
  await page.goBack();
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await page.goForward();
  await expect(preview.getByRole("figure")).toContainText("Haltane");
  await page.getByRole("link", { name: "العربية", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("scent")).toBe("oud");
  await expect(page.getByRole("figure")).toContainText("Haltane");
  await page.goto("/en?scent=unknown&discovery=notes#scents");
  await expect(preview.getByRole("figure")).toContainText("Torino21");
  await notes.getByRole("link", { name: "Rose", exact: true }).click();
  expect(new URL(page.url()).hash).toBe("#scents");
  await notes.getByRole("link", { name: "Lemon", exact: true }).click();
  expect(new URL(page.url()).searchParams.has("scent")).toBe(false);
});

test("note choice retains unrelated information state", async ({ page }) => {
  await page.goto("/en?info=contact#scents");
  // Close the native modal without losing unrelated state in the preview update.
  await page.keyboard.press("Escape");
  await page.evaluate(() => history.replaceState(null, "", "/en?info=unrecognized#scents"));
  const notes = page.getByRole("navigation", { name: getDictionary("en").spotlightLabel, exact: true });
  await notes.getByRole("link", { name: "Rose", exact: true }).click();
  const url = new URL(page.url());
  expect(url.searchParams.get("info")).toBe("unrecognized");
  expect(url.searchParams.get("scent")).toBe("rose");
  expect(url.hash).toBe("#scents");
});

test("note links fall back to real filtered results without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/en`);
    const notes = page.getByRole("navigation", { name: getDictionary("en").spotlightLabel, exact: true });
    await notes.getByRole("link", { name: "Rose", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/catalogue\?note=rose$/);
    await expect(page.getByRole("status")).toContainText("14 fragrances");
  } finally { await context.close(); }
});

test("note preview stays useful when photographs fail and loads its photograph eagerly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/perfumes/*.webp", route => route.abort());
  await page.goto("/en");
  const preview = page.getByRole("region", { name: getDictionary("en").spotlightLabel, exact: true });
  await expect(preview.getByRole("figure").getByText("Photograph unavailable", { exact: true })).toBeVisible();
  await preview.getByRole("navigation").getByRole("link", { name: "Oud", exact: true }).click();
  await expect(preview.getByRole("figure")).toContainText("Haltane");
  await preview.getByRole("link", { name: getDictionary("en").spotlightBrowse, exact: true }).click();
  await expect(page.getByRole("status")).toContainText("6 fragrances");
  await page.unroute("**/perfumes/*.webp");
  await page.goto("/en");
  // The hero photograph is the largest first-viewport image, so it is never lazy.
  const image = preview.getByRole("figure").locator("img");
  await expect(image).toHaveAttribute("loading", "eager");
  await expect(image).toHaveAttribute("fetchpriority", "high");
});

test("modified note clicks keep native filtered links", async ({ page, context }) => {
  await page.goto("/en");
  const opened = context.waitForEvent("page");
  await page.getByRole("navigation", { name: getDictionary("en").spotlightLabel, exact: true })
    .getByRole("link", { name: "Rose", exact: true }).click({ modifiers: ["Control"] });
  const tab = await opened;
  await tab.waitForURL(/\/en\/catalogue\?note=rose$/);
  await expect(page.getByRole("figure")).toContainText("Torino21");
  await tab.close();
});

test("note changes animate the bottle only when motion is allowed", async ({ page }) => {
  const notes = () => page.getByRole("navigation", { name: getDictionary("en").spotlightLabel, exact: true });
  const bottle = () => page.getByRole("figure").locator("img");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await notes().getByRole("link", { name: "Vanilla", exact: true }).click();
  await expect(page.getByRole("figure")).toContainText("13 fragrances with Vanilla");
  expect(await bottle().evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await notes().getByRole("link", { name: "Rose", exact: true }).click();
  await expect(page.getByRole("figure")).toContainText("Pour Homme");
  expect(await bottle().evaluate((el) => getComputedStyle(el).animationName)).toBe("bottle-in");
});

test("discovery tabs show eight note tiles and eight distinct family tiles", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en#scents");
  await expect(page.getByRole("figure")).toHaveCount(1);
  const panel = page.getByRole("tabpanel");
  await expect(panel.getByRole("link")).toHaveCount(8);
  await page.getByRole("tab", { name: d.family, exact: true }).click();
  await expect(page.getByRole("tabpanel").getByRole("link")).toHaveCount(8);
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale} phone hero shows its collection action before the perfume preview`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    const d = getDictionary(locale);
    const action = page.getByRole("main").getByRole("link", { name: d.campaignAction, exact: true });
    const image = page.getByRole("region", { name: d.spotlightLabel, exact: true }).getByRole("figure").locator("img");
    await expect(action).toBeInViewport({ ratio: 1 });
    expect(await action.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(await image.evaluate(el => el.getBoundingClientRect().top));
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("figure").getByRole("link")).toHaveCount(2);
      await expectDocumentFits(page);
    }
  });
}
