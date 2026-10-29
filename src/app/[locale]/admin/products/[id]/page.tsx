import { notFound } from "next/navigation";
import { isLocale } from "../../../../../i18n/config";
import { requireAdmin } from "../../../../../features/admin/session";
import { AdminNav } from "../../../../../features/admin/admin-nav";
import { ProductForm } from "../../../../../features/admin/product-form";
import { productImages } from "../../../../../features/products/product-validation";
import { withProductStore } from "../../../../../features/products/repository";
export default async function EditProductPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdmin(locale);
  const product = withProductStore((store) => store.findById(id));
  if (!product) notFound();
  return <><h1>Edit {product.name}</h1><AdminNav locale={locale} /><ProductForm key={product.id} product={product} locale={locale} images={productImages} /></>;
}
