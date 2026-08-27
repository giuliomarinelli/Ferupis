type SiteRouteDefinition<RouteKey extends string> = {
  /** The filesystem/Qwik City route, without leading or trailing slashes. */
  internalPath: string;

  /** The public route, without leading or trailing slashes. */
  publicPath: string;
  indexable: boolean;
  label?: string;
  parent?: RouteKey | null;
};

const defineSiteRouteRegistry = <
  const T extends Record<
    string,
    SiteRouteDefinition<Extract<keyof T, string>>
  >,
>(
  registry: T,
): T => registry;

/**
 * The single app-owned registry for public routes.
 *
 * Qwik City rewrites, navigation, canonical links and the sitemap all derive
 * their paths from this object. Add future pages here only after their source
 * route exists under `src/routes`.
 */
export const SITE_ROUTE_REGISTRY = defineSiteRouteRegistry({
  home: {
    internalPath: "",
    publicPath: "",
    label: "Home",
    indexable: true,
  },
  leApi: {
    internalPath: "le-api",
    publicPath: "le-api",
    label: "Le Api",
    indexable: true,
    parent: 'home'
  },
  ilMiele: {
    internalPath: "il-miele",
    publicPath: "il-miele",
    label: "Il Miele",
    indexable: true,
    parent: 'home'
  },
  laPropoli: {
    internalPath: "la-propoli",
    publicPath: "la-propoli",
    label: "La Propoli",
    indexable: true,
    parent: 'home'
  },
  laPappaReale: {
    internalPath: "la-pappa-reale",
    publicPath: "la-pappa-reale",
    label: "La Pappa Reale",
    indexable: true,
    parent: 'home'
  },
  foto: {
    internalPath: "foto",
    publicPath: "foto",
    label: "Foto",
    indexable: true,
    parent: 'home'
  },
  contattaci: {
    internalPath: "contattaci",
    publicPath: "contattaci",
    label: "Contattaci",
    indexable: true,
    parent: 'home'
  },
  alveare: {
    internalPath: "le-api/alveare",
    publicPath: "le-api/alveare",
    label: "L'alveare",
    indexable: true,
    parent: 'leApi'
  },
  covata: {
    internalPath: "le-api/covata",
    publicPath: "le-api/covata",
    label: "La covata",
    indexable: true,
    parent: 'leApi'
  },
  uovo: {
    internalPath: "le-api/uovo",
    publicPath: "le-api/uovo",
    label: "L'uovo d'ape",
    indexable: true,
    parent: 'leApi'
  },
  apeRegina: {
    internalPath: "le-api/ape-regina",
    publicPath: "le-api/ape-regina",
    label: "L'ape regina",
    indexable: true,
    parent: 'leApi'
  },
  favo: {
    internalPath: "le-api/favo",
    publicPath: "le-api/favo",
    label: "Il favo",
    indexable: true,
    parent: 'leApi'
  },
  nascita: {
    internalPath: "le-api/nascita",
    publicPath: "le-api/nascita",
    label: "La nascita",
    indexable: true,
    parent: 'leApi'
  },
  apeOperaia: {
    internalPath: "le-api/ape-operaia",
    publicPath: "le-api/ape-operaia",
    label: "L'ape operaia",
    indexable: true,
    parent: 'leApi'
  },
  fuco: {
    internalPath: "le-api/fuco",
    publicPath: "le-api/fuco",
    label: "Il fuco",
    indexable: true,
    parent: 'leApi'
  },
  sciamatura: {
    internalPath: "le-api/sciamatura",
    publicPath: "le-api/sciamatura",
    label: "La sciamatura",
    indexable: true,
    parent: 'leApi'
  },
  polline: {
    internalPath: "le-api/polline",
    publicPath: "le-api/polline",
    label: "Il polline",
    indexable: true,
    parent: 'leApi'
  },
});

export type SiteRouteKey = keyof typeof SITE_ROUTE_REGISTRY;

