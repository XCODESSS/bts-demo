import { expect, test } from "vitest";
import products from "../../src/data/products.json";
import { validateProduct } from "../../src/features/products/product-validation";
import { getStorefrontModel } from "../../src/features/home/storefront-model";
import { getScentSpotlights } from "../../src/features/home/scent-spotlights";

const catalogue = products.map(validateProduct);

test("salon previews contain bounded real note matches with known catalogue counts", () => {
  const groups = getStorefrontModel(catalogue, "en").groups;
  const choices = getScentSpotlights(catalogue, groups, "en");
  expect(choices.map(({ id, count }) => ({ id, count }))).toEqual([
    { id: "lemon", count: 14 }, { id: "rose", count: 14 },
    { id: "oud", count: 6 }, { id: "vanilla", count: 13 },
  ]);
  expect(choices[0].product.name).toBe("Torino21");
  expect(choices[0].href).toBe("/en/catalogue?note=lemon");
  expect(choices[2].product.name).toBe("Haltane");
  for (const choice of choices) {
    expect(choice.product.notes.en.map((note) => note.toLowerCase())).toContain(choice.id);
  }
});

test("Arabic previews preserve official product names with localized note labels and routes", () => {
  const groups = getStorefrontModel(catalogue, "ar").groups;
  const choice = getScentSpotlights(catalogue, groups, "ar")[0];
  expect(choice.label).toBe("الليمون");
  expect(choice.product.name).toBe("Torino21");
  expect(choice.href).toBe("/ar/catalogue?note=lemon");
  expect(choice.count).toBe(14);
});

test("empty and small catalogues never invent a preview or mutate discovery order", () => {
  expect(getScentSpotlights([], [], "en")).toEqual([]);
  const small = [catalogue[0]];
  const groups = getStorefrontModel(small, "en").groups;
  const before = JSON.stringify(groups);
  const choices = getScentSpotlights(small, groups, "en");
  expect(choices.length).toBeLessThanOrEqual(4);
  expect(choices[0].product.id).toBe("P0574");
  expect(choices.every((choice) => choice.count === 1)).toBe(true);
  expect(JSON.stringify(groups)).toBe(before);
});
