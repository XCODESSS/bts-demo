import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { EnquiryLink } from "../enquiry/enquiry-link";
import styles from "./home-extras.module.css";

export function CollectionPromise({ locale, count }: { locale: Locale; count: number }) {
  const d = getDictionary(locale);
  const features = [
    [d.featureCollectionTitle, d.featureCollectionCopy],
    [d.featureLanguageTitle, d.featureLanguageCopy],
    [d.featureEnquiryTitle, d.featureEnquiryCopy],
    [d.featureDetailsTitle, d.featureDetailsCopy],
  ];
  return <section className={styles.promise} aria-label={d.personalTitle}>
    <div className={`${styles.promiseInner} page-width`}>
      <h2><span>{new Intl.NumberFormat(locale).format(count)} {d.results}.</span><span>{d.collectionVision}</span></h2>
      <p className={styles.promiseIntro}>{d.personalCopy}</p>
      <div className={styles.features}>
        {features.map(([title, copy]) => <div key={title}><h3>{title}</h3><p>{copy}</p></div>)}
      </div>
      <div className={styles.promiseAction}><EnquiryLink locale={locale} /></div>
    </div>
  </section>;
}
