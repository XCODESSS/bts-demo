import localFont from "next/font/local";

export const manrope = localFont({
  src: [
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: true, variable: "--font-manrope",
});
export const cormorant = localFont({
  src: [
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: true, variable: "--font-cormorant",
});
export const arabic = localFont({
  src: [
    { path: "../../node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: true, variable: "--font-arabic", adjustFontFallback: false,
});
