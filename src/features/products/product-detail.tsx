import Link from "next/link";
import type { Product } from "./model";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { families } from "../../i18n/taxonomy";
import { getProducts, getRelated } from "./repository";
import { catalogueReturnHref } from "../../i18n/routing";
import { noteKey } from "../catalogue/query";
import { ProductCard } from "./product-card";
import { ProductGallery } from "./product-gallery";
import { ProductNavigationLink } from "./product-transition";
import { DemoPrice, formatDemoAmount } from "./demo-price";
import { getDemoPricing } from "./demo-pricing";
import { EnquiryLink } from "../enquiry/enquiry-link";
import { buildWhatsAppUrl } from "../enquiry/whatsapp";
import { EnquiryBar } from "./enquiry-bar";
import { Icon } from "../../components/icon";
import { ProductDetailsAccordion } from "./product-details-accordion";
import styles from "./product.module.css";

export function ProductDetail({ product, locale, returnQuery }: {
  product: Product; locale: Locale; returnQuery: string | null;
}) {
  const d = getDictionary(locale);
  const returnHref = catalogueReturnHref(locale, returnQuery, getProducts());
  const brandHref = `/${locale}/catalogue?brand=${encodeURIComponent(product.brand)}`;
  const enquiryHref = buildWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, product, locale);
  const notes = product.notes[locale].map((label, index) => ({ label, key: noteKey(product.notes.en[index] || "") }));
  const productFamilies = product.familyIds.filter((id) => families[id]);
  return (
    <div className="page-width">
      <div className={styles.productTopBar}>
        <nav aria-label={d.breadcrumbs} className={styles.breadcrumbs}>
          <Link href={`/${locale}`}>{d.home}</Link><span aria-hidden="true">/</span>
          <Link href={returnHref}>{d.collection}</Link><span aria-hidden="true">/</span>
          <bdi translate="no" aria-current="page">{product.name}</bdi>
        </nav>
        <ProductNavigationLink productId={product.id} href={returnHref} className={styles.back}><Icon name="arrow" size={17} />{d.back}</ProductNavigationLink>
      </div>
      <article className={styles.detail} aria-label={product.name}>
        <ProductGallery product={product} locale={locale} />
        <div className={styles.detailInfo}>
          <Link href={brandHref} className={styles.detailBrand}><bdi translate="no">{product.brand}</bdi></Link>
          <h1 className={product.name.length > 28 ? styles.longTitle : undefined}><bdi translate="no">{product.name}</bdi></h1>
          <p className={styles.variantLine}>
            <span>{product.concentration[locale]}</span><span><bdi>{product.sizeLabel}</bdi></span><span>{d[product.gender]}</span>
          </p>
          <div className={styles.purchase}>
            <div className={styles.purchasePrice}><DemoPrice productId={product.id} locale={locale} /></div>
            <p className={styles.pricingDisclaimer}>{d.demoPricingDisclaimer}</p>
            <div id="product-enquiry" className={styles.purchaseActions}>
              <EnquiryLink locale={locale} product={product} />
              {enquiryHref && <p className={styles.enquiryHelp}>{d.enquiryHelp}</p>}
            </div>
          </div>
          <section aria-labelledby="fragrance-profile-title">
          <h2 id="fragrance-profile-title" className={`eyebrow ${styles.factsTitle}`}>{d.profileTitle}</h2>
          <dl className={styles.facts}>
            <div><dt>{d.brand}</dt><dd><Link href={brandHref}><bdi translate="no">{product.brand}</bdi></Link></dd></div>
            <div><dt>{d.size}</dt><dd><bdi>{product.sizeLabel}</bdi></dd></div>
            <div><dt>{d.concentration}</dt><dd>{product.concentration[locale]}</dd></div>
            <div><dt>{d.gender}</dt><dd><Link href={`/${locale}/catalogue?gender=${product.gender}`}>{d[product.gender]}</Link></dd></div>
            {!!productFamilies.length && <div><dt>{d.family}</dt><dd className={styles.familyList}>
              {productFamilies.map((id) => <Link href={`/${locale}/catalogue?family=${id}`} key={id}>{families[id][locale]}</Link>)}
            </dd></div>}
          </dl>
          </section>
          <ProductDetailsAccordion key={product.id} descriptionLabel={d.details} notesLabel={d.notes}
            description={<p className={styles.description}>{product.description[locale]}</p>}
            notes={<div className={styles.notes}>
              {notes.length ? <ul>{notes.map(note => <li key={note.label}>{note.key
                ? <Link href={`/${locale}/catalogue?note=${encodeURIComponent(note.key)}`}>{note.label}</Link>
                : <span>{note.label}</span>}</li>)}</ul>
                : <p className={styles.description}>{d.noNotes}</p>}
              <small>{notes.length ? `${d.notesCaption} ${d.notesExplore}` : null}</small>
            </div>} />
        </div>
      </article>
      <section className={styles.related} aria-labelledby="related-title">
        <div className="section-heading"><div><h2 id="related-title">{d.related}</h2><p>{d.relatedCopy}</p></div></div>
        <div className="product-grid">
          {getRelated(product).map((item) => <ProductCard key={item.id} product={item} locale={locale} returnQuery={returnQuery || ""} />)}
        </div>
      </section>
      {enquiryHref && <EnquiryBar targetId="product-enquiry" href={enquiryHref} locale={locale} productId={product.id}
        name={product.name} label={d.enquireShort}
        priceLine={`${formatDemoAmount(getDemoPricing(product.id).discounted, locale)} · ${d.demoPrice}`} />}
    </div>
  );
}
