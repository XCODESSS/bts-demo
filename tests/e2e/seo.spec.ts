import { expect, test } from "@playwright/test";
for (const locale of ["en", "ar"]) {
  test(`canonical, language alternatives and social metadata are delivered in ${locale}`, async ({ page, request }) => {
    const suffix = "/perfumes/armaf-club-de-nuit-iconic-p0028";
    await page.goto(`/${locale}${suffix}?return=q%3Dprivate`);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute("href", new RegExp(`/${locale}${suffix}$`));
    for (const language of ["en", "ar"]) await expect(page.locator(`link[rel="alternate"][hreflang="${language}"]`)).toHaveAttribute("href", new RegExp(`/${language}${suffix}$`));
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Armaf Club de Nuit Iconic");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", locale === "ar" ? "ar_AE" : "en_US");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toMatch(/^https?:\/\//);
    const localImage = new URL(image!).pathname;
    expect((await request.get(localImage)).ok()).toBe(true);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    const xml = await sitemap.text();
    expect(xml).toContain(`/en${suffix}`);
    expect(xml).toContain(`/ar${suffix}`);
    expect(xml).toContain('hreflang="ar"');
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("return=");
  });
}
