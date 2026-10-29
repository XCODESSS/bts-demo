import { expect, test } from "vitest";
import {
  buildWhatsAppUrl,
  buildGeneralWhatsAppUrl,
} from "../../src/features/enquiry/whatsapp";
import { getProducts } from "../../src/features/products/repository";
const product = getProducts().find((p) => p.id === "P0028")!;
test("missing configuration never invents a recipient", () => {
  expect(buildWhatsAppUrl(undefined, product, "en")).toBeNull();
  expect(buildWhatsAppUrl("+971 123456", product, "en")).toBeNull();
});
test("English enquiry identifies the exact product and size", () => {
  const url = new URL(buildWhatsAppUrl("14155552671", product, "en")!);
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toBe("/14155552671");
  expect(url.searchParams.get("text")).toBe(
    "Hello, I'm interested in Armaf Club de Nuit Iconic, 105 ml. Could you please confirm the price and availability? Product: P0028.",
  );
});
test("Arabic enquiry uses an Arabic message with the same product identity", () => {
  const url = new URL(buildWhatsAppUrl("14155552671", product, "ar")!);
  expect(url.searchParams.get("text")).toBe(
    "مرحباً، أنا مهتم بعطر Armaf Club de Nuit Iconic بحجم 105 ml. يرجى تأكيد السعر والتوفر. رمز المنتج: P0028.",
  );
});
test("general contact is not silently tied to an unrelated product", () => {
  expect(buildGeneralWhatsAppUrl("", "en")).toBeNull();
  expect(
    new URL(buildGeneralWhatsAppUrl("14155552671", "en")!).searchParams.get(
      "text",
    ),
  ).toBe("Hello, I would like help choosing a fragrance.");
});
