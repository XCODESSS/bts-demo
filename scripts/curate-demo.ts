import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { parseSource, sourceProducts, type EditorialMap } from "./import-core";
import { families } from "../src/i18n/taxonomy";
const root = process.env.PERFUME_SOURCE_DIR || "D:/perfume-search";
const source = sourceProducts(
  parseSource(readFileSync(`${root}/site/data/catalogue.js`, "utf8")),
);
const featured = [
  "P0574",
  "P0170",
  "P0433",
  "P0074",
  "P0100",
  "P0041",
  "P0577",
  "P0168",
];
const seed = ["P0028", "P0074", "P0574"];
const campaignOnly = new Set([
  "P0064",
  "P0065",
  "P0066",
  "P0068",
  "P0069",
  "P0072",
]);
const eligible = source.filter(
  (p) =>
    !campaignOnly.has(p.id) &&
    p.productType === "Perfume" &&
    p.matchStatus === "Exact" &&
    p.image.path &&
    p.singleSizeMl &&
    ["Men", "Women", "Unisex"].includes(p.gender) &&
    p.warnings.length === 0 &&
    !/leak|damaged/i.test(p.condition),
);
const preferred = new Set([
  "Xerjoff",
  "Diptyque",
  "Burberry",
  "Chanel",
  "Dior",
  "Giorgio Armani",
  "Parfums de Marly",
  "Prada",
  "Versace",
  "Tom Ford",
  "Nishane",
  "Kayali",
]);
function score(id: string, brand: string, condition: string): number {
  if (featured.includes(id)) return 200 - featured.indexOf(id);
  if (seed.includes(id)) return 180;
  return (
    (preferred.has(brand) ? 40 : 0) + (condition === "Not stated" ? 10 : 0)
  );
}
const seen = new Set<string>();
const candidates = eligible
  .sort(
    (a, b) =>
      score(b.id, b.brand, b.condition) - score(a.id, a.brand, a.condition) ||
      a.id.localeCompare(b.id),
  )
  .filter((p) => {
    const identity = `${p.brand}|${p.name}|${p.concentration}`.toLowerCase();
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
const selected = process.argv.includes("--seed")
  ? seed.map((id) => candidates.find((p) => p.id === id)!)
  : candidates.slice(0, 100);
if (selected.some((p) => !p))
  throw new Error("Seed missing from eligible pool");
const editorial: EditorialMap = {};
for (const p of selected) {
  const matched = p.familyTags
    .map((tag) => Object.values(families).find((f) => f.source === tag)!)
    .filter(Boolean);
  editorial[p.id] = {
    featured: featured.includes(p.id),
    description: {
      en: `${p.name} by ${p.brand} brings together ${matched.map((f) => f.en.toLowerCase()).join(" and ")} facets. Discover its selected notes below, and ask us about the fragrance before choosing your next signature.`,
      ar: `اكتشف عطر ${p.name} من ${p.brand} وعائلاته العطرية: ${matched.map((f) => f.ar).join("، ")}. تعرّف على نفحاته المختارة أدناه، واستفسر عنه قبل اختيار عطرك القادم.`,
    },
  };
}
mkdirSync("content", { recursive: true });
writeFileSync(
  "content/curation.json",
  JSON.stringify(
    selected.map((p) => p.id),
    null,
    2,
  ) + "\n",
);
writeFileSync(
  "content/editorial.json",
  JSON.stringify(editorial, null, 2) + "\n",
);
writeFileSync(
  "content/provenance.json",
  JSON.stringify(
    {
      permission:
        "User confirmed permission to publish existing photos on 2026-10-26.",
      selectionRule:
        "Exact perfume match, known gender, positive size, no source warnings, existing reference photo. One size per fragrance/concentration.",
      products: selected.map((p) => ({
        id: p.id,
        sourceImage: p.image.path,
        sourceCondition: p.condition,
        representation: p.image.representation,
      })),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    {
      selected: selected.length,
      brands: new Set(selected.map((p) => p.brand)).size,
      gender: Object.fromEntries(
        ["Men", "Women", "Unisex"].map((g) => [
          g,
          selected.filter((p) => p.gender === g).length,
        ]),
      ),
    },
    null,
    2,
  ),
);
