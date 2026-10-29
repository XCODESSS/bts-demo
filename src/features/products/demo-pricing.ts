export type DemoPricing = { original: number; discounted: number; discountPercent: number };

/** Display-only sample AED amounts. Not inventory, an actual offer, or persisted pricing. */
export function getDemoPricing(productId: string): DemoPricing {
  let hash = 0;
  for (const character of productId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const original = 300 + (hash % 9) * 100;
  const discountPercent = 15 + (Math.floor(hash / 9) % 4) * 5;
  return { original, discounted: original * (100 - discountPercent) / 100, discountPercent };
}
