import type { Metadata } from "next";
import styles from "../../../features/admin/admin.module.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Catalogue studio", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <section className={styles.shell}><p>Beyond the Space · Catalogue studio</p>{children}</section>;
}
