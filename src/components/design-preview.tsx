import Image from "next/image";
import styles from "./design-preview.module.css";
import type { DesignId } from "./designs";

/** Decorative miniatures, not a second storefront or dataset. */
export function DesignPreview({ design }: { design: DesignId }) {
  if (design === "salon") return <div className={styles.salonPreview} aria-hidden="true">
    <div className={styles.salonNav}>Beyond the Space</div>
    <div className={styles.salonCampaign}>
      <div><p>A space for<br />your scent.</p><span>Explore collection →</span></div>
      <div className={styles.salonPhoto}><small>Lemon · Rose · Oud</small><Image src="/perfumes/P0574.webp" alt="" width={100} height={160} unoptimized /></div>
    </div>
    <p className={styles.salonPreviewTitle}>A different way to discover.</p>
  </div>;
  return <div className={styles.preview} data-variant={design} aria-hidden="true">
    <div className={styles.nav}><b /><i /><i /><i /></div>
    <div className={styles.campaign}>
      <span className={styles.copy}><b /><b /><b /></span>
      {["P0168", "P0577", "P0041"].map((id) => <span key={id} className={styles.photo}>
        <Image src={`/perfumes/${id}.webp`} alt="" width={50} height={76} unoptimized />
      </span>)}
    </div>
    <div className={styles.title} /><span className={styles.action} />
    <div className={styles.tiles}><i /><i /><i /><i /></div>
  </div>;
}
