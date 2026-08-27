import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import TiglioPage from "~/components/content/il-miele/tiglio/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <TiglioPage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));

export const head: DocumentHead = {
  title: "Miele di tiglio | Ferupis",
};
