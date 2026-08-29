import { component$ } from "@builder.io/qwik";
import { ContentHeader } from "~/components/content-typography";
import { Container } from "~/components/layout/container";
import { ContactForm } from "./contact-form";

export type ContattaciPageProps = Readonly<{
  turnstileSiteKey: string;
}>;

export const ContattaciPage = component$<ContattaciPageProps>((props) => (
  <Container
    context="content"
    tag="section"
    classOverride="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-stretch px-6 py-20 sm:px-8 lg:px-12"
  >
    <ContentHeader.Root classOverride="w-full font-source-serif-4">
      <ContentHeader.Eyebrow text="Ferupis" />
      <ContentHeader.Heading text="Contattaci" tag="h1" />
      <p class="mt-5 max-w-full text-lg leading-8 text-slate-600 dark:text-slate-300 justify-text">
        Per informazioni sui prodotti, sull'attività apistica o sui contenuti del
        sito, scrivici tramite il modulo. Ti risponderemo appena possibile.
      </p>
    </ContentHeader.Root>

    <ContactForm turnstileSiteKey={props.turnstileSiteKey} />
  </Container>
));
