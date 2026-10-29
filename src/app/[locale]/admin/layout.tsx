import type { Metadata } from "next";
import styles from "../../../features/admin/admin.module.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Catalogue Studio", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <section className={styles.shell} lang="en" dir="ltr"><p><span translate="no">Beyond the Space</span> · Catalogue Studio</p>{children}</section>;
}
