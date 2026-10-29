"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale } from "../../i18n/config";
import { verifyPassword } from "./auth-core";
import { adminConfigured, establishSession, SESSION_COOKIE, verifyActionOrigin } from "./session";

// Bounded single-operator throttle for this single-process prototype. A production
// deployment needs a durable, distributed rate limiter and full identity service.
const attempts = { count: 0, resetAt: 0 };
export async function login(locale: string, _previous: string, data: FormData): Promise<string> {
  if (!isLocale(locale)) return "Unsupported locale.";
  await verifyActionOrigin();
  if (!adminConfigured()) return "Admin is not configured. Run npm run admin:setup, then npm run admin:seed and restart.";
  const now = Date.now();
  if (now >= attempts.resetAt) { attempts.count = 0; attempts.resetAt = now + 15 * 60 * 1000; }
  if (attempts.count >= 8) return "Too many attempts. Try again in 15 minutes.";
  attempts.count++;
  const username = String(data.get("username") || "");
  const validPassword = verifyPassword(String(data.get("password") || ""), process.env.ADMIN_PASSWORD_HASH || "");
  if (username !== process.env.ADMIN_USERNAME || !validPassword) return "Check your username and password, then try again.";
  attempts.count = 0;
  await establishSession();
  redirect(`/${locale}/admin/products`);
}
export async function logout(data: FormData): Promise<void> {
  await verifyActionOrigin();
  (await cookies()).delete(SESSION_COOKIE);
  const locale = String(data.get("locale") || "en");
  redirect(`/${isLocale(locale) ? locale : "en"}/admin/login`);
}