const normalizeRoutePath = (value: string) =>
  value.split(/[?#]/, 1)[0].split("/").filter(Boolean).join("/");

const routeEntries = Object.entries(SITE_ROUTE_REGISTRY) as Array<
  [SiteRouteKey, SiteRouteDefinition<SiteRouteKey>]
>;

/**
 * Public path -> route key.
 *
 * Used to resolve canonical/public URLs such as:
 * `/intervista/` -> `questionnaire`
 */
const PUBLIC_ROUTE_LOOKUP = Object.fromEntries(
  routeEntries.map(([routeKey, definition]) => [
    normalizeRoutePath(definition.publicPath),
    routeKey,
  ]),
) as Readonly<Record<string, SiteRouteKey>>;

/**
 * Internal Qwik City path -> route key.
 *
 * This also allows internal paths to be resolved when needed:
 * `/questionnaire/` -> `questionnaire`
 */
const INTERNAL_ROUTE_LOOKUP = Object.fromEntries(
  routeEntries.map(([routeKey, definition]) => [
    normalizeRoutePath(definition.internalPath),
    routeKey,
  ]),
) as Readonly<Record<string, SiteRouteKey>>;

export const getIndexableRouteKeys = (): SiteRouteKey[] =>
  routeEntries
    .filter(([, definition]) => definition.indexable)
    .map(([routeKey]) => routeKey);

/**
 * Returns the canonical public pathname for a route.
 *
 * Examples:
 * - home -> /
 * - questionnaire -> /intervista/
 * - privacyCookie -> /privacy/cookie/
 */
export const toSiteRoutePath = (routeKey: SiteRouteKey): string => {
  const path = normalizeRoutePath(
    SITE_ROUTE_REGISTRY[routeKey].publicPath,
  );

  return path ? `/${path}/` : "/";
};

export type ResolvedSiteRoute = {
  routeKey: SiteRouteKey;
  pathname: string;
  internalPath: string;
};

/**
 * Resolves either a public pathname or an internal Qwik City pathname.
 *
 * Public paths take precedence over internal aliases.
 */
export const resolveSiteRoutePathname = (
  pathname: string,
): ResolvedSiteRoute | null => {
  const normalizedPath = normalizeRoutePath(pathname);

  const routeKey =
    PUBLIC_ROUTE_LOOKUP[normalizedPath] ??
    INTERNAL_ROUTE_LOOKUP[normalizedPath];

  if (!routeKey) {
    return null;
  }

  const definition = SITE_ROUTE_REGISTRY[routeKey];

  return {
    routeKey,
    pathname: toSiteRoutePath(routeKey),
    internalPath: normalizeRoutePath(definition.internalPath),
  };
};

/**
 * Creates the Qwik City path rewrite table.
 *
 * Only segments whose public representation differs from their filesystem
 * representation are included.
 *
 * Example:
 * questionnaire -> intervista
 */
const createRewritePaths = (): Readonly<Record<string, string>> => {
  const paths: Record<string, string> = {};

  for (const [, definition] of routeEntries) {
    const internalPath = normalizeRoutePath(definition.internalPath);
    const publicPath = normalizeRoutePath(definition.publicPath);

    if (!internalPath && !publicPath) {
      continue;
    }

    const internalSegments = internalPath
      ? internalPath.split("/")
      : [];

    const publicSegments = publicPath
      ? publicPath.split("/")
      : [];

    if (internalSegments.length !== publicSegments.length) {
      throw new Error(
        `Public route "${definition.publicPath}" must keep the same segment count as internal route "${definition.internalPath}".`,
      );
    }

    internalSegments.forEach((internalSegment, index) => {
      const publicSegment = publicSegments[index];

      if (internalSegment === publicSegment) {
        return;
      }

      const existing = paths[internalSegment];

      if (existing && existing !== publicSegment) {
        throw new Error(
          `Route segment "${internalSegment}" has conflicting public paths: "${existing}" and "${publicSegment}".`,
        );
      }

      paths[internalSegment] = publicSegment;
    });
  }

  return paths;
};

/**
 * Passed directly to Qwik City's `rewriteRoutes`.
 */
export const QWIK_CITY_REWRITE_ROUTES = [
  {
    paths: createRewritePaths(),
  },
] as const;
