"use client";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "./model";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";
export function ProductImage({
  product,
  locale,
  priority = false,
  className = "",
}: {
  product: Product;
  locale: Locale;
  priority?: boolean;
  className?: string;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const source = product.image.src;
  if (failedSource === source)
    return (
      <div
        className={`image-fallback ${className}`}
        role="img"
        aria-label={`${product.brand} ${product.name}`}
      >
        <span>{getDictionary(locale).noImage}</span>
        <bdi translate="no">{product.name}</bdi>
      </div>
    );
  return (
    <Image
      className={className}
      key={source}
      src={source}
      alt={`${product.brand} ${product.name}`}
      width={500}
      height={600}
      unoptimized
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      onError={() => setFailedSource(source)}
    />
  );
}
