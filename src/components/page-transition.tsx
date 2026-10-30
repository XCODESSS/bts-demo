"use client";
import { ViewTransition, type ReactNode } from "react";

/** Only public route content participates; query changes keep the same identity. */
export function PageTransition({ routeKey, children }: { routeKey: string; children: ReactNode }) {
  return (
    <ViewTransition key={routeKey} name="bts-public-page"
      default="none" share="bts-page" enter="bts-page" exit="bts-page">
      <div data-public-page>{children}</div>
    </ViewTransition>
  );
}
