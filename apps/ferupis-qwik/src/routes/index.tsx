import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { HeroSection } from "~/components/content/hero-section";
import { Container } from "~/components/layout/container";

export default component$(() => {
  return (
    <main>
      <Container>
        <HeroSection />
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
