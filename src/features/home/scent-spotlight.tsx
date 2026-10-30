"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useSearchParams } from "next/navigation";
import { withSearchValue } from "../../lib/interface-state";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { Icon } from "../../components/icon";
import { ProductImage } from "../products/product-image";
import type { ScentSpotlight as Spotlight } from "./scent-spotlights";
import styles from "./scent-spotlight.module.css";

export function ScentSpotlight({ choices, locale, placement = "hero" }: {
  choices: readonly Spotlight[];
  locale: Locale;
  placement?: "hero" | "discovery";
}) {
  const search = useSearchParams();
  const [localSelected, setLocalSelected] = useState(choices[0]?.id);
  const requested = placement === "discovery" ? search.get("scent") : localSelected;
  const current = choices.find((choice) => choice.id === requested) || choices[0];
  const d = getDictionary(locale);
  if (!current) return null;

  function choose(event: MouseEvent<HTMLAnchorElement>, id: string) {
    // Without script (or with a modified click), these remain real filtered links.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (placement === "hero") { setLocalSelected(id); return; }
    if (!choices.some(choice => choice.id === id)) return;
    const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const next = withSearchValue(href, "scent", id === choices[0]?.id ? null : id);
    if (next !== href) window.history.pushState(null, "", next);
  }

  return <div className={`${styles.spotlight} ${placement === "discovery" ? styles.discovery : ""}`}
    data-placement={placement} role="region" aria-label={d.spotlightLabel}>
    <div className={styles.selection}>
      <p className={styles.prompt}>{d.spotlightPrompt}</p>
      <nav className={styles.notes} aria-label={d.spotlightLabel}>
        {choices.map((choice) => <a key={choice.id} href={choice.href}
          aria-current={current.id === choice.id ? "true" : undefined}
          onClick={(event) => choose(event, choice.id)}>{choice.label}</a>)}
      </nav>
    </div>
    <figure className={styles.figure}>
      <Link key={current.product.id} href={`/${locale}/perfumes/${current.product.slug}`}
        className={styles.product} aria-label={`${d.view} ${current.product.name}`}>
        <ProductImage product={current.product} locale={locale} priority={placement === "hero"} className={styles.bottle} />
      </Link>
      <figcaption className={styles.caption} aria-live="polite" aria-atomic="true">
        <p className={styles.house} translate="no"><bdi>{current.product.brand}</bdi></p>
        <p className={styles.name} translate="no"><bdi>{current.product.name}</bdi></p>
        <p className={styles.count}>{new Intl.NumberFormat(locale).format(current.count)} {d.results} {d.spotlightWith} {current.label}</p>
        <Link href={current.href} className={styles.browse}>{d.spotlightBrowse}<Icon name="arrow" size={20} className="directional" /></Link>
      </figcaption>
    </figure>
  </div>;
}
