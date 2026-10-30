import { ProductNavigationLink } from "./product-transition";
import { formatDiscount } from "../../lib/format";
import type { Locale } from "../../i18n/config";
import type { Product } from "./model";
import { getDictionary } from "../../i18n/dictionaries";
import { families } from "../../i18n/taxonomy";
import { ProductImage } from "./product-image";
import { DemoPrice } from "./demo-price";
import { getDemoPricing } from "./demo-pricing";
import styles from "./product.module.css";

/** The whole card is one link; no competing per-card buttons in a dense grid. */
export function ProductCard({
  product,
  locale,
  returnQuery = "",
  headingLevel = 3,
}: {
  product: Product;
  locale: Locale;
  returnQuery?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const d = getDictionary(locale);
  const pricing = getDemoPricing(product.id);
  const family = families[product.familyIds[0]]?.[locale];
  const href = `/${locale}/perfumes/${product.slug}${returnQuery ? `?return=${encodeURIComponent(returnQuery)}` : ""}`;
  return (
    <article className={styles.card} data-testid="product-card">
      <ProductNavigationLink
        productId={product.id}
        href={href}
        className={styles.cardLink}
        label={`${d.view} ${product.name}`}
      >
        <div className={styles.imageStage}>
          <span className={styles.discountBadge} title={d.demoPrice}>{formatDiscount(pricing.discountPercent, locale)}</span>
          <ProductImage product={product} locale={locale} transition className={styles.cardImage} />
        </div>
        <div className={styles.cardBody}>
          <span className={styles.brand}><bdi translate="no">{product.brand}</bdi></span>
          <Heading className={styles.cardTitle}><bdi translate="no">{product.name}</bdi></Heading>
          <p className={styles.meta}>
            <bdi>{product.sizeLabel}</bdi>
            {family && <span>{family}</span>}
          </p>
          <DemoPrice productId={product.id} locale={locale} />
        </div>
      </ProductNavigationLink>
    </article>
  );
}
