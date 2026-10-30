"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import { withSearchValue } from "../../lib/interface-state";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { Icon } from "../../components/icon";
import type { Product } from "../products/model";
import { ProductImage } from "../products/product-image";
import type { ScentSpotlight as Spotlight } from "./scent-spotlights";
import styles from "./hero.module.css";

/**
 * A note choice previews one real matching perfume. The choice lives in `?scent=` so reload,
 * Back/Forward and language switching keep it; without script the chips are real catalogue links.
 */
export function ScentSpotlight({ choices, locale, fallback }: {
  choices: readonly Spotlight[];
  locale: Locale;
  fallback?: Product;
}) {
  const search = useSearchParams();
  const current = choices.find((choice) => choice.id === search.get("scent")) || choices[0];
  const product = current?.product || fallback;
  const d = getDictionary(locale);
  if (!product) return <p className={styles.empty}>{d.cataloguePreparing}</p>;

  function choose(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!choices.some(choice => choice.id === id)) return;
    const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const next = withSearchValue(href, "scent", id === choices[0]?.id ? null : id);
    if (next !== href) window.history.pushState(null, "", next);
  }

  return <div className={styles.spotlight} role="region" aria-label={d.spotlightLabel} data-spotlight>
    {current && <div className={styles.selection}>
      <p className={styles.prompt}>{d.spotlightPrompt}</p>
      <nav className={styles.notes} aria-label={d.spotlightLabel}>
        {choices.map((choice) => <a key={choice.id} href={choice.href}
          aria-current={current.id === choice.id ? "true" : undefined}
          onClick={(event) => choose(event, choice.id)}>{choice.label}</a>)}
      </nav>
    </div>}
    <figure className={styles.figure}>
      <div className={styles.orbit} aria-hidden="true" />
      <Link key={product.id} href={`/${locale}/perfumes/${product.slug}`}
        className={styles.aperture} aria-label={`${d.view} ${product.name}`}>
        <ProductImage product={product} locale={locale} priority className={styles.bottle} />
      </Link>
      <figcaption className={styles.caption} aria-live="polite" aria-atomic="true">
        <span className={styles.house} translate="no"><bdi>{product.brand}</bdi></span>
        <span className={styles.name} translate="no"><bdi>{product.name}</bdi></span>
        {current && <span className={styles.count}>
          {new Intl.NumberFormat(locale).format(current.count)} {current.count === 1 ? d.resultSingular : d.results} {d.spotlightWith} {current.label}
        </span>}
        {current && <Link href={current.href} className={styles.browse}>
          {d.spotlightBrowse}<Icon name="arrow" size={18} className="directional" />
        </Link>}
      </figcaption>
    </figure>
  </div>;
}
