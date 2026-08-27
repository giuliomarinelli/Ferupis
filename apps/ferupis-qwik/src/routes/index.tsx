import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { HomePage } from "~/components/content/page";
import { Container } from "~/components/layout/container";

export default component$(() => {
  return (
    <main class="flex flex-1">
      <Container class="flex flex-col justify-center">
        <HomePage />
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
