"use client";
import { useRef } from "react";
import { formatDiscount } from "../../lib/format";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { Icon } from "../../components/icon";
import type { Product } from "./model";
import { ProductImage } from "./product-image";
import { getDemoPricing } from "./demo-pricing";
import styles from "./product.module.css";

export function ProductGallery({ product, locale }: { product: Product; locale: Locale }) {
  const d = getDictionary(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pricing = getDemoPricing(product.id);
  return <div className={styles.gallery}>
    <div className={styles.detailStage}>
      <span className={styles.photoLabel}>{d.demoPrice}</span>
      <span className={styles.detailDiscount}>{formatDiscount(pricing.discountPercent, locale)}</span>
      <button type="button" ref={trigger} className={styles.imageButton} aria-label={d.zoomImage}
        aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
        <ProductImage product={product} locale={locale} priority transition className={styles.detailImage} />
        <span className={styles.zoomMark}><Icon name="plus" size={22} /></span>
      </button>
    </div>
    <p className={styles.caveat}>{product.image.caveat[locale]}</p>
    <dialog ref={dialog} data-motion-dialog className={styles.photoDialog} aria-label={d.zoomImage}
      onClose={() => trigger.current?.focus()}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.current?.close();
      }}>
      <button type="button" className={`icon-button ${styles.photoClose}`} aria-label={d.closePhoto}
        onClick={() => dialog.current?.close()}><Icon name="close" /></button>
      <ProductImage product={product} locale={locale} className={styles.enlargedImage} />
      <p><bdi translate="no">{product.brand} {product.name}</bdi></p>
    </dialog>
  </div>;
}
