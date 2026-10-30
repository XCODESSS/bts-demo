import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { loadHomeSections } from "./helpers/home-sections";
import { readMotionObservation, startMotionObservation } from "./helpers/motion-observer";

test("design crossfades stay isolated from subsequent route navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await page.getByRole("button", { name: "Choose Design", exact: true }).click();
  await page.getByRole("button", { name: "Preview Modern Gallery", exact: true }).click();
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(animation =>
    animation instanceof CSSAnimation && animation.animationName === "design-fade-in")),
  { intervals: [16, 32, 64] }).toBe(true);
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(animation =>
    animation instanceof CSSAnimation && animation.animationName === "design-fade-in"))).toBe(false);
  await page.evaluate(() => scrollTo(0, 0));
  await startMotionObservation(page);
  await page.getByRole("main").getByRole("link", { name: "Explore Collection", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue$/);
  await expect.poll(async () => (await readMotionObservation(page)).some(frame => frame.names.includes("bts-page-enter"))).toBe(true);
  expect((await readMotionObservation(page)).some(frame => frame.names.includes("design-fade-in"))).toBe(false);
});

for (const [design, name] of [
  ["atelier", "Botanical Atelier"],
  ["gallery", "Modern Gallery"],
  ["linen", "Linen Boutique"],
] as const) {
  test(`${name} keeps the full bilingual collection and light responsive pages`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(60000);
    // Static layout/image captures must not wait for continuously floating bottles to settle.
    // Motion and pause/reduced-motion behavior have dedicated browser cases.
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/en");
    await page
      .getByRole("button", { name: "Choose Design", exact: true })
      .click();
    await page
      .getByRole("button", { name: `Preview ${name}`, exact: true })
      .click();
    for (const locale of ["en", "ar"]) {
      for (const route of [
        `/${locale}`,
        `/${locale}/catalogue`,
        `/${locale}/perfumes/xerjoff-torino21-p0574`,
      ]) {
        await page.goto(route);
        if (route === "/en" || route === "/ar") await loadHomeSections(page);
        await expect(page.locator("html")).toHaveAttribute(
          "data-design",
          design,
        );
        await expect(page.locator("html")).toHaveAttribute(
          "dir",
          locale === "ar" ? "rtl" : "ltr",
        );
        await page.evaluate(() => document.fonts.ready);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth - window.innerWidth,
            ),
          )
          .toBeLessThanOrEqual(1);
        const background = await page.evaluate(() =>
          getComputedStyle(document.body)
            .backgroundColor.match(/\d+/g)
            ?.map(Number),
        );
        expect(background?.slice(0, 3).every((channel) => channel > 235)).toBe(
          true,
        );
        for (const image of await page.locator("img:visible").all())
          await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            page
              .locator("img:visible")
              .evaluateAll((images) =>
                images.every(
                  (image) =>
                    image instanceof HTMLImageElement &&
                    image.complete &&
                    image.naturalWidth > 0,
                ),
              ),
          )
          .toBe(true);
        if (route.endsWith("/catalogue")) {
          await expect(page.getByTestId("product-card")).toHaveCount(12);
          await expect(page.getByRole("status")).toContainText("100");
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        mkdirSync("artifacts/screenshots", { recursive: true });
        await page.screenshot({
          path: `artifacts/screenshots/design-${design}-${testInfo.project.name}-${route.slice(1).replaceAll("/", "-")}.png`,
          fullPage: true,
        });
      }
    }
    for (const width of [360, 768]) {
      await page.setViewportSize({ width, height: 900 });
      for (const locale of ["en", "ar"]) {
        await page.goto(`/${locale}`);
        await page.evaluate(() => document.fonts.ready);
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth - window.innerWidth,
            ),
          )
          .toBeLessThanOrEqual(1);
      }
    }
    expect(errors).toEqual([]);
  });
}

test("design changes animate without overriding reduced-motion preferences", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await page
    .getByRole("button", { name: "Choose Design", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preview Modern Gallery", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-design", "gallery");
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          document
            .getAnimations()
            .some(
              (animation) =>
                animation instanceof CSSAnimation &&
                animation.animationName === "design-fade-in",
            ),
        ),
      { timeout: 2500, intervals: [16, 32, 64] },
    )
    .toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("button", { name: "Choose Design", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preview Linen Boutique", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-design", "linen");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      ),
    )
    .toBe(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("design selection still works without native view-transition support", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/en");
  await page.evaluate(() =>
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: undefined,
    }),
  );
  await page
    .getByRole("button", { name: "Choose Design", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preview Modern Gallery", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-design", "gallery");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page
    .getByRole("link", { name: "Explore Collection", exact: true })
    .click();
  await expect(page.getByTestId("product-card")).toHaveCount(12);
  expect(errors).toEqual([]);
});

test("the design dialog supports keyboard dismissal and focus restoration", async ({
  page,
}, testInfo) => {
  await page.goto("/en");
  const trigger = page.getByRole("button", {
    name: "Choose Design",
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole("dialog", {
    name: "Choose a Design",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Preview Botanical Atelier" }),
  ).toHaveAttribute("aria-pressed", "true");
  for (const image of await dialog.locator("img").all())
    await image.scrollIntoViewIfNeeded();
  await dialog.evaluate((element) => {
    element.scrollTop = 0;
  });
  await page.screenshot({
    path: `artifacts/screenshots/design-chooser-${testInfo.project.name}.png`,
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("light bilingual pages have no horizontal overflow or runtime errors", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const route of [
    "/en",
    "/ar",
    "/en/catalogue",
    "/ar/catalogue",
    "/en/perfumes/xerjoff-torino21-p0574",
    "/ar/perfumes/xerjoff-torino21-p0574",
  ]) {
    await page.goto(route);
    if (route === "/en" || route === "/ar") await loadHomeSections(page);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      )
      .toBeLessThanOrEqual(1);
    for (const image of await page.locator("img:visible").all())
      await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        page
          .locator("img:visible")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await page.evaluate(() => window.scrollTo(0, 0));
    const language = route.startsWith("/ar") ? "ar" : "en";
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      language === "ar" ? "rtl" : "ltr",
    );
    mkdirSync("artifacts/screenshots", { recursive: true });
    await page.screenshot({
      path: `artifacts/screenshots/${testInfo.project.name}-${route.slice(1).replaceAll("/", "-")}.png`,
      fullPage: true,
    });
  }
  expect(errors).toEqual([]);
});

test("tablet and narrow phone layouts remain usable with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/en",
      "/ar",
      "/en/catalogue",
      "/ar/catalogue?page=5",
    ]) {
      await page.goto(route);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth - window.innerWidth,
          ),
        )
        .toBeLessThanOrEqual(1);
    }
  }
});
