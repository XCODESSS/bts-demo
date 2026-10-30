import localFont from "next/font/local";

export const manrope = localFont({
  src: [
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2", weight: "600" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff2", weight: "700" },
  ], display: "swap", preload: true, variable: "--font-manrope",
});
export const bodoni = localFont({
  src: [
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-500-normal.woff2", weight: "500", style: "normal" },
  ], display: "swap", preload: true, variable: "--font-bodoni",
  fallback: ["Georgia", "Times New Roman", "serif"], adjustFontFallback: "Times New Roman",
});
export const arabic = localFont({
  src: [
    { path: "../../node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: true, variable: "--font-arabic", adjustFontFallback: false,
});
/** Arabic counterpart to the Latin didone: display headings only, never controls or body copy. */
export const arabicDisplay = localFont({
  src: [
    { path: "../../node_modules/@fontsource/noto-naskh-arabic/files/noto-naskh-arabic-arabic-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/noto-naskh-arabic/files/noto-naskh-arabic-arabic-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: false, variable: "--font-arabic-display", adjustFontFallback: false,
});
