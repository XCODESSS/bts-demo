import { existsSync } from "node:fs";
import path from "node:path";
import type {
  Product,
  LocalizedText,
  Gender,
} from "../src/features/products/model";
import { families, concentrations } from "../src/i18n/taxonomy";
import noteTranslations from "../content/note-translations.json";

export type EditorialMap = Record<
  string,
  { description: LocalizedText; featured: boolean }
>;
export type SourceProduct = {
  id: string;
  brand: string;
  name: string;
  sizeLabel: string;
  concentration: string;
  gender: string;
  familyTags: string[];
  notes: string[];
  warnings: string[];
  productType: string;
  matchStatus: string;
  singleSizeMl: number | null;
  condition: string;
  image: { path?: string; representation?: string; status: string };
};

export function parseSource(text: string): unknown[] {
  const match = text.match(
    /^globalThis\.PERFUME_DATA\s*=\s*(\[[\s\S]*\]);\s*$/,
  );
  if (!match) throw new Error("Unexpected catalogue export format");
  const data: unknown = JSON.parse(match[1]);
  if (!Array.isArray(data)) throw new Error("Catalogue must contain an array");
  return data;
}

export function sourceProducts(records: readonly unknown[]): SourceProduct[] {
  return records.map((record) => {
    if (!record || typeof record !== "object")
      throw new Error("Invalid source record");
    const row = record as Record<string, unknown>;
    for (const key of [
      "id",
      "brand",
      "name",
      "sizeLabel",
      "gender",
      "concentration",
      "condition",
      "productType",
      "matchStatus",
    ]) {
      if (typeof row[key] !== "string")
        throw new Error(`Invalid source ${key}`);
    }
    for (const key of ["familyTags", "notes", "warnings"]) {
      if (
        !Array.isArray(row[key]) ||
        !row[key].every((item) => typeof item === "string")
      )
        throw new Error(`Invalid source ${key}`);
    }
    if (!row.image || typeof row.image !== "object")
      throw new Error("Invalid source image");
    return record as SourceProduct;
  });
}

export function sourceImagePath(root: string, relativePath: string): string {
  const base = path.resolve(root, "site/assets/perfumes");
  const resolved = path.resolve(root, "site", relativePath);
  if (
    !resolved.startsWith(base + path.sep) ||
    !/\.(jpg|jpeg|png|webp)$/i.test(resolved)
  )
    throw new Error("Unsafe image path");
  if (!existsSync(resolved)) throw new Error("Missing image file");
  return resolved;
}

export function productSlug(
  product: Pick<SourceProduct, "brand" | "name" | "id">,
): string {
  return `${product.brand}-${product.name}-${product.id}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildDemoProducts(
  records: readonly unknown[],
  selection: readonly string[],
  editorial: EditorialMap,
  sourceRoot: string,
): Product[] {
  if (new Set(selection).size !== selection.length)
    throw new Error("Duplicate selected ID");
  const source = sourceProducts(records);
  const translations: Record<string, string> = noteTranslations;
  const products = selection.map((id) => {
    const row = source.find((item) => item.id === id);
    if (!row) throw new Error(`Missing source ID: ${id}`);
    if (!/^P\d{4}$/.test(id)) throw new Error("Invalid product ID");
    const quarantined = ["P0417", "P0428", "P0445", "P0463", "P0537"];
    if (
      row.productType !== "Perfume" ||
      row.matchStatus !== "Exact" ||
      row.warnings.length ||
      !Number.isFinite(row.singleSizeMl) ||
      Number(row.singleSizeMl) <= 0 ||
      /leak|damaged/i.test(row.condition) ||
      quarantined.includes(id)
    )
      throw new Error(`Ineligible product: ${id}`);
    if (!editorial[id]) throw new Error(`Missing editorial: ${id}`);
    if (!row.image.path) throw new Error(`Missing image: ${id}`);
    sourceImagePath(sourceRoot, row.image.path);
    const gender = (
      { Men: "men", Women: "women", Unisex: "unisex" } as Record<string, Gender>
    )[row.gender];
    if (!gender) throw new Error(`Unknown gender: ${id}`);
    const familyIds = row.familyTags.map((tag) => {
      const entry = Object.entries(families).find(
        ([, family]) => family.source === tag,
      );
      if (!entry) throw new Error(`Unmapped family: ${tag}`);
      return entry[0];
    });
    const concentration = concentrations[row.concentration];
    if (!concentration) throw new Error(`Unknown concentration: ${id}`);
    const notes = row.notes
      .filter((note) => translations[note.toLowerCase()])
      .slice(0, 6);
    return {
      id,
      slug: productSlug(row),
      brand: row.brand,
      name: row.name,
      sizeLabel: row.sizeLabel,
      concentration,
      gender,
      familyIds,
      notes: {
        en: notes,
        ar: notes.map((note) => translations[note.toLowerCase()]),
      },
      description: editorial[id].description,
      image: {
        src: `/perfumes/${id}.webp`,
        caveat: {
          en: "Reference photograph. Bottle size and packaging may differ. Demo selection; availability on enquiry.",
          ar: "صورة مرجعية. قد يختلف حجم العبوة وتغليفها. تشكيلة تجريبية؛ يرجى الاستفسار عن التوفر.",
        },
      },
      featured: editorial[id].featured,
    };
  });
  if (new Set(products.map((product) => product.slug)).size !== products.length)
    throw new Error("Duplicate product slug");
  return products;
}
