import { formatCount, formatExamplePeriod } from "../../../../lib/format";
import { notFound } from "next/navigation";
import { isLocale } from "../../../../i18n/config";
import { requireAdmin } from "../../../../features/admin/session";
import { AdminNav } from "../../../../features/admin/admin-nav";
import { exampleReport } from "../../../../features/analytics/example-report";
import styles from "../../../../features/admin/admin.module.css";
export default async function AnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  await requireAdmin(locale);
  const views = exampleReport.pages.reduce((sum, row) => sum + row.views, 0);
  const clicks = exampleReport.enquiries.reduce((sum, row) => sum + row.clicks, 0);
  return <><h1>Example Analytics</h1><AdminNav locale={locale} />
    <p className={styles.notice}>Example analytics — sample data, not live GA4 reporting.</p><p>Example Week: {formatExamplePeriod(exampleReport.periodStart, exampleReport.periodEnd, "en")}</p>
    <div className={styles.metrics}><div><strong>{formatCount(views, "en")}</strong>Sample page views</div><div><strong>{formatCount(clicks, "en")}</strong>Sample WhatsApp clicks</div></div>
    <h2>Page Views</h2><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Page</th><th>Views</th></tr></thead><tbody>{exampleReport.pages.map((row) => <tr key={row.path}><td>{row.path}</td><td className={styles.numeric}>{formatCount(row.views, "en")}</td></tr>)}</tbody></table></div>
    <h2>Enquiry Click Intent</h2><table className={styles.table}><thead><tr><th>Product</th><th>Locale</th><th>Clicks</th></tr></thead><tbody>{exampleReport.enquiries.map((row) => <tr key={`${row.product}-${row.locale}`}><td>{row.product}</td><td>{row.locale}</td><td className={styles.numeric}>{formatCount(row.clicks, "en")}</td></tr>)}</tbody></table>
    <p className={styles.notice}>A click is not proof of a WhatsApp message, sale or completed enquiry. These numbers are illustrative, not collected from visitors.</p>
    <p>For actual measurements, sign in to your approved property at <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">Google Analytics</a>. No Google credentials or reporting API connection are stored in this example.</p></>;
}
