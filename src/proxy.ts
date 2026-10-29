import { NextResponse, type NextRequest } from "next/server";
import { preferredLocale } from "./i18n/preferred-locale";

export function proxy(request: NextRequest) {
  const target = request.nextUrl.clone();
  target.pathname = `/${preferredLocale(request.headers.get("accept-language"))}`;
  const response = NextResponse.redirect(target, 307);
  response.headers.set("Vary", "Accept-Language");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: "/" };
