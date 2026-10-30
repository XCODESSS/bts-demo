import { ProductNavigationLink } from "./product-transition";
import { formatDiscount } from "../../lib/format";
import type { Locale } from "../../i18n/config";
import type { Product } from "./model";
import { getDictionary } from "../../i18n/dictionaries";
import { families } from "../../i18n/taxonomy";
import { ProductImage } from "./product-image";
import { Icon } from "../../components/icon";
import { DemoPrice } from "./demo-price";
import { getDemoPricing } from "./demo-pricing";
import styles from "./product.module.css";
import motion from "../../components/card-motion.module.css";
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
  const href = `/${locale}/perfumes/${product.slug}${returnQuery ? `?return=${encodeURIComponent(returnQuery)}` : ""}`;
  return (
    <article className={styles.card} data-testid="product-card">
      <ProductNavigationLink
        productId={product.id}
        href={href}
        className={`${styles.cardLink} ${motion.interactive}`}
        label={`${d.view} ${product.name}`}
      >
        <div className={styles.imageStage}>
          <span className={styles.discountBadge} title={d.demoPrice}>{formatDiscount(pricing.discountPercent, locale)}</span>
          <ProductImage
            product={product}
            locale={locale}
            transition
            className={`${styles.cardImage} ${motion.visual}`}
          />
          <span className={`${styles.viewCircle} ${motion.action}`}>
            <Icon name="plus" size={20} />
          </span>
        </div>
        <div className={styles.cardBody}>
          <Heading className={styles.cardTitle}><bdi translate="no">{product.name}</bdi></Heading>
          <span className={styles.brand}><bdi translate="no">{product.brand}</bdi></span>
          <p className={styles.meta}>
            <span>{product.sizeLabel}</span>
            <span>{families[product.familyIds[0]]?.[locale]}</span>
          </p>
          <DemoPrice productId={product.id} locale={locale} />
          <span className={`${styles.cardAction} ${motion.action}`}>{d.viewFragrance}<Icon name="arrow" size={16} className="directional" /></span>
        </div>
      </ProductNavigationLink>
    </article>
  );
}
