import { pageViewParameters, validMeasurementId } from "./events";
export type Consent = "unknown" | "granted" | "denied";
const KEY = "bts-analytics-consent";
let memoryConsent: Consent = "unknown";
declare global { interface Window { dataLayer?: unknown[][]; gtag?: (...args: unknown[]) => void; btsGaInitialized?: boolean; } }
export function getConsent(): Consent {
  try { const value = localStorage.getItem(KEY); if (value === "granted" || value === "denied") return value; } catch { /* Session-only choice when storage is blocked. */ }
  return memoryConsent;
}
export function setConsent(value: Consent) {
  memoryConsent = value;
  try { localStorage.setItem(KEY, value); } catch { /* Current session still works. */ }
  window.dispatchEvent(new Event("bts-consent"));
}
export function subscribeConsent(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener("bts-consent", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("bts-consent", callback); };
}
export const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export function initializeAnalytics(): boolean {
  if (!validMeasurementId(measurementId) || getConsent() !== "granted") return false;
  (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = false;
  if (window.btsGaInitialized) {
    window.gtag?.("consent", "update", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    return true;
  }
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => { window.dataLayer!.push(args); };
  window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  const page = pageViewParameters(window.location.href, document.referrer);
  window.gtag("config", measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: page?.page_location || window.location.origin, page_referrer: page?.page_referrer || "", page_title: "Beyond the Space Perfume" });
  const script = document.createElement("script");
  script.id = "bts-ga4"; script.async = true; script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
  window.btsGaInitialized = true;
  return true;
}
export function disableAnalytics() {
  if (validMeasurementId(measurementId)) (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  document.getElementById("bts-ga4")?.remove();
}
export function trackEvent(name: "page_view" | "whatsapp_enquiry_click", parameters: Record<string, unknown>) {
  const page = pageViewParameters(window.location.href);
  if (!page || getConsent() !== "granted" || !initializeAnalytics()) return;
  window.gtag?.("event", name, { ...page, ...parameters, send_to: measurementId });
}
