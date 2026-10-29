import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { getDemoPricing } from "./demo-pricing";
import styles from "./product.module.css";

export function DemoPrice({ productId, locale }: { productId: string; locale: Locale }) {
  const d = getDictionary(locale);
  const pricing = getDemoPricing(productId);
  const format = new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency", currency: "AED", maximumFractionDigits: 0,
  });
  return <div className={styles.demoPrice} data-testid="demo-price">
    <div className={styles.priceValues}>
      <del><bdi>{format.format(pricing.original)}</bdi></del>
      <strong><bdi>{format.format(pricing.discounted)}</bdi></strong>
    </div>
    <small>{d.demoPrice}</small>
  </div>;
}
