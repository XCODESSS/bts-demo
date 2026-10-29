import Link from "next/link";
import type { Product } from "./model";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { families } from "../../i18n/taxonomy";
import { getProducts, getRelated } from "./repository";
import { catalogueReturnHref } from "../../i18n/routing";
import { ProductCard } from "./product-card";
import { ProductGallery } from "./product-gallery";
import { DemoPrice } from "./demo-price";
import { EnquiryLink } from "../enquiry/enquiry-link";
import { Icon } from "../../components/icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import styles from "./product.module.css";

export function ProductDetail({ product, locale, returnQuery }: {
  product: Product; locale: Locale; returnQuery: string | null;
}) {
  const d = getDictionary(locale);
  const returnHref = catalogueReturnHref(locale, returnQuery, getProducts());
  return (
    <div className="page-width">
      <div className={styles.productTopBar}>
        <nav aria-label={d.breadcrumbs} className={styles.breadcrumbs}>
          <Link href={`/${locale}`}>{d.home}</Link><span aria-hidden="true">/</span>
          <Link href={returnHref}>{d.collection}</Link><span aria-hidden="true">/</span>
          <bdi translate="no" aria-current="page">{product.name}</bdi>
        </nav>
        <Link href={returnHref} className={styles.back}><Icon name="arrow" size={17} />{d.back}</Link>
      </div>
      <article className={styles.detail} aria-label={product.name}>
        <div className={`${styles.detailInfo} ${styles.purchaseSummary}`}>
          <span className={styles.detailBrand}><bdi translate="no">{product.brand}</bdi></span>
          <h1 className={product.name.length > 28 ? styles.longTitle : undefined}><bdi translate="no">{product.name}</bdi></h1>
          <div className={styles.purchasePrice}><DemoPrice productId={product.id} locale={locale} /></div>
          <p className={styles.pricingDisclaimer}>{d.demoPricingDisclaimer}</p>
          <div className={styles.variantLine}>
            <span>{d.size}</span><bdi>{product.sizeLabel}</bdi><span>{product.concentration[locale]}</span>
          </div>
          <div className={styles.familyList}>
            {product.familyIds.map((id) => <Link href={`/${locale}/catalogue?family=${id}`} key={id}>{families[id][locale]}</Link>)}
          </div>
          <div className={styles.purchaseActions}>
            <EnquiryLink locale={locale} product={product} />
            <a href="#fragrance-details" className={styles.detailsLink}>{d.additionalInfo}<Icon name="arrow" size={16} className="directional" /></a>
          </div>
          <p className={styles.priceConfirmation}>{d.price}</p>
        </div>
        <ProductGallery product={product} locale={locale} />
        <div className={styles.detailBody}>
          <div className={styles.brandRow}>
            <span>{d.brand}</span><Link href={`/${locale}/catalogue?brand=${encodeURIComponent(product.brand)}`}><bdi translate="no">{product.brand}</bdi></Link>
          </div>
          <Accordion key={product.id} type="multiple" defaultValue={["description", "notes"]} className={styles.detailsAccordion}>
            <AccordionItem value="description" className={styles.accordionItem}>
              <AccordionTrigger headingLevel={2} className={styles.accordionTrigger}>{d.details}</AccordionTrigger>
              <AccordionContent className={styles.accordionBody}>
                <p className={styles.description}>{product.description[locale]}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="notes" className={styles.accordionItem}>
              <AccordionTrigger headingLevel={2} className={styles.accordionTrigger}>{d.notes}</AccordionTrigger>
              <AccordionContent className={styles.accordionBody}>
                <div className={styles.notes}>
                  {product.notes[locale].length ? <ul>{product.notes[locale].map((note) => <li key={note}>{note}</li>)}</ul>
                    : <p className={styles.description}>{d.noNotes}</p>}
                  <small>{d.notesCaption}</small>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </article>
      <section id="fragrance-details" className={styles.profile} aria-labelledby="fragrance-details-title">
        <div className={styles.profileHeading}>
          <span className={styles.profileMark}><Icon name="bottle" size={24} /></span>
          <h2 id="fragrance-details-title">{d.profileTitle}</h2>
        </div>
        <dl className={styles.profileGrid}>
          <div><dt><Icon name="house" size={17} />{d.brand}</dt><dd><Link href={`/${locale}/catalogue?brand=${encodeURIComponent(product.brand)}`}><bdi translate="no">{product.brand}</bdi></Link></dd></div>
          <div><dt><Icon name="bottle" size={17} />{d.size}</dt><dd><bdi>{product.sizeLabel}</bdi></dd></div>
          <div><dt><Icon name="drop" size={17} />{d.concentration}</dt><dd>{product.concentration[locale]}</dd></div>
          <div><dt><Icon name="users" size={17} />{d.gender}</dt><dd>{d[product.gender]}</dd></div>
        </dl>
      </section>
      <section className={styles.related}>
        <div className="section-heading"><div><h2>{d.related}</h2><p>{d.relatedCopy}</p></div></div>
        <div className="product-grid">
          {getRelated(product).map((item) => <ProductCard key={item.id} product={item} locale={locale} returnQuery={returnQuery || ""} />)}
        </div>
      </section>
    </div>
  );
}
