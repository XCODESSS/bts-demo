import Link from "next/link";
import Image from "next/image";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import type { Product } from "../products/model";
import { ProductImage } from "../products/product-image";
import { Icon } from "../../components/icon";
import { ScentSpotlight } from "./scent-spotlight";
import { DesignText } from "../../components/language-switch";
import type { ScentSpotlight as Spotlight } from "./scent-spotlights";
import styles from "./campaign-hero.module.css";

export function CampaignHero({ locale, products, spotlights }: {
  locale: Locale; products: readonly Product[]; spotlights: readonly Spotlight[];
}) {
  const d = getDictionary(locale);
  return (
    <div className={`${styles.hero} ${spotlights.length ? styles.withSpotlight : ""} page-width`}>
      <div className={styles.campaign}>
      <section className={styles.stage} aria-label={d.campaignProducts}>
        <div className={styles.statement}>
          <Image src="/brand/logo.png" width={76} height={76} alt={d.footerBrand}
            className={styles.brandLogo} loading="eager" fetchPriority="high" unoptimized />
          <p>{d.campaignLine}</p>
          <span className={styles.signature} aria-hidden="true">✧</span>
        </div>
        <div className={styles.products}>
          {products.map((product) => (
            <Link key={product.id} href={`/${locale}/perfumes/${product.slug}`}
              className={styles.product} aria-label={`${d.view} ${product.name}`}>
              <div className={styles.photo}>
                <ProductImage product={product} locale={locale} priority className={styles.bottle} />
              </div>
              <span className={styles.caption} translate="no"><bdi>{product.brand}</bdi><strong><bdi>{product.name}</bdi></strong></span>
            </Link>
          ))}
          {!products.length && <p id="scents" className={styles.empty}><span id="houses">{d.cataloguePreparing}</span></p>}
        </div>
      </section>
      <div className={styles.intro}>
        <Image src="/brand/logo.png" width={76} height={76} alt=""
          className={styles.introLogo} loading="eager" fetchPriority="high" unoptimized />
        <h1><DesignText classic={d.storefrontTitle} salon={d.salonTitle} /></h1>
        <p><DesignText classic={d.storefrontIntro} salon={d.salonIntro} /></p>
        <Link href={`/${locale}/catalogue`} className={styles.action}>
          {d.campaignAction}<Icon name="arrow" size={18} className="directional" />
        </Link>
      </div>
      </div>
      <ScentSpotlight choices={spotlights} locale={locale} />
    </div>
  );
}
