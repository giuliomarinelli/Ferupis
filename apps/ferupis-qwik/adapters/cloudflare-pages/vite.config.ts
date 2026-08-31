import { cloudflarePagesAdapter } from "@builder.io/qwik-city/adapters/cloudflare-pages/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";
import { SITE_CONFIG } from "../../src/config/site-config";

export default extendConfig(baseConfig, () => ({
  build: {
    ssr: true,
    rollupOptions: {
      input: ["src/entry.cloudflare-pages.tsx", "@qwik-city-plan"],
    },
  },
  plugins: [
    cloudflarePagesAdapter({
      ssg: {
        include: ["*"],
        exclude: [
          "/contattaci/",
          "/sitemap.xml",
          "/robots.txt",
          "/llms.txt",
        ],
        origin: SITE_CONFIG.origin,
        sitemapOutFile: null,
      },
    }),
  ],
}));
