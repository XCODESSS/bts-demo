import { expect, test } from "vitest";
import { getProducts } from "../../src/features/products/repository";
test("final demo contains exactly 100 unique products with bilingual content", () => {
  const products = getProducts();
  expect(products).toHaveLength(100);
  expect(new Set(products.map((p) => p.id)).size).toBe(100);
  expect(new Set(products.map((p) => p.slug)).size).toBe(100);
  expect(products.filter((p) => p.featured)).toHaveLength(8);
  for (const p of products) {
    expect(p.notes.ar).toHaveLength(p.notes.en.length);
    expect(p.description.ar).not.toBe("");
    expect(p).not.toHaveProperty("prices");
  }
});
