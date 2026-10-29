import { expect, test } from "vitest";
import products from "../../src/data/products.json";
import { getDemoPricing } from "../../src/features/products/demo-pricing";

test("sample AED prices use stable, exact discounted amounts", () => {
  expect(getDemoPricing("P0574")).toEqual({ original: 600, discounted: 420, discountPercent: 30 });
  expect(getDemoPricing("P0028")).toEqual({ original: 900, discounted: 765, discountPercent: 15 });
});

test("all sample products get positive whole-AED demo discounts", () => {
  for (const product of products) {
    const price = getDemoPricing(product.id);
    expect(price.original).toBeGreaterThan(price.discounted);
    expect(price.discounted).toBeGreaterThan(0);
    expect(Number.isInteger(price.discounted)).toBe(true);
    expect([15, 20, 25, 30]).toContain(price.discountPercent);
    expect((price.original - price.discounted) * 100 / price.original).toBe(price.discountPercent);
  }
});

test("new admin IDs have reproducible samples without adding persisted price fields", () => {
  expect(getDemoPricing("DEMO001")).toEqual(getDemoPricing("DEMO001"));
  expect(products[0]).not.toHaveProperty("price");
  expect(products[0]).not.toHaveProperty("discountPercent");
});
