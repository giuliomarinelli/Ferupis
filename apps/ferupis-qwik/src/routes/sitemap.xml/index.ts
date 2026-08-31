import type { RequestHandler } from "@builder.io/qwik-city";
import { createSitemapXml } from "~/seo/technical-seo";

export const onGet: RequestHandler = ({ headers, send }) => {
  headers.set("Content-Type", "application/xml; charset=utf-8");
  headers.set("Cache-Control", "public, max-age=0, s-maxage=3600");
  headers.set("X-Content-Type-Options", "nosniff");
  send(200, createSitemapXml());
};
