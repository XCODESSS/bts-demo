import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { ProductImage } from "../products/product-image";
import { Icon } from "../../components/icon";
import type { StorefrontTile } from "./storefront-model";
import styles from "./discovery.module.css";
import motion from "../../components/card-motion.module.css";

export function StorefrontCategories({ locale, items }: { locale: Locale; items: readonly StorefrontTile[] }) {
  const d = getDictionary(locale);
  if (!items.length) return null;
  return (
    <section data-reveal className={`${styles.categories} page-width`} aria-label={d.categoriesTitle}>
      <div className="section-heading"><h2>{d.categoriesTitle}</h2><p>{d.categoriesIntro}</p></div>
      <div className={styles.categoryGrid}>
        {items.map((item) => <Link key={item.id} href={item.href} className={`${styles.category} ${motion.interactive}`} aria-label={item.label}>
          <div className={styles.categoryImage}><ProductImage product={item.product} locale={locale} className={`${styles.bottle} ${motion.visual}`} /></div>
          <div className={styles.categoryCaption}>
            <div><h3>{item.label}</h3><p>{d.featuring} <bdi>{item.product.brand} {item.product.name}</bdi></p></div>
            <span className={`${styles.categoryArrow} ${motion.action}`}><Icon name="arrow" size={18} className="directional" /></span>
          </div>
        </Link>)}
      </div>
    </section>
  );
}
