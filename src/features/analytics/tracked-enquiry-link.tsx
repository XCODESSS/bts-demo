"use client";
import type { Locale } from "../../i18n/config";
import { trackEvent } from "./browser";
import { enquiryParameters } from "./events";
export function TrackedEnquiryLink({ locale, productId, children, ...props }: { locale: Locale; productId?: string; children: React.ReactNode; href: string; className: string }) {
  return <a {...props} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_enquiry_click", enquiryParameters(locale, productId))}>{children}</a>;
}
