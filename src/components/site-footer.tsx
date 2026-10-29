import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import type { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";
import { EnquiryLink } from "../features/enquiry/enquiry-link";
import { INSTAGRAM_URL } from "../lib/site-links";
import { FooterInformation } from "./footer-information";
import { Icon } from "./icon";
import { DesignChooser } from "./language-switch";

export function SiteFooter({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <footer className="site-footer">
      <p className="salon-close page-width" dir="ltr" translate="no" aria-hidden="true">Beyond the Space</p>
      <div className="footer-main page-width">
        <div className="footer-brand">
          <Image src="/brand/logo.png" width={64} height={64} alt={d.footerBrand} />
          <h2 className="footer-brand-name" translate="no">{d.footerBrand}</h2>
          <p className="footer-line">{d.footerLine}</p>
        </div>
        <Suspense fallback={null}><FooterInformation locale={locale} contactAction={<EnquiryLink locale={locale} />} /></Suspense>
        <nav className="footer-links" aria-label={d.shopBy}>
          <h2>{d.shopBy}</h2>
          <a href={`/${locale}#houses`}>{d.brand}</a>
          <Link href={`/${locale}/catalogue`}>{d.viewAll}</Link>
          <a href={`/${locale}#scents`}>{d.noteFilter}</a>
          {(["men", "women", "unisex"] as const).map((gender) =>
            <Link key={gender} href={`/${locale}/catalogue?gender=${gender}`}>{d[gender]}</Link>)}
        </nav>
        <div className="footer-contact">
          <h2>{d.storeDetails}</h2><p>{d.dubai}</p><p>{d.contactDetailsNote}</p>
          <a className="footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Icon name="instagram" size={19} /><bdi translate="no">@beyond_the_space_perfumes</bdi>
          </a>
          <EnquiryLink locale={locale} compact />
        </div>
      </div>
      <div className="footer-bottom page-width">
        <small>{d.disclosure}</small><small>© {new Date().getFullYear()} <span translate="no">{d.footerBrand}</span></small>
        <DesignChooser locale={locale} />
      </div>
    </footer>
  );
}
