import { component$ } from "@builder.io/qwik";
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
