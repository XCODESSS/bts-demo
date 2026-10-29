import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import type { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";
import { CatalogueSearch } from "./catalogue-search";
import styles from "./site-header.module.css";

export function SiteHeader({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href={`/${locale}`}
          aria-label={`${d.footerBrand} — ${d.home}`}>
          <Image src="/brand/logo.png" width={50} height={50} alt="" loading="eager" fetchPriority="high" />
          <span className={styles.wordmark} dir="ltr" translate="no">
            Beyond the Space<span>Perfume</span>
          </span>
        </Link>
        <nav className={styles.navigation}
          aria-label={locale === "en" ? "Main navigation" : "التنقل الرئيسي"}>
          <Link href={`/${locale}/catalogue`}>{d.collection}</Link>
          <a href={`/${locale}#scents`}>{d.discover}</a>
          <a href={`/${locale}#approach`}>{d.approach}</a>
        </nav>
        <CatalogueSearch locale={locale} />
        <div className={styles.actions}>
          <Suspense fallback={<span className="language-switch">{locale === "en" ? "العربية" : "English"}</span>}>
            <LanguageSwitch locale={locale} />
          </Suspense>
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}
