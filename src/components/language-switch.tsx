"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { switchLocaleHref } from "../i18n/routing";
import type { Locale } from "../i18n/config";
import { Icon } from "./icon";

/** Keeps the visitor on the equivalent page, including filters and UI state. */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const target = locale === "en" ? "ar" : "en";
  return (
    <Link
      className="language-switch"
      href={switchLocaleHref(pathname, search.toString(), target)}
      lang={target}
      hrefLang={target}
    >
      <Icon name="globe" size={17} />
      <span>{target === "ar" ? "العربية" : "English"}</span>
    </Link>
  );
}
