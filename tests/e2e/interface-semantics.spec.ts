import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { expectDocumentFits } from "./helpers/typography";

test("local font failure leaves readable bilingual content and navigation", async ({ page }) => {
  await page.route("**/*.woff2", route => route.abort());
  for (const locale of ["en", "ar"] as const) {
    await page.goto(`/${locale}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(getDictionary(locale).storefrontTitle);
    await expectDocumentFits(page);
    await page.goto(`/${locale}/catalogue`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(getDictionary(locale).allTitle);
    await expect(page.getByTestId("product-card")).toHaveCount(24);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.getByTestId("product-card").first().getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("product disclosure headings do not skip a level", async ({ page }) => {
  await page.goto("/en/perfumes/diptyque-philosykos-p0170");
  for (const name of [getDictionary("en").details, getDictionary("en").notes]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true }).getByRole("button")).toBeVisible();
  }
});

test("discovery controls have names, hints and device-aware focus", async ({ page, isMobile }) => {
  const d = getDictionary("en");
  await page.goto("/en");
  await expect(page.getByRole("banner").getByRole("searchbox")).toHaveAttribute("autocomplete", "off");
  await expect(page.getByRole("banner").getByText("Beyond the Space", { exact: false }).first()).toHaveAttribute("translate", "no");
  await page.getByRole("button", { name: d.allHousesAction, exact: true }).click();
  const input = page.getByRole("dialog").getByRole("searchbox");
  await expect(input).toHaveAttribute("name", "houseQuery");
  await expect(input).toHaveAttribute("autocomplete", "off");
  await expect(input).toHaveAttribute("placeholder", "Dior…");
  if (isMobile) await expect(page.getByRole("button", { name: d.closeHouses })).toBeFocused();
  else await expect(input).toBeFocused();
  await page.keyboard.press("Escape");
  await page.goto("/en/catalogue");
  await expect(page.getByRole("searchbox", { name: d.search, exact: true })).toHaveAttribute("autocomplete", "off");
  for (const name of ["brand", "gender", "family", "note", "sort"]) {
    await expect(page.locator(`select[name="${name}"]`)).toHaveCount(1);
  }
});

test("official identities are protected from automatic translation", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator(".footer-brand-name")).toHaveAttribute("translate", "no");
  await expect(page.locator(".footer-instagram bdi")).toHaveAttribute("translate", "no");
  for (const identity of await page.getByTestId("product-card").locator("h3 bdi, span > bdi").all()) {
    await expect(identity).toHaveAttribute("translate", "no");
  }
  await page.goto("/en/perfumes/diptyque-philosykos-p0170");
  await expect(page.getByRole("heading", { level: 1 }).locator("bdi")).toHaveAttribute("translate", "no");
  await expect(page.locator('[aria-current="page"]')).toHaveAttribute("translate", "no");
});

test("catalogue product headings do not skip a level", async ({ page }) => {
  await page.goto("/en/catalogue");
  await expect(page.getByTestId("product-card").getByRole("heading", { level: 2 })).toHaveCount(24);
});
