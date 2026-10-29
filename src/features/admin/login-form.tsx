"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { login } from "./login-actions";
import type { Locale } from "../../i18n/config";
import styles from "./admin.module.css";
export function LoginForm({ locale, configured }: { locale: Locale; configured: boolean }) {
  const [error, action, pending] = useActionState(login.bind(null, locale), "");
  const [username, setUsername] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (error && !pending) input.current?.focus(); }, [error, pending]);
  return <form action={action} className={styles.form} aria-busy={pending}>
    {!configured && <p>Admin is not configured. Run <code>npm run admin:setup</code>, then <code>npm run admin:seed</code> and restart the server.</p>}
    <label>Username<input ref={input} name="username" spellCheck={false} autoCapitalize="none" autoComplete="username" required maxLength={100}
      value={username} onChange={event => setUsername(event.target.value)} aria-invalid={error ? true : undefined} aria-describedby={error ? "login-feedback" : undefined} /></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={200}
      aria-invalid={error ? true : undefined} aria-describedby={error ? "login-feedback" : undefined} /></label>
    <p id="login-feedback" role="status" aria-live="polite" className={error ? styles.fieldError : undefined}>{pending ? "Signing in…" : error}</p>
    <button className="button" disabled={!configured || pending}>{pending && <span className="pending-spinner" aria-hidden="true" />}{pending ? "Signing in…" : "Sign In"}</button>
  </form>;
}
