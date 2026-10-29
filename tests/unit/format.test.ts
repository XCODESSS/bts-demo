import { expect, test } from "vitest";
import { formatCount, formatDiscount, formatExamplePeriod } from "../../src/lib/format";

test("discounts use localized signed percent formatting", () => {
  expect(formatDiscount(30, "en")).toBe("−30%");
  expect(formatDiscount(30, "ar")).toContain("٣٠");
});
test("example periods are deterministic date ranges", () => {
  expect(formatExamplePeriod("2026-10-19", "2026-10-25", "en")).toBe("19\u2009–\u200925 October 2026");
});
test("counts use locale numerals and grouping", () => {
  expect(formatCount(1000, "en")).toBe("1,000");
  expect(formatCount(25, "ar")).toBe("٢٥");
});
