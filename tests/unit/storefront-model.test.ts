import { expect, test } from "vitest";
import products from "../../src/data/products.json";
import { validateProduct } from "../../src/features/products/product-validation";
import { getStorefrontModel } from "../../src/features/home/storefront-model";
import { parseCatalogueQuery, queryCatalogue } from "../../src/features/catalogue/query";

const catalogue = products.map(validateProduct);

test("an empty catalogue has no fabricated campaign or discovery links", () => {
  expect(getStorefrontModel([], "en")).toEqual({
    total: 0, heroProducts: [], featuredProducts: [], brands: [], groups: [], categories: [],
  });
});

test("current featured edits and appended featured products are visible", () => {
  const changed = { ...catalogue[0], name: "Edited campaign fragrance" };
  const added = { ...catalogue[1], id: "DEMO001", slug: "demo-one", featured: true };
  const model = getStorefrontModel([changed, added], "en");
  expect(model.featuredProducts.map((product) => product.id)).toEqual(["DEMO001", "P0574"]);
  expect(model.heroProducts[1].name).toBe("Edited campaign fragrance");
  expect(model.heroProducts[1].image.src).toBe("/perfumes/P0574.webp");
});

test("small catalogues reuse only real products and supported categories", () => {
  const product = { ...catalogue[0], featured: false, gender: "unisex" as const };
  const model = getStorefrontModel([product], "en");
  expect(model.heroProducts.map((item) => item.id)).toEqual(["P0574"]);
  expect(model.featuredProducts).toHaveLength(1);
  expect(model.categories.map((item) => item.id)).toEqual(["unisex"]);
});

test("discovery entries describe categories and match counts, never mislabeled example bottles", () => {
  const model = getStorefrontModel(catalogue.slice(0, 2), "en");
  const notes = model.groups.find((group) => group.id === "notes")!;
  expect(notes.items.find((item) => item.id === "lemon")).toEqual({
    id: "lemon", label: "Lemon", href: "/en/catalogue?note=lemon", count: 1,
  });
  for (const group of model.groups) {
    expect(new Set(group.items.map((item) => item.id)).size).toBe(group.items.length);
    for (const item of group.items) expect(item).not.toHaveProperty("product");
  }
});

test("brand links encode punctuation and do not reorder the input", () => {
  const input = [{ ...catalogue[0], brand: "A & B House" }, catalogue[1]];
  const model = getStorefrontModel(input, "en");
  expect(new URL(model.brands[0].href, "http://localhost").searchParams.get("brand")).toBe("A & B House");
  expect(input.map((product) => product.id)).toEqual(["P0574", "P0170"]);
});

for (const locale of ["en", "ar"] as const) {
  test(`every ${locale} discovery destination has matching real products`, () => {
    const model = getStorefrontModel(catalogue, locale);
    const links = [...model.groups.flatMap((group) => group.items), ...model.categories, ...model.brands];
    for (const link of links) {
      const url = new URL(link.href, "http://localhost");
      const result = queryCatalogue(catalogue, parseCatalogueQuery(url.searchParams, catalogue), locale);
      expect(url.pathname).toBe(`/${locale}/catalogue`);
      expect(result.total).toBeGreaterThan(0);
    }
    expect(model.heroProducts).toHaveLength(3);
    expect(model.featuredProducts).toHaveLength(8);
    expect(new Set(model.featuredProducts.map((product) => product.id)).size).toBe(8);
  });
}

test("Lemon discovery opens real lemon results in Arabic", () => {
  const model = getStorefrontModel(catalogue, "ar");
  const lemon = model.groups.find((group) => group.id === "notes")!
    .items.find((item) => item.id === "lemon")!;
  expect(lemon.href).toBe("/ar/catalogue?note=lemon");
  const params = new URL(lemon.href, "http://localhost").searchParams;
  const result = queryCatalogue(catalogue, parseCatalogueQuery(params, catalogue), "ar");
  expect(result.total).toBeGreaterThan(0);
  expect(result.items.some((product) => product.id === "P0574")).toBe(true);
});
