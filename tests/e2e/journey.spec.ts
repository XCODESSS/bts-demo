import { expect, test } from "@playwright/test";

test("homepage opens the real collection and product journey", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "A space for your scent.",
  );
  await page
    .getByRole("link", { name: "Explore the Collection", exact: true })
    .click();
  await expect(page.getByTestId("product-card")).toHaveCount(24);
  await page
    .getByRole("link", { name: "View Club de Nuit Iconic", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Club de Nuit Iconic", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("article", { name: "Club de Nuit Iconic" })
      .getByText("Demo price", { exact: true }),
  ).toBeVisible();
  const enquiry = page.getByRole("link", {
    name: "Enquire on WhatsApp",
    exact: true,
  });
  if (await enquiry.count()) {
    const href = await enquiry.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/[1-9]\d{6,14}\?text=/);
    expect(new URL(href!).searchParams.get("text")).toContain(
      "Club de Nuit Iconic, 105 ml",
    );
  } else {
    await expect(
      page.getByRole("button", { name: "Enquire on WhatsApp", exact: true }),
    ).toBeDisabled();
  }
});

test("100 products paginate and oversized page requests clamp", async ({
  page,
}) => {
  await page.goto("/en/catalogue");
  await expect(page.getByRole("status")).toContainText("100 fragrances");
  await page.getByRole("link", { name: "Page 5", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(4);
  await page.goto("/en/catalogue?page=999");
  await expect(page.getByTestId("product-card")).toHaveCount(4);
  await expect(page.getByRole("status")).toContainText("Page 5 of 5");
});

test("search, clear and empty states are real", async ({ page }) => {
  await page.goto("/en/catalogue");
  await page.getByRole("main")
    .getByRole("searchbox", { name: "Search Fragrances" })
    .fill("armaf iconic");
  await page.getByRole("main").getByRole("searchbox").press("Enter");
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expect(page.getByTestId("product-card")).toContainText(
    "Club de Nuit Iconic",
  );
  await page.getByRole("main").getByRole("searchbox").fill("there-is-no-perfume-with-this-name");
  await page.getByRole("main").getByRole("searchbox").press("Enter");
  await expect(
    page.getByRole("heading", { name: "A different direction, perhaps?" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Clear Filters", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(24);
});

test("filter state survives locale switching, reload and product return", async ({
  page,
  isMobile,
}) => {
  await page.goto("/en/catalogue");
  if (isMobile)
    await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page
    .getByLabel("Perfume House", { exact: true })
    .selectOption("Burberry");
  await expect(page).toHaveURL(/brand=Burberry/);
  await page.reload();
  await page.getByRole("link", { name: "العربية", exact: true }).click();
  await expect(page).toHaveURL(/\/ar\/catalogue\?brand=Burberry/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByRole("link", { name: "عرض Her", exact: true }).click();
  await expect(page).toHaveURL(/\/ar\/perfumes\/burberry-her-p0074/);
  const productPath = new URL(page.url()).pathname.replace("/ar/", "/en/");
  await page.getByRole("link", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(productPath));
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page
    .getByRole("link", { name: "Back to the Collection", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/catalogue\?brand=Burberry/);
});

test("sort, combined filters and browser back preserve query state", async ({
  page,
  isMobile,
}) => {
  await page.goto("/en/catalogue");
  if (isMobile)
    await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByLabel("Perfume House", { exact: true }).selectOption("Armaf");
  await expect(page).toHaveURL(/brand=Armaf/);
  await page
    .getByLabel("Fragrance Family", { exact: true })
    .selectOption("amber");
  await expect(page).toHaveURL(/family=amber/);
  await expect(
    page.getByRole("link", { name: "View Club de Nuit Iconic", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Sort by", { exact: true }).selectOption("name-asc");
  await expect(page).toHaveURL(/sort=name-asc/);
  await page.goBack();
  await expect(page).not.toHaveURL(/sort=name-asc/);
  await expect(page).toHaveURL(/family=amber/);
});

{
  test("dedicated note filtering preserves the full bilingual journey", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/en/catalogue?page=3");
    if (isMobile)
      await page.getByRole("button", { name: "Filters", exact: true }).click();
    await page
      .getByLabel("Fragrance Note", { exact: true })
      .selectOption("mint");
    await expect(page).toHaveURL(/note=mint/);
    await expect(page).not.toHaveURL(/page=/);
    await expect(page.getByTestId("product-card")).toHaveCount(4);
    await page
      .getByLabel("Perfume House", { exact: true })
      .selectOption("Armaf");
    await expect(page).toHaveURL(/brand=Armaf/);
    await page.getByLabel("For", { exact: true }).selectOption("men");
    await expect(page).toHaveURL(/gender=men/);
    await page
      .getByLabel("Fragrance Family", { exact: true })
      .selectOption("amber");
    await expect(page).toHaveURL(/family=amber/);
    await page.getByRole("main").getByRole("searchbox").fill("iconic");
    await page.getByRole("main").getByRole("searchbox").press("Enter");
    await expect(page).toHaveURL(/q=iconic/);
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await expect(page.getByTestId("product-card")).toContainText(
      "Club de Nuit Iconic",
    );
    await page.getByRole("link", { name: "العربية", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await page.reload();
    if (isMobile)
      await page.getByRole("button", { name: "التصفية", exact: true }).click();
    await expect(
      page.getByLabel("النفحة العطرية", { exact: true }),
    ).toHaveValue("mint");
    await expect(
      page.getByRole("button", { name: "إزالة النعناع", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "عرض Club de Nuit Iconic", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Club de Nuit Iconic", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "العودة إلى المجموعة", exact: true })
      .click();
    await expect(page).toHaveURL(/note=mint/);
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await page
      .getByRole("button", { name: "إزالة النعناع", exact: true })
      .click();
    await expect(page).not.toHaveURL(/note=/);
    await expect(page).toHaveURL(/brand=Armaf/);
    await page
      .getByRole("button", { name: "مسح التصفية", exact: true })
      .click();
    await expect(page.getByTestId("product-card")).toHaveCount(24);
    await expect(page.getByRole("status")).toContainText(
      new Intl.NumberFormat("ar").format(100),
    );
  });
}

test("note filtering survives pagination and invalid note URLs fail safely", async ({
  page,
}) => {
  await page.goto("/en/catalogue?note=bergamot&page=2");
  await expect(page.getByTestId("product-card")).toHaveCount(5);
  await expect(page.getByRole("status")).toContainText("29 fragrances");
  await page.getByRole("link", { name: "Previous", exact: true }).click();
  await expect(page).toHaveURL(/note=bergamot/);
  await expect(page.getByTestId("product-card")).toHaveCount(24);
  await page.goto("/en/catalogue?note=not-a-real-note");
  await expect(page.getByTestId("product-card")).toHaveCount(24);
  await expect(page.getByRole("status")).toContainText("100 fragrances");
  await expect(page.getByLabel("Fragrance Note", { exact: true })).toHaveValue(
    "",
  );
});

test("unknown products and missing photographs fail safely", async ({
  page,
}) => {
  await page.goto("/en/perfumes/not-a-real-perfume");
  await expect(
    page.getByRole("heading", { name: "This scent is still a mystery." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Explore Collection", exact: true })
    .click();
  await expect(page.getByTestId("product-card")).toHaveCount(24);
  await page.route("**/perfumes/*.webp", (route) => route.abort());
  await page.reload();
  await expect(page.getByText("Photograph unavailable").first()).toBeVisible();
});

test("a design preference saved by the retired chooser is ignored", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("bts-demo-design", "gallery"),
  );
  await page.goto("/en/catalogue?brand=Burberry");
  await expect(page.locator("html")).not.toHaveAttribute("data-design", /.+/);
  await expect(page.getByRole("contentinfo").getByRole("button", { name: "Choose Design" })).toHaveCount(0);
  await expect(page).toHaveURL(/brand=Burberry/);
  await expect(page.getByTestId("product-card").first()).toContainText("Burberry");
});

test("mobile menu has meaningful keyboard close behavior", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Menu is only shown at mobile widths");
  await page.goto("/en");
  await page.getByRole("button", { name: "Open Menu" }).click();
  await expect(
    page.getByRole("button", { name: "Close Menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open Menu" })).toBeFocused();
});
