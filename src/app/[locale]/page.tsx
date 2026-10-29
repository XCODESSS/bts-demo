import { notFound } from "next/navigation";
import { isLocale } from "../../i18n/config";
import { HomePage } from "../../features/home/home-page";
import { buildPageMetadata } from "../../features/seo/metadata";
import { getDictionary } from "../../i18n/dictionaries";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDictionary(locale);
  return buildPageMetadata(locale, "", "Beyond the Space Perfume", d.storefrontIntro);
}
export const dynamic = "force-dynamic";
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomePage locale={locale} />;
}
