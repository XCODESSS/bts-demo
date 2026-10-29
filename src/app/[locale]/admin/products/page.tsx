import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "../../../../i18n/config";
import { requireAdmin } from "../../../../features/admin/session";
import { AdminNav } from "../../../../features/admin/admin-nav";
import { getProducts } from "../../../../features/products/repository";
import styles from "../../../../features/admin/admin.module.css";
export default async function ProductsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdmin(locale);
  const { q = "" } = await searchParams;
  const normalize = (s: string) => s.toLocaleLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670\u0640]/g, "");
  const words = normalize(String(q)).split(/\s+/).filter(Boolean);
  const products = getProducts().filter((p) => words.every((word) => normalize(`${p.id} ${p.brand} ${p.name} ${p.description.ar}`).includes(word)));
  return <><h1>Manage products</h1><AdminNav locale={locale} />
    <form className={styles.search}><label>Search products<input name="q" type="search" defaultValue={q} maxLength={200} /></label><button className="button">Search</button></form>
    <p role="status">{products.length} products</p>
    <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Brand</th><th>Product</th><th>Action</th></tr></thead><tbody>
      {products.map((p) => <tr key={p.id}><td>{p.id}</td><td>{p.brand}</td><td>{p.name}</td><td><Link href={`/${locale}/admin/products/${p.id}`}>Edit {p.name}</Link></td></tr>)}
    </tbody></table></div></>;
}
