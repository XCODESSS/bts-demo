import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { signSession, verifySession } from "./auth-core";
import type { Locale } from "../../i18n/config";
export const SESSION_COOKIE = "bts_admin";
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_USERNAME && /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.ADMIN_PASSWORD_HASH || "") && (process.env.ADMIN_SESSION_SECRET?.length || 0) >= 32 && process.env.BTS_DATABASE_PATH && existsSync(process.env.BTS_DATABASE_PATH));
}
function signingKey(): string {
  if (!adminConfigured()) return "";
  // Rotating the password, user or secret also revokes existing sessions.
  return createHash("sha256").update(`${process.env.ADMIN_SESSION_SECRET}:${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD_HASH}`).digest("hex");
}
export async function hasAdminSession(): Promise<boolean> {
  return verifySession((await cookies()).get(SESSION_COOKIE)?.value, signingKey(), Date.now());
}
export async function requireAdmin(locale: Locale = "en"): Promise<void> {
  if (!(await hasAdminSession())) redirect(`/${locale}/admin/login`);
}
export async function verifyActionOrigin(): Promise<void> {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("host");
  if (!origin || !host) throw new Error("Untrusted request origin.");
  const parsed = new URL(origin);
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.host !== host) throw new Error("Untrusted request origin.");
}
export async function establishSession(): Promise<void> {
  const h = await headers();
  const origin = h.get("origin") || "";
  (await cookies()).set(SESSION_COOKIE, signSession(signingKey(), Date.now()), {
    httpOnly: true, sameSite: "lax", secure: origin.startsWith("https://"), path: "/", maxAge: 8 * 60 * 60,
  });
}
