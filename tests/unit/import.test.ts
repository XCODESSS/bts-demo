import { afterAll, expect, test } from "vitest";
import { mkdtempSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import {
  buildDemoProducts,
  parseSource,
  type EditorialMap,
} from "../../scripts/import-core";
const sourceRoot = mkdtempSync(path.join(tmpdir(), "bts-import-test-"));
mkdirSync(path.join(sourceRoot, "site/assets/perfumes"), { recursive: true });
copyFileSync(
  "public/perfumes/P0028.webp",
  path.join(sourceRoot, "site/assets/perfumes/P0028.webp"),
);
afterAll(() => rmSync(sourceRoot, { recursive: true, force: true }));
const source = [
  {
    id: "P0028",
    brand: "Armaf",
    name: "Club de Nuit Iconic",
    sizeLabel: "105 ml",
    singleSizeMl: 105,
    concentration: "Eau de Parfum",
    gender: "Men",
    familyTags: ["Amber"],
    notes: ["Amber"],
    warnings: [],
    productType: "Perfume",
    matchStatus: "Exact",
    condition: "Not stated",
    image: { path: "assets/perfumes/P0028.webp", status: "reference" },
    prices: { catalogue: 12345, currency: "INR" },
  },
];
const editorial: EditorialMap = {
  P0028: {
    description: { en: "An amber fragrance.", ar: "عطر عنبري." },
    featured: true,
  },
};

test("reads the trusted catalogue data envelope without executing JavaScript", () => {
  expect(parseSource('globalThis.PERFUME_DATA = [{"id":"P0001"}];\n')).toEqual([
    { id: "P0001" },
  ]);
});

test("rejects executable content appended to the export", () => {
  expect(() =>
    parseSource("globalThis.PERFUME_DATA = []; process.exit();"),
  ).toThrow("Unexpected catalogue export format");
});

test("exports only explicit demo fields and no supplier prices", () => {
  const products = buildDemoProducts(source, ["P0028"], editorial, sourceRoot);
  expect(products[0].name).toBe("Club de Nuit Iconic");
  expect(products[0]).not.toHaveProperty("prices");
  expect(products[0].image.src).toBe("/perfumes/P0028.webp");
});

test("rejects duplicate selection and missing records", () => {
  expect(() =>
    buildDemoProducts(source, ["P0028", "P0028"], editorial, sourceRoot),
  ).toThrow("Duplicate selected ID");
  expect(() =>
    buildDemoProducts(source, ["P9999"], editorial, sourceRoot),
  ).toThrow("Missing source ID");
});
test("cannot use a manifest to bypass unresolved identity warnings", () => {
  const uncertain = [{ ...source[0], warnings: ["Edition unconfirmed"] }];
  expect(() =>
    buildDemoProducts(uncertain, ["P0028"], editorial, sourceRoot),
  ).toThrow("Ineligible product");
});
test("rejects image path traversal", () => {
  const unsafe = [
    {
      ...source[0],
      image: { path: "../private/workbook.jpg", status: "reference" },
    },
  ];
  expect(() =>
    buildDemoProducts(unsafe, ["P0028"], editorial, sourceRoot),
  ).toThrow("Unsafe image path");
});
