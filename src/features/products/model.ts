import type { Locale } from "../../i18n/config";
export type Gender = "men" | "women" | "unisex";
export type LocalizedText = Record<Locale, string>;
export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  sizeLabel: string;
  concentration: LocalizedText;
  gender: Gender;
  familyIds: string[];
  notes: Record<Locale, string[]>;
  description: LocalizedText;
  image: { src: string; caveat: LocalizedText };
  featured: boolean;
};
