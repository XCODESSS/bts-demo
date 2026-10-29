import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "../../../../i18n/config";
import { requireAdmin } from "../../../../features/admin/session";
import { AdminNav } from "../../../../features/admin/admin-nav";
import { getProducts } from "../../../../features/products/repository";
import { queryAdminProducts } from "../../../../features/admin/products-query";
import { formatCount } from "../../../../lib/format";
import styles from "../../../../features/admin/admin.module.css";
export default async function ProductsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdmin(locale);
  const input = await searchParams;
  const query = new URLSearchParams();
  for (const key of ["q", "page"] as const) {
    const value = input[key];
    if (typeof value === "string") query.set(key, value);
  }
  const result = queryAdminProducts(getProducts(), query);
  const base = `/${locale}/admin/products`;
  const href = (page: number) => {
    const next = new URLSearchParams();
    if (result.q) next.set("q", result.q);
    if (page > 1) next.set("page", String(page));
    return `${base}${next.size ? `?${next}` : ""}`;
  };
  return <><h1>Manage Products</h1><AdminNav locale={locale} />
    <form action={base} method="get" className={styles.search}><label>Search products<input name="q" type="search" autoComplete="off" defaultValue={result.q} maxLength={200} /></label><button className="button">Search</button></form>
    <p role="status">{formatCount(result.total, "en")} {result.total === 1 ? "product" : "products"}</p>
    {result.total ? <>
      <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>ID</th><th>Brand</th><th>Product</th><th>Action</th></tr></thead><tbody>
        {result.items.map(p => <tr key={p.id}><td translate="no">{p.id}</td><td translate="no">{p.brand}</td><td translate="no">{p.name}</td><td><Link href={`${base}/${p.id}`}>Edit {p.name}</Link></td></tr>)}
      </tbody></table></div>
      {result.totalPages > 1 && <nav className={styles.pagination} aria-label="Product Pages">
        {result.page > 1 && <Link href={href(result.page - 1)}>Previous</Link>}
        {Array.from({ length: result.totalPages }, (_, index) => index + 1).map(page => <Link key={page} href={href(page)} aria-label={`Page ${formatCount(page, "en")}`} aria-current={page === result.page ? "page" : undefined}>{formatCount(page, "en")}</Link>)}
        {result.page < result.totalPages && <Link href={href(result.page + 1)}>Next</Link>}
      </nav>}
    </> : <section className={styles.notice}><h2>No Products Match Your Search</h2><p>Try a different Product ID, brand, or name.</p><Link href={base}>Clear Search</Link></section>}
  </>;
}
