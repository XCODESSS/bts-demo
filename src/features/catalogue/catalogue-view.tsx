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
  const href = (page: number) =>
    `/${locale}/catalogue?${serializeCatalogueQuery({ ...query, page })}`;
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
        <p>{d.allCopy}</p>
        <p>{d.demoPricingDisclaimer}</p>
      </header>
      <CatalogueControls
        locale={locale}
        query={effectiveQuery}
        brands={brands}
        familyIds={familyIds}
        noteOptions={noteOptions}
      />
      <div className={styles.resultLine} role="status">
        <span>
          <b>{new Intl.NumberFormat(locale).format(result.total)}</b>{" "}
          {d.results}
        </span>
        <span>
          {d.page} {new Intl.NumberFormat(locale).format(result.page)} {d.of}{" "}
          {new Intl.NumberFormat(locale).format(result.totalPages)}
        </span>
      </div>
      {result.total === 0 ? (
        <section className={styles.empty}>
          <Icon name="search" size={40} />
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
            <Link
              className={styles.prev}
              href={href(result.page - 1)}
              aria-label={d.previous}
            >
              <Icon name="chevron" size={15} />
              <span>{d.previous}</span>
            </Link>
          ) : (
            <span className={styles.pageDisabled}>
              <Icon name="chevron" size={15} />
            </span>
          )}
          {pages.map((page, index) => (
            <span className={styles.pageGroup} key={page}>
              {index > 0 && page - pages[index - 1] > 1 && (
                <span className={styles.ellipsis}>…</span>
              )}
              <Link
                href={href(page)}
                aria-label={`${d.page} ${page}`}
                aria-current={page === result.page ? "page" : undefined}
              >
                {new Intl.NumberFormat(locale).format(page)}
              </Link>
            </span>
          ))}
          {result.page < result.totalPages ? (
            <Link
              className={styles.next}
              href={href(result.page + 1)}
              aria-label={d.next}
            >
              <span>{d.next}</span>
              <Icon name="chevron" size={15} />
            </Link>
          ) : (
            <span className={styles.pageDisabled}>
              <Icon name="chevron" size={15} />
            </span>
          )}
        </nav>
      )}
      <div className={styles.collectionEnd}>
        <span>✳</span>
        <p>{d.footerLine}</p>
      </div>
    </div>
  );
}
