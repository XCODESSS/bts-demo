import products from "../../data/products.json";
import type { Product } from "./model";
import { openProductStore } from "./product-store";
import { existsSync } from "node:fs";
import path from "node:path";
const catalogue: readonly Product[] = products as Product[];
export function withProductStore<T>(work: (store: ReturnType<typeof openProductStore>) => T): T {
  const filename = process.env.BTS_DATABASE_PATH;
  if (!filename || !existsSync(filename)) throw new Error("Persistent catalogue is not initialized. Run npm run admin:seed.");
  if (path.resolve(filename).startsWith(path.resolve("public") + path.sep)) throw new Error("Database must be private.");
  const store = openProductStore(filename);
  try { return work(store); } finally { store.close(); }
}
export function getProducts(): readonly Product[] {
  return process.env.BTS_DATABASE_PATH ? withProductStore((store) => store.list()) : catalogue;
}
export function getProduct(slug: string): Product | undefined {
  return process.env.BTS_DATABASE_PATH ? withProductStore((store) => store.findBySlug(slug)) : catalogue.find((product) => product.slug === slug);
}
export function getRelated(product: Product, limit = 4): readonly Product[] {
  const others = getProducts().filter((item) => item.id !== product.id);
  return [
    ...others.filter((item) =>
      item.familyIds.some((id) => product.familyIds.includes(id)),
    ),
    ...others.filter(
      (item) => !item.familyIds.some((id) => product.familyIds.includes(id)),
    ),
  ].slice(0, limit);
}
