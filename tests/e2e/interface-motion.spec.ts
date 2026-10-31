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

test("campaign star keeps rotating after the opening animation settles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await page.getByRole("button", { name: "Choose Design", exact: true }).click();
  await page.getByRole("button", { name: "Preview Modern Gallery", exact: true }).click();
  const stage = page.getByRole("region", { name: getDictionary("en").campaignProducts, exact: true });
  const star = stage.getByText("✧", { exact: true });
  await expect(star).toBeVisible();
  await page.waitForTimeout(4500); // The old one-shot rotation had stopped by now.
  expect(await star.evaluate(element => element.getAnimations().some(animation => animation.playState === "running"))).toBe(true);
  const rotation = await star.evaluate(element => getComputedStyle(element).rotate);
  await expect.poll(() => star.evaluate(element => getComputedStyle(element).rotate)).not.toBe(rotation);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => star.evaluate(element => element.getAnimations().length)).toBe(0);
});

test("decorative campaign motion ends without a pause control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const stage = page.getByRole("region", { name: getDictionary("en").campaignProducts, exact: true });
  await expect.poll(() => stage.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === "running"))).toBe(true);
  await page.waitForTimeout(4500); // Deliberately measure the maximum autoplay interval.
  expect(await stage.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === "running"))).toBe(false);
  await expect(stage.getByRole("button", { name: /Pause|Resume/ })).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await stage.evaluate(el => el.getAnimations({ subtree: true }).some(a => a.playState === "running"))).toBe(false);
});
