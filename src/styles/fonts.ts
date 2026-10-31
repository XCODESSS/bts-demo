import localFont from "next/font/local";

export const manrope = localFont({
  src: [
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: true, variable: "--font-manrope",
});
export const bodoni = localFont({
  src: [
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../../node_modules/@fontsource/bodoni-moda/files/bodoni-moda-latin-600-normal.woff2", weight: "600", style: "normal" },
  ], display: "swap", preload: true, variable: "--font-bodoni",
  fallback: ["Georgia", "Times New Roman", "serif"], adjustFontFallback: "Times New Roman",
});
export const arabic = localFont({
  src: [
    { path: "../../node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/noto-sans-arabic/files/noto-sans-arabic-arabic-600-normal.woff2", weight: "600" },
  ], display: "swap", preload: true, variable: "--font-arabic", adjustFontFallback: false,
});
export const fraunces = localFont({
  src: [
    { path: "../../node_modules/@fontsource/fraunces/files/fraunces-latin-700-normal.woff2", weight: "700" },
    { path: "../../node_modules/@fontsource/fraunces/files/fraunces-latin-800-normal.woff2", weight: "800" },
  ], display: "swap", preload: true, variable: "--font-fraunces",
});
export const cinzel = localFont({
  src: [
    { path: "../../node_modules/@fontsource/cinzel/files/cinzel-latin-600-normal.woff2", weight: "600" },
    { path: "../../node_modules/@fontsource/cinzel/files/cinzel-latin-700-normal.woff2", weight: "700" },
  ], display: "swap", preload: false, variable: "--font-cinzel",
});
export const playfair = localFont({
  src: [
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2", weight: "700" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-800-normal.woff2", weight: "800" },
    { path: "../../node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff2", weight: "700", style: "italic" },
  ], display: "swap", preload: false, variable: "--font-playfair",
});
export const bricolage = localFont({
  src: [
    { path: "../../node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2", weight: "700" },
    { path: "../../node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2", weight: "800" },
  ], display: "swap", preload: false, variable: "--font-bricolage",
});
