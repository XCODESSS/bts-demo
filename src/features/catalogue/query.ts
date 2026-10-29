import type { Product, Gender, LocalizedText } from "../products/model";
import type { Locale } from "../../i18n/config";
import { families } from "../../i18n/taxonomy";
export type CatalogueQuery = {
  q: string;
  brand: string;
  gender: Gender | "";
  family: string;
  note: string;
  sort: "featured" | "name-asc" | "name-desc";
  page: number;
};
export type CatalogueResult = {
  items: readonly Product[];
  total: number;
  page: number;
  totalPages: number;
};
export const PAGE_SIZE = 12;
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .toLowerCase()
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا");
}
export type NoteOption = { value: string; label: LocalizedText };
function noteKey(note: string): string {
  return normalizeSearch(note).replace(/[^\p{L}\p{N}]/gu, "");
}
export function getNoteOptions(products: readonly Product[]): NoteOption[] {
  const options = new Map<string, NoteOption>();
  for (const product of products) {
    product.notes.en.forEach((note, index) => {
      const value = noteKey(note);
      if (!value || options.has(value)) return;
      options.set(value, {
        value,
        label: { en: note, ar: product.notes.ar[index] || note },
      });
    });
  }
  return [...options.values()].sort((a, b) =>
    a.label.en.localeCompare(b.label.en, "en", { sensitivity: "base" }),
  );
}
export function parseCatalogueQuery(
  params: URLSearchParams,
  products: readonly Product[],
): CatalogueQuery {
  const brand = params.get("brand") || "";
  const gender = params.get("gender") || "";
  const family = params.get("family") || "";
  const requestedNote = noteKey(params.get("note") || "");
  const selectedNote = getNoteOptions(products).find(
    (option) =>
      option.value === requestedNote ||
      noteKey(option.label.ar) === requestedNote,
  );
  const sort = params.get("sort") || "";
  const page = Number(params.get("page") || 1);
  return {
    q: (params.get("q") || "").trim().slice(0, 200),
    brand: products.some((product) => product.brand === brand) ? brand : "",
    gender:
      gender === "men" || gender === "women" || gender === "unisex"
        ? gender
        : "",
    family: Object.hasOwn(families, family) ? family : "",
    note: selectedNote?.value || "",
    sort: sort === "name-asc" || sort === "name-desc" ? sort : "featured",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
}
export function queryCatalogue(
  products: readonly Product[],
  query: CatalogueQuery,
  locale: Locale,
): CatalogueResult {
  const terms = normalizeSearch(query.q).split(/\s+/).filter(Boolean);
  const matches = products.filter((product) => {
    const text = normalizeSearch(
      [
        product.brand,
        product.name,
        product.sizeLabel,
        ...product.notes[locale],
        ...product.notes.en,
        ...product.familyIds.flatMap((id) => [
          families[id]?.en || "",
          families[id]?.ar || "",
        ]),
      ].join(" "),
    );
    return (
      terms.every((term) => text.includes(term)) &&
      (!query.brand || product.brand === query.brand) &&
      (!query.gender || product.gender === query.gender) &&
      (!query.family || product.familyIds.includes(query.family)) &&
      (!query.note ||
        product.notes.en.some((note) => noteKey(note) === query.note))
    );
  });
  if (query.sort !== "featured") {
    const collator = new Intl.Collator("en", { sensitivity: "base" });
    matches.sort(
      (a, b) =>
        (query.sort === "name-desc" ? -1 : 1) *
          collator.compare(a.name, b.name) || a.id.localeCompare(b.id),
    );
  }
  const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const page = Math.min(query.page, totalPages);
  return {
    items: matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: matches.length,
    page,
    totalPages,
  };
}
export function serializeCatalogueQuery(query: CatalogueQuery): string {
  const params = new URLSearchParams();
  for (const key of ["q", "brand", "gender", "family", "note"] as const)
    if (query[key]) params.set(key, query[key]);
  if (query.sort !== "featured") params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  return params.toString();
}
