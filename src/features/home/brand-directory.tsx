"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { normalizeSearch } from "../catalogue/query";
import { Icon } from "../../components/icon";
import type { StorefrontModel } from "./storefront-model";
import styles from "./discovery.module.css";

const featuredHouses = ["Chanel", "Dior", "Xerjoff", "Diptyque", "Parfums de Marly", "Giorgio Armani", "Tom Ford", "Versace"];
const INDEX_SIZE = 12;

/** A typographic house index; the complete, searchable directory opens in a dialog. */
export function BrandDirectory({ locale, brands }: { locale: Locale; brands: StorefrontModel["brands"] }) {
  const d = getDictionary(locale);
  const [search, setSearch] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  if (!brands.length) return null;
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const preferred = featuredHouses.flatMap((name) => brands.filter((brand) => brand.name === name));
  const others = brands.filter((brand) => !featuredHouses.includes(brand.name))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "en"));
  const featured = [...preferred, ...others].slice(0, INDEX_SIZE);
  const visible = brands.filter((brand) => normalizeSearch(brand.name).includes(normalizeSearch(search.trim())));
  return <section className={`${styles.houses} section page-width`} aria-labelledby="houses-title">
    <div className="section-heading">
      <div><h2 id="houses-title">{d.brandsTitle}</h2><p>{d.brandsIntro}</p></div>
      <button ref={trigger} type="button" className={`button button-light ${styles.allHouses}`} aria-label={d.allHousesAction} aria-haspopup="dialog"
        onClick={() => { setSearch(""); dialog.current?.showModal(); if (window.matchMedia("(pointer: fine)").matches) input.current?.focus(); }}>
        <Icon name="search" size={17} /><span>{d.allHousesAction}</span><b>{number(brands.length)}</b>
      </button>
    </div>
    <ul className={styles.houseIndex}>
      {featured.map((brand) => <li key={brand.name}>
        <Link href={brand.href} className={styles.house}>
          <bdi translate="no" className={styles.houseName}>{brand.name}</bdi>
          <span className={styles.houseMeta}>{number(brand.count)} {brand.count === 1 ? d.resultSingular : d.results}</span>
        </Link>
      </li>)}
    </ul>
    <dialog ref={dialog} data-motion-dialog className={styles.brandDialog} aria-labelledby="brand-directory-title" onClose={() => trigger.current?.focus()}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const b = event.currentTarget.getBoundingClientRect();
        if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.current?.close();
      }}>
      <div className={styles.dialogHeader}>
        <h2 id="brand-directory-title">{d.brandsTitle}</h2>
        <button type="button" className="icon-button" aria-label={d.closeHouses} onClick={() => dialog.current?.close()}><Icon name="close" /></button>
      </div>
      <div className={styles.dialogSearch}>
        <Icon name="search" size={18} />
        <input ref={input} type="search" name="houseQuery" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)}
          aria-label={d.searchHouses} placeholder={d.searchHousesHint} className={styles.brandSearch} />
      </div>
      <p className={styles.houseCount} role="status">{number(visible.length)} {visible.length === 1 ? d.houseSingular : d.houseResults}</p>
      {visible.length ? <div className={styles.directoryGrid}>
        {visible.map((brand) => <Link key={brand.name} href={brand.href} aria-label={brand.name} onClick={() => dialog.current?.close()}>
          <bdi translate="no">{brand.name}</bdi><span>{number(brand.count)}</span>
        </Link>)}
      </div> : <div className={styles.noHouses}><p>{d.noHouses}</p><button className="button button-light" onClick={() => { setSearch(""); input.current?.focus(); }}>{d.clearHouseSearch}</button></div>}
    </dialog>
  </section>;
}
