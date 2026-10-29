import type { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";
import { Icon } from "./icon";
import styles from "./site-header.module.css";

export function CatalogueSearch({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <form action={`/${locale}/catalogue`} method="get" role="search"
      aria-label={d.headerSearch} className={styles.search}>
      <input type="search" name="q" autoComplete="off" aria-label={d.headerSearch}
        placeholder={d.searchHint} maxLength={200} />
      <button type="submit" aria-label={d.headerSearchSubmit}>
        <Icon name="search" />
      </button>
    </form>
  );
}
