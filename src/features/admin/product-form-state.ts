export type ProductFormField =
  | "id" | "slug" | "brand" | "name" | "sizeLabel" | "concentration" | "gender"
  | "familyIds" | "descriptionEn" | "descriptionAr" | "notesEn" | "notesAr"
  | "image" | "caveatEn" | "caveatAr" | "featured";
export type ProductFormValues = Record<Exclude<ProductFormField, "familyIds">, string> & { familyIds: string[] };
export type ProductFormState = {
  attempt: number;
  message: string;
  fieldErrors: Partial<Record<ProductFormField, string>>;
  values: ProductFormValues | null;
};
export const initialProductFormState: ProductFormState = { attempt: 0, message: "", fieldErrors: {}, values: null };

export function submittedProductValues(form: FormData): ProductFormValues {
  const value = (name: string) => {
    const entry = form.get(name);
    return typeof entry === "string" ? entry : "";
  };
  return {
    id: value("id"), slug: value("slug"), brand: value("brand"), name: value("name"),
    sizeLabel: value("sizeLabel"), concentration: value("concentration"), gender: value("gender"),
    descriptionEn: value("descriptionEn"), descriptionAr: value("descriptionAr"),
    notesEn: value("notesEn"), notesAr: value("notesAr"), image: value("image"),
    caveatEn: value("caveatEn"), caveatAr: value("caveatAr"), featured: value("featured"),
    familyIds: form.getAll("familyIds").filter((entry): entry is string => typeof entry === "string"),
  };
}
