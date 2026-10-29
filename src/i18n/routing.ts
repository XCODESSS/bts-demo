import { isLocale, type Locale } from "./config";
import type { Product } from "../features/products/model";
import {
  parseCatalogueQuery,
  serializeCatalogueQuery,
} from "../features/catalogue/query";
export function switchLocaleHref(
  pathname: string,
  search: string,
  target: Locale,
): string {
  const segments = pathname.split("/");
  if (!isLocale(segments[1])) return `/${target}`;
  segments[1] = target;
  const query = search.replace(/^\?/, "");
  return `${segments.join("/")}${query ? `?${query}` : ""}`;
}
export function catalogueReturnHref(
  locale: Locale,
  raw: string | null,
  products: readonly Product[],
): string {
  const base = `/${locale}/catalogue`;
  if (
    !raw ||
    raw.startsWith("/") ||
    /^[a-z][a-z0-9+.-]*:/i.test(raw) ||
    raw.length > 2000
  )
    return base;
  const query = parseCatalogueQuery(new URLSearchParams(raw), products);
  const serialized = serializeCatalogueQuery(query);
  return serialized ? `${base}?${serialized}` : base;
}
