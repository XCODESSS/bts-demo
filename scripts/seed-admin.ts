import nextEnv from "@next/env";
import { mkdirSync } from "node:fs";
import path from "node:path";
import products from "../src/data/products.json";
import { openProductStore } from "../src/features/products/product-store";
import { validateProduct } from "../src/features/products/product-validation";
nextEnv.loadEnvConfig(process.cwd());
const filename = process.env.BTS_DATABASE_PATH;
if (!filename) throw new Error("Set BTS_DATABASE_PATH to a private persistent path, e.g. ./var/catalogue.sqlite.");
if (path.resolve(filename).startsWith(path.resolve("public") + path.sep)) throw new Error("Database cannot be under public/.");
mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
const store = openProductStore(filename);
try { store.seed(products.map(validateProduct)); console.log(`Catalogue ready: ${store.list().length} products. Existing edits retained.`); }
finally { store.close(); }
