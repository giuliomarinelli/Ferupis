import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  type RequestHandler,
} from "@builder.io/qwik-city";
import { applyContactMessageDocumentHeaders } from "@gm/qwik-core/contact-message";
import { ContattaciPage } from "~/components/content/contattaci/page";
import { resolveContactRuntimeEnv } from "~/server/contact-runtime";

export const onGet: RequestHandler = ({ headers }) => {
  applyContactMessageDocumentHeaders(headers);
};

export const useContactTurnstileSiteKey = routeLoader$<string>(({ platform }) =>
  String(resolveContactRuntimeEnv(platform).CF_TURNSTILE_SITE_KEY ?? ""),
);

export default component$(() => {
  const turnstileSiteKey = useContactTurnstileSiteKey();
  return (
    <main>
      <ContattaciPage turnstileSiteKey={turnstileSiteKey.value} />
    </main>
  );
});

export const head: DocumentHead = {
  title: "Contattaci | Ferupis",
  meta: [
    {
      name: "description",
      content:
        "Contatta Ferupis per informazioni sui prodotti, sull'attività apistica e sui contenuti del sito.",
    },
  ],
  scripts: [
    {
      key: "cloudflare-turnstile",
      props: {
        src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit",
        async: true,
        defer: true,
      },
    },
  ],
};
