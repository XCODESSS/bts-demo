"use client";
import Link from "next/link";
import { useState, ViewTransition, type ReactNode } from "react";

const identity = (id: string) => `bts-bottle-${id}`;

/** Full dynamic-route prefetch on intent only. Link still owns native navigation. */
export function ProductNavigationLink({ productId, href, label, className, children }: {
  productId: string; href: string; label?: string; className?: string; children: ReactNode;
}) {
  const [intentHref, setIntentHref] = useState<string | null>(null);
  const prepare = () => setIntentHref(href);
  return (
    <Link href={href} aria-label={label} className={className}
      transitionTypes={[identity(productId)]} prefetch={intentHref === href}
      onPointerEnter={prepare} onFocus={prepare}>
      {children}
    </Link>
  );
}

/** Only the selected product may share; unrelated matching cards remain still. */
export function ProductImageTransition({ productId, children }: { productId: string; children: ReactNode }) {
  const name = identity(productId);
  return (
    <ViewTransition name={name} default="none" enter="none" exit="none" update="none"
      share={{ [name]: "bts-bottle", default: "none" }}>
      {children}
    </ViewTransition>
  );
}
