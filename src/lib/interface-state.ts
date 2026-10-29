export type DiscoveryTab = "notes" | "families";
export function readDiscoveryTab(search: string): DiscoveryTab {
  return new URLSearchParams(search).get("discovery") === "families" ? "families" : "notes";
}

export type InformationTopic = "contact" | "tracking" | "shipping" | "returns";
export function readInformationTopic(search: string): InformationTopic | null {
  const topic = new URLSearchParams(search).get("info");
  return topic === "contact" || topic === "tracking" || topic === "shipping" || topic === "returns" ? topic : null;
}

export type DetailPanel = "description" | "notes";
const detailPanels: readonly DetailPanel[] = ["description", "notes"];
export function readDetailPanels(search: string): DetailPanel[] {
  const value = new URLSearchParams(search).get("details");
  if (value === "none") return [];
  const tokens = value?.split(",") || [];
  const selected = detailPanels.filter(panel => tokens.includes(panel));
  return selected.length ? selected : [...detailPanels];
}
export function serializeDetailPanels(panels: readonly DetailPanel[]): string | null {
  const selected = detailPanels.filter(panel => panels.includes(panel));
  return selected.length === 2 ? null : selected.join(",") || "none";
}

/** Mutate one UI key, retaining other state and hashes, never a navigation origin. */
export function withSearchValue(href: string, key: string, value: string | null): string {
  if (!href.startsWith("/") || href.startsWith("//") || /[\\\u0000-\u0020]/.test(href)) {
    throw new Error("Expected an app-relative URL");
  }
  const url = new URL(href, "https://interface.invalid");
  if (value === null) url.searchParams.delete(key);
  else url.searchParams.set(key, value);
  return `${url.pathname}${url.search}${url.hash}`;
}
