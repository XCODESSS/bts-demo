export type Locale = "en" | "ar";
export function isLocale(value: string): value is Locale {
  return value === "en" || value === "ar";
}
