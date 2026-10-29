import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
export const SESSION_MS = 8 * 60 * 60 * 1000;
export function hashPassword(password: string): string {
  if (password.length < 12 || password.length > 200) throw new Error("Use a password of 12–200 characters.");
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, hash: string): boolean {
  if (password.length > 200 || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash)) return false;
  const [salt, expected] = hash.split(":");
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(expected, "hex"));
}
export function signSession(secret: string, nowMs: number): string {
  if (secret.length < 32) throw new Error("Admin session secret is not configured.");
  const payload = `${nowMs + SESSION_MS}.${randomBytes(24).toString("hex")}`;
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("hex")}`;
}
export function verifySession(token: string | undefined, secret: string, nowMs: number): boolean {
  if (!token || secret.length < 32 || !/^\d{1,16}\.[a-f0-9]{48}\.[a-f0-9]{64}$/.test(token)) return false;
  const [expiry, nonce, signature] = token.split(".");
  const expires = Number(expiry);
  if (expires <= nowMs || expires > nowMs + SESSION_MS) return false;
  const expected = createHmac("sha256", secret).update(`${expiry}.${nonce}`).digest();
  return timingSafeEqual(Buffer.from(signature, "hex"), expected);
}
