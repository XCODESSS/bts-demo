import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import {
  buildDemoProducts,
  parseSource,
  type EditorialMap,
} from "./import-core";
const root = process.env.PERFUME_SOURCE_DIR || "D:/perfume-search";
const selection: string[] = JSON.parse(
  readFileSync("content/curation.json", "utf8"),
);
const expected = process.argv.includes("--seed") ? 3 : 100;
if (selection.length !== expected)
  throw new Error(
    `Expected ${expected} selected products, received ${selection.length}`,
  );
const editorial: EditorialMap = JSON.parse(
  readFileSync("content/editorial.json", "utf8"),
);
const source = parseSource(
  readFileSync(`${root}/site/data/catalogue.js`, "utf8"),
);
const products = buildDemoProducts(source, selection, editorial, root);
mkdirSync("src/data", { recursive: true });
writeFileSync(
  "src/data/products.json",
  JSON.stringify(products, null, 2) + "\n",
);
console.log(
  `Exported ${products.length} allowlisted products. Run python scripts/prepare-assets.py to prepare selected images.`,
);
