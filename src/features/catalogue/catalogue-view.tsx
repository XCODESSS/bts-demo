import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { getProducts } from "../products/repository";
import { ProductCard } from "../products/product-card";
import {
  parseCatalogueQuery,
  queryCatalogue,
  serializeCatalogueQuery,
  getNoteOptions,
} from "./query";
import { CatalogueControls } from "./catalogue-controls";
import { Icon } from "../../components/icon";
import styles from "./catalogue.module.css";

export function CatalogueView({
  locale,
  params,
}: {
  locale: Locale;
  params: URLSearchParams;
}) {
  const d = getDictionary(locale);
  const products = getProducts();
  const query = parseCatalogueQuery(params, products);
  const result = queryCatalogue(products, query, locale);
  const effectiveQuery = { ...query, page: result.page };
  const returnQuery = serializeCatalogueQuery(effectiveQuery);
  const brands = [...new Set(products.map((p) => p.brand))].sort((a, b) =>
    a.localeCompare(b),
  );
  const familyIds = [...new Set(products.flatMap((p) => p.familyIds))].sort();
  const noteOptions = getNoteOptions(products).sort((a, b) =>
    a.label[locale].localeCompare(b.label[locale], locale),
  );
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const href = (page: number) => {
    const serialized = serializeCatalogueQuery({ ...query, page });
    return `/${locale}/catalogue${serialized ? `?${serialized}` : ""}`;
  };
  const pages = Array.from(
    { length: result.totalPages },
    (_, i) => i + 1,
  ).filter(
    (page) =>
      page === 1 ||
      page === result.totalPages ||
      Math.abs(page - result.page) <= 1,
  );
  return (
    <div className="page-width">
      <header className={styles.pageHeader}>
        <Link href={`/${locale}`} className={styles.breadcrumb}>
          {d.home}
        </Link>
        <h1>{d.allTitle}</h1>
        <div className={styles.pageIntro}>
          <p>{d.allCopy}</p>
          <p className={styles.disclaimer}>{d.demoPricingDisclaimer}</p>
        </div>
      </header>
      <CatalogueControls
        locale={locale}
        query={effectiveQuery}
        total={result.total}
        brands={brands}
        familyIds={familyIds}
        noteOptions={noteOptions}
      />
      <div className={styles.resultLine} role="status">
        <span>
          <b>{number(result.total)}</b>{" "}
          {result.total === 1 ? d.resultSingular : d.results}
        </span>
        {result.totalPages > 1 && <span>
          {d.page} {number(result.page)} {d.of} {number(result.totalPages)}
        </span>}
      </div>
      {result.total === 0 ? (
        <section className={styles.empty}>
          <span className={styles.emptyMark}><Icon name="search" size={30} /></span>
          <h2>{d.emptyTitle}</h2>
          <p>{d.emptyCopy}</p>
          <Link href={`/${locale}/catalogue`} className="button button-light">
            {d.clear}
          </Link>
        </section>
      ) : (
        <div className="product-grid">
          {result.items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              returnQuery={returnQuery}
              headingLevel={2}
            />
          ))}
        </div>
      )}
      {result.totalPages > 1 && (
        <nav className={styles.pagination} aria-label={d.pagination}>
          {result.page > 1 ? (
            <Link className={styles.step} href={href(result.page - 1)} aria-label={d.previous}>
              <Icon name="chevron" size={16} className={styles.previousIcon} />
              <span>{d.previous}</span>
            </Link>
          ) : (
            <span className={`${styles.step} ${styles.stepDisabled}`} aria-hidden="true">
              <Icon name="chevron" size={16} className={styles.previousIcon} />
              <span>{d.previous}</span>
            </span>
          )}
          <span className={styles.pageNumbers}>
            {pages.map((page, index) => (
              <span className={styles.pageGroup} key={page}>
                {index > 0 && page - pages[index - 1] > 1 && (
                  <span className={styles.ellipsis} aria-hidden="true">…</span>
                )}
                <Link
                  href={href(page)}
                  aria-label={`${d.page} ${page}`}
                  aria-current={page === result.page ? "page" : undefined}
                >
                  {number(page)}
                </Link>
              </span>
            ))}
          </span>
          {result.page < result.totalPages ? (
            <Link className={styles.step} href={href(result.page + 1)} aria-label={d.next}>
              <span>{d.next}</span>
              <Icon name="chevron" size={16} className="directional" />
            </Link>
          ) : (
            <span className={`${styles.step} ${styles.stepDisabled}`} aria-hidden="true">
              <span>{d.next}</span>
              <Icon name="chevron" size={16} className="directional" />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
