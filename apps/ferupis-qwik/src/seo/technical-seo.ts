import type {
  DocumentHead,
  DocumentHeadProps,
  DocumentHeadValue,
} from "@builder.io/qwik-city";
import {
  SITE_ROUTE_REGISTRY,
  getIndexableRouteKeys,
  getSiteRouteDefinition,
  resolveSiteRoutePathname,
  toSiteRoutePath,
  type SiteRouteKey,
} from "../config/routes.ts";
import { SITE_CONFIG, isConfiguredSiteValue } from "../config/site-config.ts";

type JsonLdNode = Record<string, unknown>;

const siteOrigin = new URL(SITE_CONFIG.origin).origin;

const toAbsoluteSiteUrl = (pathname: string): string =>
  new URL(pathname, `${siteOrigin}/`).toString();

export const getCanonicalUrlForPathname = (pathname: string): string | null => {
  const route = resolveSiteRoutePathname(pathname);
  return route ? toAbsoluteSiteUrl(route.pathname) : null;
};

const getBreadcrumbRouteKeys = (routeKey: SiteRouteKey): SiteRouteKey[] => {
  const routeKeys = [routeKey];
  const visited = new Set<SiteRouteKey>(routeKeys);
  let parent = getSiteRouteDefinition(routeKey).parent;

  while (parent) {
    if (visited.has(parent)) return [];
    routeKeys.unshift(parent);
    visited.add(parent);
    parent = getSiteRouteDefinition(parent).parent;
  }

  return routeKeys;
};

