import { expect, test } from "vitest";
import { hashPassword, verifyPassword, signSession, verifySession } from "../../src/features/admin/auth-core";

test("only the correct password verifies against a salted hash", () => {
  const hash = hashPassword("a-test-password-123");
  expect(verifyPassword("a-test-password-123", hash)).toBe(true);
  expect(verifyPassword("wrong", hash)).toBe(false);
  expect(verifyPassword("wrong", "malformed")).toBe(false);
});
test("sessions reject tampering, expiration, a different key and missing config", () => {
  const secret = "s".repeat(64);
  const token = signSession(secret, 1000);
  expect(verifySession(token, secret, 1001)).toBe(true);
  expect(verifySession(`${token}x`, secret, 1001)).toBe(false);
  expect(verifySession(token, secret, 1000 + 8 * 60 * 60 * 1000)).toBe(false);
  expect(verifySession(token, "b".repeat(64), 1001)).toBe(false);
  expect(verifySession(token, "", 1001)).toBe(false);
  expect(verifySession(undefined, secret, 1001)).toBe(false);
});
