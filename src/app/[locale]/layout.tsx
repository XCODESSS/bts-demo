import type { Metadata, Viewport } from "next";
import { manrope, bodoni, arabic } from "../../styles/fonts";
import { Suspense } from "react";
import { AnalyticsProvider } from "../../features/analytics/analytics-provider";
import { siteOrigin } from "../../features/seo/metadata";
import { notFound } from "next/navigation";
import "../../styles/shadcn.css";
import "./globals.css";
import "../../styles/typography.css";
import { isLocale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { HashNavigation } from "../../components/hash-navigation";
import { designIds } from "../../components/designs";
import "../../styles/salon.css";
export const viewport: Viewport = {
  width: "device-width", initialScale: 1, viewportFit: "cover",
  themeColor: "#fbfaf6", colorScheme: "light",
};
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: "Beyond the Space Perfume — Find your signature",
    template: "%s | Beyond the Space Perfume",
  },
  description:
    "A considered collection of designer and niche fragrances. Discover a scent that feels like you.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/icon.png" },
};
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-design="atelier"
      className={`${manrope.variable} ${bodoni.variable} ${arabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const design=localStorage.getItem('bts-demo-design');if(${JSON.stringify(designIds)}.includes(design))document.documentElement.setAttribute('data-design',design)}catch{}})()`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {getDictionary(locale).skip}
        </a>
        <SiteHeader locale={locale} />
        <main id="main-content">{children}</main>
        <SiteFooter locale={locale} />
        <Suspense fallback={null}><HashNavigation /><AnalyticsProvider /></Suspense>
      </body>
    </html>
  );
}
