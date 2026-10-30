import { notFound } from "next/navigation";
import { isLocale } from "../../../i18n/config";
import { PageTransition } from "../../../components/page-transition";
import { CatalogueView } from "../../../features/catalogue/catalogue-view";
import { buildPageMetadata } from "../../../features/seo/metadata";
import { getDictionary } from "../../../i18n/dictionaries";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return buildPageMetadata(locale, "/catalogue", d.allTitle, d.allCopy);
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    if (value !== undefined)
      query.set(key, Array.isArray(value) ? value[0] : value);
  }
  return <PageTransition routeKey={`/${locale}/catalogue`}><CatalogueView locale={locale} params={query} /></PageTransition>;
}
