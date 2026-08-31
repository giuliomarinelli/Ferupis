import { component$ } from "@builder.io/qwik";
import MelataPage from "~/components/content/il-miele/melata/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <MelataPage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));
