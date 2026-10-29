import type { Locale } from "../../i18n/config";
import type { Product } from "../products/model";
import { getDictionary } from "../../i18n/dictionaries";
import { buildGeneralWhatsAppUrl, buildWhatsAppUrl } from "./whatsapp";
import { Icon } from "../../components/icon";
import { TrackedEnquiryLink } from "../analytics/tracked-enquiry-link";
export function EnquiryLink({
  product,
  locale,
  className = "",
  compact = false,
}: {
  product?: Product;
  locale: Locale;
  className?: string;
  compact?: boolean;
}) {
  const d = getDictionary(locale);
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const href = product
    ? buildWhatsAppUrl(number, product, locale)
    : buildGeneralWhatsAppUrl(number, locale);
  const label = product ? d.enquire : d.advice;
  if (!href)
    return (
      <div className={`enquiry-unavailable ${compact ? "compact" : ""}`}>
        <button className={`button ${className}`} disabled title={d.disabled}>
          <Icon name="whatsapp" />
          {label}
        </button>
        {!compact && <p className="configuration-note">{d.disabled}</p>}
      </div>
    );
  return (
    <TrackedEnquiryLink
      href={href}
      locale={locale}
      productId={product?.id}
      className={`button ${className}`}
    >
      <Icon name="whatsapp" />
      {label}
    </TrackedEnquiryLink>
  );
}
