/** Shared by the picker and the pre-paint restoration script. */
export const designIds = ["atelier", "gallery", "linen", "salon", "gilded", "noir", "souk", "verdant"] as const;
export type DesignId = (typeof designIds)[number];
export const designCanvas: Record<DesignId, string> = {
  atelier: "#fbfaf6", gallery: "#ffffff", linen: "#fcf9f3", salon: "#fbfaf6", gilded: "#f6eedb", noir: "#07211d", souk: "#e3ecdc", verdant: "#ffffff",
};

export function isDesign(value: string | null | undefined): value is DesignId {
  return designIds.some((id) => id === value);
}
