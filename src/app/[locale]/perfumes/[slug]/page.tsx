import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildProductMetadata } from "../../../../features/seo/metadata";
import { isLocale } from "../../../../i18n/config";
import {
  getProduct,
} from "../../../../features/products/repository";
import { PageTransition } from "../../../../components/page-transition";
import { ProductDetail } from "../../../../features/products/product-detail";
type Props = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ return?: string | string[] }>;
};
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();
  return buildProductMetadata(product, locale);
}
export default async function Page({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();
  const query = await searchParams;
  const returnQuery = Array.isArray(query.return)
    ? query.return[0]
    : query.return || null;
  return (
    <PageTransition routeKey={`/${locale}/perfumes/${slug}`}>
      <ProductDetail
        product={product}
        locale={locale}
        returnQuery={returnQuery}
      />
    </PageTransition>
  );
}
