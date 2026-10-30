"use client";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useMediaQuery } from "../../components/use-media-query";
import type { CatalogueQuery, NoteOption } from "./query";
import { serializeCatalogueQuery } from "./query";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
import { families } from "../../i18n/taxonomy";
import { Icon } from "../../components/icon";
import styles from "./catalogue.module.css";

/** Every control writes the URL, so state survives reloads, history and language changes. */
export function CatalogueControls({
  locale,
  query,
  total,
  brands,
  familyIds,
  noteOptions,
}: {
  locale: Locale;
  query: CatalogueQuery;
  total: number;
  brands: string[];
  familyIds: string[];
  noteOptions: NoteOption[];
}) {
  const [expanded, setExpanded] = useState(false);
  const isPhone = useMediaQuery("(max-width: 760px)");
  const toggle = useRef<HTMLButtonElement>(null);
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
  function collapse() {
    setExpanded(false);
    toggle.current?.focus();
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
  const filterCount = active.filter((item) => item.key !== "q").length;
  const field = (label: string, control: ReactNode, className = "") =>
    <label className={`${styles.field} ${className}`}><span>{label}</span>{control}</label>;
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
          ref={toggle}
          aria-expanded={expanded}
          aria-controls="catalogue-filters"
          onClick={() => setExpanded(value => !value)}
        >
          <Icon name="filter" size={19} />
          {d.filters}
          {filterCount > 0 && <span className={styles.filterCount} aria-hidden="true">{new Intl.NumberFormat(locale).format(filterCount)}</span>}
        </button>
      </div>
      <div
        id="catalogue-filters"
        className={styles.filterDisclosure}
        data-expanded={expanded}
        aria-hidden={isPhone && !expanded}
        inert={isPhone && !expanded}
        onKeyDown={event => {
          if (event.key !== "Escape" || !isPhone || !expanded) return;
          event.preventDefault();
          collapse();
        }}
      >
        <div className={styles.filterClip}>
          <div className={styles.filterPanel}>
            <div className={styles.filterRow}>
              {field(d.brand, <select
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
              </select>)}
              {field(d.gender, <select
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
              </select>)}
              {field(d.family, <select
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
              </select>)}
              {field(d.noteFilter, <select
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
              </select>)}
              {field(d.sort, <select
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
              </select>, styles.sortControl)}
            </div>
            <button type="button" className={`button ${styles.showResults}`} onClick={collapse}>
              {d.show} {new Intl.NumberFormat(locale).format(total)} {total === 1 ? d.resultSingular : d.results}
            </button>
          </div>
        </div>
      </div>
      {active.length > 0 && (
        <div className={styles.activeFilters} aria-label={d.activeFilters} role="group">
          {active.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => update({ [item.key]: "" })}
              disabled={pending}
              aria-label={`${d.remove} ${item.label}`}
            >
              <bdi>{item.label}</bdi>
              <Icon name="close" size={14} />
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
