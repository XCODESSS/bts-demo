"use client";
import { useActionState } from "react";
import type { Locale } from "../../i18n/config";
import type { Product } from "../products/model";
import { concentrations, families } from "../../i18n/taxonomy";
import { saveProduct } from "./product-actions";
import styles from "./admin.module.css";
export function ProductForm({ product, locale, images }: { product?: Product; locale: Locale; images: string[] }) {
  const [error, action, pending] = useActionState(saveProduct.bind(null, locale, product?.id || null), "");
  return <form action={action} className={styles.form} autoComplete="off">
    <p>All product information is illustrative. Use approved reference photographs and paired English/Arabic content. IDs and URLs cannot change after creation.</p>
    <label>Product ID<input name="id" spellCheck={false} autoCapitalize="none" defaultValue={product?.id} readOnly={Boolean(product)} required maxLength={50} pattern="[A-Za-z0-9_\-]+" /></label>
    <label>URL slug<input name="slug" spellCheck={false} autoCapitalize="none" defaultValue={product?.slug} readOnly={Boolean(product)} required maxLength={160} pattern="[a-z0-9]+(\-[a-z0-9]+)*" /></label>
    <label>Brand<input name="brand" defaultValue={product?.brand} required maxLength={200} /></label>
    <label>Product name<input name="name" defaultValue={product?.name} required maxLength={200} /></label>
    <label>Bottle size<input name="sizeLabel" defaultValue={product?.sizeLabel} required maxLength={200} placeholder="100 ml…" /></label>
    <label>Concentration<select aria-label="Concentration" name="concentration" defaultValue={product?.concentration.en}>{Object.keys(concentrations).map((c) => <option key={c}>{c}</option>)}</select></label>
    <label>Gender<select aria-label="Gender" name="gender" defaultValue={product?.gender || "unisex"}><option value="unisex">Unisex</option><option value="men">Men</option><option value="women">Women</option></select></label>
    <fieldset><legend>Fragrance families — choose at least one</legend>{Object.entries(families).map(([id, f]) => <label className={styles.check} key={id}><input type="checkbox" name="familyIds" value={id} defaultChecked={product?.familyIds.includes(id)} />{f.en}</label>)}</fieldset>
    <label>English description<textarea aria-label="English description" name="descriptionEn" defaultValue={product?.description.en} required maxLength={3000} /></label>
    <label>Arabic description<textarea aria-label="Arabic description" name="descriptionAr" lang="ar" dir="rtl" defaultValue={product?.description.ar} required maxLength={3000} /></label>
    <label>English notes — one per line<textarea aria-label="English notes — one per line" name="notesEn" defaultValue={product?.notes.en.join("\n")} maxLength={5000} /></label>
    <label>Arabic notes — matching order, one per line<textarea aria-label="Arabic notes — matching order, one per line" name="notesAr" lang="ar" dir="rtl" defaultValue={product?.notes.ar.join("\n")} maxLength={5000} /></label>
    <label>Approved reference image<select aria-label="Approved reference image" name="image" defaultValue={product?.image.src}>{images.map((image) => <option key={image} value={image}>{image}</option>)}</select></label>
    <label>English photo caveat<textarea aria-label="English photo caveat" name="caveatEn" defaultValue={product?.image.caveat.en || "Reference photograph; packaging and size may differ."} required maxLength={3000} /></label>
    <label>Arabic photo caveat<textarea aria-label="Arabic photo caveat" name="caveatAr" lang="ar" dir="rtl" defaultValue={product?.image.caveat.ar || "صورة مرجعية؛ قد تختلف العبوة والحجم."} required maxLength={3000} /></label>
    <label className={styles.check}><input type="checkbox" name="featured" defaultChecked={product?.featured} />Featured product</label>
    {error && <p role="alert">{error}</p>}
    <button className="button" disabled={pending}>{pending ? "Saving…" : "Save Product"}</button>
  </form>;
}
