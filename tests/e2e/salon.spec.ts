import { expect, test } from "@playwright/test";

test("Scent Salon is an additional persisted option; existing designs and filters survive", async ({ page }) => {
  await page.goto("/en/catalogue?brand=Burberry");
  await page.getByRole("button", { name: "Choose design", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Choose a design", exact: true });
  await expect(dialog.getByRole("button", { name: /^Preview / })).toHaveCount(4);
  for (const design of ["Botanical Atelier", "Modern Gallery", "Linen Boutique", "Scent Salon"]) {
    await expect(dialog.getByRole("button", { name: `Preview ${design}`, exact: true })).toHaveCount(1);
  }
  await dialog.getByRole("button", { name: "Preview Scent Salon", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-design", "salon");
  await expect(page).toHaveURL(/brand=Burberry/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-design", "salon");
  await page.getByRole("link", { name: "العربية", exact: true }).click();
  await expect(page).toHaveURL(/\/ar\/catalogue\?brand=Burberry/);
  await expect(page.locator("html")).toHaveAttribute("data-design", "salon");
  await page.getByRole("button", { name: "اختر التصميم", exact: true }).click();
  await page.getByRole("button", { name: "معاينة المشغل النباتي", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-design", "atelier");
  await expect(page).toHaveURL(/brand=Burberry/);
});

test("salon note selection changes a real perfume and opens its exact collection", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("bts-demo-design", "salon"));
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A space for your scent.");
  const notes = page.getByRole("navigation", { name: "Explore a fragrance note", exact: true });
  await expect(notes.getByRole("link")).toHaveCount(4);
  await expect(page.locator("figure")).toContainText("Torino21");
  const rose = notes.getByRole("link", { name: "Rose", exact: true });
  await rose.focus();
  await page.keyboard.press("Enter");
  await expect(rose).toHaveAttribute("aria-current", "true");
  await expect(page.locator("figure")).toContainText("Pour Homme");
  await expect(page.locator("figure")).toContainText("14 fragrances with Rose");
  await page.getByRole("link", { name: "Explore matching fragrances", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue\?note=rose/);
  await expect(page.getByRole("status")).toContainText("14 fragrances");
});

for (const locale of ["en", "ar"] as const) {
  test(`salon ${locale} mobile product exposes the actual enquiry in its opening viewport`, async ({ page, isMobile }) => {
    test.skip(!isMobile, "Phone composition.");
    await page.addInitScript(() => localStorage.setItem("bts-demo-design", "salon"));
    await page.goto(`/${locale}/perfumes/xerjoff-torino21-p0574`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    const article = page.getByRole("article", { name: "Torino21", exact: true });
    const action = article.getByRole("link", { name: locale === "en" ? "Inquire on WhatsApp" : "استفسر عبر واتساب", exact: true });
    if (await action.count()) {
      await expect(action).toBeInViewport({ ratio: 1 });
      expect(await action.getAttribute("href")).toMatch(/^https:\/\/wa\.me\//);
    } else {
      await expect(article.getByRole("button", { name: locale === "en" ? "Inquire on WhatsApp" : "استفسر عبر واتساب", exact: true })).toBeDisabled();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test("salon keeps long official product titles complete and within two lines", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("bts-demo-design", "salon"));
  for (const locale of ["en", "ar"]) {
    await page.goto(`/${locale}/perfumes/giorgio-armani-emporio-armani-stronger-with-you-powerfully-p0042`);
    await page.evaluate(() => document.fonts.ready);
    const title = page.getByRole("heading", { level: 1 });
    await expect(title).toHaveText("Emporio Armani Stronger With You Powerfully");
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const lines = await title.evaluate((element) => {
        const range = document.createRange(); range.selectNodeContents(element);
        return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
      });
      expect(lines).toBeLessThanOrEqual(2);
    }
  }
});

test("salon keeps note discovery usable when photographs fail", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("bts-demo-design", "salon"));
  await page.route("**/perfumes/*.webp", (route) => route.abort());
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A space for your scent.");
  await expect(page.locator("figure").getByText("Photograph unavailable", { exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Explore a fragrance note", exact: true }).getByRole("link", { name: "Oud", exact: true }).click();
  await expect(page.locator("figure")).toContainText("Haltane");
  await page.getByRole("link", { name: "Explore matching fragrances", exact: true }).click();
  await expect(page).toHaveURL(/note=oud/);
  await expect(page.getByRole("status")).toContainText("6 fragrances");
});

test("salon note changes respect reduced motion and keep their full content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("bts-demo-design", "salon"));
  await page.goto("/en");
  await page.getByRole("navigation", { name: "Explore a fragrance note", exact: true }).getByRole("link", { name: "Vanilla", exact: true }).click();
  await expect(page.locator("figure")).toContainText("13 fragrances with Vanilla");
  const imageLink = page.locator("figure").getByRole("link").first();
  await expect(imageLink).toBeVisible();
  expect(await imageLink.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
});

test("salon selection works for the session when persistent storage is blocked", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(Storage.prototype, "setItem", { value() { throw new DOMException("Blocked", "SecurityError"); } }));
  await page.goto("/en");
  await page.getByRole("button", { name: "Choose design", exact: true }).click();
  await page.getByRole("button", { name: "Preview Scent Salon", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A space for your scent.");
  await page.getByRole("link", { name: "العربية", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-design", "salon");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("مساحة تشبه عطرك.");
});
