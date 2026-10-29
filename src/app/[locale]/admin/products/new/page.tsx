import { notFound } from "next/navigation";
import { isLocale } from "../../../../../i18n/config";
import { requireAdmin } from "../../../../../features/admin/session";
import { AdminNav } from "../../../../../features/admin/admin-nav";
import { ProductForm } from "../../../../../features/admin/product-form";
import { productImages } from "../../../../../features/products/product-validation";
export default async function NewProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdmin(locale);
  return <><h1>Add a sample product</h1><AdminNav locale={locale} /><ProductForm locale={locale} images={productImages} /></>;
}
