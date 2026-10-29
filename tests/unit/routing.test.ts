import { expect, test } from "vitest";
import { switchLocaleHref, catalogueReturnHref } from "../../src/i18n/routing";
import { getProducts } from "../../src/features/products/repository";
test("language change keeps the product and filter query intact", () => {
  expect(
    switchLocaleHref("/en/perfumes/test-p0028", "return=q%3Dmint", "ar"),
  ).toBe("/ar/perfumes/test-p0028?return=q%3Dmint");
  expect(switchLocaleHref("/ar/catalogue", "?brand=Chanel&page=2", "en")).toBe(
    "/en/catalogue?brand=Chanel&page=2",
  );
});
test("locale switching and product return links preserve the canonical note filter", () => {
  expect(switchLocaleHref("/en/catalogue", "note=vanilla&page=2", "ar")).toBe(
    "/ar/catalogue?note=vanilla&page=2",
  );
  expect(catalogueReturnHref("ar", "note=Vanilla&page=2", getProducts())).toBe(
    "/ar/catalogue?note=vanilla&page=2",
  );
});
test("return links cannot redirect to outside websites or injected paths", () => {
  for (const raw of [
    "https://evil.example",
    "//evil.example",
    "javascript:alert(1)",
    "/en/catalogue",
  ]) {
    expect(catalogueReturnHref("ar", raw, getProducts())).toBe("/ar/catalogue");
  }
  expect(
    catalogueReturnHref(
      "ar",
      "brand=Chanel&page=2&tracking=private",
      getProducts(),
    ),
  ).toBe("/ar/catalogue?brand=Chanel&page=2");
});
