import type { RequestHandler } from "@builder.io/qwik-city";
import { createLlmsText } from "~/seo/technical-seo";

export const onGet: RequestHandler = ({ headers, text }) => {
  headers.set("Cache-Control", "public, max-age=0, s-maxage=3600");
  headers.set("X-Content-Type-Options", "nosniff");
  text(200, createLlmsText());
};
