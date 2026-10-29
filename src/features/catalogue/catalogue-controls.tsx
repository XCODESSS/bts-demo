"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { CatalogueQuery, NoteOption } from "./query";
import { serializeCatalogueQuery } from "./query";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { families } from "../../i18n/taxonomy";
import { Icon } from "../../components/icon";
import styles from "./catalogue.module.css";
export function CatalogueControls({
  locale,
  query,
  brands,
  familyIds,
  noteOptions,
}: {
  locale: Locale;
  query: CatalogueQuery;
  brands: string[];
  familyIds: string[];
  noteOptions: NoteOption[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const d = getDictionary(locale);
  function update(changes: Partial<CatalogueQuery>) {
    const params = serializeCatalogueQuery({ ...query, ...changes, page: 1 });
    startTransition(() =>
      router.push(`${pathname}${params ? "?" + params : ""}`, {
        scroll: false,
      }),
    );
  }
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update({
      q: String(new FormData(event.currentTarget).get("q") || "").trim(),
    });
  }
  const active = [
    { key: "q", label: query.q },
    { key: "brand", label: query.brand },
    { key: "gender", label: query.gender ? d[query.gender] : "" },
    {
      key: "family",
      label: query.family ? families[query.family]?.[locale] : "",
    },
    {
      key: "note",
      label:
        noteOptions.find((option) => option.value === query.note)?.label[
          locale
        ] || "",
    },
  ].filter((item) => item.label);
  return (
    <div className={styles.controls} aria-busy={pending}>
      <div className={styles.searchRow}>
        <form className={styles.searchForm} onSubmit={search} role="search">
          <Icon name="search" size={20} />
          <input
            id="search"
            name="q"
            autoComplete="off"
            type="search"
            key={query.q}
            defaultValue={query.q}
            placeholder={d.searchHint}
            aria-label={d.search}
            maxLength={200}
          />
          <button type="submit" disabled={pending}>
            {d.searchButton}
          </button>
        </form>
        <button
          type="button"
          className={styles.filterToggle}
          aria-expanded={expanded}
          aria-controls="catalogue-filters"
          onClick={() => setExpanded(!expanded)}
        >
          <Icon name="filter" size={19} />
          {d.filters}
        </button>
      </div>
      <div
        id="catalogue-filters"
        className={`${styles.filterRow} ${expanded ? styles.expanded : ""}`}
      >
        <label>
          <span>{d.brand}</span>
          <select
            name="brand"
            aria-label={d.brand}
            value={query.brand}
            onChange={(e) => update({ brand: e.target.value })}
            disabled={pending}
          >
            <option value="">{d.allBrands}</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{d.gender}</span>
          <select
            name="gender"
            aria-label={d.gender}
            value={query.gender}
            onChange={(e) =>
              update({ gender: e.target.value as CatalogueQuery["gender"] })
            }
            disabled={pending}
          >
            <option value="">{d.allGenders}</option>
            <option value="men">{d.men}</option>
            <option value="women">{d.women}</option>
            <option value="unisex">{d.unisex}</option>
          </select>
        </label>
        <label>
          <span>{d.family}</span>
          <select
            name="family"
            aria-label={d.family}
            value={query.family}
            onChange={(e) => update({ family: e.target.value })}
            disabled={pending}
          >
            <option value="">{d.allFamilies}</option>
            {familyIds.map((id) => (
              <option key={id} value={id}>
                {families[id][locale]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{d.noteFilter}</span>
          <select
            name="note"
            aria-label={d.noteFilter}
            value={query.note}
            onChange={(event) => update({ note: event.target.value })}
            disabled={pending}
          >
            <option value="">{d.allNotes}</option>
            {noteOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label[locale]}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.sortControl}>
          <span>{d.sort}</span>
          <select
            name="sort"
            aria-label={d.sort}
            value={query.sort}
            onChange={(e) =>
              update({ sort: e.target.value as CatalogueQuery["sort"] })
            }
            disabled={pending}
          >
            <option value="featured">{d.featured}</option>
            <option value="name-asc">{d.nameAsc}</option>
            <option value="name-desc">{d.nameDesc}</option>
          </select>
        </label>
      </div>
      {active.length > 0 && (
        <div className={styles.activeFilters} aria-label={d.activeFilters}>
          {active.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => update({ [item.key]: "" })}
              disabled={pending}
              aria-label={`${d.remove} ${item.label}`}
            >
              <bdi>{item.label}</bdi>
              <Icon name="close" size={13} />
            </button>
          ))}
          <button
            type="button"
            className={styles.clear}
            disabled={pending}
            onClick={() =>
              startTransition(() => router.push(pathname, { scroll: false }))
            }
          >
            {d.clear}
          </button>
        </div>
      )}
      {pending && (
        <div
          className={styles.pendingLine}
          role="status"
          aria-label={
            locale === "en" ? "Updating collection" : "جارٍ تحديث المجموعة"
          }
        />
      )}
    </div>
  );
}
