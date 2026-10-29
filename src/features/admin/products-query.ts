import type { Product } from "../products/model";
import { normalizeSearch } from "../catalogue/query";

export const ADMIN_PAGE_SIZE = 25;
export function queryAdminProducts(products: readonly Product[], params: URLSearchParams): {
  items: readonly Product[]; total: number; page: number; totalPages: number; q: string;
} {
  const q = (params.get("q") || "").slice(0, 200).trim();
  const words = normalizeSearch(q).split(/\s+/).filter(Boolean);
  const matching = products.filter(p => {
    const text = normalizeSearch(`${p.id} ${p.brand} ${p.name} ${p.description.ar}`);
    return words.every(word => text.includes(word));
  });
  const total = matching.length;
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  const raw = params.get("page") || "1";
  const requested = /^\d+$/.test(raw) ? Number(raw) : 1;
  const page = Math.min(totalPages, Math.max(1, requested));
  return { items: matching.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE), total, page, totalPages, q };
}
