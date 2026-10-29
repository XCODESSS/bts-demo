import { expect, test } from "vitest";
import { pageViewParameters, enquiryParameters, validMeasurementId } from "../../src/features/analytics/events";
test("page events remove query and referrer secrets and exclude admin or unknown paths", () => {
  expect(pageViewParameters("https://example.com/ar/catalogue?q=private+text", "https://external.test/?email=private")).toEqual({ page_location: "https://example.com/ar/catalogue", page_referrer: "", page_title: "Beyond the Space Perfume", locale: "ar" });
  expect(pageViewParameters("https://example.com/en/admin/products")).toBeNull();
  expect(pageViewParameters("https://example.com/en/private-email@example.com")).toBeNull();
  expect(validMeasurementId("G-DEMO123")).toBe(true);
  expect(validMeasurementId("invalid")).toBe(false);
});
test("enquiry events describe intent without recipient, message or external link", () => {
  expect(enquiryParameters("ar", "P0028")).toEqual({ locale: "ar", enquiry_type: "product", product_id: "P0028" });
  expect(enquiryParameters("en")).toEqual({ locale: "en", enquiry_type: "general" });
});
