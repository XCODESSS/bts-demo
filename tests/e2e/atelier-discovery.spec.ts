import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { expectDocumentFits } from "./helpers/typography";

test("Atelier Notes previews an actual matching fragrance", async ({ page }) => {
  const d = getDictionary("en");
  await page.goto("/en#scents");
  await page.getByRole("tab", { name: d.noteFilter, exact: true }).click();
  const preview = page.getByRole("region", { name: d.spotlightLabel, exact: true });
  const notes = preview.getByRole("navigation", { name: d.spotlightLabel, exact: true });
  await expect(notes.getByRole("link")).toHaveCount(4);
  await notes.getByRole("link", { name: "Rose", exact: true }).click();
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await expect(preview).toContainText("14 fragrances with Rose");
  await expect(preview.getByRole("link", { name: d.spotlightBrowse, exact: true })).toHaveAttribute("href", "/en/catalogue?note=rose");
});

test("Atelier scent state survives history, reload, tabs and language without scroll jumps", async ({ page }) => {
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

test("Atelier note choice retains unrelated information state", async ({ page }) => {
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

test("Atelier note links fall back to real filtered results without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/en#scents`);
    const notes = page.getByRole("navigation", { name: getDictionary("en").spotlightLabel, exact: true });
    await notes.getByRole("link", { name: "Rose", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/catalogue\?note=rose$/);
    await expect(page.getByRole("status")).toContainText("14 fragrances");
  } finally { await context.close(); }
});

test("Atelier discovery is lazy and stays useful when photographs fail", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/perfumes/*.webp", route => route.abort());
  await page.goto("/en#scents");
  const preview = page.getByRole("region", { name: getDictionary("en").spotlightLabel, exact: true });
  await expect(preview.getByRole("figure").getByText("Photograph unavailable", { exact: true })).toBeVisible();
  await preview.getByRole("navigation").getByRole("link", { name: "Rose", exact: true }).click();
  await expect(preview.getByRole("figure")).toContainText("Pour Homme");
  await preview.getByRole("link", { name: getDictionary("en").spotlightBrowse, exact: true }).click();
  await expect(page.getByRole("status")).toContainText("14 fragrances");
  await page.unroute("**/perfumes/*.webp");
  await page.goto("/en#scents");
  await expect(preview.getByRole("figure").locator("img")).toHaveAttribute("loading", "lazy");
});

test("modified note clicks keep native filtered links", async ({ page, context }) => {
  await page.goto("/en#scents");
  const opened = context.waitForEvent("page");
  await page.getByRole("navigation", { name: getDictionary("en").spotlightLabel, exact: true })
    .getByRole("link", { name: "Rose", exact: true }).click({ modifiers: ["Control"] });
  const tab = await opened;
  await tab.waitForURL(/\/en\/catalogue\?note=rose$/);
  await expect(page.getByRole("figure")).toContainText("Torino21");
  await tab.close();
});

for (const design of ["atelier", "gallery", "linen", "salon"]) {
  test(`${design} exposes only its intended Notes presentation`, async ({ page }) => {
    await page.addInitScript(id => localStorage.setItem("bts-demo-design", id), design);
    await page.goto("/en#scents");
    await expect(page.getByRole("figure")).toHaveCount(design === "atelier" || design === "salon" ? 1 : 0);
    const collection = page.getByRole("tabpanel");
    if (design === "atelier") await expect(collection.getByRole("navigation").getByRole("link")).toHaveCount(4);
    else await expect(collection.getByRole("link")).toHaveCount(8);
    await page.getByRole("tab", { name: getDictionary("en").family, exact: true }).click();
    await expect(page.getByRole("tabpanel").getByRole("link")).toHaveCount(8);
  });
}

for (const locale of ["en", "ar"] as const) {
  test(`Atelier ${locale} opens with one actionable three-bottle campaign`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}`);
    await page.evaluate(() => document.fonts.ready);
    const d = getDictionary(locale);
    const action = page.getByRole("main").getByRole("link", { name: d.campaignAction, exact: true });
    const campaign = page.getByRole("region", { name: d.campaignProducts, exact: true });
    const image = campaign.getByRole("link").first().locator("img");
    await expect(action).toBeInViewport({ ratio: 1 });
    expect(await action.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(await image.evaluate(el => el.getBoundingClientRect().top));
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(campaign.getByRole("link")).toHaveCount(3);
      await expectDocumentFits(page);
    }
  });
}
