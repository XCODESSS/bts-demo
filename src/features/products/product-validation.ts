import seed from "../../data/products.json" with { type: "json" };
import { concentrations, families } from "../../i18n/taxonomy";
import type { Product } from "./model";

export const productImages = [...new Set(seed.map((p) => p.image.src))];
const keys = ["id", "slug", "brand", "name", "sizeLabel", "concentration", "gender", "familyIds", "notes", "description", "image", "featured"];
function object(value: unknown, allowed: string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected a product object.");
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some((key) => !allowed.includes(key))) throw new Error("Unexpected product field.");
  return record;
}
function text(value: unknown, label: string, max = 200): string {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\u0000-\u0008]/.test(value)) throw new Error(`${label} is required (maximum ${max} characters).`);
  return value.trim();
}
function localized(value: unknown, label: string) {
  const v = object(value, ["en", "ar"]);
  return { en: text(v.en, `${label} (English)`, 3000), ar: text(v.ar, `${label} (Arabic)`, 3000) };
}
function strings(value: unknown, label: string): string[] {
  if (!Array.isArray(value) || value.length > 50) throw new Error(`${label} must be a list of at most 50 entries.`);
  return [...new Set(value.map((v) => text(v, label)))];
}
export function validateProduct(input: unknown): Product {
  const v = object(input, keys);
  const id = text(v.id, "ID", 50);
  const slug = text(v.slug, "Slug", 160);
  if (!/^[A-Za-z0-9_-]+$/.test(id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Use a safe ID and a lowercase hyphenated slug.");
  const concentration = localized(v.concentration, "Concentration");
  if (!Object.values(concentrations).some((c) => c.en === concentration.en && c.ar === concentration.ar)) throw new Error("Choose a supported concentration.");
  if (v.gender !== "men" && v.gender !== "women" && v.gender !== "unisex") throw new Error("Choose a supported gender.");
  const familyIds = strings(v.familyIds, "Families");
  if (!familyIds.length || familyIds.some((id) => !Object.hasOwn(families, id))) throw new Error("Choose supported fragrance families.");
  const n = object(v.notes, ["en", "ar"]);
  const notes = { en: strings(n.en, "English notes"), ar: strings(n.ar, "Arabic notes") };
  if (notes.en.length !== notes.ar.length) throw new Error("English and Arabic notes must be paired.");
  const image = object(v.image, ["src", "caveat"]);
  if (typeof image.src !== "string" || !productImages.includes(image.src)) throw new Error("Choose an existing approved product image.");
  if (typeof v.featured !== "boolean") throw new Error("Featured must be true or false.");
  return { id, slug, brand: text(v.brand, "Brand"), name: text(v.name, "Name"), sizeLabel: text(v.sizeLabel, "Size"), concentration, gender: v.gender, familyIds, notes, description: localized(v.description, "Description"), image: { src: image.src, caveat: localized(image.caveat, "Photo caveat") }, featured: v.featured };
}
