import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { expect, test } from "vitest";
import { openProductStore } from "../../src/features/products/product-store";

test("the actual admin:seed entrypoint creates persistent storage and preserves existing edits", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "bts-seed-cli-"));
  const filename = path.join(dir, "private", "catalogue.sqlite");
  const seed = () => spawnSync(process.execPath, ["--import", "tsx", "scripts/seed-admin.ts"], {
    cwd: process.cwd(), env: { ...process.env, BTS_DATABASE_PATH: filename }, encoding: "utf8", timeout: 15000,
  });
  try {
    const first = seed();
    expect(first.status, first.stderr).toBe(0);
    expect(first.stdout).toContain("Catalogue ready: 100 products");
    const store = openProductStore(filename);
    try {
      const product = store.findById("P0028")!;
      store.update(product.id, { ...product, description: { ...product.description, en: "Preserve my saved edit." } });
    } finally { store.close(); }
    const repeated = seed();
    expect(repeated.status, repeated.stderr).toBe(0);
    const reopened = openProductStore(filename);
    try {
      expect(reopened.list()).toHaveLength(100);
      expect(reopened.findById("P0028")?.description.en).toBe("Preserve my saved edit.");
    } finally { reopened.close(); }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
