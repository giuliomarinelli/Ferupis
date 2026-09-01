export const SITE_CONFIG = {
  origin: "https://ferupis.pages.dev",
  name: "Ferupis",
  language: "it",
  locale: "it_IT",
  description: "Ferupis — apicoltura, api e prodotti dell'alveare.",
  socialImageUrl: "<URL_ASSOLUTO_IMMAGINE_SOCIAL>",
  structuredData: {
    legalName: "Ferdinando Marinelli",
    logoUrl: "<URL_ASSOLUTO_LOGO>",
    telephone: "<NUMERO_DI_TELEFONO>",
    address: {
      streetAddress: "Via delle Terme, 13",
      postalCode: "30023",
      addressLocality: "Concordia Sagittaria",
      addressRegion: "Veneto",
      addressCountry: "IT",
    },
    socialProfiles: ["<URL_PROFILO_SOCIAL>"],
  },
} as const;

export const isConfiguredSiteValue = (value: string): boolean =>
  value.trim().length > 0 && !/^<[^>]+>$/.test(value.trim());

export const DESCR_GEMMA =
  "Riproduzione di una gemma romana conservata nel Museo Nazionale Concordiese di Portogruaro";
export const CONTACT_EMAIL = "ferupiss@gmail.com";
export const TEST_CONTACT_EMAIL = "giulio.marinelli@icloud.com";
