import { getPhotoRouteDefinitions } from "../components/content/foto/photo-data.ts";

export type SiteRouteDefinition<RouteKey extends string> = {
  /** The filesystem/Qwik City route, without leading or trailing slashes. */
  internalPath: string;

  /** The public route, without leading or trailing slashes. */
  publicPath: string;
  indexable: boolean;
  seo: {
    title: string;
    description: string;
  };
  label?: string;
  parent?: RouteKey | null;
};

const defineSiteRouteRegistry = <
  const T extends Record<string, SiteRouteDefinition<Extract<keyof T, string>>>,
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
    seo: {
      title: "Ferupis | Apicoltura, api e prodotti dell'alveare",
      description: "Ferupis — apicoltura, api e prodotti dell'alveare.",
    },
  },
  leApi: {
    internalPath: "le-api",
    publicPath: "le-api",
    label: "Le Api",
    indexable: true,
    parent: "home",
    seo: {
      title: "Il mondo delle api | Ferupis",
      description:
        "Scopri il mondo delle api, la vita dell'alveare e il ruolo di regina, operaie e fuchi.",
    },
  },
  ilMiele: {
    internalPath: "il-miele",
    publicPath: "il-miele",
    label: "Il Miele",
    indexable: true,
    parent: "home",
    seo: {
      title: "Il miele | Ferupis",
      description:
        "Scopri il miele e le caratteristiche delle varietà di tarassaco, acacia, millefiori, tiglio, girasole e melata.",
    },
  },
  laPropoli: {
    internalPath: "la-propoli",
    publicPath: "la-propoli",
    label: "La Propoli",
    indexable: true,
    parent: "home",
    seo: {
      title: "La propoli | Ferupis",
      description:
        "Origine, raccolta e caratteristiche della propoli, una preziosa sostanza prodotta dalle api.",
    },
  },
  laPappaReale: {
    internalPath: "la-pappa-reale",
    publicPath: "la-pappa-reale",
    label: "La Pappa Reale",
    indexable: true,
    parent: "home",
    seo: {
      title: "La pappa reale | Ferupis",
      description:
        "Scopri come le api producono la pappa reale e quale funzione svolge nella vita dell'alveare.",
    },
  },
  foto: {
    internalPath: "foto",
    publicPath: "foto",
    label: "Foto",
    indexable: true,
    parent: "home",
    seo: {
      title: "Foto di api, alveari e miele | Ferupis",
      description:
        "Galleria fotografica Ferupis dedicata ad api, covata, alveari, favi, miele e piante mellifere.",
    },
  },
  contattaci: {
    internalPath: "contattaci",
    publicPath: "contattaci",
    label: "Contattaci",
    indexable: true,
    parent: "home",
    seo: {
      title: "Contattaci | Ferupis",
      description:
        "Contatta Ferupis per informazioni sui prodotti, sull'attività apistica e sui contenuti del sito.",
    },
  },
  alveare: {
    internalPath: "le-api/alveare",
    publicPath: "le-api/alveare",
    label: "L'alveare",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "L'alveare | Ferupis",
      description:
        "Com'è fatto un alveare e come le api organizzano spazi, risorse e attività della colonia.",
    },
  },
  covata: {
    internalPath: "le-api/covata",
    publicPath: "le-api/covata",
    label: "La covata",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "La covata delle api | Ferupis",
      description:
        "Scopri la covata delle api e le fasi di sviluppo che si svolgono nelle celle dell'alveare.",
    },
  },
  uovo: {
    internalPath: "le-api/uovo",
    publicPath: "le-api/uovo",
    label: "L'uovo d'ape",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "L'uovo d'ape | Ferupis",
      description:
        "L'uovo d'ape è l'inizio del ciclo vitale: scopri deposizione, sviluppo e nascita nell'alveare.",
    },
  },
  apeRegina: {
    internalPath: "le-api/ape-regina",
    publicPath: "le-api/ape-regina",
    label: "L'ape regina",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "L'ape regina | Ferupis",
      description:
        "Ruolo, sviluppo e vita dell'ape regina, l'unica femmina fertile della colonia.",
    },
  },
  favo: {
    internalPath: "le-api/favo",
    publicPath: "le-api/favo",
    label: "Il favo",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "Il favo | Ferupis",
      description:
        "Struttura e funzioni del favo, costruito dalle api per covata, miele e polline.",
    },
  },
  nascita: {
    internalPath: "le-api/nascita",
    publicPath: "le-api/nascita",
    label: "La nascita",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "La nascita delle api | Ferupis",
      description:
        "Dall'uovo all'ape adulta: le fasi della metamorfosi e la nascita delle api nell'alveare.",
    },
  },
  apeOperaia: {
    internalPath: "le-api/ape-operaia",
    publicPath: "le-api/ape-operaia",
    label: "L'ape operaia",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "L'ape operaia | Ferupis",
      description:
        "Mansioni, sviluppo e ciclo di vita dell'ape operaia, protagonista delle attività dell'alveare.",
    },
  },
  fuco: {
    internalPath: "le-api/fuco",
    publicPath: "le-api/fuco",
    label: "Il fuco",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "Il fuco | Ferupis",
      description:
        "Caratteristiche e ruolo del fuco, il maschio dell'ape, nella riproduzione della colonia.",
    },
  },
  sciamatura: {
    internalPath: "le-api/sciamatura",
    publicPath: "le-api/sciamatura",
    label: "La sciamatura",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "La sciamatura | Ferupis",
      description:
        "Cos'è la sciamatura, perché avviene e come nasce una nuova colonia di api.",
    },
  },
  polline: {
    internalPath: "le-api/polline",
    publicPath: "le-api/polline",
    label: "Il polline",
    indexable: true,
    parent: "leApi",
    seo: {
      title: "Il polline | Ferupis",
      description:
        "Raccolta, trasporto e funzione del polline nell'alimentazione e nella vita delle api.",
    },
  },
  tarassaco: {
    internalPath: "il-miele/tarassaco",
    publicPath: "il-miele/tarassaco",
    label: "Tarassaco",
    indexable: true,
    parent: "ilMiele",
    seo: {
      title: "Miele di tarassaco | Ferupis",
      description:
        "Colore, aroma e caratteristiche del miele di tarassaco, una produzione tipica della primavera.",
    },
  },
  acacia: {
    internalPath: "il-miele/acacia",
    publicPath: "il-miele/acacia",
    label: "Acacia",
    indexable: true,
    parent: "ilMiele",
    seo: {
      title: "Miele di acacia | Ferupis",
      description:
        "Colore, gusto e caratteristiche del miele di acacia, delicato e naturalmente fluido.",
    },
  },
  millefiori: {
    internalPath: "il-miele/millefiori",
    publicPath: "il-miele/millefiori",
    label: "Millefiori",
    indexable: true,
    parent: "ilMiele",
    seo: {
      title: "Miele millefiori | Ferupis",
      description:
        "Origine e caratteristiche del miele millefiori, espressione delle fioriture del territorio.",
    },
  },
  tiglio: {
    internalPath: "il-miele/tiglio",
    publicPath: "il-miele/tiglio",
    label: "Tiglio",
    indexable: true,
    parent: "ilMiele",
    seo: {
      title: "Miele di tiglio | Ferupis",
      description:
        "Profumo, gusto e caratteristiche del miele di tiglio, intenso e aromatico.",
    },
  },
  girasole: {
    internalPath: "il-miele/girasole",
    publicPath: "il-miele/girasole",
    label: "Girasole",
    indexable: true,
    parent: "ilMiele",
    seo: {
      title: "Miele di girasole | Ferupis",
      description:
        "Colore, cristallizzazione e caratteristiche del miele di girasole.",
    },
  },
  melata: {
    internalPath: "il-miele/melata",
    publicPath: "il-miele/melata",
    label: "Melata",
    indexable: true,
    parent: "ilMiele",
    seo: {
      title: "Miele di melata | Ferupis",
      description:
        "Origine, sapore e caratteristiche del miele di melata, scuro e ricco di sali minerali.",
    },
  },
  ...getPhotoRouteDefinitions(),
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

export const getSiteRouteDefinition = (
  routeKey: SiteRouteKey,
): SiteRouteDefinition<SiteRouteKey> => SITE_ROUTE_REGISTRY[routeKey];

/**
 * Returns the canonical public pathname for a route.
 *
 * Examples:
 * - home -> /
 * - questionnaire -> /intervista/
 * - privacyCookie -> /privacy/cookie/
 */
export const toSiteRoutePath = (routeKey: SiteRouteKey): string => {
  const path = normalizeRoutePath(SITE_ROUTE_REGISTRY[routeKey].publicPath);

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

    const internalSegments = internalPath ? internalPath.split("/") : [];

    const publicSegments = publicPath ? publicPath.split("/") : [];

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
