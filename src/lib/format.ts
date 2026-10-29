import type { Locale } from "../i18n/config";

export function formatDiscount(percent: number, locale: Locale): string {
  return `−${new Intl.NumberFormat(locale === "ar" ? "ar-u-nu-arab" : locale, { style: "percent", maximumFractionDigits: 0 }).format(percent / 100)}`;
}
export function formatCount(count: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-u-nu-arab" : locale).format(count);
}
export function formatExamplePeriod(start: string, end: string, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "ar-AE-u-nu-arab", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
  return formatter.formatRange(new Date(`${start}T00:00:00Z`), new Date(`${end}T00:00:00Z`));
}
