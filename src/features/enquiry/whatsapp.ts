import type { Product } from "../products/model";
import type { Locale } from "../../i18n/config";
function link(number: string | undefined, message: string): string | null {
  if (!number || !/^[1-9]\d{6,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function buildWhatsAppUrl(
  number: string | undefined,
  product: Product,
  locale: Locale,
): string | null {
  return link(
    number,
    locale === "ar"
      ? `مرحباً، أنا مهتم بعطر ${product.brand} ${product.name} بحجم ${product.sizeLabel}. يرجى تأكيد السعر والتوفر. رمز المنتج: ${product.id}.`
      : `Hello, I'm interested in ${product.brand} ${product.name}, ${product.sizeLabel}. Could you please confirm the price and availability? Product: ${product.id}.`,
  );
}
export function buildGeneralWhatsAppUrl(
  number: string | undefined,
  locale: Locale,
): string | null {
  return link(
    number,
    locale === "ar"
      ? "مرحباً، أود المساعدة في اختيار عطر."
      : "Hello, I would like help choosing a fragrance.",
  );
}
