import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import products from "../../src/data/products.json";
import { openProductStore } from "../../src/features/products/product-store";
import { validateProduct } from "../../src/features/products/product-validation";

test("saved edits and new products survive closing and reopening storage", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "bts-store-"));
  const file = path.join(dir, "catalogue.sqlite");
  const seed = validateProduct(products[0]);
  try {
    const store = openProductStore(file);
    store.seed([seed]);
    store.update(seed.id, { ...seed, description: { en: "Saved description", ar: "وصف محفوظ" } });
    store.seed([seed]);
    store.create({ ...seed, id: "DEMO001", slug: "demo-one" });
    expect(() => store.create({ ...seed, id: "OTHER" })).toThrow();
    expect(() => store.update(seed.id, { ...seed, slug: "changed" })).toThrow();
    store.close();
    const reopened = openProductStore(file);
    expect(reopened.list()).toHaveLength(2);
    expect(reopened.findById(seed.id)?.description.en).toBe("Saved description");
    expect(reopened.findBySlug("demo-one")?.id).toBe("DEMO001");
    reopened.close();
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("invalid bilingual fields, unknown keys and unsafe images cannot be persisted", () => {
  const seed = products[0];
  for (const input of [
    { ...seed, prices: 100 },
    { ...seed, description: { en: "OK", ar: "" } },
    { ...seed, familyIds: ["__proto__"] },
    { ...seed, image: { ...seed.image, src: "/perfumes/../../.env" } },
    { ...seed, notes: { en: ["Mint"], ar: [] } },
    { ...seed, slug: "../bad" },
  ]) expect(() => validateProduct(input)).toThrow();
});
