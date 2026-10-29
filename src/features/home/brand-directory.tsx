"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { normalizeSearch } from "../catalogue/query";
import { Icon } from "../../components/icon";
import type { StorefrontModel } from "./storefront-model";
import motion from "../../components/card-motion.module.css";
import styles from "./discovery.module.css";

const featuredHouses = ["Chanel", "Dior", "Xerjoff", "Diptyque", "Parfums de Marly", "Giorgio Armani", "Tom Ford", "Versace"];
export function BrandDirectory({ locale, brands }: { locale: Locale; brands: StorefrontModel["brands"] }) {
  const d = getDictionary(locale);
  const [search, setSearch] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  if (!brands.length) return null;
  const preferred = featuredHouses.flatMap((name) => brands.filter((brand) => brand.name === name));
  const featured = [...preferred, ...brands.filter((brand) => !featuredHouses.includes(brand.name))].slice(0, 8);
  const visible = brands.filter((brand) => normalizeSearch(brand.name).includes(normalizeSearch(search.trim())));
  return <section className={`${styles.brands} page-width`} aria-label={d.brandsTitle}>
    <div className={styles.brandHeading}>
      <div><h2>{d.brandsTitle}</h2><p>{d.brandsIntro}</p></div>
      <button ref={trigger} type="button" className={styles.allBrands} aria-label={d.allHousesAction} aria-haspopup="dialog"
        onClick={() => { setSearch(""); dialog.current?.showModal(); if (window.matchMedia("(pointer: fine)").matches) input.current?.focus(); }}>
        <Icon name="search" size={17} /><span>{d.allHousesAction}</span><b>{new Intl.NumberFormat(locale).format(brands.length)}</b>
      </button>
    </div>
    <div className={styles.brandGrid}>
      {featured.map((brand) => <Link key={brand.name} href={brand.href} aria-label={brand.name} className={`${styles.brandCard} ${motion.interactive}`}>
        <bdi translate="no" className={styles.houseName}>{brand.name}</bdi>
        <span className={styles.houseMeta}>{new Intl.NumberFormat(locale).format(brand.count)} {brand.count === 1 ? d.resultSingular : d.results}
          <span className={`${styles.houseArrow} ${motion.action}`}><Icon name="arrow" size={16} className="directional" /></span>
        </span>
      </Link>)}
    </div>
    <dialog ref={dialog} className={styles.brandDialog} aria-labelledby="brand-directory-title" onClose={() => trigger.current?.focus()}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const b = event.currentTarget.getBoundingClientRect();
        if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.current?.close();
      }}>
      <div className={styles.dialogHeader}>
        <h2 id="brand-directory-title">{d.brandsTitle}</h2>
        <button type="button" className="icon-button" aria-label={d.closeHouses} onClick={() => dialog.current?.close()}><Icon name="close" /></button>
      </div>
      <input ref={input} type="search" name="houseQuery" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)}
        aria-label={d.searchHouses} placeholder={d.searchHousesHint} className={styles.brandSearch} />
      <p className={styles.houseCount} role="status">{new Intl.NumberFormat(locale).format(visible.length)} {visible.length === 1 ? d.houseSingular : d.houseResults}</p>
      {visible.length ? <div className={styles.directoryGrid}>
        {visible.map((brand) => <Link key={brand.name} href={brand.href} aria-label={brand.name} onClick={() => dialog.current?.close()}>
          <bdi translate="no">{brand.name}</bdi><span>{new Intl.NumberFormat(locale).format(brand.count)}</span>
        </Link>)}
      </div> : <div className={styles.noHouses}><p>{d.noHouses}</p><button className="button button-light" onClick={() => { setSearch(""); input.current?.focus(); }}>{d.clearHouseSearch}</button></div>}
    </dialog>
  </section>;
}
