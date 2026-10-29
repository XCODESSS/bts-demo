import { expect, test } from "vitest";
import products from "../../src/data/products.json";
import { validateProduct } from "../../src/features/products/product-validation";
import { buildProductMetadata, buildSitemap, siteOrigin } from "../../src/features/seo/metadata";
const product = validateProduct(products.find((p) => p.id === "P0028"));
test("product metadata has canonical bilingual links and localized social content", () => {
  const result = buildProductMetadata(product, "ar", "https://example.com");
  expect(result.alternates).toEqual({ canonical: "https://example.com/ar/perfumes/armaf-club-de-nuit-iconic-p0028", languages: { en: "https://example.com/en/perfumes/armaf-club-de-nuit-iconic-p0028", ar: "https://example.com/ar/perfumes/armaf-club-de-nuit-iconic-p0028" } });
  expect(result.description).toBe(product.description.ar);
  expect(result.openGraph).toMatchObject({ locale: "ar_AE", url: "https://example.com/ar/perfumes/armaf-club-de-nuit-iconic-p0028", images: [{ url: `https://example.com${product.image.src}` }] });
});
test("sitemap includes both product locales and no admin or filter URLs", () => {
  const entries = buildSitemap([product], "https://example.com");
  expect(entries).toHaveLength(6);
  expect(entries.map((p) => p.url)).toContain("https://example.com/ar/perfumes/armaf-club-de-nuit-iconic-p0028");
  expect(entries.every((p) => !p.url.includes("?") && !p.url.includes("admin"))).toBe(true);
  expect(siteOrigin("https://example.com/path?tracking=secret")).toBe("https://example.com");
  expect(() => siteOrigin("javascript:alert(1)")).toThrow();
});
