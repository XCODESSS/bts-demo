import { notFound, redirect } from "next/navigation";
import { isLocale } from "../../../../i18n/config";
import { adminConfigured, hasAdminSession } from "../../../../features/admin/session";
import { LoginForm } from "../../../../features/admin/login-form";
export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  if (await hasAdminSession()) redirect(`/${locale}/admin/products`);
  return <><h1>Admin sign in</h1><p>Single-operator demo. Customer accounts and checkout are not enabled.</p><LoginForm locale={locale} configured={adminConfigured()} /></>;
}
