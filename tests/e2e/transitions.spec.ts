import { expect, test, type Page, type Locator } from "@playwright/test";
import { getDictionary } from "../../src/i18n/dictionaries";
import { startMotionObservation, readMotionObservation } from "./helpers/motion-observer";

async function prepareProduct(page: Page, link: Locator) {
  const href = await link.getAttribute("href");
  const response = page.waitForResponse(response => {
    const url = new URL(response.url());
    const destination = new URL(href!, page.url());
    return url.pathname === destination.pathname && url.searchParams.has("_rsc") && response.ok();
  });
  await link.focus();
  // Next can keep its RSC stream open after delivering the route. Observe the
  // real response, then require a paired movement on the actual navigation.
  expect((await response).headers()["content-type"]).toContain("text/x-component");
}

async function expectOneMovingBottle(page: Page, id: string) {
  await expect.poll(async () => new Set((await readMotionObservation(page))
    .map(frame => frame.bottleTransform).filter(value => value && value !== "none")).size).toBeGreaterThan(1);
  const groups = new Set((await readMotionObservation(page)).flatMap(frame => frame.pseudoElements)
    .filter(pseudo => pseudo.startsWith("::view-transition-group(bts-bottle-")));
  expect([...groups]).toEqual([`::view-transition-group(bts-bottle-${id})`]);
}

async function expectNoPageArrival(page: Page) {
  // Sample until the observer finishes, including delayed React commits.
  await expect.poll(async () => (await readMotionObservation(page)).length).toBe(180);
  expect((await readMotionObservation(page)).some(frame => frame.names.includes("bts-page-enter"))).toBe(false);
}

test("reduced motion swaps public pages without positional animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await startMotionObservation(page);
  await page.getByRole("main").getByRole("link", { name: getDictionary("en").campaignAction, exact: true }).click();
  await expect(page).toHaveURL(/\/en\/catalogue$/);
  await expect.poll(async () => (await readMotionObservation(page)).length).toBe(180);
  expect((await readMotionObservation(page)).flatMap(frame => frame.viewTransitionDurations).every(duration => duration === 0)).toBe(true);
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length)).toBe(0);
});

test("unsupported motion never blocks product navigation or history", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(document, "startViewTransition", {
    configurable: true, value: undefined,
  }));
  await page.goto("/en/catalogue?brand=Dior");
  await page.getByTestId("product-card").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/catalogue\?brand=Dior$/);
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("query changes do not replay page arrival", async ({ page }) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const d = getDictionary("en");
  await page.goto("/en/catalogue");
  await startMotionObservation(page);
  await page.getByRole("combobox", { name: d.brand, exact: true }).selectOption("Dior");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expectNoPageArrival(page);
  await page.goto("/en/perfumes/dior-spice-blend-p0168");
  await startMotionObservation(page);
  await page.getByRole("article", { name: "Spice Blend", exact: true }).getByRole("button", { name: d.details, exact: true }).click();
  await expect(page).toHaveURL(/details=notes/);
  await expectNoPageArrival(page);
  await page.goto("/en#scents");
  await startMotionObservation(page);
  await page.locator('[data-placement="discovery"] a[href*="note=rose"]').click();
  await expect(page).toHaveURL(/scent=rose/);
  await expectNoPageArrival(page);
  await startMotionObservation(page);
  await page.getByRole("contentinfo").getByRole("button", { name: d.shippingInfo, exact: true }).click();
  await expect(page.getByRole("dialog", { name: d.shippingInfo, exact: true })).toBeVisible();
  await expectNoPageArrival(page);
});

test("admin and not-found screens have no public motion boundary", async ({ page }) => {
  await page.goto("/en/admin/login");
  await expect(page.locator("[data-public-page]")).toHaveCount(0);
  await page.goto("/en/perfumes/not-a-perfume");
  await expect(page.locator("[data-public-page]")).toHaveCount(0);
});

test("selected card photograph moves into its detail position", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/catalogue?brand=Dior");
  const card = page.getByTestId("product-card");
  await expect(card.getByRole("heading")).toHaveText("Spice Blend");
  const photo = await card.locator("img").getAttribute("src");
  await card.locator("img").evaluate(image => (image as HTMLImageElement).decode());
  await card.getByRole("link").hover();
  await startMotionObservation(page, { bottleName: "bts-bottle-P0168" });
  await card.getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  expect(new URL(page.url()).searchParams.get("return")).toBe("brand=Dior");
  await expect(page.getByRole("button", { name: getDictionary("en").zoomImage, exact: true })
    .locator("img")).toHaveAttribute("src", photo!);
  await expect.poll(async () => new Set((await readMotionObservation(page))
    .map(frame => frame.bottleTransform).filter(value => value && value !== "none")).size)
    .toBeGreaterThan(1);
  await testInfo.attach("bottle-frames", { body: JSON.stringify(await readMotionObservation(page), null, 2), contentType: "application/json" });
});

