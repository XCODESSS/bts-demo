"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { disableAnalytics, getConsent, initializeAnalytics, measurementId, setConsent, subscribeConsent, trackEvent } from "./browser";
import { pageViewParameters, validMeasurementId } from "./events";
import styles from "./analytics.module.css";
export function AnalyticsProvider() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => "unknown");
  const lastPath = useRef<string | null>(null);
  const previous = useRef("");
  const admin = pathname.includes("/admin");
  useEffect(() => {
    if (consent !== "granted" || admin) { disableAnalytics(); lastPath.current = null; return; }
    const page = pageViewParameters(window.location.href, previous.current || document.referrer);
    if (!page || !initializeAnalytics() || lastPath.current === pathname) return;
    trackEvent("page_view", page);
    previous.current = page.page_location;
    lastPath.current = pathname;
  }, [pathname, consent, admin]);
  if (!validMeasurementId(measurementId) || admin) return null;
  const ar = pathname.startsWith("/ar");
  return <aside className={styles.consent} aria-label={ar ? "خصوصية التحليلات" : "Analytics privacy"}>
    {consent === "unknown" ? <>
      <p>{ar ? "هل تسمح بتحليلات الاستخدام؟ لن نرسل رسالة واتساب أو بيانات الاتصال." : "Allow usage analytics? We never send your WhatsApp message or contact details."}</p>
      <button onClick={() => setConsent("granted")}>{ar ? "السماح بالتحليلات" : "Allow Analytics"}</button>
      <button onClick={() => setConsent("denied")}>{ar ? "رفض" : "Decline"}</button>
    </> : <button onClick={() => { if (consent === "granted") { disableAnalytics(); setConsent("denied"); } else setConsent("unknown"); }}>{ar ? (consent === "granted" ? "إيقاف التحليلات" : "خيارات التحليلات") : (consent === "granted" ? "Disable Analytics" : "Analytics Preferences")}</button>}
  </aside>;
}
