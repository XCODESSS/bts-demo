import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { getDemoPricing } from "./demo-pricing";
import styles from "./product.module.css";

export function formatDemoAmount(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency", currency: "AED", maximumFractionDigits: 0,
  }).format(amount);
}

/** The sample amount leads; the struck original and the demo label are always present. */
export function DemoPrice({ productId, locale }: { productId: string; locale: Locale }) {
  const d = getDictionary(locale);
  const pricing = getDemoPricing(productId);
  return <div className={styles.demoPrice} data-testid="demo-price">
    <div className={styles.priceValues}>
      <strong><bdi>{formatDemoAmount(pricing.discounted, locale)}</bdi></strong>
      <del><bdi>{formatDemoAmount(pricing.original, locale)}</bdi></del>
    </div>
    <small>{d.demoPrice}</small>
  </div>;
}