test("intent prefetch and explicit return retain one reverse-moving photograph", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/catalogue?brand=Dior");
  const link = page.getByTestId("product-card").getByRole("link");
  await prepareProduct(page, link);
  await startMotionObservation(page, { bottleName: "bts-bottle-P0168" });
  await link.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  await expectOneMovingBottle(page, "P0168");
  const back = page.getByRole("link", { name: getDictionary("en").back, exact: true });
  await back.focus();
  await startMotionObservation(page, { bottleName: "bts-bottle-P0168" });
  await back.click();
  await expect(page).toHaveURL(/\/en\/catalogue\?brand=Dior$/);
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expectOneMovingBottle(page, "P0168");
});

for (const source of ["featured", "related"] as const) {
  test(`${source} cards move only the selected photograph`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(source === "featured" ? "/en#featured" : "/en/perfumes/dior-spice-blend-p0168");
    const card = page.getByTestId("product-card").first();
    const link = card.getByRole("link");
    const href = await link.getAttribute("href");
    const id = href!.match(/-(p\d+)/i)![1].toUpperCase();
    const name = await card.getByRole("heading").innerText();
    await card.scrollIntoViewIfNeeded();
    await card.locator("img").evaluate(image => (image as HTMLImageElement).decode());
    await prepareProduct(page, link);
    await startMotionObservation(page, { bottleName: `bts-bottle-${id}` });
    await link.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expectOneMovingBottle(page, id);
  });
}

for (const width of [360, 390]) {
  test(`${width}px uses page arrival without chasing the mobile photograph`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/en/catalogue?brand=Dior");
    const link = page.getByTestId("product-card").getByRole("link");
    await prepareProduct(page, link);
    const sourceScroll = await page.evaluate(() => scrollY);
    await startMotionObservation(page, { bottleName: "bts-bottle-P0168" });
    await link.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
    await expect.poll(async () => (await readMotionObservation(page)).length).toBe(180);
    expect((await readMotionObservation(page)).flatMap(frame => frame.names)
      .some(name => name.includes("group-anim-bts-bottle"))).toBe(false);
    const article = page.getByRole("article", { name: "Spice Blend", exact: true });
    const enquiry = await article.locator('.button').boundingBox();
    const photo = await article.locator('button:has(img)').boundingBox();
    expect(enquiry!.y + enquiry!.height).toBeLessThan(844);
    expect(enquiry!.y).toBeLessThan(photo!.y);
    // Next may reset to the top or retain the source scroll when the new page
    // is already visible. Neither path may force a scroll toward the gallery.
    expect([0, sourceScroll]).toContain(await page.evaluate(() => scrollY));
  });
}

