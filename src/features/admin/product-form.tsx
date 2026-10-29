"use client";
import { useActionState, useEffect, useRef, type InputHTMLAttributes } from "react";
import type { Locale } from "../../i18n/config";
import type { Product } from "../products/model";
import { concentrations, families } from "../../i18n/taxonomy";
import { useUnsavedChanges } from "./use-unsaved-changes";
import { saveProduct } from "./product-actions";
import { initialProductFormState, type ProductFormField, type ProductFormValues } from "./product-form-state";
import styles from "./admin.module.css";

export function ProductForm({ product, locale, images }: { product?: Product; locale: Locale; images: string[] }) {
  const [state, action, pending] = useActionState(saveProduct.bind(null, locale, product?.id || null), initialProductFormState);
  const form = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLParagraphElement>(null);
  const dirty = useUnsavedChanges(form);
  useEffect(() => {
    if (!state.attempt || pending) return;
    const invalid = form.current?.querySelector<HTMLElement>('[aria-invalid="true"]:is(input,textarea,select)');
    (invalid || summary.current)?.focus();
  }, [state.attempt, pending]);
  const defaults: ProductFormValues = {
    id: product?.id || "", slug: product?.slug || "", brand: product?.brand || "", name: product?.name || "",
    sizeLabel: product?.sizeLabel || "", concentration: product?.concentration.en || Object.keys(concentrations)[0], gender: product?.gender || "unisex",
    familyIds: product?.familyIds || [], descriptionEn: product?.description.en || "", descriptionAr: product?.description.ar || "",
    notesEn: product?.notes.en.join("\n") || "", notesAr: product?.notes.ar.join("\n") || "", image: product?.image.src || images[0] || "",
    caveatEn: product?.image.caveat.en || "Reference photograph; packaging and size may differ.",
    caveatAr: product?.image.caveat.ar || "صورة مرجعية؛ قد تختلف العبوة والحجم.", featured: product?.featured ? "on" : "",
  };
  const values = state.values || defaults;
  const attributes = (name: ProductFormField) => ({
    id: `product-${name}`, name,
    "aria-invalid": state.fieldErrors[name] ? true : undefined,
    "aria-describedby": state.fieldErrors[name] ? `error-${name}` : undefined,
  });
  const error = (name: ProductFormField) => state.fieldErrors[name] ? <p className={styles.fieldError} id={`error-${name}`}>{state.fieldErrors[name]}</p> : null;
  function input(name: Exclude<ProductFormField, "familyIds">, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}) {
    return <div><label htmlFor={`product-${name}`}>{label}</label><input {...attributes(name)} defaultValue={values[name]} {...props} />{error(name)}</div>;
  }
  function textarea(name: Exclude<ProductFormField, "familyIds">, label: string, arabic = false, required = true) {
    return <div><label htmlFor={`product-${name}`}>{label}</label>
      <textarea {...attributes(name)} defaultValue={values[name]} required={required} maxLength={required ? 3000 : 5000}
        lang={arabic ? "ar" : "en"} dir={arabic ? "rtl" : "ltr"} />{error(name)}</div>;
  }
  return <form ref={form} action={action} className={styles.form} autoComplete="off" aria-busy={pending}>
    <p>All product information is illustrative. Use approved reference photographs and paired English/Arabic content. IDs and URLs cannot change after creation.</p>
    {dirty && <p className={styles.notice}>Unsaved changes</p>}
    <div key={state.attempt} className={styles.fields}>
      {input("id", "Product ID", { readOnly: Boolean(product), required: true, maxLength: 50, pattern: "[A-Za-z0-9_\\-]+", spellCheck: false, autoCapitalize: "none" })}
      {input("slug", "URL slug", { readOnly: Boolean(product), required: true, maxLength: 160, pattern: "[a-z0-9]+(\\-[a-z0-9]+)*", spellCheck: false, autoCapitalize: "none" })}
      {input("brand", "Brand", { required: true, maxLength: 200 })}
      {input("name", "Product name", { required: true, maxLength: 200 })}
      {input("sizeLabel", "Bottle size", { required: true, maxLength: 200, placeholder: "100 ml…" })}
      <div><label htmlFor="product-concentration">Concentration</label><select {...attributes("concentration")} defaultValue={values.concentration}>
        {Object.keys(concentrations).map(c => <option key={c}>{c}</option>)}</select>{error("concentration")}</div>
      <div><label htmlFor="product-gender">Gender</label><select {...attributes("gender")} defaultValue={values.gender}>
        <option value="unisex">Unisex</option><option value="men">Men</option><option value="women">Women</option></select>{error("gender")}</div>
      <fieldset aria-describedby={state.fieldErrors.familyIds ? "error-familyIds" : undefined}>
        <legend>Fragrance families — choose at least one</legend>
        {Object.entries(families).map(([id, f]) => <label className={styles.check} key={id}>
          <input type="checkbox" name="familyIds" value={id} defaultChecked={values.familyIds.includes(id)}
            aria-invalid={state.fieldErrors.familyIds ? true : undefined} aria-describedby={state.fieldErrors.familyIds ? "error-familyIds" : undefined} />{f.en}</label>)}
        {error("familyIds")}
      </fieldset>
      {textarea("descriptionEn", "English description")}
      {textarea("descriptionAr", "Arabic description", true)}
      {textarea("notesEn", "English notes — one per line", false, false)}
      {textarea("notesAr", "Arabic notes — matching order, one per line", true, false)}
      <div><label htmlFor="product-image">Approved reference image</label><select {...attributes("image")} defaultValue={values.image}>
        {images.map(image => <option key={image} value={image}>{image}</option>)}</select>{error("image")}</div>
      {textarea("caveatEn", "English photo caveat")}
      {textarea("caveatAr", "Arabic photo caveat", true)}
      <label className={styles.check}><input {...attributes("featured")} type="checkbox" defaultChecked={values.featured === "on"} />Featured product</label>{error("featured")}
    </div>
    <p ref={summary} tabIndex={-1} role="status" aria-live="polite" className={state.message ? styles.fieldError : undefined}>{pending ? "Saving…" : state.message}</p>
    <button className="button" disabled={pending}>{pending && <span className="pending-spinner" aria-hidden="true" />}{pending ? "Saving…" : "Save Product"}</button>
  </form>;
}
