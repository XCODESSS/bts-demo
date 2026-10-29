import seed from "../../data/products.json" with { type: "json" };
import { concentrations, families } from "../../i18n/taxonomy";
import type { Product } from "./model";
import type { ProductFormField } from "../admin/product-form-state";

export class ProductValidationError extends Error {
  constructor(message: string, readonly fields: readonly ProductFormField[]) {
    super(message);
    this.name = "ProductValidationError";
  }
}
export const productImages = [...new Set(seed.map(p => p.image.src))];
const keys = ["id", "slug", "brand", "name", "sizeLabel", "concentration", "gender", "familyIds", "notes", "description", "image", "featured"];
function object(value: unknown, allowed: string[], fields: readonly ProductFormField[] = []): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ProductValidationError("Expected a product object.", fields);
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some(key => !allowed.includes(key))) throw new ProductValidationError("Unexpected product field.", fields);
  return record;
}
function text(value: unknown, label: string, field: ProductFormField, max = 200): string {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\u0000-\u0008]/.test(value)) {
    throw new ProductValidationError(`${label} is required (maximum ${max} characters).`, [field]);
  }
  return value.trim();
}
function localized(value: unknown, label: string, en: ProductFormField, ar: ProductFormField) {
  const v = object(value, ["en", "ar"], [en, ar]);
  return { en: text(v.en, `${label} (English)`, en, 3000), ar: text(v.ar, `${label} (Arabic)`, ar, 3000) };
}
function strings(value: unknown, label: string, field: ProductFormField): string[] {
  if (!Array.isArray(value) || value.length > 50) throw new ProductValidationError(`${label} must be a list of at most 50 entries.`, [field]);
  return [...new Set(value.map(v => text(v, label, field)))];
}
export function validateProduct(input: unknown): Product {
  const v = object(input, keys);
  const id = text(v.id, "Product ID", "id", 50);
  const slug = text(v.slug, "URL Slug", "slug", 160);
  if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new ProductValidationError("Use letters, numbers, hyphens or underscores for the Product ID.", ["id"]);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new ProductValidationError("Use a lowercase hyphenated URL Slug.", ["slug"]);
  const concentration = localized(v.concentration, "Concentration", "concentration", "concentration");
  if (!Object.values(concentrations).some(c => c.en === concentration.en && c.ar === concentration.ar)) throw new ProductValidationError("Choose a supported concentration.", ["concentration"]);
  if (v.gender !== "men" && v.gender !== "women" && v.gender !== "unisex") throw new ProductValidationError("Choose a supported gender.", ["gender"]);
  const familyIds = strings(v.familyIds, "Families", "familyIds");
  if (!familyIds.length || familyIds.some(id => !Object.hasOwn(families, id))) throw new ProductValidationError("Choose supported fragrance families.", ["familyIds"]);
  const n = object(v.notes, ["en", "ar"], ["notesEn", "notesAr"]);
  const notes = { en: strings(n.en, "English notes", "notesEn"), ar: strings(n.ar, "Arabic notes", "notesAr") };
  if (notes.en.length !== notes.ar.length) throw new ProductValidationError("English and Arabic notes must be paired.", ["notesEn", "notesAr"]);
  const image = object(v.image, ["src", "caveat"], ["image"]);
  if (typeof image.src !== "string" || !productImages.includes(image.src)) throw new ProductValidationError("Choose an existing approved product image.", ["image"]);
  if (typeof v.featured !== "boolean") throw new ProductValidationError("Featured must be true or false.", ["featured"]);
  return {
    id, slug, brand: text(v.brand, "Brand", "brand"), name: text(v.name, "Name", "name"), sizeLabel: text(v.sizeLabel, "Size", "sizeLabel"),
    concentration, gender: v.gender, familyIds, notes,
    description: localized(v.description, "Description", "descriptionEn", "descriptionAr"),
    image: { src: image.src, caveat: localized(image.caveat, "Photo caveat", "caveatEn", "caveatAr") }, featured: v.featured,
  };
}
