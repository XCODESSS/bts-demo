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
  return <><h1>Add a Sample Product</h1><AdminNav locale={locale} /><ProductForm key="new" locale={locale} images={productImages} /></>;
}
