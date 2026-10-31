import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { ProductCard } from "../products/product-card";
import { getStorefrontModel } from "./storefront-model";
import { getProducts } from "../products/repository";
import { CampaignHero } from "./campaign-hero";
import { getScentSpotlights } from "./scent-spotlights";
import { ScentSpotlight } from "./scent-spotlight";
import { CollectionsBrowser } from "./collections-browser";
import { BrandDirectory } from "./brand-directory";
import { StorefrontCategories } from "./storefront-categories";
import { CollectionPromise } from "./collection-promise";
import { CustomerExperiences } from "./customer-experiences";
import { ScrollSection } from "./storefront-motion";
import { Icon } from "../../components/icon";
import styles from "./home.module.css";

export function HomePage({ locale }: { locale: Locale }) {
  const products = getProducts();
  const model = getStorefrontModel(products, locale);
  const spotlights = getScentSpotlights(products, model.groups, locale);
  const d = getDictionary(locale);
  return <>
    <CampaignHero locale={locale} products={model.heroProducts} spotlights={spotlights} />
    {!!model.groups.length && <ScrollSection id="scents">
      <section className={styles.collectionsBand} aria-label={d.collectionsTitle}>
        <div className={`${styles.collections} page-width`}>
          <div className="section-heading"><h2>{d.collectionsTitle}</h2><p>{d.collectionsIntro}</p></div>
          <CollectionsBrowser groups={model.groups} label={d.discover} locale={locale}
            notePreview={spotlights.length ? <ScentSpotlight choices={spotlights} locale={locale} placement="discovery" /> : undefined} />
        </div>
      </section>
    </ScrollSection>}
    {!!model.brands.length && <ScrollSection id="houses"><BrandDirectory locale={locale} brands={model.brands} /></ScrollSection>}
    {!!model.featuredProducts.length && <ScrollSection id="featured">
      <section className={`${styles.featured} page-width`} aria-label={d.featuredTitle}>
        <div className="section-heading"><h2>{d.featuredTitle}</h2><p>{d.featuredIntro}</p></div>
        <p className={styles.demoDisclaimer}>{d.demoPricingDisclaimer}</p>
        <div className="product-grid">{model.featuredProducts.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}</div>
        <div className={styles.viewAll}><Link href={`/${locale}/catalogue`} className="button button-dark">{d.viewAll}</Link></div>
      </section>
    </ScrollSection>}
    <ScrollSection id="catalogue-guide">
      <section className={styles.guideBand} aria-label={d.guideTitle}>
        <div className={`${styles.guide} page-width`}><h2>{d.guideTitle}</h2><ul>
          <li><Icon name="globe" />{d.guideExplore}</li><li><Icon name="drop" />{d.guideDetails}</li><li><Icon name="whatsapp" />{d.guideEnquire}</li>
        </ul></div>
      </section>
    </ScrollSection>
    {!!model.categories.length && <ScrollSection id="for-you"><StorefrontCategories locale={locale} items={model.categories} /></ScrollSection>}
    <ScrollSection id="approach"><CollectionPromise locale={locale} /></ScrollSection>
    <ScrollSection id="customer-experiences"><CustomerExperiences locale={locale} /></ScrollSection>
  </>;
}
