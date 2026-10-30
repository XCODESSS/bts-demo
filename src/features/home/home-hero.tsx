import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import type { Product } from "../products/model";
import { Icon } from "../../components/icon";
import { buildGeneralWhatsAppUrl } from "../enquiry/whatsapp";
import { TrackedEnquiryLink } from "../analytics/tracked-enquiry-link";
import { ScentSpotlight } from "./scent-spotlight";
import type { ScentSpotlight as Spotlight } from "./scent-spotlights";
import styles from "./hero.module.css";

/** Opening statement: brand green, real catalogue figures and a live note-to-perfume preview. */
export function HomeHero({ locale, spotlights, fallback, total, houses }: {
  locale: Locale; spotlights: readonly Spotlight[]; fallback?: Product; total: number; houses: number;
}) {
  const d = getDictionary(locale);
  const advice = buildGeneralWhatsAppUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, locale);
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  return (
    <section className={`${styles.hero} on-dark`} aria-labelledby="home-title">
      <div className={`${styles.inner} page-width`}>
        <div className={styles.copy}>
          <span className={`eyebrow ${styles.eyebrow}`}>{d.heroEyebrow}</span>
          <h1 id="home-title">{d.storefrontTitleLead} <em>{d.storefrontTitleAccent}</em></h1>
          <p className={styles.intro}>{d.storefrontIntro}</p>
          <div className={styles.actions}>
            <Link href={`/${locale}/catalogue`} className="button button-gold">
              {d.campaignAction}<Icon name="arrow" size={18} className="directional" />
            </Link>
            {advice && <TrackedEnquiryLink href={advice} locale={locale} className="button button-on-dark">
              <Icon name="whatsapp" />{d.advice}
            </TrackedEnquiryLink>}
          </div>
          {total > 0 && <dl className={styles.facts}>
            <div><dt>{d.results}</dt><dd>{number(total)}</dd></div>
            <div><dt>{d.houseResults}</dt><dd>{number(houses)}</dd></div>
          </dl>}
        </div>
        <div className={styles.stage}>
          <ScentSpotlight choices={spotlights} locale={locale} fallback={fallback} />
        </div>
      </div>
    </section>
  );
}
