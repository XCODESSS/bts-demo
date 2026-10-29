import { test, expect } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import products from "../../src/data/products.json" with { type: "json" };
import { validateProduct } from "../../src/features/products/product-validation";
import { openProductStore } from "../../src/features/products/product-store";
import { hashPassword } from "../../src/features/admin/auth-core";
import { revealHomeSection } from "./helpers/home-sections";

let child: ChildProcess;
let dir: string;
let database: string;
let output = "";
const password = "isolated-test-password-123";
const secret = randomBytes(32).toString("hex");
const passwordHash = hashPassword(password);
async function start() {
  output = "";
  child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3101"], {
    env: { ...process.env, BTS_DATABASE_PATH: database, ADMIN_USERNAME: "test-operator", ADMIN_PASSWORD_HASH: passwordHash, ADMIN_SESSION_SECRET: secret, SITE_URL: "http://127.0.0.1:3101", NEXT_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout?.on("data", (chunk) => { output = (output + String(chunk)).slice(-10000); });
  child.stderr?.on("data", (chunk) => { output = (output + String(chunk)).slice(-10000); });
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error(`Test server exited: ${output}`);
    try { if ((await fetch("http://127.0.0.1:3101/en/admin/login")).ok) return; } catch { /* Wait for this owned process. */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Test server failed to start: ${output}`);
}
async function stop() {
  if (child && child.exitCode === null) {
    const exit = new Promise<void>((resolve) => child.once("exit", () => resolve()));
    child.kill(); await exit;
  }
}
test.beforeAll(async () => {
  // Refuse to attach to or terminate a pre-existing service on the test port.
  try { await fetch("http://127.0.0.1:3101/en"); throw new Error("Port 3101 is already occupied."); } catch (error) { if (error instanceof Error && error.message.includes("occupied")) throw error; }
  dir = mkdtempSync(path.join(tmpdir(), "bts-admin-e2e-")); database = path.join(dir, "catalogue.sqlite");
  const store = openProductStore(database); store.seed(products.map(validateProduct)); store.close();
  await start();
});
test.afterEach(async ({ page }, info) => {
  if (info.status !== info.expectedStatus) {
    await info.attach("server-log", { body: output, contentType: "text/plain" });
    await info.attach("page-state", { body: `${page.url()}\n${await page.locator("body").innerText({ timeout: 2000 }).catch(() => "Unavailable")}`, contentType: "text/plain" });
  }
});
test.afterAll(async () => { await stop(); if (dir) rmSync(dir, { recursive: true, force: true }); });

test("admin login, search, edit, add, authorization and actual process-restart persistence", async ({ page }) => {
  await page.goto("/en/admin/products");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.getByLabel("Username", { exact: true }).fill("test-operator");
  await page.getByLabel("Password", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Invalid username or password." })).toBeVisible();
  await page.getByLabel("Username", { exact: true }).fill("test-operator");
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Manage products" })).toBeVisible();
  await page.getByLabel("Search products", { exact: true }).fill("P0028");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("1 products");
  await page.getByRole("link", { name: "Edit Club de Nuit Iconic", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Edit Club de Nuit Iconic", exact: true })).toBeVisible();
  await page.getByLabel("English description", { exact: true }).fill("Saved admin demonstration description.");
  await page.getByLabel("Arabic description", { exact: true }).fill("وصف تجريبي محفوظ من الإدارة.");
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(page).toHaveURL(/saved=1/);
  await page.goto("/ar/perfumes/armaf-club-de-nuit-iconic-p0028");
  await expect(page.getByText("وصف تجريبي محفوظ من الإدارة.", { exact: true })).toBeVisible();
  await page.goto("/en/admin/products/new");
  await page.getByLabel("Product ID", { exact: true }).fill("DEMO001");
  await page.getByLabel("URL slug", { exact: true }).fill("demo-fragrance-001");
  await page.getByLabel("Brand", { exact: true }).fill("Demo House");
  await page.getByLabel("Product name", { exact: true }).fill("Sample Fragrance");
  await page.getByLabel("Bottle size", { exact: true }).fill("100 ml");
  await page.getByLabel("Woody", { exact: true }).check();
  await page.getByLabel("English description", { exact: true }).fill("A sample saved persistently, not confirmed stock.");
  await page.getByLabel("Arabic description", { exact: true }).fill("عينة محفوظة وليست مخزوناً مؤكداً.");
  await page.getByLabel("Featured product", { exact: true }).check();
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(page).toHaveURL(/saved=1/);
  await page.goto("/en/perfumes/demo-fragrance-001");
  await expect(page.getByRole("heading", { name: "Sample Fragrance", exact: true })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "http://127.0.0.1:3101/en/perfumes/demo-fragrance-001");
  expect(await (await page.request.get("/sitemap.xml")).text()).toContain("/ar/perfumes/demo-fragrance-001");
  await page.goto("/en");
  await revealHomeSection(page, "featured");
  const featured = page.getByRole("region", { name: "Featured fragrances", exact: true });
  await expect(featured.getByTestId("product-card").first()).toContainText("Sample Fragrance");
  await page.goto("/ar");
  await revealHomeSection(page, "featured");
  await expect(page.getByRole("region", { name: "عطور مختارة", exact: true })
    .getByRole("link", { name: "عرض Sample Fragrance", exact: true })).toBeVisible();
  await page.goto("/en/admin/products/DEMO001");
  await page.getByLabel("Product name", { exact: true }).fill("Updated Sample Fragrance");
  await page.getByLabel("Approved reference image", { exact: true }).selectOption("/perfumes/P0574.webp");
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(page).toHaveURL(/saved=1/);
  await page.goto("/en");
  await revealHomeSection(page, "featured");
  const updated = featured.getByRole("link", { name: "View Updated Sample Fragrance", exact: true });
  await expect(updated).toBeVisible();
  await expect(updated.locator("img")).toHaveAttribute("src", /\/perfumes\/P0574\.webp$/);
  const campaign = page.getByRole("region", { name: "Fragrances in focus", exact: true });
  await expect(campaign.getByRole("link", { name: "View Updated Sample Fragrance", exact: true })
    .locator("img")).toHaveAttribute("src", /\/perfumes\/P0574\.webp$/);
  // Header search works from an admin route without conflicting with admin Search.
  await page.goto("/en/admin/products");
  await page.getByRole("banner").getByRole("searchbox", { name: "Search the collection", exact: true }).fill("Updated Sample");
  await page.getByRole("banner").getByRole("button", { name: "Search the catalogue", exact: true }).click();
  await expect(page.getByTestId("product-card")).toHaveCount(1);
  await expect(page.getByTestId("product-card")).toContainText("Updated Sample Fragrance");
  // This really stops and restarts Next, keeping the same on-disk database.
  await stop(); await start();
  await page.goto("/en");
  await revealHomeSection(page, "featured");
  await expect(featured.getByRole("link", { name: "View Updated Sample Fragrance", exact: true })).toBeVisible();
  await expect(featured.getByTestId("product-card").first().locator("img"))
    .toHaveAttribute("src", /\/perfumes\/P0574\.webp$/);
  await page.goto("/en/perfumes/armaf-club-de-nuit-iconic-p0028");
  await expect(page.getByText("Saved admin demonstration description.", { exact: true })).toBeVisible();
  await page.goto("/ar/perfumes/demo-fragrance-001");
  await expect(page.getByText("عينة محفوظة وليست مخزوناً مؤكداً.", { exact: true })).toBeVisible();
  await page.goto("/en/admin/analytics");
  await expect(page.getByText("Example analytics — sample data, not live GA4 reporting.", { exact: true })).toBeVisible();
  await expect(page.getByText("420", { exact: true })).toBeVisible();
  await expect(page.getByText("25", { exact: true })).toBeVisible();
  mkdirSync("artifacts/screenshots", { recursive: true });
  await page.screenshot({ path: "artifacts/screenshots/admin-example-report.png", fullPage: true });
  await page.goto("/en/admin/products/P0028");
  await page.getByLabel("English description", { exact: true }).fill("Unauthorized overwrite");
  await page.context().clearCookies();
  await page.getByRole("button", { name: "Save product" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/en/perfumes/armaf-club-de-nuit-iconic-p0028");
  await expect(page.getByText("Saved admin demonstration description.", { exact: true })).toBeVisible();
  await page.goto("/en/admin/analytics");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("an empty persistent catalogue renders honest recovery in both languages", async ({ page }) => {
  await stop();
  const populatedDatabase = database;
  database = path.join(dir, "empty.sqlite");
  const empty = openProductStore(database);
  empty.close();
  try {
    await start();
    for (const locale of ["en", "ar"]) {
      await page.goto(`/${locale}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByTestId("product-card")).toHaveCount(0);
      await expect(page.getByRole("main").locator('a[href*="/perfumes/"]')).toHaveCount(0);
      await expect(page.getByText(locale === "en"
        ? "The collection is being prepared. Ask us about a fragrance."
        : "يجري إعداد المجموعة. تواصل معنا للاستفسار عن عطر.", { exact: true })).toBeVisible();
      await expect(page.locator("#featured")).toHaveCount(0);
      await page.getByRole("banner").locator(`a[href="/${locale}#scents"]`).click();
      await expect(page.locator("#scents")).toBeInViewport();
      await page.getByRole("contentinfo").locator(`a[href="/${locale}#houses"]`).click();
      await expect(page.locator("#houses")).toBeInViewport();
      await page.getByRole("main").getByRole("link", { name: locale === "en" ? "Explore collection" : "اكتشف المجموعة", exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/catalogue$`));
      await expect(page.getByTestId("product-card")).toHaveCount(0);
      await expect(page.getByRole("main").getByRole("heading", {
        name: locale === "en" ? "A different direction, perhaps?" : "لنجرب اتجاهاً آخر؟", exact: true,
      })).toBeVisible();
    }
  } finally {
    await stop(); database = populatedDatabase; await start();
  }
});
