"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLocale } from "../../i18n/config";
import { concentrations } from "../../i18n/taxonomy";
import { withProductStore } from "../products/repository";
import { ProductValidationError, validateProduct } from "../products/product-validation";
import { requireAdmin, verifyActionOrigin } from "./session";
import { submittedProductValues, type ProductFormState } from "./product-form-state";
export async function saveProduct(locale: string, existingId: string | null, previousState: ProductFormState, form: FormData): Promise<ProductFormState> {
  if (!isLocale(locale)) throw new Error("Unsupported locale.");
  await requireAdmin(locale);
  await verifyActionOrigin();
  const values = submittedProductValues(form);
  let slug = "";
  try {
    const value = (key: string) => String(form.get(key) || "");
    const lines = (key: string) => value(key).split(/\r?\n/).map((v) => v.trim()).filter(Boolean);
    withProductStore((store) => {
      const previous = existingId ? store.findById(existingId) : undefined;
      if (existingId && !previous) throw new Error("Product not found.");
      const p = validateProduct({
        id: previous?.id || value("id"), slug: previous?.slug || value("slug"),
        name: value("name"), brand: value("brand"), sizeLabel: value("sizeLabel"),
        concentration: concentrations[value("concentration")], gender: value("gender"),
        familyIds: form.getAll("familyIds"), notes: { en: lines("notesEn"), ar: lines("notesAr") },
        description: { en: value("descriptionEn"), ar: value("descriptionAr") },
        image: { src: value("image"), caveat: { en: value("caveatEn"), ar: value("caveatAr") } },
        featured: form.get("featured") === "on",
      });
      if (existingId) store.update(existingId, p); else store.create(p);
      slug = p.slug;
    });
  } catch (error) {
    const fieldErrors: ProductFormState["fieldErrors"] = {};
    let message = "Unable to save. Check the product details and private database configuration.";
    if (error instanceof ProductValidationError) {
      message = error.message;
      for (const field of error.fields) fieldErrors[field] = message;
    } else if (error instanceof Error && /UNIQUE constraint/.test(error.message)) {
      message = existingId ? "Unable to save this product. Reload and try again." : "Choose a different Product ID or URL Slug; that identifier is already in use.";
      if (!existingId) { fieldErrors.id = message; fieldErrors.slug = message; }
    }
    return { attempt: previousState.attempt + 1, message, fieldErrors, values };
  }
  for (const language of ["en", "ar"]) {
    revalidatePath(`/${language}`);
    revalidatePath(`/${language}/catalogue`);
    revalidatePath(`/${language}/perfumes/${slug}`);
    revalidatePath(`/${language}/admin/products`);
  }
  revalidatePath("/sitemap.xml");
  redirect(`/${locale}/admin/products?saved=1`);
}
