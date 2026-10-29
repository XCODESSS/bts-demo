import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { INSTAGRAM_URL } from "../../lib/site-links";
import { Card, CardContent, CardFooter } from "../../components/ui/card";
import { Icon } from "../../components/icon";
import styles from "./home-extras.module.css";

export function CustomerExperiences({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return <section className={styles.experiences} aria-label={d.experiencesTitle}>
    <div className="page-width"><h2>{d.experiencesTitle}</h2>
    <p className={styles.intro}>{d.experiencesHelp}</p>
    <div className={styles.reviews}>
      {[d.sampleReviewOne, d.sampleReviewTwo, d.sampleReviewThree].map((copy) => <Card key={copy} className={styles.reviewCard}>
        <CardContent>
          <span className={styles.sampleLabel}>{d.sampleReviewLabel}</span>
          <span className={styles.stars} aria-hidden="true">★★★★★</span>
          <blockquote>{copy}</blockquote>
        </CardContent>
        <CardFooter><cite>{d.sampleCustomer}</cite></CardFooter>
      </Card>)}
    </div>
    <div className={styles.instagram}>
      <Icon name="instagram" size={32} />
      <div><h3>{d.instagramTitle}</h3><p>{d.instagramCopy}</p></div>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="button button-light">
        {d.instagramAction}<Icon name="arrow" size={17} className="directional" />
      </a>
    </div></div>
  </section>;
}
