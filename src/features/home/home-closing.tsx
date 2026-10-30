import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { EnquiryLink } from "../enquiry/enquiry-link";
import { Icon } from "../../components/icon";
import styles from "./home.module.css";

/** Closing invitation: the business is enquiry-led, so the page ends with a conversation. */
export function HomeClosing({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return <section className={`${styles.closing} on-dark`} aria-labelledby="approach-title">
    <div className={`${styles.closingInner} page-width`}>
      <h2 id="approach-title">{d.personalTitle}</h2>
      <div className={styles.closingCopy}>
        <p>{d.personalCopy}</p>
        <div className={styles.closingActions}>
          <EnquiryLink locale={locale} className="button-gold" />
          <Link href={`/${locale}/catalogue`} className="button button-on-dark">
            {d.viewAll}<Icon name="arrow" size={18} className="directional" />
          </Link>
        </div>
      </div>
    </div>
  </section>;
}
