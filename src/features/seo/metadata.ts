import type { Metadata, MetadataRoute } from "next";
import type { Product } from "../products/model";
import type { Locale } from "../../i18n/config";
export function siteOrigin(value = process.env.SITE_URL || "http://localhost:3000"): string {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("SITE_URL must be an HTTP(S) origin without credentials.");
  return url.origin;
}
export function buildPageMetadata(locale: Locale, suffix: string, title: string, description: string, image = "/brand/icon.png", origin = siteOrigin()): Metadata {
  const absolute = (path: string) => new URL(path, origin).toString();
  const url = absolute(`/${locale}${suffix}`);
  return {
    title, description,
    alternates: { canonical: url, languages: { en: absolute(`/en${suffix}`), ar: absolute(`/ar${suffix}`) } },
    openGraph: { type: "website", title, description, url, siteName: "Beyond the Space Perfume", locale: locale === "ar" ? "ar_AE" : "en_US", alternateLocale: [locale === "ar" ? "en_US" : "ar_AE"], images: [{ url: absolute(image), alt: title }] },
  };
}
export function buildProductMetadata(product: Product, locale: Locale, origin = siteOrigin()): Metadata {
  return buildPageMetadata(locale, `/perfumes/${product.slug}`, `${product.brand} ${product.name}`, product.description[locale], product.image.src, origin);
}
export function buildSitemap(products: readonly Product[], origin = siteOrigin()): MetadataRoute.Sitemap {
  return ["", "/catalogue", ...products.map((p) => `/perfumes/${p.slug}`)].flatMap((suffix) => {
    const languages = { en: new URL(`/en${suffix}`, origin).toString(), ar: new URL(`/ar${suffix}`, origin).toString() };
    return Object.values(languages).map((url) => ({ url, alternates: { languages } }));
  });
}
