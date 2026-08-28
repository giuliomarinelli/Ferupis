import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { FotoPage } from "~/components/content/foto/page";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <FotoPage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));

export const head: DocumentHead = {
  title: "Foto | Ferupis",
};
