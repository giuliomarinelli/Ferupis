import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Container } from "~/components/layout/container";
import { ContentHeader } from "~/components/UI/content-header";

export default component$(() => {
  return (
    <main>
      <Container>
        <ContentHeader headingTag="h2" eyebrow="Ferupis" heading="UI foundation placeholder" addClass="!max-w-4xl">
          Neutral surface, theme-aware honeycomb mask and low-intensity brand
          lighting. Final palette and typography will be defined after contrast
          validation.
        </ContentHeader>
      </Container>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Ferupis",
  meta: [
    {
      name: "description",
      content: "Ferupis — apicoltura, api e prodotti dell'alveare.",
    },
  ],
};
