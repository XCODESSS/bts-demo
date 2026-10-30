"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";
import { Icon } from "./icon";
import { siteNavigation } from "./site-navigation";
import styles from "./site-header.module.css";
export function MobileMenu({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  return <MobileMenuContent key={pathname} locale={locale} />;
}

function MobileMenuContent({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const d = getDictionary(locale);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className={styles.mobileMenu}>
      <button
        ref={button}
        type="button"
        className="icon-button"
        aria-label={open ? d.close : d.menu}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(value => !value)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>
        <nav
          id="mobile-navigation"
          className={styles.mobileNavigation}
          data-open={open}
          aria-hidden={!open}
          inert={!open}
          aria-label={d.menu}
        >
          {siteNavigation(locale).map((item) => item.route
            ? <Link key={item.href} onClick={() => setOpen(false)} href={item.href}>
              {item.label}<Icon name="arrow" size={18} className="directional" />
            </Link>
            : <a key={item.href} onClick={() => setOpen(false)} href={item.href}>
              {item.label}<Icon name="arrow" size={18} className="directional" />
            </a>)}
        </nav>
    </div>
  );
}
