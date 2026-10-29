import { expect, test } from "vitest";
import { preferredLocale } from "../../src/i18n/preferred-locale";

test("initial locale respects supported language weights and safe fallbacks", () => {
  expect(preferredLocale(null)).toBe("en");
  expect(preferredLocale("ar-AE,ar;q=0.9,en;q=0.8")).toBe("ar");
  expect(preferredLocale("en-US,en;q=0.9,ar;q=0.2")).toBe("en");
  expect(preferredLocale("fr-FR,ar;q=0.7")).toBe("ar");
  expect(preferredLocale("ar;q=0,en;q=0.5")).toBe("en");
  expect(preferredLocale("ar;q=bad,en;q=0.5")).toBe("en");
  expect(preferredLocale("fr-FR")).toBe("en");
  expect(preferredLocale("en;q=0,*;q=0.5")).toBe("ar");
  expect(preferredLocale("ar;q=1.1,en;q=0.5")).toBe("en");
  expect(preferredLocale("ar;q=0.5,en;q=0.5")).toBe("ar");
});
