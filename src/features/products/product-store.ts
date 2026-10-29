import { DatabaseSync } from "node:sqlite";
import type { Product } from "./model";
import { validateProduct } from "./product-validation";

export function openProductStore(filename: string) {
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE,
      position INTEGER NOT NULL UNIQUE, payload TEXT NOT NULL
    );`);
  const decode = (row: Record<string, unknown> | undefined): Product | undefined => row ? validateProduct(JSON.parse(String(row.payload))) : undefined;
  function transaction<T>(work: () => T): T {
    db.exec("BEGIN IMMEDIATE");
    try { const result = work(); db.exec("COMMIT"); return result; }
    catch (error) { db.exec("ROLLBACK"); throw error; }
  }
  function insert(input: Product) {
    const p = validateProduct(input);
    db.prepare("INSERT INTO products (id, slug, position, payload) VALUES (?, ?, (SELECT COALESCE(MAX(position), -1) + 1 FROM products), ?)").run(p.id, p.slug, JSON.stringify(p));
  }
  return {
    list(): readonly Product[] { return db.prepare("SELECT payload FROM products ORDER BY position").all().map((row) => decode(row)!); },
    findBySlug(slug: string) { return decode(db.prepare("SELECT payload FROM products WHERE slug = ?").get(slug)); },
    findById(id: string) { return decode(db.prepare("SELECT payload FROM products WHERE id = ?").get(id)); },
    seed(products: readonly Product[]) {
      transaction(() => { if (!db.prepare("SELECT id FROM products LIMIT 1").get()) products.forEach(insert); });
    },
    create(product: Product) { transaction(() => insert(product)); },
    update(id: string, input: Product) {
      const p = validateProduct(input);
      transaction(() => {
        const current = decode(db.prepare("SELECT payload FROM products WHERE id = ?").get(id));
        if (!current || id !== p.id || current.slug !== p.slug) throw new Error("Existing product ID and slug cannot change.");
        db.prepare("UPDATE products SET payload = ? WHERE id = ?").run(JSON.stringify(p), id);
      });
    },
    close() { db.close(); },
  };
}
