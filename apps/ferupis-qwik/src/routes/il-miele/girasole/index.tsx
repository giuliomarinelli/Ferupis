import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import GirasolePage from "~/components/content/il-miele/girasole/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <GirasolePage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));

export const head: DocumentHead = {
  title: "Miele di girasole | Ferupis",
};
