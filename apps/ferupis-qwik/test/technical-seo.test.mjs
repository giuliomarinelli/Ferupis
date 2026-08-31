import assert from "node:assert/strict";
import test from "node:test";
import { getIndexableRouteKeys } from "../src/config/routes.ts";
import {
  createLlmsText,
  createRobotsText,
  createSitemapXml,
  getCanonicalUrlForPathname,
  getIndexableSiteUrls,
  getTechnicalSeoHead,
} from "../src/seo/technical-seo.ts";

const getMetaContent = (head, key) =>
  head.meta?.find((meta) => meta.key === key)?.content;

test("creates complete technical metadata from the route registry", () => {
  const head = getTechnicalSeoHead({
    url: new URL("https://preview.example/le-api/ape-regina/?source=test"),
  });

  assert.equal(head.title, "L'ape regina | Ferupis");
  assert.equal(
    getMetaContent(head, "og:url"),
    "https://ferupis.pages.dev/le-api/ape-regina/",
  );
  assert.match(getMetaContent(head, "description"), /ape regina/i);
  assert.match(getMetaContent(head, "robots"), /^index, follow/);
  assert.equal(getMetaContent(head, "og:image"), undefined);

  const jsonLd = JSON.parse(
    head.scripts?.find((script) => script.key === "json-ld-site-graph")
      ?.script ?? "null",
  );
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.ok(
    jsonLd["@graph"].some(
      (node) => node["@type"] === "BreadcrumbList",
    ),
  );
  assert.doesNotMatch(JSON.stringify(jsonLd), /<[^>]+>/);
});

test("does not canonicalize unknown routes and marks them noindex", () => {
  assert.equal(getCanonicalUrlForPathname("/foto/slug-sconosciuto/"), null);

  const head = getTechnicalSeoHead({
    url: new URL("https://ferupis.pages.dev/foto/slug-sconosciuto/"),
  });
  assert.equal(head.title, "Foto | Ferupis");
  assert.equal(getMetaContent(head, "robots"), "noindex");
  assert.equal(head.scripts, undefined);
});

test("builds one canonical sitemap entry for every indexable route", () => {
  const urls = getIndexableSiteUrls();
  const sitemap = createSitemapXml();

  assert.equal(urls.length, getIndexableRouteKeys().length);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal((sitemap.match(/<loc>/g) ?? []).length, urls.length);
  assert.match(sitemap, /<loc>https:\/\/ferupis\.pages\.dev\/<\/loc>/);
  assert.match(
    sitemap,
    /<loc>https:\/\/ferupis\.pages\.dev\/foto\/uova-api\/<\/loc>/,
  );
  assert.doesNotMatch(sitemap, /\/api\//);
});

test("publishes crawler and AI discovery files from the same registry", () => {
  const robots = createRobotsText();
  const llms = createLlmsText();

  assert.match(robots, /^User-agent: \*\nAllow: \//);
  assert.match(robots, /Disallow: \/api\//);
  assert.match(
    robots,
    /Sitemap: https:\/\/ferupis\.pages\.dev\/sitemap\.xml/,
  );
  assert.match(llms, /^# Ferupis/m);
  assert.match(llms, /https:\/\/ferupis\.pages\.dev\/il-miele\//);
  assert.doesNotMatch(llms, /<[^>]+>/);
});
