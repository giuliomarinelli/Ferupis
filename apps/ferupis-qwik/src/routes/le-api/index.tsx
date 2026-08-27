import { component$ } from "@builder.io/qwik";
import { ContentHeader } from "~/components/content-typography";

export default component$(() => (
  <ContentHeader.Root>
    <ContentHeader.Eyebrow text="Ferupis" />
    <ContentHeader.Heading text="Le Api" tag="h1" />
  </ContentHeader.Root>
));
