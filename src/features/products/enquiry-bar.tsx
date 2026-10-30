"use client";
import { useEffect, useState } from "react";
import type { Locale } from "../../i18n/config";
import { Icon } from "../../components/icon";
import { TrackedEnquiryLink } from "../analytics/tracked-enquiry-link";
import styles from "./product.module.css";

/**
 * Phones only (CSS): keeps the enquiry one tap away while the in-page action is off screen.
 * It hides whenever the real enquiry button is visible, so the two never compete.
 */
export function EnquiryBar({ targetId, href, locale, productId, name, priceLine, label }: {
  targetId: string; href: string; locale: Locale; productId: string; name: string; priceLine: string; label: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);
  return (
    <div className={styles.enquiryBar} data-enquiry-bar data-visible={visible} aria-hidden={!visible} inert={!visible}>
      <div><bdi translate="no">{name}</bdi><span>{priceLine}</span></div>
      <TrackedEnquiryLink href={href} locale={locale} productId={productId} className="button">
        <Icon name="whatsapp" />{label}
      </TrackedEnquiryLink>
    </div>
  );
}
