import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { ProductCard } from "../products/product-card";
import { getStorefrontModel } from "./storefront-model";
import { getProducts } from "../products/repository";
import { HomeHero } from "./home-hero";
import { getScentSpotlights } from "./scent-spotlights";
import { CollectionsBrowser } from "./collections-browser";
import { BrandDirectory } from "./brand-directory";
import { StorefrontCategories } from "./storefront-categories";
import { HomeClosing } from "./home-closing";
import { ScrollSection } from "./storefront-motion";
import { Icon } from "../../components/icon";
import styles from "./home.module.css";

/**
 * Story order: statement → what to buy now → how to discover → who it is for → the houses → talk to us.
 * Every figure, product and count comes from the live repository.
 */
export function HomePage({ locale }: { locale: Locale }) {
  const products = getProducts();
  const model = getStorefrontModel(products, locale);
  const spotlights = getScentSpotlights(products, model.groups, locale);
  const d = getDictionary(locale);
  return <>
    <HomeHero locale={locale} spotlights={spotlights} fallback={model.heroProducts[0]}
      total={model.total} houses={model.brands.length} />
    {!!model.featuredProducts.length && <ScrollSection id="featured">
      <section className={`${styles.featured} section page-width`} aria-labelledby="featured-title">
        <div className="section-heading">
          <div><h2 id="featured-title">{d.featuredTitle}</h2><p>{d.featuredIntro}</p></div>
          <Link href={`/${locale}/catalogue`} className="text-link">{d.viewAll}<Icon name="arrow" size={18} className="directional" /></Link>
        </div>
        <div className="product-grid four-up">{model.featuredProducts.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}</div>
        <p className={styles.demoDisclaimer}>{d.demoPricingDisclaimer}</p>
      </section>
    </ScrollSection>}
    {!!model.groups.length && <ScrollSection id="scents">
      <section className={styles.discoveryBand} aria-labelledby="scents-title">
        <div className="section page-width">
          <div className="section-heading"><div><h2 id="scents-title">{d.collectionsTitle}</h2><p>{d.collectionsIntro}</p></div></div>
          <CollectionsBrowser groups={model.groups} label={d.discover} locale={locale} />
        </div>
      </section>
    </ScrollSection>}
    {!!model.categories.length && <ScrollSection id="for-you"><StorefrontCategories locale={locale} items={model.categories} /></ScrollSection>}
    {!!model.brands.length && <ScrollSection id="houses"><BrandDirectory locale={locale} brands={model.brands} /></ScrollSection>}
    <ScrollSection id="approach"><HomeClosing locale={locale} /></ScrollSection>
  </>;
}
