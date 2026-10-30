import { expect, test } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";

for (const reduced of [false, true]) {
  test(`product panels preserve presence and interruptibility (reduced=${reduced})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: reduced ? "reduce" : "no-preference" });
    await page.goto("/en/perfumes/diptyque-philosykos-p0170");
    const button = page.getByRole("button", { name: getDictionary("en").details, exact: true });
    const content = page.locator(`[id="${await button.getAttribute("aria-controls")}"]`);
    await page.evaluate(() => document.addEventListener("animationstart", event => {
      if (event.target instanceof HTMLElement && event.target.dataset.slot === "accordion-content") document.documentElement.dataset.fade = event.animationName;
    }, true));
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    if (!reduced) await expect(page.locator("html")).toHaveAttribute("data-fade", "accordion-fade-out");
    await expect(content).toBeHidden();
    await button.click();
    await expect(content).toBeVisible();
    if (!reduced) await expect(page.locator("html")).toHaveAttribute("data-fade", "accordion-fade-in");
    await button.click();
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(content).toBeVisible();
    await expect(button).toBeFocused();
  });
}

test("hero motion ends on its own without a pause control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const stage = page.getByRole("region", { name: getDictionary("en").spotlightLabel, exact: true });
  await stage.getByRole("navigation").getByRole("link", { name: "Rose", exact: true }).click();
  await expect.poll(() => stage.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === "running")), { intervals: [16, 32, 64] }).toBe(true);
  await page.waitForTimeout(4500); // Deliberately measure the maximum autoplay interval.
  expect(await stage.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === "running"))).toBe(false);
  await expect(stage.getByRole("button", { name: /Pause|Resume/ })).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await stage.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === "running"))).toBe(false);
});
