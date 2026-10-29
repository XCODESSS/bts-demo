import type { MetadataRoute } from "next";
import { getProducts } from "../features/products/repository";
import { buildSitemap } from "../features/seo/metadata";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap { return buildSitemap(getProducts()); }
