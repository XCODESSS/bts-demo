import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { families } from "../../i18n/taxonomy";
import { getNoteOptions, parseCatalogueQuery, queryCatalogue } from "../catalogue/query";
import type { Product } from "../products/model";

export type StorefrontTile = {
  id: string;
  label: string;
  href: string;
  product: Product;
};
export type DiscoveryTile = { id: string; label: string; href: string; count: number };
export type DiscoveryGroup = {
  id: "notes" | "families";
  label: string;
  items: readonly DiscoveryTile[];
};
export type StorefrontModel = {
  total: number;
  heroProducts: readonly Product[];
  featuredProducts: readonly Product[];
  brands: readonly { name: string; href: string; count: number }[];
  groups: readonly DiscoveryGroup[];
  categories: readonly StorefrontTile[];
};

/** Merchandising only: no claims about sales, arrival dates or confirmed stock. */
export function getStorefrontModel(products: readonly Product[], locale: Locale): StorefrontModel {
  const d = getDictionary(locale);
  // Appended featured products stay discoverable when the eight slots are full.
  const featured = products.filter((product) => product.featured).slice().reverse();
  const ordered = [...featured, ...products.filter((product) => !product.featured)];
  const featuredProducts = ordered.slice(0, 8);
  const options = getNoteOptions(products);
  const preferred = ["lavender", "lemon", "amber", "bergamot", "oud", "jasmine", "vanilla", "rose"];
  const candidates = [...preferred.flatMap((value) => options.filter((option) => option.value === value)), ...options];
  const seen = new Set<string>();
  const notes = candidates.filter((option) => {
    if (seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  }).slice(0, 8).flatMap((option) => {
    const params = new URLSearchParams({ note: option.value });
    const query = parseCatalogueQuery(params, products);
    const count = queryCatalogue(products, query, locale).total;
    return count ? [{ id: option.value, label: option.label[locale],
      href: `/${locale}/catalogue?${params}`, count }] : [];
  });
  const familyItems = Object.entries(families).flatMap(([id, label]) => {
    const count = products.filter((product) => product.familyIds.includes(id)).length;
    return count ? [{ id, label: label[locale],
      href: `/${locale}/catalogue?${new URLSearchParams({ family: id })}`, count }] : [];
  }).slice(0, 8);
  const categories = (["men", "women", "unisex"] as const).flatMap((gender) => {
    const product = products.find((product) => product.gender === gender);
    return product ? [{ id: gender, label: d[gender],
      href: `/${locale}/catalogue?${new URLSearchParams({ gender })}`, product }] : [];
  });
  const groups: DiscoveryGroup[] = [];
  if (notes.length) groups.push({ id: "notes", label: d.noteFilter, items: notes });
  if (familyItems.length) groups.push({ id: "families", label: d.family, items: familyItems });
  return {
    total: products.length,
    heroProducts: featuredProducts.slice(0, 3),
    featuredProducts,
    brands: [...new Set(products.map((product) => product.brand))]
      .sort((a, b) => a.localeCompare(b, "en"))
      .map((name) => ({ name, href: `/${locale}/catalogue?brand=${encodeURIComponent(name)}`,
        count: products.filter((product) => product.brand === name).length })),
    groups,
    categories,
  };
}