const createOrganizationJsonLd = (): JsonLdNode | null => {
  const config = SITE_CONFIG.structuredData;

  if (!isConfiguredSiteValue(config.legalName)) return null;

  const sameAs = config.socialProfiles.filter(isConfiguredSiteValue);
  const addressEntries = Object.entries(config.address).filter(([, value]) =>
    isConfiguredSiteValue(value),
  );

  return {
    "@type": "Organization",
    "@id": `${siteOrigin}/#organization`,
    name: config.legalName,
    url: `${siteOrigin}/`,
    ...(isConfiguredSiteValue(config.logoUrl) ? { logo: config.logoUrl } : {}),
    ...(isConfiguredSiteValue(config.telephone)
      ? { telephone: config.telephone }
      : {}),
    ...(addressEntries.length > 0
      ? {
          address: {
            "@type": "PostalAddress",
            ...Object.fromEntries(addressEntries),
          },
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
};

const createJsonLdGraph = (
  routeKey: SiteRouteKey,
  title: string,
  description: string,
  canonicalUrl: string,
): JsonLdNode[] => {
  const organization = createOrganizationJsonLd();
  const breadcrumbRouteKeys = getBreadcrumbRouteKeys(routeKey);
  const website: JsonLdNode = {
    "@type": "WebSite",
    "@id": `${siteOrigin}/#website`,
    url: `${siteOrigin}/`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.language,
    ...(organization
      ? { publisher: { "@id": `${siteOrigin}/#organization` } }
      : {}),
  };
  const webPage: JsonLdNode = {
    "@type": routeKey === "foto" ? "CollectionPage" : "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: SITE_CONFIG.language,
    isPartOf: { "@id": `${siteOrigin}/#website` },
  };

  const breadcrumb =
    breadcrumbRouteKeys.length > 1
      ? {
          "@type": "BreadcrumbList",
          "@id": `${canonicalUrl}#breadcrumb`,
          itemListElement: breadcrumbRouteKeys.map(
            (breadcrumbRouteKey, index) => {
              const definition = getSiteRouteDefinition(breadcrumbRouteKey);
              return {
                "@type": "ListItem",
                position: index + 1,
                name: definition.label ?? definition.seo.title,
                item: toAbsoluteSiteUrl(toSiteRoutePath(breadcrumbRouteKey)),
              };
            },
          ),
        }
      : null;

  return [
    ...(organization ? [organization] : []),
    website,
    webPage,
    ...(breadcrumb ? [breadcrumb] : []),
  ];
};

const createNotFoundHead = (pathname: string): DocumentHeadValue => ({
  title: pathname.startsWith("/foto/")
    ? "Foto | Ferupis"
    : "Pagina non trovata | Ferupis",
  meta: [
    {
      key: "description",
      name: "description",
      content: SITE_CONFIG.description,
    },
    {
      key: "robots",
      name: "robots",
      content: "noindex",
    },
  ],
});

export const getTechnicalSeoHead = (
  props: Pick<DocumentHeadProps, "url">,
): DocumentHeadValue => {
  const route = resolveSiteRoutePathname(props.url.pathname);
  if (!route) return createNotFoundHead(props.url.pathname);

  const definition = getSiteRouteDefinition(route.routeKey);
  const { title, description } = definition.seo;
  const canonicalUrl = toAbsoluteSiteUrl(route.pathname);
  const socialImage = isConfiguredSiteValue(SITE_CONFIG.socialImageUrl)
    ? SITE_CONFIG.socialImageUrl
    : null;
  const robots = definition.indexable
    ? "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    : "noindex, nofollow";
  const jsonLdGraph = createJsonLdGraph(
    route.routeKey,
    title,
    description,
    canonicalUrl,
  );

  return {
    title,
    meta: [
      { key: "description", name: "description", content: description },
      { key: "robots", name: "robots", content: robots },
      { key: "og:title", property: "og:title", content: title },
      {
        key: "og:description",
        property: "og:description",
        content: description,
      },
      { key: "og:type", property: "og:type", content: "website" },
      {
        key: "og:locale",
        property: "og:locale",
        content: SITE_CONFIG.locale,
      },
      {
        key: "og:site_name",
        property: "og:site_name",
        content: SITE_CONFIG.name,
      },
      { key: "og:url", property: "og:url", content: canonicalUrl },
      ...(socialImage
        ? [
            {
              key: "og:image",
              property: "og:image",
              content: socialImage,
            },
          ]
        : []),
      {
        key: "twitter:card",
        name: "twitter:card",
        content: socialImage ? "summary_large_image" : "summary",
      },
      { key: "twitter:title", name: "twitter:title", content: title },
      {
        key: "twitter:description",
        name: "twitter:description",
        content: description,
      },
      ...(socialImage
        ? [
            {
              key: "twitter:image",
              name: "twitter:image",
              content: socialImage,
            },
          ]
        : []),
    ],
    scripts: [
      {
        key: "json-ld-site-graph",
        props: { type: "application/ld+json" },
        script: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": jsonLdGraph,
        }),
      },
    ],
  };
};

export const technicalSeoHead: DocumentHead = (props) =>
  getTechnicalSeoHead(props);

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const getIndexableSiteUrls = (): string[] =>
  getIndexableRouteKeys().map((routeKey) =>
    toAbsoluteSiteUrl(toSiteRoutePath(routeKey)),
  );

export const createSitemapXml = (): string => {
  const entries = getIndexableSiteUrls()
    .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
};

export const createRobotsText = (): string =>
  [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${toAbsoluteSiteUrl("/sitemap.xml")}`,
    "",
  ].join("\n");

export const createLlmsText = (): string => {
  const routeLines = getIndexableRouteKeys().map((routeKey) => {
    const definition = SITE_ROUTE_REGISTRY[routeKey];
    return `- ${definition.label ?? definition.seo.title}: ${toAbsoluteSiteUrl(toSiteRoutePath(routeKey))}`;
  });

  return [
    `# ${SITE_CONFIG.name}`,
    "",
    SITE_CONFIG.description,
    "",
    "## Pagine pubbliche",
    "",
    ...routeLines,
    "",
    "## Informazioni tecniche",
    "",
    `- Sitemap XML: ${toAbsoluteSiteUrl("/sitemap.xml")}`,
    `- Regole per i crawler: ${toAbsoluteSiteUrl("/robots.txt")}`,
    "",
  ].join("\n");
};
