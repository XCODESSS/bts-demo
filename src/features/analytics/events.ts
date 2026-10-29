import type { Locale } from "../../i18n/config";
export function validMeasurementId(value: string | undefined): value is string { return /^G-[A-Z0-9]+$/.test(value || ""); }
function publicPath(path: string): boolean { return /^\/(en|ar)(?:\/catalogue|\/perfumes\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(path); }
export function pageViewParameters(href: string, referrer = "") {
  const url = new URL(href);
  if (!publicPath(url.pathname)) return null;
  let safeReferrer = "";
  try { const ref = new URL(referrer); if (ref.origin === url.origin && publicPath(ref.pathname)) safeReferrer = ref.origin + ref.pathname; } catch { /* External/empty referrer is deliberately omitted. */ }
  return { page_location: url.origin + url.pathname, page_referrer: safeReferrer, page_title: "Beyond the Space Perfume", locale: url.pathname.startsWith("/ar") ? "ar" : "en" };
}
export function enquiryParameters(locale: Locale, productId?: string) {
  return productId ? { locale, enquiry_type: "product", product_id: productId } : { locale, enquiry_type: "general" };
}
