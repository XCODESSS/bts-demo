import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { families, concentrations } from "../src/i18n/taxonomy";
import type { Product } from "../src/features/products/model";
const products: Product[] = JSON.parse(
  readFileSync("src/data/products.json", "utf8"),
);
const expected = process.argv.includes("--seed") ? 3 : 100;
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
assert(products.length === expected, `Expected ${expected} products`);
assert(new Set(products.map((p) => p.id)).size === expected, "Duplicate IDs");
assert(
  new Set(products.map((p) => p.slug)).size === expected,
  "Duplicate slugs",
);
const forbidden = new Set([
  "prices",
  "catalogue",
  "online",
  "sourceDescription",
  "evidenceUrls",
  "listings",
  "cost",
  "markup",
  "vat",
  "fx",
]);
function inspectFields(value: unknown): void {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert(!forbidden.has(key), `Private data field: ${key}`);
    inspectFields(child);
  }
}
inspectFields(products);
const keys = [
  "id",
  "slug",
  "brand",
  "name",
  "sizeLabel",
  "concentration",
  "gender",
  "familyIds",
  "notes",
  "description",
  "image",
  "featured",
]
  .sort()
  .join(",");
for (const p of products) {
  assert(
    Object.keys(p).sort().join(",") === keys,
    `Unexpected fields on ${p.id}`,
  );
  assert(/^P\d{4}$/.test(p.id), "Malformed ID");
  assert(
    p.familyIds.every((id) => Object.hasOwn(families, id)),
    `Unknown family: ${p.id}`,
  );
  assert(
    Object.values(concentrations).some(
      (c) => c.en === p.concentration.en && c.ar === p.concentration.ar,
    ),
    `Unknown concentration: ${p.id}`,
  );
  assert(
    p.description.en &&
      p.description.ar &&
      p.notes.en.length === p.notes.ar.length,
    `Incomplete translation: ${p.id}`,
  );
  assert(
    p.image.src === `/perfumes/${p.id}.webp`,
    `Unexpected image path: ${p.id}`,
  );
  assert(
    existsSync(path.join("public", p.image.src)),
    `Missing image: ${p.id}`,
  );
}
function publicFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? publicFiles(path.join(directory, entry.name))
      : [path.join(directory, entry.name).replaceAll("\\", "/")],
  );
}
const allowed = new Set([
  ...products.map((p) => `public${p.image.src}`),
  "public/brand/logo.png",
  "public/brand/icon.png",
  "public/hero/torino21.png",
]);
for (const file of publicFiles("public"))
  assert(allowed.has(file), `Unapproved public file: ${file}`);
console.log(
  `PASS: ${products.length} unique bilingual products, ${new Set(products.map((p) => p.brand)).size} houses, local images present, no private fields/documents.`,
);
