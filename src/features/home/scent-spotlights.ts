import type { Locale } from "../../i18n/config";
import { parseCatalogueQuery, queryCatalogue } from "../catalogue/query";
import type { Product } from "../products/model";
import type { DiscoveryGroup } from "./storefront-model";

export type ScentSpotlight = {
  id: string;
  label: string;
  href: string;
  count: number;
  product: Product;
};

/** Bounded, actual note matches for the salon; never a second product catalogue. */
export function getScentSpotlights(
  products: readonly Product[],
  groups: readonly DiscoveryGroup[],
  locale: Locale,
): ScentSpotlight[] {
  const notes = groups.find((group) => group.id === "notes")?.items || [];
  const preferred = ["lemon", "rose", "oud", "vanilla"];
  const ordered = [...notes].sort((a, b) => {
    const rank = (id: string) => {
      const index = preferred.indexOf(id);
      return index < 0 ? preferred.length : index;
    };
    return rank(a.id) - rank(b.id);
  });
  return ordered.slice(0, 4).flatMap((note) => {
    const params = new URLSearchParams({ note: note.id });
    const result = queryCatalogue(products, parseCatalogueQuery(params, products), locale);
    const product = result.items[0];
    return product ? [{ ...note, count: result.total, product }] : [];
  });
}
