import { expect, test } from "vitest";
import {
  parseCatalogueQuery,
  queryCatalogue,
  getNoteOptions,
  serializeCatalogueQuery,
} from "../../src/features/catalogue/query";
import { getProducts } from "../../src/features/products/repository";
const products = getProducts().filter((p) =>
  ["P0028", "P0074", "P0574"].includes(p.id),
);
test("search terms combine across the perfume house and fragrance name", () => {
  const query = parseCatalogueQuery(
    new URLSearchParams("q=armaf+iconic"),
    products,
  );
  expect(queryCatalogue(products, query, "en").items.map((p) => p.id)).toEqual([
    "P0028",
  ]);
});
test("a dedicated note filter matches the retained notes exactly", () => {
  const query = parseCatalogueQuery(new URLSearchParams("note=Mint"), products);
  expect(queryCatalogue(products, query, "en").items.map((p) => p.id)).toEqual([
    "P0574",
    "P0028",
  ]);
});
test("note filtering combines with search, brand, gender and family", () => {
  const query = parseCatalogueQuery(
    new URLSearchParams(
      "q=iconic&brand=Armaf&gender=men&family=amber&note=mint",
    ),
    products,
  );
  expect(queryCatalogue(products, query, "en").items.map((p) => p.id)).toEqual([
    "P0028",
  ]);
  const mismatch = { ...query, gender: "women" as const };
  expect(queryCatalogue(products, mismatch, "en").total).toBe(0);
});
test("note options deduplicate punctuation/case aliases and keep paired Arabic labels", () => {
  const aliases = [
    { ...products[0], notes: { en: ["Black Currant"], ar: ["الكشمش الأسود"] } },
    { ...products[1], notes: { en: ["blackcurrant"], ar: ["الكشمش الأسود"] } },
  ];
  expect(getNoteOptions(aliases)).toEqual([
    {
      value: "blackcurrant",
      label: { en: "Black Currant", ar: "الكشمش الأسود" },
    },
  ]);
});
test("a selected note does not match a different note containing the same word", () => {
  const distinctNotes = [
    { ...products[0], notes: { en: ["Peppermint"], ar: ["النعناع الفلفلي"] } },
    { ...products[1], notes: { en: ["Mint"], ar: ["النعناع"] } },
  ];
  const query = parseCatalogueQuery(
    new URLSearchParams("note=mint"),
    distinctNotes,
  );
  expect(
    queryCatalogue(distinctNotes, query, "en").items.map((p) => p.id),
  ).toEqual([products[1].id]);
});
test("Arabic note URLs normalize to the same locale-independent selection", () => {
  const query = parseCatalogueQuery(
    new URLSearchParams({ note: "الـنَّعناع" }),
    products,
  );
  expect(query.note).toBe("mint");
  expect(queryCatalogue(products, query, "ar").items.map((p) => p.id)).toEqual([
    "P0574",
    "P0028",
  ]);
});
test("note pagination retains the selection and unknown notes are ignored", () => {
  const all = getProducts();
  const query = parseCatalogueQuery(
    new URLSearchParams("note=Vanilla&page=2"),
    all,
  );
  const result = queryCatalogue(all, query, "en");
  expect(result.total).toBe(13);
  expect(result.items).toHaveLength(1);
  expect(serializeCatalogueQuery(query)).toBe("note=vanilla&page=2");
  const unknown = parseCatalogueQuery(
    new URLSearchParams("note=not-a-real-note"),
    all,
  );
  expect(unknown.note).toBe("");
  expect(queryCatalogue(all, unknown, "en").total).toBe(100);
});
test("different filter groups combine with AND", () => {
  const query = parseCatalogueQuery(
    new URLSearchParams("brand=Armaf&family=woody"),
    products,
  );
  expect(queryCatalogue(products, query, "en").total).toBe(0);
});
test("unsupported filters and malformed pagination return safe defaults", () => {
  const query = parseCatalogueQuery(
    new URLSearchParams(
      "brand=Fake&gender=unknown&family=fake&note=fake&sort=price&page=-2",
    ),
    products,
  );
  expect(query).toEqual({
    q: "",
    brand: "",
    gender: "",
    family: "",
    note: "",
    sort: "featured",
    page: 1,
  });
});
test("last page contains four records and excessive page numbers clamp", () => {
  const all = getProducts();
  const query = parseCatalogueQuery(new URLSearchParams("page=999"), all);
  const result = queryCatalogue(all, query, "en");
  expect(result.page).toBe(9);
  expect(result.items).toHaveLength(4);
});
test("name sorting does not mutate the source order", () => {
  const query = parseCatalogueQuery(
    new URLSearchParams("sort=name-desc"),
    products,
  );
  expect(queryCatalogue(products, query, "en").items.map((p) => p.id)).toEqual([
    "P0574",
    "P0074",
    "P0028",
  ]);
});
test("Arabic search ignores diacritics and elongation", () => {
  const query = parseCatalogueQuery(new URLSearchParams("q=حَـمْضي"), products);
  expect(
    queryCatalogue(products, query, "ar").items.some((p) => p.id === "P0574"),
  ).toBe(true);
});
