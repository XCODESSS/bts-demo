import type { Locale } from "./config";

export function preferredLocale(header: string | null): Locale {
  const ranges = (header || "").slice(0, 4096).split(",").slice(0, 100).flatMap(range => {
    const [tag, ...parameters] = range.trim().toLowerCase().split(";").map(part => part.trim());
    if (!/^(?:[a-z]{2,8}(?:-[a-z0-9]{1,8})*|\*)$/.test(tag)) return [];
    if (parameters.length > 1 || (parameters.length && !/^q=(?:0(?:\.\d{1,3})?|1(?:\.0{1,3})?)$/.test(parameters[0]))) return [];
    return [{ language: tag.split("-")[0], quality: parameters.length ? Number(parameters[0].slice(2)) : 1 }];
  });
  const excluded = new Set(ranges.filter(range => range.quality === 0).map(range => range.language));
  let selected: Locale = "en";
  let quality = 0;
  for (const range of ranges) {
    const language = range.language === "*" ? (["en", "ar"] as const).find(locale => !excluded.has(locale)) : range.language;
    if ((language === "en" || language === "ar") && range.quality > quality) {
      selected = language; quality = range.quality;
    }
  }
  return selected;
}