test("cold delayed requests and failed photographs leave native navigation usable", async ({ page }) => {
  await page.route("**/perfumes/**", async route => {
    if (new URL(route.request().url()).searchParams.has("_rsc")) await new Promise(resolve => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.route("**/perfumes/P0168.webp", route => route.abort());
  await page.goto("/en/catalogue?brand=Dior");
  await expect(page.getByTestId("product-card").getByRole("img")).toContainText(getDictionary("en").noImage);
  await page.getByTestId("product-card").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  await page.getByRole("link", { name: getDictionary("en").back, exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(1);
});

test("modified clicks, direct entry and native history retain real destinations", async ({ page, context }) => {
  await page.goto("/en/catalogue?brand=Dior");
  const popup = context.waitForEvent("page");
  await page.getByTestId("product-card").getByRole("link").click({ modifiers: ["ControlOrMeta"] });
  const tab = await popup;
  await expect(tab.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  await tab.reload();
  await expect(tab.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  await tab.close();
  await expect(page).toHaveURL(/\/en\/catalogue\?brand=Dior$/);
  await page.getByTestId("product-card").getByRole("link").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
  await page.goBack();
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
});

test("mobile filters expand without exposing closed controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/catalogue");
  const toggle = page.locator('button[aria-controls="catalogue-filters"]');
  await startMotionObservation(page, { targetSelector: "#catalogue-filters" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("combobox")).toHaveCount(5);
  const panel = page.locator("#catalogue-filters");
  await expect.poll(async () => {
    const finalHeight = await panel.evaluate(el => el.getBoundingClientRect().height);
    return (await readMotionObservation(page)).some(frame => frame.target &&
      frame.target.height > 2 && frame.target.height < finalHeight - 2);
  }).toBe(true);
  await page.getByRole("combobox").first().focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(toggle).toBeFocused();
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale} filter disclosure handles resizing, rapid toggles and reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}/catalogue?brand=Dior`);
    const toggle = page.locator('button[aria-controls="catalogue-filters"]');
    const panel = page.locator("#catalogue-filters");
    await expect(panel).toHaveAttribute("inert", "");
    await toggle.click();
    await expect(page.getByRole("combobox")).toHaveCount(5);
    await expect(page.getByRole("combobox", { name: getDictionary(locale).brand, exact: true })).toHaveValue("Dior");
    await toggle.click({ clickCount: 3, delay: 20 });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("combobox")).toHaveCount(0);
    await page.setViewportSize({ width: 768, height: 1000 });
    await expect(page.getByRole("combobox")).toHaveCount(5);
    await expect(panel).not.toHaveAttribute("inert");
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(panel).toHaveAttribute("inert", "");
    await toggle.click();
    await page.getByRole("combobox", { name: getDictionary(locale).gender, exact: true }).selectOption("unisex");
    await expect(page).toHaveURL(/brand=Dior.*gender=unisex/);
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test("mobile menu is interruptible and closed links are inert", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  const d = getDictionary("en");
  await startMotionObservation(page, { targetSelector: "#mobile-navigation" });
  await page.getByRole("button", { name: d.menu, exact: true }).click();
  await expect.poll(async () => (await readMotionObservation(page))
    .some(frame => frame.target && frame.target.opacity > 0 && frame.target.opacity < 1)).toBe(true);
  await startMotionObservation(page, { targetSelector: "#mobile-navigation" });
  await page.getByRole("button", { name: d.close, exact: true }).click();
  await expect(page.locator("#mobile-navigation")).toHaveAttribute("inert", "");
  await expect(page.getByRole("navigation", { name: d.menu, exact: true })).toHaveCount(0);
  await expect.poll(async () => (await readMotionObservation(page))
    .some(frame => frame.target && frame.target.opacity > 0 && frame.target.opacity < 1)).toBe(true);
  await page.getByRole("button", { name: d.menu, exact: true }).click();
  await expect(page.getByRole("navigation", { name: d.menu, exact: true })).toBeVisible();
});

for (const locale of ["en", "ar"] as const) {
  test(`${locale} mobile menu resets on pathname navigation and restores Escape focus`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const d = getDictionary(locale);
    await page.goto(`/${locale}`);
    const toggle = page.getByRole("button", { name: d.menu, exact: true });
    await toggle.click();
    await page.getByRole("navigation", { name: d.menu, exact: true }).getByRole("link").first().focus();
    await page.keyboard.press("Escape");
    await expect(toggle).toBeFocused();
    await expect(page.locator("#mobile-navigation")).toHaveAttribute("inert", "");
    await toggle.click();
    await page.getByRole("navigation", { name: d.menu, exact: true }).getByRole("link").first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/catalogue$`));
    await expect(page.locator("#mobile-navigation")).toHaveAttribute("inert", "");
    await page.goBack();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    // Another header link also resets the state-owning child.
    await page.getByRole("banner").getByRole("link", { name: locale === "en" ? "العربية" : "English", exact: true }).click();
    await expect(page.locator("#mobile-navigation")).toHaveAttribute("inert", "");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(page.locator("#mobile-navigation")).not.toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator("#mobile-navigation")).toHaveAttribute("inert", "");
  });
}

