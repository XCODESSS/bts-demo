import { expect, test } from "vitest";
import seed from "../../src/data/products.json" with { type: "json" };
import { validateProduct } from "../../src/features/products/product-validation";
import { queryAdminProducts } from "../../src/features/admin/products-query";
const products = seed.map(validateProduct);

test("admin queries clamp pages and combine normalized search terms", () => {
  for (const page of ["-1", "NaN", "0", "1.5"]) expect(queryAdminProducts(products, new URLSearchParams({ page })).page).toBe(1);
  expect(queryAdminProducts(products, new URLSearchParams("page=999999999999999999999999" )).page).toBe(4);
  expect(queryAdminProducts(products, new URLSearchParams("page=4")).items).toHaveLength(25);
  expect(queryAdminProducts(products, new URLSearchParams("q=armaf+iconic")).items.map(p => p.id)).toEqual(["P0028"]);
  expect(queryAdminProducts(products, new URLSearchParams("q=armaf+__missing__")).items).toEqual([]);
  expect(queryAdminProducts([], new URLSearchParams())).toMatchObject({ total: 0, page: 1, totalPages: 1, items: [] });
});

test("admin browsing is bounded and searches real product identities", () => {
  const result = queryAdminProducts(products, new URLSearchParams());
  expect(result.total).toBe(100);
  expect(result.items).toHaveLength(25);
  expect(result.totalPages).toBe(4);
  expect(queryAdminProducts(products, new URLSearchParams("q=P0028")).items.map(p => p.id)).toEqual(["P0028"]);
  expect(queryAdminProducts(products, new URLSearchParams("q=__not_a_product__")).total).toBe(0);
});
