import Link from "next/link";
import type { Locale } from "../../i18n/config";
import { logout } from "./login-actions";
import styles from "./admin.module.css";
export function AdminNav({ locale }: { locale: Locale }) {
  return <nav className={styles.nav} aria-label="Admin navigation">
    <Link href={`/${locale}/admin/products`}>Products</Link><Link href={`/${locale}/admin/products/new`}>Add Product</Link>
    <Link href={`/${locale}/admin/analytics`}>Example Analytics</Link><Link href={`/${locale}/catalogue`}>View Storefront</Link>
    <form action={logout}><input type="hidden" name="locale" value={locale} /><button className="button">Sign Out</button></form>
  </nav>;
}
