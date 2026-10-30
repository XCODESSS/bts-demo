import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { ProductImage } from "../products/product-image";
import { Icon } from "../../components/icon";
import type { StorefrontTile } from "./storefront-model";
import styles from "./discovery.module.css";

export function StorefrontCategories({ locale, items }: { locale: Locale; items: readonly StorefrontTile[] }) {
  const d = getDictionary(locale);
  if (!items.length) return null;
  return (
    <section className={`${styles.categories} section page-width`} aria-labelledby="for-you-title">
      <div className="section-heading"><div><h2 id="for-you-title">{d.categoriesTitle}</h2><p>{d.categoriesIntro}</p></div></div>
      <div className={styles.categoryGrid}>
        {items.map((item) => <Link key={item.id} href={item.href} className={styles.category} aria-label={item.label}>
          <span className={styles.categoryImage}><ProductImage product={item.product} locale={locale} className={styles.bottle} /></span>
          <span className={styles.categoryCaption}>
            <span className={styles.categoryLabel}>{item.label}</span>
            <span className={styles.categoryNote}>{d.featuring} <bdi translate="no">{item.product.brand} {item.product.name}</bdi></span>
          </span>
          <span className={styles.categoryArrow}><Icon name="arrow" size={18} className="directional" /></span>
        </Link>)}
      </div>
    </section>
  );
}