for (const surface of ["house", "footer", "photo", "design"] as const) {
  test(`native dialogs share a gentle entrance and immediate close semantics: ${surface}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const d = getDictionary("en");
    await page.goto(surface === "photo" ? "/en/perfumes/dior-spice-blend-p0168" : "/en#houses");
    const trigger = surface === "house" ? page.getByRole("button", { name: d.allHousesAction, exact: true })
      : surface === "footer" ? page.getByRole("contentinfo").getByRole("button", { name: d.shippingInfo, exact: true })
      : surface === "photo" ? page.getByRole("button", { name: d.zoomImage, exact: true })
      : page.getByRole("button", { name: d.chooseDesign, exact: true });
    const selector = surface === "house" ? 'dialog[aria-labelledby="brand-directory-title"]'
      : surface === "footer" ? 'dialog[aria-labelledby="footer-information-title"]'
      : surface === "photo" ? `dialog[aria-label="${d.zoomImage}"]` : '.design-dialog';
    await trigger.scrollIntoViewIfNeeded();
    await startMotionObservation(page, { targetSelector: selector });
    await trigger.click();
    await expect.poll(async () => (await readMotionObservation(page))
      .some(frame => frame.target && frame.target.opacity > 0 && frame.target.opacity < 1)).toBe(true);
    // Finish entry before measuring an independent exit, not a mount-only effect.
    await expect.poll(() => page.locator(selector).evaluate(el => getComputedStyle(el).opacity)).toBe("1");
    await startMotionObservation(page, { targetSelector: selector });
    await page.keyboard.press("Escape");
    expect(await page.locator(selector).evaluate(el => el instanceof HTMLDialogElement && el.open)).toBe(false);
    await expect(trigger).toBeFocused();
    expect(await page.locator(selector).evaluate(el => getComputedStyle(el).pointerEvents)).toBe("none");
    await expect.poll(async () => (await readMotionObservation(page))
      .some(frame => frame.target && frame.target.opacity > 0 && frame.target.opacity < 1)).toBe(true);
    await expect(page.locator(selector)).not.toBeVisible();
  });
}

for (const locale of ["en", "ar"] as const) for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`${locale} integrated storefront journey with ${reducedMotion} motion`, async ({ page }) => {
    test.setTimeout(60000);
    await page.emulateMedia({ reducedMotion });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const d = getDictionary(locale);
    await page.goto(`/${locale}`);
    const card = page.getByTestId("product-card").first();
    const name = await card.getByRole("heading").innerText();
    await card.getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await page.getByRole("button", { name: d.zoomImage, exact: true }).click();
    await expect(page.getByRole("dialog", { name: d.zoomImage, exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: d.zoomImage, exact: true })).not.toBeVisible();
    await page.getByRole("link", { name: d.back, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/catalogue$`));
    const filterToggle = page.locator('button[aria-controls="catalogue-filters"]');
    if (await filterToggle.isVisible()) await filterToggle.click();
    await page.getByRole("combobox", { name: d.brand, exact: true }).selectOption("Dior");
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await expect(page.getByTestId("product-card").getByRole("heading")).toHaveText("Spice Blend");
    await page.getByRole("banner").locator(`a[href="/${locale}"]`).click();
    await page.getByRole("button", { name: d.allHousesAction, exact: true }).click();
    await expect(page.getByRole("dialog", { name: d.brandsTitle, exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: d.chooseDesign, exact: true }).click();
    await page.getByRole("button", { name: `${d.previewDesign} ${d.designSalon}`, exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-design", "salon");
    await page.getByRole("main").getByRole("link", { name: d.campaignAction, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/catalogue$`));
    await expect(page.getByTestId("product-card")).toHaveCount(12);
    await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation =>
      animation.effect instanceof KeyframeEffect && animation.effect.pseudoElement?.startsWith("::view-transition")).length)).toBe(0);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

for (const locale of ["en", "ar"] as const) {
  test(`${locale} reduced-motion dialogs close and reopen without animation or topic changes`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const d = getDictionary(locale);
    await page.goto(`/${locale}/catalogue?brand=Dior&info=shipping`);
    const dialog = page.locator('dialog[aria-labelledby="footer-information-title"]');
    await expect(dialog).toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toHaveAttribute("open");
    await expect(page.locator("#footer-information-title")).toHaveText(d.shippingInfo);
    const trigger = page.getByRole("contentinfo").getByRole("button", { name: d.returnsInfo, exact: true });
    await trigger.click();
    await expect(dialog).toHaveAttribute("open", "");
    await expect(dialog.getByRole("heading")).toHaveText(d.returnsInfo);
    expect(await dialog.evaluate(el => el.getAnimations().length)).toBe(0);
    await page.keyboard.press("Escape");
    await trigger.click();
    await expect(dialog).toHaveAttribute("open", "");
    expect(new URL(page.url()).searchParams.get("brand")).toBe("Dior");
  });
}

test("short windows and repeated navigation never strand the public surface", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 420 });
  await page.goto("/en/catalogue?brand=Dior");
  for (let i = 0; i < 3; i++) {
    await page.getByTestId("product-card").getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Spice Blend");
    await page.getByRole("link", { name: getDictionary("en").back, exact: true }).click();
    await expect(page.getByTestId("product-card")).toHaveCount(1);
  }
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(animation =>
    animation.effect instanceof KeyframeEffect && animation.effect.pseudoElement?.startsWith("::view-transition")).length)).toBe(0);
  expect(errors).toEqual([]);
});

test("public page arrival moves content, not the header", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en");
  await page.evaluate(() => document.fonts.ready);
  const link = page.getByRole("main").getByRole("link", {
    name: getDictionary("en").campaignAction, exact: true,
  });
  await link.hover();
  await startMotionObservation(page);
  await link.click();
  await expect(page).toHaveURL(/\/en\/catalogue$/);
  await expect.poll(async () => (await readMotionObservation(page))
    .some(frame => frame.names.includes("bts-page-enter"))).toBe(true);
  const frames = await readMotionObservation(page);
  await testInfo.attach("page-frames", { body: JSON.stringify(frames, null, 2), contentType: "application/json" });
  expect(frames.some(frame => frame.names.includes("design-fade-in"))).toBe(false);
  // This header is deliberately non-fixed: native scroll may move it out of
  // view. Its document position must stay still, not its viewport coordinate.
  expect(frames.filter(frame => frame.headerTop !== null)
    .every(frame => Math.abs(frame.headerTop! + frame.scrollY) < 1)).toBe(true);
});
