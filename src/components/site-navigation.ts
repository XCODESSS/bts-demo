import type { Locale } from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";

/** Shared by the desktop bar and the phone menu so both always offer the same destinations. */
export function siteNavigation(locale: Locale) {
  const d = getDictionary(locale);
  return [
    { href: `/${locale}/catalogue`, label: d.collection, route: true },
    { href: `/${locale}#scents`, label: d.discover, route: false },
    { href: `/${locale}#houses`, label: d.housesNav, route: false },
    { href: `/${locale}#approach`, label: d.approach, route: false },
  ];
}
