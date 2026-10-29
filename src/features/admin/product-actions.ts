"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isLocale } from "../../i18n/config";
import { concentrations } from "../../i18n/taxonomy";
import { withProductStore } from "../products/repository";
import { validateProduct } from "../products/product-validation";
import { requireAdmin, verifyActionOrigin } from "./session";
export async function saveProduct(locale: string, existingId: string | null, _previous: string, form: FormData): Promise<string> {
  if (!isLocale(locale)) throw new Error("Unsupported locale.");
  await requireAdmin(locale);
  await verifyActionOrigin();
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
    if (error instanceof Error && /UNIQUE constraint/.test(error.message)) return "A product with that ID or slug already exists.";
    return error instanceof Error && !/SQLITE|database|ENOENT/i.test(error.message) ? error.message : "Unable to save. Check the private database configuration.";
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
