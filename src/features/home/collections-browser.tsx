"use client";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { readDiscoveryTab, withSearchValue } from "../../lib/interface-state";
import type { Locale } from "../../i18n/config";
import { Icon } from "../../components/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { getDictionary } from "../../i18n/dictionaries";
import { ScentVisual } from "./scent-visual";
import type { DiscoveryGroup } from "./storefront-model";
import styles from "./collections.module.css";

export function CollectionsBrowser({ groups, label, locale }: {
  groups: readonly DiscoveryGroup[]; label: string; locale: Locale;
}) {
  const d = getDictionary(locale);
  const active = readDiscoveryTab(useSearchParams().toString());
  function setActive(value: string) {
    if (readDiscoveryTab(window.location.search) === value) return;
    const href = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.history.pushState(null, "", withSearchValue(href, "discovery", value === "notes" ? null : value));
  }
  const list = useRef<HTMLDivElement>(null);
  const selected = groups.some((group) => group.id === active) ? active : groups[0]?.id;
  useLayoutEffect(() => {
    const element = list.current;
    if (!element) return;
    let disposed = false;
    function measure() {
      if (disposed || !element) return;
      const trigger = element.querySelector<HTMLElement>('[data-state="active"]');
      if (!trigger) return;
      // Physical coordinates deliberately handle both reading directions and unequal label widths.
      const metrics = { x: trigger.offsetLeft, y: trigger.offsetTop, width: trigger.offsetWidth, height: trigger.offsetHeight };
      element.style.setProperty("--pill-x", `${metrics.x}px`);
      element.style.setProperty("--pill-width", `${metrics.width}px`);
      element.style.setProperty("--pill-height", `${metrics.height}px`);
      element.style.setProperty("--pill-y", `${metrics.y}px`);
      element.dataset.indicatorReady = "true";
    }
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : undefined;
    observer?.observe(element);
    void document.fonts.ready.then(measure);
    return () => { disposed = true; observer?.disconnect(); };
  }, [selected, locale]);
  if (!groups.length) return null;
  return (
    <Tabs value={selected} onValueChange={setActive} dir={locale === "ar" ? "rtl" : "ltr"} className={styles.browser}>
      <TabsList ref={list} aria-label={label} className={styles.tabs}>
        <span data-slot="tabs-indicator" className={styles.indicator} aria-hidden="true" />
        {groups.map((group) => <TabsTrigger key={group.id} value={group.id} className={styles.tab}>
          {group.label}
        </TabsTrigger>)}
      </TabsList>
      {groups.map((group) => <TabsContent key={group.id} value={group.id} className={styles.panel}>
        {selected === group.id && <div className={styles.grid}>
          {group.items.map((item) => <Link key={item.id} href={item.href} aria-label={item.label} className={styles.tile}>
            <ScentVisual id={item.id} group={group.id} label={item.label} className={styles.image} />
            <span className={styles.caption}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.count}>{new Intl.NumberFormat(locale).format(item.count)} {item.count === 1 ? d.resultSingular : d.results}</span>
            </span>
            <span className={styles.arrow}><Icon name="arrow" size={18} className="directional" /></span>
          </Link>)}
        </div>}
      </TabsContent>)}
    </Tabs>
  );
}
