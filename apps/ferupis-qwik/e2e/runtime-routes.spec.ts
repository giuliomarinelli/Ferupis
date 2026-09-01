import { expect, test } from "@playwright/test";

test("l'artefatto Pages espone la route HTTP reale dei contatti", async ({
  request,
}) => {
  const response = await request.get("/api/contact/messages/");

  expect(response.status()).toBe(405);
  expect(response.headers()).toMatchObject({
    allow: "POST",
    "cache-control": "private, no-store, max-age=0, must-revalidate",
    "cross-origin-resource-policy": "same-origin",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  });
  expect(await response.json()).toEqual({
    ok: false,
    code: "METHOD_NOT_ALLOWED",
  });

  const invalidPost = await request.post("/api/contact/messages/", {
    data: "not-json",
    headers: {
      "Content-Type": "text/plain",
      Origin: "http://127.0.0.1:8790",
      "Sec-Fetch-Site": "same-origin",
    },
  });
  expect(invalidPost.status()).toBe(415);
  expect(await invalidPost.json()).toEqual({
    ok: false,
    code: "CONTENT_TYPE_UNSUPPORTED",
  });
});

test("una route foto sconosciuta risponde 404 e impedisce l'indicizzazione", async ({
  page,
}) => {
  const response = await page.goto("/foto/slug-sconosciuto/");

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Foto | Ferupis");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("espone discovery SEO dinamica dal runtime Pages", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()).toMatchObject({
    "permissions-policy":
      "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  });
  expect(sitemap.headers()["content-type"]).toBe(
    "application/xml; charset=utf-8",
  );
  expect(sitemap.headers()["cache-control"]).toBe(
    "public, max-age=0, s-maxage=3600",
  );
  const sitemapXml = await sitemap.text();
  expect(sitemapXml).toContain(
    "<loc>https://ferupis.pages.dev/le-api/ape-regina/</loc>",
  );
  expect(sitemapXml).toContain(
    "<loc>https://ferupis.pages.dev/foto/uova-api/</loc>",
  );
  expect(sitemapXml).not.toContain("/api/");

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toBe(
    "User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: https://ferupis.pages.dev/sitemap.xml\n",
  );

  const llms = await request.get("/llms.txt");
  expect(llms.status()).toBe(200);
  expect(await llms.text()).toContain(
    "- L'ape regina: https://ferupis.pages.dev/le-api/ape-regina/",
  );
});

test("renderizza canonical, social metadata e JSON-LD rotta per rotta", async ({
  page,
}) => {
  const response = await page.goto(
    "/le-api/ape-regina/?utm_source=technical-seo-test",
  );

  expect(response?.status()).toBe(200);
  expect(response?.headers()).toMatchObject({
    "permissions-policy":
      "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
  });
  await expect(page).toHaveTitle("L'ape regina | Ferupis");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://ferupis.pages.dev/le-api/ape-regina/",
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://ferupis.pages.dev/le-api/ape-regina/",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /^index, follow/,
  );

  const jsonLd = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "null",
  );
  expect(jsonLd["@context"]).toBe("https://schema.org");
  expect(
    jsonLd["@graph"].some(
      (node: { "@type"?: string }) => node["@type"] === "BreadcrumbList",
    ),
  ).toBe(true);
  expect(JSON.stringify(jsonLd)).not.toMatch(/<[^>]+>/);

  await page.goto("/foto/uova-api/");
  await expect(page).toHaveTitle("Uova di ape | Foto | Ferupis");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://ferupis.pages.dev/foto/uova-api/",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Fotografia Ferupis di uova di ape.",
  );
});
