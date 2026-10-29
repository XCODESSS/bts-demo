"use client";
import { useActionState } from "react";
import { login } from "./login-actions";
import type { Locale } from "../../i18n/config";
import styles from "./admin.module.css";
export function LoginForm({ locale, configured }: { locale: Locale; configured: boolean }) {
  const [error, action, pending] = useActionState(login.bind(null, locale), "");
  return <form action={action} className={styles.form}>
    {!configured && <p role="status">Admin is not configured. Run <code>npm run admin:setup</code>, then <code>npm run admin:seed</code> and restart the server.</p>}
    <label>Username<input name="username" spellCheck={false} autoCapitalize="none" autoComplete="username" required maxLength={100} /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={200} /></label>
    {error && <p role="alert">{error}</p>}
    <button className="button" disabled={!configured || pending}>{pending ? "Signing in…" : "Sign In"}</button>
  </form>;
}
